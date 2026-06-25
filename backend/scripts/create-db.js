import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Client } = pg;

async function main() {
    const dbUrl = process.env.DATABASE_URL || "";
    if (!dbUrl.includes("/")) {
        throw new Error("DATABASE_URL is invalid");
    }

    const adminUrl = dbUrl.replace("/reimbursement", "/postgres");
    const client = new Client({ connectionString: adminUrl });
    await client.connect();

    const check = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", ["reimbursement"]);
    if (check.rowCount === 0) {
        await client.query("CREATE DATABASE reimbursement");
        console.log("DB_CREATED");
    } else {
        console.log("DB_EXISTS");
    }

    await client.end();
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
