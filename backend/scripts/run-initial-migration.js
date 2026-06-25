import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Client } = pg;

async function main() {
    const migrationPath = path.resolve("src/db/migrations/001_initial_schema.sql");
    const sql = fs.readFileSync(migrationPath, "utf8");

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(sql);
    await client.end();

    console.log("MIGRATION_APPLIED");
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
