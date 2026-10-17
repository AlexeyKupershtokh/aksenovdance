# кАллигрАфия телА

Демонстрационный лендинг зимних танцевальных сборов 5–7 января 2027 года в Новосибирске. Vite 8, React 19, Mantine 9. Оформление, локальные шрифты и semantic UI-компоненты перенесены из Glamdance.

Сайт: https://alexeykupershtokh.github.io/aksenovdance/

## Запуск

Требуется Bun 1.4.3 или новее.

```sh
bun install
bun run dev
```

Открыть http://127.0.0.1:4173/aksenovdance/.

## Проверки

```sh
bun run lint
bun run validate
bun run test:unit
bun --bun node_modules/@playwright/test/cli.js install chromium
bun run test:e2e
```

Полный E2E запускает Chromium на 1440, 390 и 360 px. Риски и причина выбора E2E описаны в `e2e/landing.spec.ts`: реальные клики, загрузка изображений и шрифтов, геометрия и липкая навигация не проверяются только unit-тестами.

## Данные и публикация

- `src/data.ts` — состав тренеров, демонстрационные места/цены, этапы повышения, ссылки сервисов.
- `public/images/` — оптимизированные WebP из предоставленной папки; портреты вырезаны из афиши.
- Даты, площадка, телефон и состав взяты с афиши; год указан пользователем. Фотоподписи редакционные. Сервисы найдены через Glamdance, их участие не подтверждено.
- Цены, пакеты, даты повышения и остатки мест — примеры, а не реальные условия. Сайт не хранит заявки; запись согласуется с организатором по телефону.
- Автоматический деплой через `.github/workflows/pages.yml` после проверок. `vite.config.ts` задаёт base `/aksenovdance/`. GitHub Pages должен использовать GitHub Actions.
- Демонстрация закрыта от индексации через robots.txt и meta robots. Sitemap намеренно не публикуется. Перед реальным запуском подтвердить данные и пересмотреть индексацию.

Данные публичного каталога проверены 17 октября 2026 года:
[Алексей Куперштох](https://glamdance.ru/s/akupershtokh),
[svetlana_fotolifes](https://glamdance.ru/s/svetlana_fotolifes),
[Dance ICON](https://glamdance.ru/s/danceicon_dw),
[Танцевальный Бутик](https://glamdance.ru/s/dance_boutique),
[Ольга Устинова-Занкина](https://glamdance.ru/s/olga_ustinova_zankina).
