import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

async function run() {
    if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");

    const sql = neon(process.env.DATABASE_URL);
    const migration = readFileSync("./migrations/0000_naive_wendell_vaughn.sql", "utf-8");

    console.log("Running migration via HTTP...");

    // Neon-http driver neon() doesn't support multiple statements well,
    // so we split by semicolon and execute one by one
    const statements = migration.split(";").filter(s => s.trim().length > 0);

    for (const stmt of statements) {
        try {
            await sql(stmt);
        } catch (e) {
            console.error("Error executing statement:", stmt);
            console.error(e);
            process.exit(1);
        }
    }
    console.log("Migration complete!");
}

run();
