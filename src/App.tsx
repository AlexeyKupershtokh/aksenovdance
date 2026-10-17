import { Accordion, SegmentedControl } from "@mantine/core";
import {
	IconArrowDown,
	IconArrowRight,
	IconArrowUpRight,
	IconCalendar,
	IconCamera,
	IconCheck,
	IconMapPin,
	IconMusic,
	IconPhone,
	IconShoppingBag,
	IconSnowflake,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { AppButton } from "./components/ui/app-button";
import { AppHeading, AppText } from "./components/ui/typography";
import {
	type Category,
	categories,
	imageUrl,
	phone,
	priceStages,
	rubles,
	sections,
	services,
	trainers,
} from "./data";

function SectionTitle({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string;
	title: string;
	description?: string;
}) {
	return (
		<div className="section-heading">
			<AppText kind="overline" tone="accent">
				{eyebrow}
			</AppText>
			<AppHeading level={2}>{title}</AppHeading>
			{description && (
				<AppText tone="muted" className="section-description">
					{description}
				</AppText>
			)}
		</div>
	);
}

export function App() {
	const [rosterCategory, setRosterCategory] = useState<Category>("Стандарт");
	const [priceCategory, setPriceCategory] = useState<Category>("Стандарт");
	const [openedTrainer, setOpenedTrainer] = useState<string | null>(null);
	const [activeSection, setActiveSection] = useState("about");
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		let frame = 0;
		function updateSection() {
			frame = 0;
			let current = "about";
			for (const [id] of sections) {
				const element = document.getElementById(id);
				if (element && element.getBoundingClientRect().top <= 180) current = id;
			}
			if (
				window.scrollY + window.innerHeight >=
				document.documentElement.scrollHeight - 8
			)
				current = "contacts";
			setActiveSection(current);
		}
		function scheduleUpdate() {
			if (!frame) frame = requestAnimationFrame(updateSection);
		}
		window.addEventListener("scroll", scheduleUpdate, { passive: true });
		window.addEventListener("resize", scheduleUpdate);
		updateSection();
		return () => {
			window.removeEventListener("scroll", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		const nav = navRef.current;
		const item = nav?.querySelector<HTMLElement>(`[href="#${activeSection}"]`);
		if (nav && item)
			nav.scrollTo({
				left: item.offsetLeft - 12,
				behavior: "instant",
			});
	}, [activeSection]);

	function showPrices(trainer: (typeof trainers)[number]) {
		setPriceCategory(trainer.category);
		setOpenedTrainer(trainer.id);
		document
			.getElementById("availability")
			?.scrollIntoView({ behavior: "auto" });
	}

	return (
		<>
			<a className="skip-link" href="#main">
				Перейти к содержимому
			</a>
			<header className="site-header">
				<div className="header-inner">
					<a className="brand" href="https://glamdance.ru/">
						<img
							src={`${import.meta.env.BASE_URL}logo.svg`}
							alt=""
							width="25"
							height="25"
						/>
						<span>Glamdance</span>
					</a>
					<div className="header-links">
						<a href="https://glamdance.ru/services">Сервисы</a>
						<a href="https://glamdance.ru/tournaments">Турниры</a>
						<span className="header-divider" />
						<span>Танцуем вместе</span>
					</div>
					<AppButton
						component="a"
						href={phone}
						intent="secondary"
						size="compact"
						leftSection={<IconPhone size={16} />}
					>
						Связаться<span className="desktop-word"> с организатором</span>
					</AppButton>
				</div>
			</header>
			<main id="main">
				<section className="hero wrap" aria-labelledby="hero-title">
					<div className="hero-copy">
						<AppText kind="overline" tone="accent" className="with-icon">
							<IconSnowflake size={17} />
							Зимние танцевальные сборы
						</AppText>
						<div className="hero-date">
							<IconCalendar size={16} />
							5–7 января 2027<span>Новосибирск</span>
						</div>
						<AppHeading level={1} kind="display" id="hero-title">
							кАллигрАфия
							<br />
							<span className="title-accent">телА</span>
							<span className="title-dot">.</span>
						</AppHeading>
						<AppText kind="lead" tone="muted" className="hero-lead">
							Начните год с движения.
							<br />
							Три дня на паркете — с любимыми тренерами и теми, кто так же
							влюблён в танец.
						</AppText>
						<div className="hero-actions">
							<AppButton
								component="a"
								href="#trainers"
								intent="accent"
								size="large"
								rightSection={<IconArrowUpRight size={18} />}
							>
								Выбрать тренера
							</AppButton>
							<AppButton
								component="a"
								href="#about"
								intent="quiet"
								size="large"
								rightSection={<IconArrowDown size={17} />}
							>
								О сборах
							</AppButton>
						</div>
						<AppText kind="compact" tone="muted" className="hero-location">
							<IconMapPin size={17} />
							МЦ «Содружество» · Кропоткина, 119/3
						</AppText>
					</div>
					<div className="hero-visual">
						<img
							className="hero-photo"
							src={imageUrl("hero.webp")}
							alt="Тренер показывает движение на занятии по бальным танцам"
							width="1080"
							height="1350"
							fetchPriority="high"
						/>
						<div className="photo-label">
							<span className="small-star">✳</span>
							<div>
								<AppText kind="label">Больше, чем тренировка</AppText>
								<AppText kind="compact" tone="muted">
									Место встречи своих людей
								</AppText>
							</div>
						</div>
						<div className="year-stamp" aria-hidden="true">
							ЗИМА
							<br />
							<span>2027</span>
						</div>
					</div>
				</section>
				<div className="demo-note wrap">
					<span className="demo-badge">Пример лендинга</span>
					<AppText kind="compact" tone="muted">
						Цены, свободные места и даты повышения — демонстрационные. Условия и
						участие сервисов уточняйте у организатора.
					</AppText>
				</div>
				<div className="section-nav-shell">
					<div className="nav-inner wrap">
						<nav
							ref={navRef}
							className="section-nav"
							aria-label="Разделы сборов"
						>
							{sections.map(([id, label]) => (
								<a
									key={id}
									href={`#${id}`}
									aria-current={activeSection === id ? "location" : undefined}
								>
									{label}
								</a>
							))}
						</nav>
						<a className="nav-date" href="#contacts">
							5–7 января <IconArrowUpRight size={16} />
						</a>
					</div>
				</div>

				<section id="about" className="section wrap">
					<div className="about-top">
						<SectionTitle
							eyebrow="Встретимся на паркете"
							title="Три дня. Один язык — танец."
							description="Стандарт, латина и сибирские педагоги. Соберите свои сборы: от работы над базой до индивидуальных деталей, которые меняют весь танец."
						/>
						<div className="about-facts">
							<div>
								<IconCalendar />
								<div>
									<AppText kind="label">5–7 января 2027</AppText>
									<AppText kind="compact" tone="muted">
										Вторник — четверг
									</AppText>
								</div>
							</div>
							<div>
								<IconMapPin />
								<div>
									<AppText kind="label">МЦ «Содружество»</AppText>
									<AppText kind="compact" tone="muted">
										Новосибирск, Кропоткина, 119/3
									</AppText>
								</div>
							</div>
						</div>
					</div>
					<div className="pricing-heading">
						<AppHeading level={3} kind="card">
							Спланируйте участие заранее
						</AppHeading>
						<span className="demo-badge">Пример стоимости</span>
					</div>
					<div className="price-stages">
						{priceStages.map((stage, index) => (
							<article
								className={`price-stage ${index === 0 ? "price-stage-first" : ""}`}
								key={stage.label}
							>
								<div className="price-stage-top">
									<AppText kind="label">{stage.label}</AppText>
									<span className="stage-number">0{index + 1}</span>
								</div>
								<AppText kind="compact" tone="muted">
									{stage.date}
								</AppText>
								<div className="stage-price">
									{rubles(stage.price)}
									<span> / участник</span>
								</div>
								<AppText kind="compact" tone="muted">
									Пример пакета групповых занятий
								</AppText>
							</article>
						))}
					</div>
					<AppText kind="compact" tone="muted" className="price-footnote">
						Состав пакета и продолжительность занятий уточняются. Индивидуальные
						уроки оплачиваются отдельно. Окончательную стоимость подтверждает
						Александр.
					</AppText>
				</section>

				<section id="trainers" className="section section-tinted">
					<div className="wrap">
						<div className="section-top">
							<SectionTitle
								eyebrow="Учиться у тех, кто вдохновляет"
								title="Ваши проводники в танце"
								description="Знакомые имена и новые точки роста. Выберите направление и найдите своего тренера."
							/>
							<a
								className="text-link poster-link"
								href={imageUrl("poster.webp")}
								target="_blank"
								rel="noreferrer"
							>
								Открыть афишу <IconArrowUpRight size={17} />
							</a>
						</div>
						<SegmentedControl
							className="category-tabs roster-tabs"
							aria-label="Направление тренеров"
							value={rosterCategory}
							onChange={(value) => setRosterCategory(value as Category)}
							data={categories.map((value) => ({ value, label: value }))}
						/>
						<div className="trainer-grid" aria-live="polite">
							{trainers
								.filter((t) => t.category === rosterCategory)
								.map((trainer) => (
									<article key={trainer.id} className="trainer-card">
										<img
											src={imageUrl(trainer.image)}
											alt={trainer.name}
											width="82"
											height="82"
											loading="lazy"
										/>
										<AppText kind="meta" tone="accent">
											{trainer.category}
										</AppText>
										<AppHeading level={3} kind="card">
											{trainer.name}
										</AppHeading>
										<AppButton
											intent="quiet"
											fullWidth
											onClick={() => showPrices(trainer)}
											rightSection={<IconArrowUpRight size={16} />}
										>
											Места и цены
										</AppButton>
									</article>
								))}
						</div>
						<AppText kind="compact" tone="muted" className="roster-note">
							Состав — по предоставленной афише. Актуальное расписание и участие
							педагогов подтвердит организатор.
						</AppText>
					</div>
				</section>

				<section id="availability" className="section wrap">
					<div className="section-top">
						<SectionTitle
							eyebrow="Найдите время для своего роста"
							title="Место для вашего танца"
							description="Посмотрите доступность тренеров и стоимость форматов. Для записи и согласования времени свяжитесь с Александром."
						/>
						<span className="demo-badge">Места и цены — пример</span>
					</div>
					<SegmentedControl
						className="category-tabs availability-tabs"
						aria-label="Направление занятий"
						value={priceCategory}
						onChange={(value) => {
							setPriceCategory(value as Category);
							setOpenedTrainer(null);
						}}
						data={categories.map((value) => ({ value, label: value }))}
					/>
					<div className="availability-table">
						<div className="availability-table-head">
							<AppText kind="meta">Тренер</AppText>
							<AppText kind="meta">Индивидуальные места · пример</AppText>
						</div>
						<Accordion
							value={openedTrainer}
							onChange={setOpenedTrainer}
							className="price-accordion"
						>
							{trainers
								.filter((t) => t.category === priceCategory)
								.map((trainer) => (
									<Accordion.Item value={trainer.id} key={trainer.id}>
										<Accordion.Control>
											<div className="availability-row">
												<div className="trainer-identity">
													<img
														src={imageUrl(trainer.image)}
														alt=""
														width="46"
														height="46"
														loading="lazy"
													/>
													<AppText component="span" kind="label">
														{trainer.name}
													</AppText>
												</div>
												<span
													className={`availability-status ${trainer.slots === 0 ? "sold-out" : trainer.slots < 3 ? "few-slots" : ""}`}
												>
													<span className="status-dot" />
													{trainer.slots === 0
														? "Лист ожидания"
														: `Осталось мест: ${trainer.slots}`}
												</span>
											</div>
										</Accordion.Control>
										<Accordion.Panel>
											<div className="lesson-details">
												<div>
													<AppText kind="compact" tone="muted">
														Групповое занятие
													</AppText>
													<AppHeading level={3} kind="card">
														{rubles(trainer.groupPrice)}{" "}
														<span className="price-unit">/ человек</span>
													</AppHeading>
												</div>
												<div>
													<AppText kind="compact" tone="muted">
														Индивидуальное занятие
													</AppText>
													<AppHeading level={3} kind="card">
														{rubles(trainer.individualPrice)}{" "}
														<span className="price-unit">/ занятие</span>
													</AppHeading>
												</div>
												<AppButton
													component="a"
													href={phone}
													intent="primary"
													rightSection={<IconPhone size={16} />}
												>
													{trainer.slots
														? "Уточнить запись"
														: "Уточнить лист ожидания"}
												</AppButton>
												<AppText
													kind="compact"
													tone="muted"
													className="lesson-disclaimer"
												>
													Демонстрационные цены и остатки. Длительность, формат,
													цену за пару и время занятия уточняйте у организатора.
												</AppText>
											</div>
										</Accordion.Panel>
									</Accordion.Item>
								))}
						</Accordion>
					</div>
					<div className="contact-hint">
						<IconPhone size={20} />
						<AppText kind="compact">
							Не знаете, кого выбрать? Александр поможет составить программу:{" "}
							<a href={phone}>+7 (913) 907-8-777</a>
						</AppText>
					</div>
				</section>

				<section id="experience" className="section experience-section">
					<div className="wrap">
						<SectionTitle
							eyebrow="Всё складывается в атмосферу"
							title="Между занятиями — тоже жизнь"
							description="Музыка, встречи, красивые кадры и любимые танцевальные бренды. Собрали идеи для пространства, в котором хочется остаться."
						/>
						<div className="experience-grid">
							<article className="live-card">
								<IconMusic size={28} stroke={1.5} />
								<AppText kind="overline" tone="inverseMuted">
									В ритме сборов
								</AppText>
								<AppHeading level={3} kind="subsection" tone="inverse">
									Когда музыка живая,
									<br />
									танец звучит иначе.
								</AppHeading>
								<AppText tone="inverseMuted">
									Вечер живого звука — возможность выдохнуть после занятий и
									снова выйти на паркет. Программа на 2027 год уточняется.
								</AppText>
								<span className="sound-waves" aria-hidden="true">
									▂ ▅ ▃ ▇ ▄ ▂ ▆ ▃ ▅ ▇ ▂ ▄ ▆ ▃ ▅
								</span>
							</article>
							<div className="experience-intro">
								<div className="feature-line">
									<IconCamera size={25} />
									<div>
										<AppHeading level={3} kind="card">
											Сохранить своё движение
										</AppHeading>
										<AppText kind="compact" tone="muted">
											Фото и видео, в которых виден ваш прогресс — и
											удовольствие от танца.
										</AppText>
									</div>
								</div>
								<div className="feature-line">
									<IconShoppingBag size={25} />
									<div>
										<AppHeading level={3} kind="card">
											Найти свою новую любимую вещь
										</AppHeading>
										<AppText kind="compact" tone="muted">
											Тренировочная одежда, платья и обувь от сибирских мастеров
											и магазинов.
										</AppText>
									</div>
								</div>
								<div className="services-note">
									<IconCheck size={18} />
									<AppText kind="compact" tone="muted">
										Ниже — подборка из Glamdance. Участие сервисов в сборах пока
										не подтверждено.
									</AppText>
								</div>
							</div>
						</div>
						<div className="service-grid">
							{services.map((service) => (
								<a
									className="service-card"
									href={`https://glamdance.ru/s/${service.slug}`}
									target="_blank"
									rel="noreferrer"
									key={service.slug}
								>
									<div className="service-top">
										<span className={`service-monogram ${service.tone}`}>
											{service.initials}
										</span>
										<IconArrowUpRight size={19} />
									</div>
									<AppText kind="meta" tone="muted">
										{service.category}
									</AppText>
									<AppHeading level={3} kind="card">
										{service.name}
									</AppHeading>
									<AppText kind="compact" tone="muted">
										{service.description}
									</AppText>
									<span className="service-link">Профиль на Glamdance</span>
								</a>
							))}
						</div>
					</div>
				</section>

				<section id="stories" className="section wrap">
					<SectionTitle
						eyebrow="У каждого движения есть история"
						title="Как это было"
						description="Маленькие открытия на занятии, разговоры у паркета и радость от того, что наконец получилось. Несколько моментов прошлых встреч."
					/>
					<div className="story-grid">
						<article className="story story-large">
							<img
								src={imageUrl("practice.webp")}
								width="900"
								height="1125"
								alt="Пара отрабатывает движение на светлом паркете"
								loading="lazy"
							/>
							<div className="story-caption">
								<AppText kind="overline" tone="inverseMuted">
									01 / Вместе
								</AppText>
								<AppHeading level={3} kind="subsection" tone="inverse">
									Тот самый момент,
									<br />
									когда вы — в одном ритме.
								</AppHeading>
							</div>
						</article>
						<article className="story">
							<img
								src={imageUrl("coach.webp")}
								width="900"
								height="1125"
								alt="Тренер подробно разбирает движение с участниками"
								loading="lazy"
							/>
							<div className="story-caption">
								<AppText kind="overline" tone="inverseMuted">
									02 / Внимание к деталям
								</AppText>
								<AppHeading level={3} kind="card" tone="inverse">
									Один совет.
									<br />
									Совсем другое ощущение.
								</AppHeading>
							</div>
						</article>
						<article className="story">
							<img
								src={imageUrl("movement.webp")}
								width="900"
								height="1125"
								alt="Танцовщица в движении во время занятия"
								loading="lazy"
							/>
							<div className="story-caption">
								<AppText kind="overline" tone="inverseMuted">
									03 / Свобода
								</AppText>
								<AppHeading level={3} kind="card" tone="inverse">
									Пробовать. Чувствовать.
									<br />
									Танцевать по-своему.
								</AppHeading>
							</div>
						</article>
					</div>
					<figure className="group-memory">
						<img
							src={imageUrl("together.webp")}
							width="1080"
							height="811"
							alt="Общая фотография участников и тренеров сборов в спортивном зале"
							loading="lazy"
						/>
						<figcaption>
							<AppText kind="label">Большая танцевальная семья</AppText>
							<AppText kind="compact" tone="muted">
								Фотографии из архива сборов. Подписи — редакционные, без цитат
								участников.
							</AppText>
						</figcaption>
					</figure>
				</section>

				<section id="contacts" className="section wrap contact-section">
					<div className="contact-panel">
						<div>
							<AppText kind="overline" tone="accent">
								Ваш январь начинается здесь
							</AppText>
							<AppHeading level={2}>Увидимся на паркете?</AppHeading>
							<AppText tone="muted">
								Выберите тренеров, задайте вопросы
								<br className="desktop-word" /> и спланируйте три дня для себя и
								танца.
							</AppText>
							<AppButton
								component="a"
								href={phone}
								intent="accent"
								size="large"
								leftSection={<IconPhone size={18} />}
							>
								Позвонить Александру
							</AppButton>
						</div>
						<div className="contact-information">
							<AppText kind="label">Организатор · Александр</AppText>
							<a className="phone-link" href={phone}>
								+7 (913) 907-8-777
							</a>
							<AppText kind="compact" tone="muted">
								<IconCalendar size={16} />
								5–7 января 2027
							</AppText>
							<AppText kind="compact" tone="muted">
								<IconMapPin size={16} />
								МЦ «Содружество»
								<br />
								Новосибирск, ул. Кропоткина, 119/3
							</AppText>
							<a
								className="text-link"
								href="https://2gis.ru/novosibirsk/search/Кропоткина%20119%2F3"
								target="_blank"
								rel="noreferrer"
							>
								Посмотреть на карте <IconArrowUpRight size={16} />
							</a>
						</div>
					</div>
				</section>
			</main>
			<footer className="wrap site-footer">
				<a className="brand" href="https://glamdance.ru/">
					Glamdance
					<IconArrowUpRight size={16} />
				</a>
				<AppText kind="compact" tone="muted">
					кАллигрАфия телА · Зима 2027
				</AppText>
				<AppText kind="meta" tone="muted">
					Демонстрационный лендинг · Не является офертой
				</AppText>
				<a
					className="back-top"
					href="#main"
					aria-label="Вернуться к началу страницы"
				>
					<IconArrowRight size={20} />
				</a>
			</footer>
		</>
	);
}
