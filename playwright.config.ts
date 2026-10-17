import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	workers: 1,
	timeout: 30000,
	expect: { timeout: 7000 },
	use: {
		baseURL:
			process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173/aksenovdance/",
		browserName: "chromium",
		contextOptions: { reducedMotion: "reduce" },
		trace: "retain-on-failure",
	},
	projects: [
		{ name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
		{
			name: "mobile",
			use: {
				viewport: { width: 390, height: 844 },
				isMobile: true,
				hasTouch: true,
			},
		},
		{
			name: "small-mobile",
			use: {
				viewport: { width: 360, height: 800 },
				isMobile: true,
				hasTouch: true,
			},
		},
	],
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: "bun run preview",
				url: "http://127.0.0.1:4173/aksenovdance/",
				reuseExistingServer: !process.env.CI,
			},
});
