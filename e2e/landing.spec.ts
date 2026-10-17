import { expect, test } from "@playwright/test";

// E2E проверяет browser-only риски: геометрию, sticky anchors, реальные клики и загрузку ресурсов.
test("лендинг: фотографии, шрифты, навигация и отсутствие переполнения", async ({
	page,
}, testInfo) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});
	page.on("response", (response) => {
		if (response.status() >= 400 && response.url().includes("/aksenovdance/"))
			errors.push(`${response.status()} ${response.url()}`);
	});
	await page.goto("./");
	await expect(page.locator("h1")).toHaveText("кАллигрАфиятелА.");
	await expect(page.locator("h1")).toHaveCount(1);
	await page.evaluate(() => document.fonts.ready);
	await expect(page.locator(".demo-note")).toContainText("демонстрационные");
	await page.screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-hero.png`,
	});
	const nav = page.getByRole("navigation", { name: "Разделы сборов" });
	for (const id of [
		"about",
		"trainers",
		"availability",
		"experience",
		"stories",
		"contacts",
	]) {
		await nav.locator(`[href="#${id}"]`).click();
		await expect
			.poll(async () =>
				page
					.locator(`#${id}`)
					.evaluate((element) =>
						Math.round(element.getBoundingClientRect().top),
					),
			)
			.toBeGreaterThan(50);
		await expect
			.poll(async () =>
				page
					.locator(`#${id}`)
					.evaluate((element) =>
						Math.round(element.getBoundingClientRect().top),
					),
			)
			.toBeLessThan(
				id === "contacts" ? (page.viewportSize()?.height ?? 844) - 100 : 230,
			);
		await expect(nav.locator(`[href="#${id}"]`)).toHaveAttribute(
			"aria-current",
			"location",
		);
		await expect
			.poll(() =>
				page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
			)
			.toBe(true);
	}
	await expect(page.locator(".service-card")).toHaveCount(5);
	await expect(
		page.locator('.service-card[href="https://glamdance.ru/s/akupershtokh"]'),
	).toBeAttached();
	await expect(
		page.locator('.contact-panel a[href="tel:+79139078777"]').first(),
	).toHaveText("Позвонить Александру");
	await page.evaluate(async () => {
		for (const image of document.images) {
			image.loading = "eager";
			await image.decode();
		}
	});
	await expect
		.poll(() =>
			page
				.locator("img")
				.evaluateAll((images) =>
					images.every(
						(image) =>
							image instanceof HTMLImageElement &&
							image.complete &&
							image.naturalWidth > 0,
					),
				),
		)
		.toBe(true);
	const fonts = await page.locator("h1").evaluate((element) => ({
		family: getComputedStyle(element).fontFamily,
		weight: getComputedStyle(element).fontWeight,
	}));
	expect(fonts.family).toContain("Roboto Serif");
	expect(fonts.weight).toBe("600");
	await page.screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-full.png`,
		fullPage: true,
	});
	expect(errors).toEqual([]);
});

test("выбор тренера каждой категории открывает его цены; нулевые места ведут в лист ожидания", async ({
	page,
}, testInfo) => {
	await page.goto("./");
	for (const [category, trainer] of [
		["Стандарт", "Наталья Смирнова"],
		["Латина", "Андрей Зайцев"],
		["Сибирские педагоги", "Денис Козлов"],
	]) {
		await page
			.locator(".roster-tabs")
			.getByText(category, { exact: true })
			.click();
		const card = page.locator(".trainer-card").filter({
			has: page.getByRole("heading", { name: trainer, exact: true }),
		});
		await card.getByRole("button", { name: "Места и цены" }).click();
		const row = page
			.locator(".mantine-Accordion-item")
			.filter({ has: page.getByRole("button", { name: new RegExp(trainer) }) });
		await expect(
			row.getByText("Групповое занятие", { exact: true }),
		).toBeVisible();
		await expect(
			row.getByText("Индивидуальное занятие", { exact: true }),
		).toBeVisible();
		await expect(
			row.getByText("Демонстрационные цены и остатки.", { exact: false }),
		).toBeVisible();
		await expect(
			row.getByRole("link", { name: "Уточнить запись", exact: true }),
		).toHaveAttribute("href", "tel:+79139078777");
	}
	await page
		.locator(".availability-tabs")
		.getByText("Стандарт", { exact: true })
		.click();
	await page
		.getByRole("button", { name: "Екатерина Стрелкова Лист ожидания" })
		.click();
	await expect(
		page.getByRole("link", { name: "Уточнить лист ожидания" }),
	).toBeVisible();
	await expect(
		page.locator(".mantine-Accordion-item[data-active] a"),
	).toHaveAttribute("href", "tel:+79139078777");
	const expanded = page.locator(".mantine-Accordion-item[data-active]");
	await expanded.evaluate(async (element) => {
		await Promise.all(
			element
				.getAnimations({ subtree: true })
				.map((animation) => animation.finished),
		);
	});
	await expect
		.poll(() =>
			expanded.evaluate((element) => {
				const panel = element.querySelector(".mantine-Accordion-panel");
				const content = element.querySelector(".lesson-details");
				return Boolean(
					panel &&
						content &&
						content.getBoundingClientRect().bottom <=
							panel.getBoundingClientRect().bottom + 1,
				);
			}),
		)
		.toBe(true);
	await expanded.screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-prices.png`,
	});
	await page
		.getByRole("button", { name: "Екатерина Стрелкова Лист ожидания" })
		.click();
	await expect(
		page.getByRole("link", { name: "Уточнить лист ожидания" }),
	).not.toBeVisible();
});
