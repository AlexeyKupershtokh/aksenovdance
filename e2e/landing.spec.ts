import { expect, test } from "@playwright/test";

// Browser-only риски: реальные клики, sticky anchors, загрузка аватаров и геометрия медиа.
test("публичный лендинг: навигация, афиши, аватары и отсутствие переполнения", async ({
	page,
}, testInfo) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});
	page.on("response", (response) => {
		if (
			response.status() >= 400 &&
			(response.url().includes("/aksenovdance/") ||
				response.url().includes("img.glamdance.ru"))
		)
			errors.push(`${response.status()} ${response.url()}`);
	});
	await page.goto("./");
	await expect(page.locator("h1")).toHaveText("кАллигрАфиятелА.");
	await expect(page.locator("h1")).toHaveCount(1);
	await page.evaluate(() => document.fonts.ready);
	await expect(page.locator("body")).not.toContainText(
		/демонстрац|пример|по предоставленной|уточняется|не подтвержден|редакционн/i,
	);
	await expect(page.locator("#availability")).toHaveCount(0);
	await page.screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-hero.png`,
	});
	const nav = page.getByRole("navigation", { name: "Разделы сборов" });
	for (const id of [
		"about",
		"trainers",
		"experience",
		"stories",
		"contacts",
		"merch",
	]) {
		await nav.locator(`[href="#${id}"]`).click();
		await expect
			.poll(() =>
				page
					.locator(`#${id}`)
					.evaluate((element) =>
						Math.round(element.getBoundingClientRect().top),
					),
			)
			.toBeGreaterThan(50);
		await expect
			.poll(() =>
				page
					.locator(`#${id}`)
					.evaluate((element) =>
						Math.round(element.getBoundingClientRect().top),
					),
			)
			.toBeLessThan(
				id === "merch" ? (page.viewportSize()?.height ?? 844) - 100 : 230,
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
	await expect(page.locator(".service-avatar")).toHaveCount(5);
	for (const avatar of await page.locator(".service-avatar").all())
		await expect(avatar).toHaveAttribute(
			"src",
			/\/aksenovdance\/images\/service-/,
		);
	await expect(page.locator(".merch-card")).toHaveCount(3);
	for (const link of await page.locator(".merch-card a").all())
		await expect(link).toHaveAttribute("href", "tel:+79139078777");
	await expect(page.locator(".camp-poster img")).toBeAttached();
	await expect(page.locator(".music-poster img")).toBeAttached();
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
	for (const selector of [".camp-poster img", ".music-poster img"]) {
		const geometry = await page.locator(selector).evaluate((image) => {
			const img = image as HTMLImageElement;
			return {
				rendered: img.clientWidth / img.clientHeight,
				natural: img.naturalWidth / img.naturalHeight,
			};
		});
		expect(Math.abs(geometry.rendered - geometry.natural)).toBeLessThan(0.01);
	}
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

// Риск: карточка теряет цены/места при переключении направления или предлагает запись при нулевом остатке.
test("цены и места в карточке каждой категории, лист ожидания при нулевом остатке", async ({
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
		await expect(card.getByText("Групповое", { exact: true })).toBeVisible();
		await expect(
			card.getByText("Индивидуальное", { exact: true }),
		).toBeVisible();
		await expect(card.locator(".availability-status")).toContainText(
			"Свободных мест:",
		);
		const link = card.getByRole("link", {
			name: `Записаться: ${trainer}`,
			exact: true,
		});
		await expect(link).toHaveAttribute("href", "tel:+79139078777");
		await expect
			.poll(() =>
				link.evaluate((element) => element.getBoundingClientRect().height),
			)
			.toBeGreaterThanOrEqual(44);
		await expect
			.poll(() =>
				card.evaluate((element) => element.scrollWidth <= element.clientWidth),
			)
			.toBe(true);
	}
	await page
		.locator(".roster-tabs")
		.getByText("Стандарт", { exact: true })
		.click();
	const soldOut = page.locator(".trainer-card").filter({
		has: page.getByRole("heading", {
			name: "Екатерина Стрелкова",
			exact: true,
		}),
	});
	await expect(soldOut.locator(".availability-status")).toHaveText(
		"Лист ожидания",
	);
	await expect(
		soldOut.getByRole("link", {
			name: "Лист ожидания: Екатерина Стрелкова",
			exact: true,
		}),
	).toHaveAttribute("href", "tel:+79139078777");
	await expect(soldOut.getByRole("link", { name: /^Записаться/ })).toHaveCount(
		0,
	);
	await page.locator("#trainers").screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-trainers.png`,
	});
});
