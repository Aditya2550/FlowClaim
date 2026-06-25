import { chromium } from "playwright";

const BASE_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const USERS = [
    {
        label: "employee",
        email: "employee1@acme.com",
        password: "Demo@123",
        expectedPath: "/employee",
        heading: "Submit Expense",
    },
    {
        label: "manager",
        email: "manager1@acme.com",
        password: "Demo@123",
        expectedPath: "/manager",
        heading: "Approval Queue",
    },
    {
        label: "admin",
        email: "admin@acme.com",
        password: "Demo@123",
        expectedPath: "/admin",
        heading: "Approval Logic",
    },
];

async function assertRoute(page, path, text) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const content = await page.content();
    if (!content.includes(text)) {
        throw new Error(`Expected text '${text}' on route '${path}'`);
    }
}

async function loginAndValidate(page, user) {
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });

    await page.getByPlaceholder("you@company.com").fill(user.email);
    await page.getByPlaceholder("••••••••").fill(user.password);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(`**${user.expectedPath}`, { timeout: 10000 });
    const html = await page.content();
    if (!html.includes(user.heading)) {
        throw new Error(`Expected heading '${user.heading}' after ${user.label} login`);
    }
}

async function run() {
    const browser = await chromium.launch({ headless: true });
    const results = [];

    try {
        for (const user of USERS) {
            const context = await browser.newContext();
            const page = await context.newPage();

            try {
                await loginAndValidate(page, user);

                if (user.label === "employee") {
                    await page.goto(`${BASE_URL}/analytics`, { waitUntil: "networkidle" });
                    await page.waitForURL("**/unauthorized", { timeout: 5000 });
                }

                if (user.label !== "employee") {
                    await assertRoute(page, "/analytics", "Analytics Dashboard");
                }

                results.push({ user: user.label, ok: true, path: page.url() });
            } catch (error) {
                results.push({ user: user.label, ok: false, error: String(error.message || error) });
            } finally {
                await context.close();
            }
        }
    } finally {
        await browser.close();
    }

    console.log(JSON.stringify({ baseUrl: BASE_URL, results }, null, 2));

    const failures = results.filter((x) => !x.ok);
    if (failures.length > 0) {
        process.exit(1);
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
