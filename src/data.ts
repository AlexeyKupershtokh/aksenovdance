export const categories = ["Стандарт", "Латина", "Сибирские педагоги"] as const;
export type Category = (typeof categories)[number];

const names = [
	[
		"Наталья Смирнова",
		"Екатерина Стрелкова",
		"Кристина Полунина",
		"Анастасия Пташинская и Егор Романюк",
		"Дарья Жукова и Илья Корнев",
		"Михаил Сарматов",
		"Евгений Никитин",
		"Роман Воронин",
	],
	[
		"Олег Чжен",
		"Андрей Зайцев",
		"Денис Старостин",
		"Андрей и Илья Боровские",
		"Ксения Пятяхина",
		"Мария Тзапташвили",
		"Юлия Рогозина",
		"Анастасия Дубровская",
	],
	[
		"Денис Козлов",
		"Алексей Святов",
		"Галина Зайцева",
		"Виктория Редько",
		"Саркис Акопян",
		"Ваге Смбатян",
		"Данис Шарипов",
	],
];

// shortcut: места и цены — демонстрационные fixtures, заменить данными организатора перед реальной записью.
export const trainers = names.flatMap((group, row) =>
	group.map((name, col) => ({
		id: `trainer-${row}-${col}`,
		name,
		category: categories[row],
		image: `trainer-${row}-${col}.webp`,
		slots: [3, 0, 5, 2, 4, 1, 6, 3][(col + row) % 8],
		groupPrice: row === 2 ? 900 : 1200,
		individualPrice: (row === 2 ? 3500 : 5500) + (col % 3) * 500,
	})),
);

export const priceStages = [
	{ label: "Ранняя запись", date: "До 30 ноября 2026", price: 9500 },
	{ label: "Основная запись", date: "1–20 декабря 2026", price: 11000 },
	{ label: "Перед встречей", date: "С 21 декабря 2026", price: 12500 },
];

export const services = [
	{
		name: "Алексей Куперштох",
		category: "Фото и видео",
		description: "Танцевальные кадры и видео, к которым хочется возвращаться.",
		slug: "akupershtokh",
		initials: "АК",
		tone: "green",
	},
	{
		name: "svetlana_fotolifes",
		category: "Фото и видео",
		description: "Движение, эмоции и ваши любимые моменты на паркете.",
		slug: "svetlana_fotolifes",
		initials: "sf",
		tone: "peach",
	},
	{
		name: "Dance ICON",
		category: "Тренировочная одежда",
		description: "Сибирский бренд одежды для спортивных бальных танцев.",
		slug: "danceicon_dw",
		initials: "ICON",
		tone: "dark",
	},
	{
		name: "Танцевальный Бутик",
		category: "Одежда и обувь · Новосибирск",
		description:
			"Всё, чтобы чувствовать себя уверенно на следующей тренировке.",
		slug: "dance_boutique",
		initials: "ТБ",
		tone: "sand",
	},
	{
		name: "Ольга Устинова-Занкина",
		category: "Платья и одежда · Новосибирск",
		description: "Танцевальные платья и тренировочная одежда «Оля-ля».",
		slug: "olga_ustinova_zankina",
		initials: "ОУ",
		tone: "rose",
	},
];

export const sections = [
	["about", "О сборах"],
	["trainers", "Тренеры"],
	["availability", "Места и цены"],
	["experience", "Атмосфера"],
	["stories", "Как это было"],
	["contacts", "Контакты"],
] as const;

export const imageUrl = (name: string) =>
	`${import.meta.env.BASE_URL}images/${name}`;
export const rubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;
export const phone = "tel:+79139078777";
