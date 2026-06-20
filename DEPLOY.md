# Деплой портфолио

Сайт статический: ему не нужен сервер, база данных или сборка. Для публикации достаточно загрузить содержимое папки сайта на хостинг.

## Самый простой вариант: Netlify Drop

1. Открой `https://app.netlify.com/drop`.
2. Перетащи туда папку `kalashnikov-portfolio-public` или архив `kalashnikov-portfolio-public.zip`.
3. Netlify выдаст временную ссылку. Ее можно сразу отправлять.
4. Если нужен красивый домен, добавь домен в настройках Netlify: `Domain management`.

## Вариант через Vercel

1. Создай проект на `https://vercel.com`.
2. Импортируй папку сайта или репозиторий.
3. Build command оставь пустым.
4. Output directory оставь `.`.
5. Нажми Deploy.

## Вариант через обычный хостинг

1. Зайди в файловый менеджер хостинга или FTP.
2. Открой папку домена, часто она называется `public_html`, `www` или `htdocs`.
3. Загрузи туда файлы из подготовленной папки деплоя так, чтобы `index.html` лежал в корне домена.
4. Проверь адрес домена в браузере.

## Что должно лежать в публичной папке

- `index.html`
- `mts.html`
- `fashion-fund.html`
- `ai-concepts.html`
- `presentations.html`
- `styles.css`
- `app.js`
- `assets/`
- `netlify.toml`, `vercel.json`, `_headers`, `.nojekyll`

Папки `tools`, `qa`, `assets/source` и локальные `.cmd` файлы на хостинг загружать не нужно.
