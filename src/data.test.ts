import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import {
	categories,
	merch,
	priceStages,
	services,
	storyPhotos,
	trainers,
} from "./data";

describe("данные лендинга", () => {
	test("риск пропуска или дублирования файлов галереи: шесть разных доступных фотографий", () => {
		expect(storyPhotos).toHaveLength(6);
		expect(new Set(storyPhotos.map((photo) => photo.image)).size).toBe(6);
		for (const photo of storyPhotos)
			expect(
				existsSync(new URL(`../public/images/${photo.image}`, import.meta.url)),
			).toBe(true);
	});
	test("риск потери состава афиши: 23 уникальные записи, три категории и портрет каждого", () => {
		expect(trainers).toHaveLength(23);
		expect(new Set(trainers.map((trainer) => trainer.name)).size).toBe(23);
		expect(
			categories.map(
				(category) =>
					trainers.filter((trainer) => trainer.category === category).length,
			),
		).toEqual([8, 8, 7]);
		for (const trainer of trainers) {
			expect(
				existsSync(
					new URL(`../public/images/${trainer.image}`, import.meta.url),
				),
			).toBe(true);
			expect(Number.isInteger(trainer.slots) && trainer.slots >= 0).toBe(true);
			expect(trainer.groupPrice).toBeGreaterThan(0);
			expect(trainer.individualPrice).toBeGreaterThan(trainer.groupPrice);
		}
	});
	test("риск неверного удвоения цен и неполных карточек сервисов и мерча", () => {
		expect(priceStages.map((stage) => stage.price)).toEqual([
			19000, 22000, 25000,
		]);
		expect(new Set(services.map((service) => service.slug)).size).toBe(5);
		expect(
			[...new Set(trainers.map((trainer) => trainer.groupPrice))].sort(),
		).toEqual([1800, 2400]);
		expect([
			trainers[0].individualPrice,
			trainers[2].individualPrice,
			trainers[16].individualPrice,
		]).toEqual([11000, 13000, 7000]);
		for (const service of services)
			expect(
				existsSync(
					new URL(`../public/images/${service.avatar}`, import.meta.url),
				),
			).toBe(true);
		expect(merch.map((product) => product.price)).toEqual([3000, 6000, 8000]);
		for (const product of merch)
			expect(
				existsSync(
					new URL(`../public/images/${product.image}`, import.meta.url),
				),
			).toBe(true);
	});
});
