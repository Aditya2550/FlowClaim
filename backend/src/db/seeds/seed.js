/*
Demo Credentials (password for all users: Demo@123)
- admin@acme.com      -> role: admin
- manager1@acme.com   -> role: manager
- manager2@acme.com   -> role: manager
- finance1@acme.com   -> role: finance
- director1@acme.com  -> role: director
- employee1@acme.com  -> role: employee (manager: manager1)
- employee2@acme.com  -> role: employee (manager: manager1)
- employee3@acme.com  -> role: employee (manager: manager2)
*/

import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM approval_steps");
    await client.query("DELETE FROM expenses");
    await client.query("DELETE FROM approval_rules");
    await client.query("DELETE FROM users");
    await client.query("DELETE FROM companies");

    const company = await client.query(
      `INSERT INTO companies (name, currency, country_code)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Acme Corp", "INR", "IN"],
    );

    const companyId = company.rows[0].id;
    const passwordHash = await bcrypt.hash("Demo@123", 10);

    const admin = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id`,
      [companyId, "Acme Admin", "admin@acme.com", passwordHash],
    );

    const manager1 = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'manager')
       RETURNING id`,
      [companyId, "Manager One", "manager1@acme.com", passwordHash],
    );

    const manager2 = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'manager')
       RETURNING id`,
      [companyId, "Manager Two", "manager2@acme.com", passwordHash],
    );

    const finance1 = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'finance')
     RETURNING id`,
      [companyId, "Finance Lead", "finance1@acme.com", passwordHash],
    );

    const director1 = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'director')
     RETURNING id`,
      [companyId, "Director One", "director1@acme.com", passwordHash],
    );

    await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role, manager_id)
       VALUES
         ($1, $2, $3, $4, 'employee', $5),
         ($1, $6, $7, $4, 'employee', $5),
         ($1, $8, $9, $4, 'employee', $10)`,
      [
        companyId,
        "Employee One",
        "employee1@acme.com",
        passwordHash,
        manager1.rows[0].id,
        "Employee Two",
        "employee2@acme.com",
        "Employee Three",
        "employee3@acme.com",
        manager2.rows[0].id,
      ],
    );

    await client.query(
      `INSERT INTO approval_rules (company_id, type, config)
       VALUES ($1, 'sequential', $2::jsonb)`,
      [
        companyId,
        JSON.stringify({ sequence: ["manager", "finance", "director"] }),
      ],
    );

    await client.query("COMMIT");

    console.log("Seed completed successfully.");
    console.log("Company ID:", companyId);
    console.log("Admin ID:", admin.rows[0].id);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
