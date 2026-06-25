/*
Demo Login Credentials
- admin@acme.com / Admin123 (admin)
- sarah.manager@acme.com / Pass123 (manager)
- raj.finance@acme.com / Pass123 (manager - finance)
- director@acme.com / Pass123 (manager - director)
- alice@acme.com / Pass123 (employee)
- bob@acme.com / Pass123 (employee)
*/

import bcrypt from "bcryptjs";
import { pool } from "../src/config/db.js";

function hoursAgo(hours) {
    return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function insertUser(client, { companyId, name, email, passwordHash, role, managerId = null }) {
    const result = await client.query(
        `INSERT INTO users (company_id, name, email, password_hash, role, manager_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, email, role`,
        [companyId, name, email, passwordHash, role, managerId]
    );
    return result.rows[0];
}

async function insertExpense(client, payload) {
    const result = await client.query(
        `INSERT INTO expenses
      (user_id, company_id, amount, currency, converted_amount, base_currency, category, vendor, description, receipt_url, status, submitted_at, updated_at)
     VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id, status, description`,
        [
            payload.userId,
            payload.companyId,
            payload.amount,
            payload.currency,
            payload.convertedAmount,
            payload.baseCurrency,
            payload.category,
            payload.vendor,
            payload.description,
            payload.receiptUrl,
            payload.status,
            payload.submittedAt,
            payload.updatedAt
        ]
    );
    return result.rows[0];
}

async function insertStep(client, { expenseId, approverId, sequence, status, comment = null, actedAt = null }) {
    await client.query(
        `INSERT INTO approval_steps (expense_id, approver_id, sequence, status, comment, acted_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [expenseId, approverId, sequence, status, comment, actedAt]
    );
}

async function main() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query("DELETE FROM approval_steps");
        await client.query("DELETE FROM expenses");
        await client.query("DELETE FROM approval_rules");
        await client.query("DELETE FROM users");
        await client.query("DELETE FROM companies");

        const companyRes = await client.query(
            `INSERT INTO companies (name, currency, country_code)
       VALUES ($1, $2, $3)
       RETURNING id, name`,
            ["Acme Technologies", "INR", "IN"]
        );
        const companyId = companyRes.rows[0].id;

        const adminHash = await bcrypt.hash("Admin123", 10);
        const userHash = await bcrypt.hash("Pass123", 10);

        const admin = await insertUser(client, {
            companyId,
            name: "Admin User",
            email: "admin@acme.com",
            passwordHash: adminHash,
            role: "admin"
        });

        const sarah = await insertUser(client, {
            companyId,
            name: "Sarah Chen",
            email: "sarah.manager@acme.com",
            passwordHash: userHash,
            role: "manager"
        });

        const raj = await insertUser(client, {
            companyId,
            name: "Raj Patel",
            email: "raj.finance@acme.com",
            passwordHash: userHash,
            role: "manager"
        });

        const priya = await insertUser(client, {
            companyId,
            name: "Priya Sharma",
            email: "director@acme.com",
            passwordHash: userHash,
            role: "manager"
        });

        const alice = await insertUser(client, {
            companyId,
            name: "Alice Johnson",
            email: "alice@acme.com",
            passwordHash: userHash,
            role: "employee",
            managerId: sarah.id
        });

        const bob = await insertUser(client, {
            companyId,
            name: "Bob Kumar",
            email: "bob@acme.com",
            passwordHash: userHash,
            role: "employee",
            managerId: sarah.id
        });

        await client.query(
            `INSERT INTO approval_rules (company_id, type, config)
       VALUES ($1, 'sequential', $2::jsonb)`,
            [companyId, JSON.stringify({ roles: ["manager", "finance", "director"] })]
        );

        const now = new Date();

        const exp1 = await insertExpense(client, {
            userId: alice.id,
            companyId,
            amount: 45000,
            currency: "INR",
            convertedAmount: 45000,
            baseCurrency: "INR",
            category: "Travel",
            vendor: "IndiGo Airlines",
            description: "Flight to Mumbai",
            receiptUrl: "https://example.com/receipts/flight-mumbai.pdf",
            status: "approved",
            submittedAt: hoursAgo(48),
            updatedAt: hoursAgo(6)
        });
        await insertStep(client, {
            expenseId: exp1.id,
            approverId: sarah.id,
            sequence: 1,
            status: "approved",
            comment: "Travel is business critical. Approved.",
            actedAt: hoursAgo(42)
        });
        await insertStep(client, {
            expenseId: exp1.id,
            approverId: raj.id,
            sequence: 2,
            status: "approved",
            comment: "Matches policy and budget allocation.",
            actedAt: hoursAgo(30)
        });
        await insertStep(client, {
            expenseId: exp1.id,
            approverId: priya.id,
            sequence: 3,
            status: "approved",
            comment: "Approved for client workshop attendance.",
            actedAt: hoursAgo(6)
        });

        const exp2 = await insertExpense(client, {
            userId: bob.id,
            companyId,
            amount: 3200,
            currency: "INR",
            convertedAmount: 3200,
            baseCurrency: "INR",
            category: "Food",
            vendor: "Spice Route Bistro",
            description: "Team lunch",
            receiptUrl: "https://example.com/receipts/team-lunch.jpg",
            status: "rejected",
            submittedAt: hoursAgo(20),
            updatedAt: hoursAgo(18)
        });
        await insertStep(client, {
            expenseId: exp2.id,
            approverId: sarah.id,
            sequence: 1,
            status: "rejected",
            comment: "Exceeds food budget policy",
            actedAt: hoursAgo(18)
        });

        const exp3 = await insertExpense(client, {
            userId: alice.id,
            companyId,
            amount: 1800,
            currency: "INR",
            convertedAmount: 1800,
            baseCurrency: "INR",
            category: "Office",
            vendor: "Workspace Store",
            description: "Laptop stand",
            receiptUrl: "https://example.com/receipts/laptop-stand.png",
            status: "pending",
            submittedAt: hoursAgo(5),
            updatedAt: hoursAgo(5)
        });
        await insertStep(client, {
            expenseId: exp3.id,
            approverId: sarah.id,
            sequence: 1,
            status: "pending"
        });
        await insertStep(client, {
            expenseId: exp3.id,
            approverId: raj.id,
            sequence: 2,
            status: "pending"
        });
        await insertStep(client, {
            expenseId: exp3.id,
            approverId: priya.id,
            sequence: 3,
            status: "pending"
        });

        const exp4 = await insertExpense(client, {
            userId: bob.id,
            companyId,
            amount: 28000,
            currency: "INR",
            convertedAmount: 28000,
            baseCurrency: "INR",
            category: "Travel",
            vendor: "DevCon India",
            description: "Conference registration (CFO override triggered)",
            receiptUrl: "https://example.com/receipts/conference-registration.pdf",
            status: "pending",
            submittedAt: hoursAgo(10),
            updatedAt: hoursAgo(10)
        });
        await insertStep(client, {
            expenseId: exp4.id,
            approverId: priya.id,
            sequence: 1,
            status: "pending",
            comment: "Override lane for high-value spend"
        });

        const exp5 = await insertExpense(client, {
            userId: alice.id,
            companyId,
            amount: 890,
            currency: "INR",
            convertedAmount: 890,
            baseCurrency: "INR",
            category: "Travel",
            vendor: "City Cabs",
            description: "Taxi receipts",
            receiptUrl: "https://example.com/receipts/taxi-bundle.pdf",
            status: "approved",
            submittedAt: hoursAgo(14),
            updatedAt: hoursAgo(3)
        });
        await insertStep(client, {
            expenseId: exp5.id,
            approverId: sarah.id,
            sequence: 1,
            status: "approved",
            comment: "Routine travel claim. Approved.",
            actedAt: hoursAgo(9)
        });
        await insertStep(client, {
            expenseId: exp5.id,
            approverId: raj.id,
            sequence: 2,
            status: "approved",
            comment: "Amounts reconciled with receipts.",
            actedAt: hoursAgo(3)
        });

        await client.query("COMMIT");

        console.log("Demo seed completed successfully.");
        console.log(`Company: ${companyRes.rows[0].name}`);
        console.log("=== DEMO LOGIN CHEATSHEET ===");
        console.log("Tab 1 (Employee): alice@acme.com / Pass123");
        console.log("Tab 2 (Manager): sarah.manager@acme.com / Pass123");
        console.log("Tab 3 (Admin): admin@acme.com / Admin123");
        console.log("Happy path: Submit new expense as Alice -> approve as Sarah -> show live notification -> show analytics");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Demo seed failed:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

main();
