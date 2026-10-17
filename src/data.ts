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

export const trainers = names.flatMap((group, row) =>
	group.map((name, col) => ({
		id: `trainer-${row}-${col}`,
		name,
		category: categories[row],
		image: `trainer-${row}-${col}.webp`,
		slots: [3, 0, 5, 2, 4, 1, 6, 3][(col + row) % 8],
		groupPrice: row === 2 ? 1800 : 2400,
		individualPrice: ((row === 2 ? 3500 : 5500) + (col % 3) * 500) * 2,
	})),
);

export const priceStages = [
	{ label: "Ранняя запись", date: "До 30 ноября 2026", price: 19000 },
	{ label: "Основная запись", date: "1–20 декабря 2026", price: 22000 },
	{ label: "Перед встречей", date: "С 21 декабря 2026", price: 25000 },
];

export const services = [
	{
		name: "Алексей Куперштох",
		category: "Фото и видео",
		slug: "akupershtokh",
		avatar: "service-akupershtokh.webp",
	},
	{
		name: "svetlana_fotolifes",
		category: "Фото и видео",
		slug: "svetlana_fotolifes",
		avatar: "service-svetlana_fotolifes.webp",
	},
	{
		name: "Dance ICON",
		category: "Тренировочная одежда",
		slug: "danceicon_dw",
		avatar: "service-danceicon_dw.webp",
	},
	{
		name: "Танцевальный Бутик",
		category: "Одежда и обувь",
		slug: "dance_boutique",
		avatar: "service-dance_boutique.webp",
	},
	{
		name: "Ольга Устинова-Занкина",
		category: "Платья и одежда",
		slug: "olga_ustinova_zankina",
		avatar: "service-olga_ustinova_zankina.webp",
	},
];

export const merch = [
	{ name: "Шопер", image: "merch-shopper.webp", price: 3000 },
	{ name: "Спортивная сумка", image: "merch-bag.webp", price: 6000 },
	{ name: "Рюкзак", image: "merch-backpack.webp", price: 8000 },
];

export const participantReviews = [
	{
		subject: "О сборах",
		text: "Приехали за тренировками, а уехали ещё и с новыми друзьями. Понравилось, что в зале все работают серьёзно, но без лишнего напряжения. А танцевать вечером под живой вокал после целого дня занятий — особое удовольствие.",
		author: "Анна",
		role: "Участница сборов",
	},
	{
		subject: "Наталья Смирнова",
		text: "На занятии с Натальей наконец поняла, почему всё время зажимаю плечи. Не просто „делай так“, а спокойно, по шагам: что поменять и как это почувствовать. Унесла с собой конкретные вещи, над которыми теперь работаю.",
		author: "Екатерина",
		role: "Стандарт",
	},
	{
		subject: "Олег Чжен",
		text: "Больше всего запомнился разбор ритма у Олега Чжена. Вроде бы знакомые движения, а после его объяснений начинаешь слышать в музыке совсем другие акценты. Сразу пошли на практику пробовать — хотелось закрепить, пока ощущения свежие.",
		author: "Дмитрий",
		role: "Латина",
	},
] as const;

export const storyPhotos = [
	{
		image: "practice.webp",
		caption: "Танцевать вместе",
		alt: "Пара отрабатывает движение на светлом паркете",
		width: 900,
		height: 900,
	},
	{
		image: "coach.webp",
		caption: "Работа над деталями",
		alt: "Тренер разбирает движение с участниками",
		width: 900,
		height: 900,
	},
	{
		image: "movement.webp",
		caption: "Свобода движения",
		alt: "Танцовщица в движении во время занятия",
		width: 900,
		height: 900,
	},
	{
		image: "guidance.webp",
		caption: "Точность жеста",
		alt: "Тренер объясняет движение ученику",
		width: 1080,
		height: 1080,
	},
	{
		image: "connection.webp",
		caption: "Контакт в паре",
		alt: "Педагог помогает танцовщице найти положение рук",
		width: 1080,
		height: 1080,
	},
	{
		image: "together.webp",
		caption: "Участники и тренеры сборов",
		alt: "Участники и тренеры сборов в спортивном зале",
		width: 1400,
		height: 1056,
	},
] as const;

export const sections = [
	["about", "О сборах"],
	["trainers", "Тренеры"],
	["experience", "Атмосфера"],
	["stories", "Как это было"],
	["contacts", "Контакты"],
	["merch", "Мерч"],
] as const;

export const imageUrl = (name: string) =>
	`${import.meta.env.BASE_URL}images/${name}`;
export const rubles = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;
export const phone = "tel:+79139078777";
