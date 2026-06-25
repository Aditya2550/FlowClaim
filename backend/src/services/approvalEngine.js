function mapSequenceRoleToUserRole(sequenceRole) {
    const role = String(sequenceRole || "").toLowerCase();
    if (role === "finance" || role === "director" || role === "cfo") return "admin";
    return role;
}

async function getLatestCompanyRule(companyId, client) {
    const result = await client.query(
        `SELECT id, type, config
         FROM approval_rules
         WHERE company_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [companyId]
    );

    return result.rows[0] || null;
}

function resolveRuleKind(rule) {
    const configType = String(rule?.config?.type || "").toLowerCase();
    if (["percentage", "hybrid", "sequential"].includes(configType)) return configType;

    const ruleType = String(rule?.type || "").toLowerCase();
    if (ruleType === "percentage") return "percentage";
    if (ruleType === "hybrid") return "hybrid";
    return "sequential";
}

async function getRoleApprover(companyId, sequenceRole, client) {
    const userRole = mapSequenceRoleToUserRole(sequenceRole);
    const result = await client.query(
        `SELECT id, name, role
         FROM users
         WHERE company_id = $1
             AND role = $2
         ORDER BY created_at ASC
         LIMIT 1`,
        [companyId, userRole]
    );

    if (!result.rows[0]) {
        throw new Error(`No approver found for role: ${sequenceRole}`);
    }

    return result.rows[0];
}

async function getRoleApprovers(companyId, sequenceRole, client) {
    const userRole = mapSequenceRoleToUserRole(sequenceRole);
    const result = await client.query(
        `SELECT id, name, role
         FROM users
         WHERE company_id = $1
             AND role = $2
         ORDER BY created_at ASC`,
        [companyId, userRole]
    );

    if (!result.rows.length) {
        throw new Error(`No approver found for role: ${sequenceRole}`);
    }

    return result.rows;
}

async function getExpenseForEngine(expenseId, client) {
    const result = await client.query(
        `SELECT id, company_id, status, converted_amount
         FROM expenses
         WHERE id = $1`,
        [expenseId]
    );

    return result.rows[0] || null;
}

async function insertStep(expenseId, approverId, sequence, client) {
    const inserted = await client.query(
        `INSERT INTO approval_steps (expense_id, approver_id, sequence, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING id, expense_id, approver_id, sequence, status, comment, acted_at`,
        [expenseId, approverId, sequence]
    );

    return inserted.rows[0];
}

async function getCurrentPendingStep(expenseId, client) {
    const result = await client.query(
        `SELECT s.*
         FROM approval_steps s
         WHERE s.expense_id = $1
             AND s.status = 'pending'
             AND NOT EXISTS (
                 SELECT 1
                 FROM approval_steps prev
                 WHERE prev.expense_id = s.expense_id
                     AND prev.sequence < s.sequence
                     AND prev.status <> 'approved'
             )
         ORDER BY s.sequence ASC
         LIMIT 1`,
        [expenseId]
    );

    return result.rows[0] || null;
}

async function getStepForApprover(expenseId, approverId, client) {
    const result = await client.query(
        `SELECT *
         FROM approval_steps
         WHERE expense_id = $1
             AND approver_id = $2
             AND status = 'pending'
         LIMIT 1`,
        [expenseId, approverId]
    );

    return result.rows[0] || null;
}

async function getVoteStats(expenseId, client) {
    const result = await client.query(
        `SELECT
             COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
             COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
         FROM approval_steps
         WHERE expense_id = $1`,
        [expenseId]
    );

    return result.rows[0];
}

async function updateStep(stepId, status, comment, client) {
    if (status === "rejected") {
        await client.query(
            `UPDATE approval_steps
             SET status = 'rejected', comment = $2, acted_at = NOW()
             WHERE id = $1`,
            [stepId, comment]
        );
        return;
    }

    await client.query(
        `UPDATE approval_steps
         SET status = 'approved', comment = COALESCE($2, comment), acted_at = NOW()
         WHERE id = $1`,
        [stepId, comment || null]
    );
}

export async function initializeApprovalSteps(expenseId, companyId, client) {
    const rule = await getLatestCompanyRule(companyId, client);
    if (!rule) {
        throw new Error("No approval rule configured for company");
    }

    const ruleKind = resolveRuleKind(rule);
    const createdSteps = [];

    if (ruleKind === "percentage") {
        const approverRole = rule.config?.approverRole || "manager";
        const approvers = await getRoleApprovers(companyId, approverRole, client);
        for (const approver of approvers) {
            createdSteps.push(await insertStep(expenseId, approver.id, 1, client));
        }
        return createdSteps;
    }

    if (ruleKind === "hybrid") {
        const expense = await getExpenseForEngine(expenseId, client);
        if (!expense) throw new Error("Expense not found");

        const overrideRole = rule.config?.overrideRole || "cfo";
        const overrideThreshold = Number(rule.config?.overrideThreshold ?? 10000);
        const convertedAmount = Number(expense.converted_amount || 0);

        if (convertedAmount >= overrideThreshold) {
            const overrideApprover = await getRoleApprover(companyId, overrideRole, client);
            createdSteps.push(await insertStep(expenseId, overrideApprover.id, 1, client));
            return createdSteps;
        }

        const defaultFlow = Array.isArray(rule.config?.defaultFlow)
            ? rule.config.defaultFlow
            : ["manager", "finance"];

        for (let i = 0; i < defaultFlow.length; i += 1) {
            const approver = await getRoleApprover(companyId, defaultFlow[i], client);
            createdSteps.push(await insertStep(expenseId, approver.id, i + 1, client));
        }
        return createdSteps;
    }

    const roles = Array.isArray(rule.config?.roles)
        ? rule.config.roles
        : Array.isArray(rule.config?.sequence)
            ? rule.config.sequence
            : ["manager", "finance", "director"];

    for (let i = 0; i < roles.length; i += 1) {
        const approver = await getRoleApprover(companyId, roles[i], client);
        createdSteps.push(await insertStep(expenseId, approver.id, i + 1, client));
    }

    return createdSteps;
}

export async function processApproval(expenseId, approverId, action, comment, client) {
    const normalizedAction = String(action || "").toLowerCase();
    if (!["approved", "rejected"].includes(normalizedAction)) {
        throw new Error("Invalid approval action");
    }

    const expense = await getExpenseForEngine(expenseId, client);
    if (!expense) throw new Error("Expense not found");
    if (expense.status !== "pending") throw new Error("Expense already finalized");

    const rule = await getLatestCompanyRule(expense.company_id, client);
    if (!rule) throw new Error("No approval rule configured for company");
    const ruleKind = resolveRuleKind(rule);

    if (ruleKind === "percentage") {
        const step = await getStepForApprover(expenseId, approverId, client);
        if (!step) throw new Error("Not your turn to approve");

        if (normalizedAction === "rejected" && (!comment || !String(comment).trim())) {
            throw new Error("Rejection comment is required");
        }

        await updateStep(
            step.id,
            normalizedAction,
            normalizedAction === "rejected" ? String(comment).trim() : comment,
            client
        );

        const stats = await getVoteStats(expenseId, client);
        const total = Number(stats.total || 0);
        const approved = Number(stats.approved || 0);
        const rejected = Number(stats.rejected || 0);
        const threshold = Number(rule.config?.threshold ?? 60);

        const approvedPct = total === 0 ? 0 : (approved * 100) / total;
        const rejectedPct = total === 0 ? 0 : (rejected * 100) / total;

        if (approvedPct >= threshold) {
            await client.query("UPDATE expenses SET status = 'approved' WHERE id = $1", [expenseId]);
            return { done: true, status: "approved", approvedPct, rejectedPct };
        }

        if (rejectedPct > (100 - threshold)) {
            await client.query("UPDATE expenses SET status = 'rejected' WHERE id = $1", [expenseId]);
            return { done: true, status: "rejected", approvedPct, rejectedPct };
        }

        return { done: false, approvedPct, rejectedPct };
    }

    const currentStep = await getCurrentPendingStep(expenseId, client);
    if (!currentStep) throw new Error("No pending approval step found");
    if (currentStep.approver_id !== approverId) throw new Error("Not your turn to approve");

    if (normalizedAction === "rejected") {
        if (!comment || !String(comment).trim()) {
            throw new Error("Rejection comment is required");
        }

        await updateStep(currentStep.id, "rejected", String(comment).trim(), client);
        await client.query("UPDATE expenses SET status = 'rejected' WHERE id = $1", [expenseId]);
        return { done: true, status: "rejected" };
    }

    await updateStep(currentStep.id, "approved", comment, client);

    const nextStep = await getCurrentPendingStep(expenseId, client);
    if (nextStep) {
        return { done: false, nextApproverId: nextStep.approver_id };
    }

    await client.query("UPDATE expenses SET status = 'approved' WHERE id = $1", [expenseId]);
    return { done: true, status: "approved" };
}

export async function getCurrentPendingApprover(expenseId, client) {
    const result = await client.query(
        `SELECT u.id, u.name, u.email, u.role
         FROM users u
         JOIN approval_steps s ON s.approver_id = u.id
         WHERE s.expense_id = $1
             AND s.status = 'pending'
             AND NOT EXISTS (
                 SELECT 1
                 FROM approval_steps prev
                 WHERE prev.expense_id = s.expense_id
                     AND prev.sequence < s.sequence
                     AND prev.status <> 'approved'
             )
         ORDER BY s.sequence ASC, u.created_at ASC
         LIMIT 1`,
        [expenseId]
    );

    return result.rows[0] || null;
}

export async function getPendingApprovers(expenseId, client) {
    const result = await client.query(
        `SELECT u.id, u.name, u.email, u.role, s.sequence
         FROM approval_steps s
         JOIN users u ON u.id = s.approver_id
         WHERE s.expense_id = $1
             AND s.status = 'pending'
             AND NOT EXISTS (
                 SELECT 1
                 FROM approval_steps prev
                 WHERE prev.expense_id = s.expense_id
                     AND prev.sequence < s.sequence
                     AND prev.status <> 'approved'
             )
         ORDER BY s.sequence ASC, u.created_at ASC`,
        [expenseId]
    );

    return result.rows;
}

export async function getApprovalTimeline(expenseId, client) {
    const result = await client.query(
        `SELECT
             s.id,
             s.expense_id,
             s.approver_id,
             s.sequence,
             s.status,
             s.comment,
             s.acted_at,
             u.name AS approver_name
         FROM approval_steps s
         JOIN users u ON u.id = s.approver_id
         WHERE s.expense_id = $1
         ORDER BY s.sequence ASC, u.created_at ASC`,
        [expenseId]
    );

    return result.rows;
}
