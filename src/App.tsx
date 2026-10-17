import { SegmentedControl } from "@mantine/core";
import {
	IconArrowDown,
	IconArrowRight,
	IconArrowUpRight,
	IconCalendar,
	IconMapPin,
	IconPhone,
	IconSnowflake,
} from "@tabler/icons-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AppButton } from "./components/ui/app-button";
import { AppHeading, AppText } from "./components/ui/typography";
import {
	type Category,
	categories,
	imageUrl,
	merch,
	phone,
	priceStages,
	rubles,
	sections,
	services,
	storyPhotos,
	trainers,
} from "./data";

const MediaLightbox = lazy(() => import("./components/media-lightbox"));

function SectionTitle({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div className="section-heading">
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
	const [activeSection, setActiveSection] = useState("about");
	const navRef = useRef<HTMLElement>(null);
	const [gallery, setGallery] = useState<{
		index: number;
		poster?: "poster.webp" | "live-music.webp";
	} | null>(null);

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
				current = "merch";
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
			nav.scrollTo({ left: item.offsetLeft - 12, behavior: "instant" });
	}, [activeSection]);

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
						</AppHeading>
						<AppText kind="lead" tone="muted" className="hero-lead">
							Стандарт, латина и сибирские педагоги. Три дня групповых и
							индивидуальных занятий.
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
							alt="Пара танцует на занятии под руководством тренера"
							width="1200"
							height="1200"
							fetchPriority="high"
						/>
					</div>
				</section>
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
					</div>
				</div>

				<section id="about" className="section wrap about-layout">
					<div className="about-copy">
						<SectionTitle title="Участие в сборах" />
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
										Новосибирск, ул. Кропоткина, 119/3
									</AppText>
								</div>
							</div>
						</div>
						<div className="pricing-heading">
							<AppHeading level={3} kind="card">
								Пакет групповых занятий
							</AppHeading>
						</div>
						<div className="price-stages">
							{priceStages.map((stage, index) => (
								<article
									className={`price-stage ${index === 0 ? "price-stage-first" : ""}`}
									key={stage.label}
								>
									<AppText kind="label">{stage.label}</AppText>
									<AppText kind="compact" tone="muted">
										{stage.date}
									</AppText>
									<div className="stage-price">
										{rubles(stage.price)}
										<span> / участник</span>
									</div>
								</article>
							))}
						</div>
						<AppText kind="compact" tone="muted" className="price-footnote">
							Индивидуальные занятия оплачиваются отдельно.
						</AppText>
					</div>
					<a
						className="camp-poster"
						href={imageUrl("poster.webp")}
						onClick={(event) => {
							if (
								event.metaKey ||
								event.ctrlKey ||
								event.shiftKey ||
								event.altKey
							)
								return;
							event.preventDefault();
							setGallery({ index: 0, poster: "poster.webp" });
						}}
						aria-label="Открыть афишу сборов"
					>
						<img
							src={imageUrl("poster.webp")}
							alt="Афиша сборов «кАллигрАфия телА» со всеми тренерами"
							width="1080"
							height="1920"
							loading="lazy"
						/>
					</a>
				</section>

				<section id="trainers" className="section section-tinted">
					<div className="wrap">
						<SectionTitle title="Ваши проводники в танце" />
						<SegmentedControl
							className="category-tabs roster-tabs"
							aria-label="Направление тренеров"
							value={rosterCategory}
							onChange={(value) => setRosterCategory(value as Category)}
							data={categories.map((value) => ({ value, label: value }))}
						/>
						<div className="trainer-grid" aria-live="polite">
							{trainers
								.filter((trainer) => trainer.category === rosterCategory)
								.map((trainer) => (
									<article key={trainer.id} className="trainer-card">
										<img
											src={imageUrl(trainer.image)}
											alt={trainer.name}
											width="82"
											height="82"
											loading="lazy"
										/>
										<AppHeading level={3} kind="card">
											{trainer.name}
										</AppHeading>
										<span
											className={`availability-status ${trainer.slots === 0 ? "sold-out" : trainer.slots < 3 ? "few-slots" : ""}`}
										>
											<span className="status-dot" />
											{trainer.slots === 0
												? "Лист ожидания"
												: `Свободных мест: ${trainer.slots}`}
										</span>
										<dl className="trainer-prices">
											<div>
												<AppText component="dt" kind="compact" tone="muted">
													Групповое
												</AppText>
												<AppText component="dd" kind="label">
													{rubles(trainer.groupPrice)}
													<span className="price-unit"> / чел.</span>
												</AppText>
											</div>
											<div>
												<AppText component="dt" kind="compact" tone="muted">
													Индивидуальное
												</AppText>
												<AppText component="dd" kind="label">
													{rubles(trainer.individualPrice)}
													<span className="price-unit"> / занятие</span>
												</AppText>
											</div>
										</dl>
										<AppButton
											component="a"
											href={phone}
											intent="quiet"
											fullWidth
											aria-label={`${trainer.slots ? "Записаться" : "Лист ожидания"}: ${trainer.name}`}
										>
											{trainer.slots ? "Записаться" : "Лист ожидания"}
										</AppButton>
									</article>
								))}
						</div>
					</div>
				</section>

				<section id="experience" className="section experience-section">
					<div className="wrap">
						<SectionTitle title="Музыка, фото и магазины" />
						<div className="live-event">
							<a
								className="music-poster"
								href={imageUrl("live-music.webp")}
								onClick={(event) => {
									if (
										event.metaKey ||
										event.ctrlKey ||
										event.shiftKey ||
										event.altKey
									)
										return;
									event.preventDefault();
									setGallery({ index: 0, poster: "live-music.webp" });
								}}
								aria-label="Открыть постер вечера живого звука"
							>
								<img
									src={imageUrl("live-music.webp")}
									alt="Постер «кАллигрАфия телА»: вечер живого звука 7 января"
									width="1080"
									height="1080"
									loading="lazy"
								/>
							</a>
							<div>
								<AppText kind="overline" tone="accent">
									7 января
								</AppText>
								<AppHeading level={3} kind="subsection">
									Вечер живого звука
								</AppHeading>
								<AppText tone="muted">
									Танцевальный вечер с живым вокалом
									<br />в МЦ «Содружество».
								</AppText>
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
										<img
											className="service-avatar"
											src={imageUrl(service.avatar)}
											width="56"
											height="56"
											alt={service.name}
											loading="lazy"
										/>
										<IconArrowUpRight size={19} />
									</div>
									<AppHeading level={3} kind="card">
										{service.name}
									</AppHeading>
									<AppText kind="compact" tone="muted">
										{service.category}
									</AppText>
								</a>
							))}
						</div>
					</div>
				</section>

				<section id="stories" className="section wrap">
					<SectionTitle title="Как это было" />
					<div className="story-grid">
						{storyPhotos.map((photo, index) => (
							<a
								className={`story ${index === 0 ? "story-large" : ""} ${index === 5 ? "story-group" : ""}`}
								href={imageUrl(photo.image)}
								key={photo.image}
								aria-label={`Открыть фото: ${photo.caption}`}
								onClick={(event) => {
									if (
										event.metaKey ||
										event.ctrlKey ||
										event.shiftKey ||
										event.altKey
									)
										return;
									event.preventDefault();
									setGallery({ index });
								}}
							>
								<img
									src={imageUrl(photo.image)}
									width={photo.width}
									height={photo.height}
									alt={photo.alt}
									loading="lazy"
								/>
								<div className="story-caption">
									<AppHeading level={3} kind="card" tone="inverse">
										{photo.caption}
									</AppHeading>
								</div>
							</a>
						))}
					</div>
				</section>

				<section id="contacts" className="section wrap contact-section">
					<div className="contact-panel">
						<div>
							<AppHeading level={2}>Запись на сборы</AppHeading>
							<AppText tone="muted">Александр — организатор сборов.</AppText>
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

				<section id="merch" className="section wrap merch-section">
					<SectionTitle title="Мерч сборов" />
					<div className="merch-grid">
						{merch.map((product) => (
							<article className="merch-card" key={product.image}>
								<img
									src={imageUrl(product.image)}
									alt={`${product.name} «кАллигрАфия телА»`}
									width="900"
									height="683"
									loading="lazy"
								/>
								<div className="merch-info">
									<AppHeading level={3} kind="card">
										{product.name}
									</AppHeading>
									<AppText kind="lead" tone="accent">
										{rubles(product.price)}
									</AppText>
									<AppButton
										component="a"
										href={phone}
										intent="secondary"
										fullWidth
										aria-label={`Заказать: ${product.name}`}
									>
										Заказать
									</AppButton>
								</div>
							</article>
						))}
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
				<a
					className="back-top"
					href="#main"
					aria-label="Вернуться к началу страницы"
				>
					<IconArrowRight size={20} />
				</a>
			</footer>
			{gallery && (
				<Suspense fallback={null}>
					<MediaLightbox
						open
						close={() => setGallery(null)}
						single={Boolean(gallery.poster)}
						index={gallery.index}
						slides={
							gallery.poster
								? [
										{
											src: imageUrl(gallery.poster),
											alt:
												gallery.poster === "poster.webp"
													? "Афиша сборов «кАллигрАфия телА»"
													: "Постер вечера живого звука",
										},
									]
								: storyPhotos.map((photo) => ({
										src: imageUrl(photo.image),
										alt: photo.alt,
										width: photo.width,
										height: photo.height,
									}))
						}
					/>
				</Suspense>
			)}
		</>
	);
}
