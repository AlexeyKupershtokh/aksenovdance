import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { categories, priceStages, services, trainers } from "./data";

describe("fixtures лендинга", () => {
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
	test("риск некорректных демонстрационных этапов и повторных сервисов", () => {
		expect(priceStages.map((stage) => stage.price)).toEqual([
			9500, 11000, 12500,
		]);
		expect(new Set(services.map((service) => service.slug)).size).toBe(5);
	});
});
