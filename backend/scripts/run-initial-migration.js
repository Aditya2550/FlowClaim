import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Client } = pg;

async function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.error(
      "Usage: node scripts/run-initial-migration.js <migration_filename>",
    );
    process.exit(1);
  }

  const migrationPath = path.resolve("src/db/migrations", filename);
  const sql = fs.readFileSync(migrationPath, "utf8");

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();

  console.log("MIGRATION_APPLIED", filename);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
