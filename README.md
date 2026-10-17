# кАллигрАфия телА

Лендинг зимних танцевальных сборов 5–7 января 2027 года в Новосибирске. Vite 8, React 19, Mantine 9. Оформление, локальные шрифты и semantic UI-компоненты перенесены из Glamdance.

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

- `src/data.ts` — состав тренеров, свободные места и цены, этапы повышения, аватары и ссылки сервисов, товары мерча.
- `public/images/` — локальные фотографии, исходная афиша, постер живого звука и фотографии мерча.
- Аватары взяты из опубликованных профилей Glamdance через Imagor и сохранены локально в WebP.
- Сайт статический: запись и заказ выполняются по телефону организатора, остатки редактируются вручную в данных.
- `.github/workflows/pages.yml` проверяет код и Chromium перед публикацией. Base: `/aksenovdance/`.
- Метаданные, robots.txt и sitemap.xml настроены для публичной индексации.

Сервисы: [Алексей Куперштох](https://glamdance.ru/s/akupershtokh), [svetlana_fotolifes](https://glamdance.ru/s/svetlana_fotolifes), [Dance ICON](https://glamdance.ru/s/danceicon_dw), [Танцевальный Бутик](https://glamdance.ru/s/dance_boutique), [Ольга Устинова-Занкина](https://glamdance.ru/s/olga_ustinova_zankina).
