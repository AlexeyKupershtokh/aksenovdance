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
	await expect(page.locator("h1")).toHaveText("кАллигрАфиятелА");
	await expect(page.locator("h1")).toHaveCount(1);
	await page.evaluate(() => document.fonts.ready);
	const contact = page
		.locator("header")
		.getByRole("link", { name: /^Связаться/ });
	await expect(contact).toHaveAccessibleName(
		testInfo.project.name === "desktop"
			? "Связаться с организатором"
			: "Связаться",
	);
	if (testInfo.project.name === "desktop") {
		// Риск: DOM содержит пробел, но flex-label схлопывает его на границе элементов.
		const gap = await contact.evaluate((element) => {
			const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
			const nodes: Text[] = [];
			while (walker.nextNode()) nodes.push(walker.currentNode as Text);
			const first = nodes.find((node) => node.data.includes("Связаться"));
			const second = nodes.find((node) =>
				node.data.includes("с организатором"),
			);
			if (!first || !second)
				throw new Error("В кнопке отсутствуют слова подписи");
			const end = first.data.indexOf("Связаться") + "Связаться".length;
			const start = second.data.indexOf("с организатором");
			const word = document.createRange();
			word.setStart(first, end - 1);
			word.setEnd(first, end);
			const preposition = document.createRange();
			preposition.setStart(second, start);
			preposition.setEnd(second, start + 1);
			return (
				preposition.getBoundingClientRect().left -
				word.getBoundingClientRect().right
			);
		});
		expect(gap).toBeGreaterThan(2);
	}
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
	// Риск браузерной вёрстки: блок уходит под мерч или обрезает длинные цитаты на телефоне.
	const reviews = page.locator("#reviews");
	await expect(
		reviews.getByRole("heading", { name: "Отзывы участников" }),
	).toBeVisible();
	await expect(reviews.locator(".review-card")).toHaveCount(3);
	const reviewLayout = await reviews.evaluate((section) => {
		const cards = Array.from(section.querySelectorAll(".review-card"));
		return {
			columns: getComputedStyle(
				section.querySelector(".reviews-grid") as Element,
			).gridTemplateColumns.split(" ").length,
			beforeMerch: section.nextElementSibling?.id === "merch",
			unclipped: cards.every(
				(card) =>
					card.scrollWidth <= card.clientWidth &&
					card.scrollHeight <= card.clientHeight,
			),
		};
	});
	expect(reviewLayout).toEqual({
		columns: testInfo.project.name === "desktop" ? 3 : 1,
		beforeMerch: true,
		unclipped: true,
	});
	await reviews.screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-reviews.png`,
	});
	for (const link of await page.locator(".merch-card a").all())
		await expect(link).toHaveAttribute("href", "tel:+79139078777");
	await expect(page.locator(".camp-poster img")).toBeAttached();
	const posterWidth = await page
		.locator(".camp-poster")
		.evaluate((element) => element.getBoundingClientRect().width);
	if (testInfo.project.name === "desktop")
		expect(posterWidth).toBeGreaterThanOrEqual(440);
	else
		expect(posterWidth).toBeGreaterThanOrEqual(
			(page.viewportSize()?.width ?? 360) - 48,
		);
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

// Browser-only риски: lazy viewer, настоящий фокус, жесты/клавиатура и изоляция постеров; unit-тест не проверит их.
test("фотогалерея и отдельные постеры: открытие, переключение, увеличение и закрытие", async ({
	page,
}, testInfo) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto("./");
	const photos = page.locator(".story-grid a");
	await expect(photos).toHaveCount(6);
	const gallery = page.getByRole("dialog", { name: "Фотографии сборов" });
	const currentImage = () =>
		page.locator(".yarl__slide_current img.yarl__slide_image");
	await photos.nth(3).click();
	await expect(gallery).toBeVisible();
	await expect(currentImage()).toHaveAttribute("src", /guidance\.webp$/);
	await expect(
		gallery.locator(
			".yarl__thumbnails_thumbnail:not(.yarl__thumbnails_thumbnail_placeholder)",
		),
	).toHaveCount(6);
	await gallery
		.getByRole("button", { name: "Следующее фото", exact: true })
		.click();
	await expect(currentImage()).toHaveAttribute("src", /connection\.webp$/);
	await page.keyboard.press("ArrowLeft");
	await expect(currentImage()).toHaveAttribute("src", /guidance\.webp$/);
	await gallery
		.getByRole("button", { name: "Фото 5 из 6", exact: true })
		.click();
	await expect(currentImage()).toHaveAttribute("src", /connection\.webp$/);
	await page.keyboard.press("ArrowLeft");
	await expect(currentImage()).toHaveAttribute("src", /guidance\.webp$/);
	if (testInfo.project.name !== "desktop") {
		const session = await page.context().newCDPSession(page);
		const viewport = page.viewportSize();
		if (!viewport) throw new Error("Отсутствует mobile viewport");
		const y = Math.round(viewport.height * 0.45);
		await session.send("Input.dispatchTouchEvent", {
			type: "touchStart",
			touchPoints: [{ x: viewport.width - 45, y }],
		});
		for (let x = viewport.width - 65; x >= 45; x -= 25)
			await session.send("Input.dispatchTouchEvent", {
				type: "touchMove",
				touchPoints: [{ x, y }],
			});
		await session.send("Input.dispatchTouchEvent", {
			type: "touchEnd",
			touchPoints: [],
		});
		await expect(currentImage()).toHaveAttribute("src", /connection\.webp$/);
		await session.detach();
	}
	await page.screenshot({
		path: `/tmp/aksenovdance-${testInfo.project.name}-gallery.png`,
	});
	await page.keyboard.press("Escape");
	await expect(gallery).toHaveCount(0);
	await expect(photos.nth(3)).toBeFocused();
	for (const [index, photo] of [
		"practice",
		"coach",
		"movement",
		"guidance",
		"connection",
		"together",
	].entries()) {
		await photos.nth(index).click();
		await expect(currentImage()).toHaveAttribute(
			"src",
			new RegExp(`${photo}\\.webp$`),
		);
		await gallery.getByRole("button", { name: "Закрыть", exact: true }).click();
		await expect(gallery).toHaveCount(0);
	}
	for (const [selector, file] of [
		[".camp-poster", "poster"],
		[".music-poster", "live-music"],
	]) {
		const trigger = page.locator(selector);
		await trigger.click();
		const poster = page.getByRole("dialog", { name: "Просмотр постера" });
		await expect(poster).toBeVisible();
		await expect(currentImage()).toHaveAttribute(
			"src",
			new RegExp(`${file}\\.webp$`),
		);
		await expect(poster.locator(".yarl__thumbnails_container")).toHaveCount(0);
		await expect(
			poster.getByRole("button", { name: /Следующее|Предыдущее/ }),
		).toHaveCount(0);
		await expect(currentImage()).toBeVisible();
		await expect
			.poll(() =>
				currentImage().evaluate((image) => {
					const img = image as HTMLImageElement;
					return img.complete && img.naturalWidth > 0;
				}),
			)
			.toBe(true);
		const box = await currentImage().boundingBox();
		expect(box).not.toBeNull();
		if (!box) throw new Error("Постер не виден");
		expect(box.x).toBeGreaterThanOrEqual(0);
		expect(box.y).toBeGreaterThanOrEqual(0);
		expect(box.x + box.width).toBeLessThanOrEqual(
			page.viewportSize()?.width ?? 0,
		);
		expect(box.y + box.height).toBeLessThanOrEqual(
			page.viewportSize()?.height ?? 0,
		);
		await page.screenshot({
			path: `/tmp/aksenovdance-${testInfo.project.name}-${file}-viewer.png`,
		});
		const zoom = poster.getByRole("button", { name: "Увеличить", exact: true });
		await expect(zoom).toBeEnabled();
		await zoom.click();
		await expect(
			poster.getByRole("button", { name: "Уменьшить", exact: true }),
		).toBeEnabled();
		await page.keyboard.press("Escape");
		await expect(poster).toHaveCount(0);
		await expect(trigger).toBeFocused();
	}
	expect(errors).toEqual([]);
});
