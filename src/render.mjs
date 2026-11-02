// Шаблоны прототипа GRAFIT. Комплект: ~/.claude/skills/marketolog/prototip/ (kit.css, разметка w-*), образец – ~/Sites/monobrend-servis.
import { readFileSync } from 'node:fs';
import { SITE, CITIES } from '../data/grafit.mjs';

const KIT = readFileSync(new URL('./kit.css', import.meta.url), 'utf8');
const SCRIPT = readFileSync(new URL('./page.js', import.meta.url), 'utf8');
export const DATE = '03.11.2026';
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const ask = (t) => `<span class="w-ask">[запросить: ${esc(t)}]</span>`;
export const askPrice = () => ask('цена');
export const askTime = () => ask('срок');
// Цена с сайта: показываем, но помечаем «подтвердить» – прайс на сайте местами противоречит сам себе.
export const sitePrice = (p) => `${esc(p)} <small class="w-muted">(с сайта, подтвердить)</small>`;
const cut = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,.:;–\s]+$/, '') + '.');
const tel = (c) => (c.phone ? c.phone.replace(/[^+\d]/g, '') : '+70000000000');
export const phone = (c) => (c.phone ? esc(c.phone) : ask(`телефон точки ${c.gen}`));

export function page(ctx, { title, description, h1, zapros, schema, links = [], crumbs = [], blocks, pageName }) {
  const { city, L } = ctx;
  const seo = { title: cut(title, 65), description: cut(description, 160), h1: esc(h1), zapros, schema, links };
  const bc = crumbs.length ? `<nav class="w-wrap w-muted" style="font-size:14px;padding-top:12px">${[['Главная', '/'], ...crumbs].map(([t, p], i, a) => i < a.length - 1 ? `<a href="${L(p)}">${esc(t)}</a>` : esc(t)).join(' › ')}</nav>` : '';
  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><title>${esc(seo.title)}</title><style>${KIT}</style></head><body>
<div class="w-bar"><div class="w-wrap"><b>Прототип · ${esc(city.host)} · ${esc(pageName)} · ${DATE}</b>
<a href="${ctx.root}">Разбор и карта</a> <a href="${L('/sitemap/')}">Карта сайта</a>
<label><input type="checkbox" id="t-logic"> Логика блоков</label><label><input type="checkbox" id="t-notes"> Комментарии дизайнеру</label>
<label><input type="checkbox" id="t-seo"> SEO страницы</label><label><input type="checkbox" id="t-success"> После отправки</label>
<span>Меток «запросить»: <b id="ask-count">0</b></span></div></div>
<script type="application/json" id="w-seo">${JSON.stringify(seo).replace(/</g, '\\u003c')}</script><div class="w-seo" id="w-seo-box"></div>
${header(ctx)}${bc}
<main>
${blocks.join('\n')}
</main>
${footer(ctx)}
<div class="w-sticky"><a class="w-btn" href="tel:${tel(city)}">Позвонить</a><a class="w-btn ghost" href="#zayavka">Записаться</a></div>
<script>${SCRIPT}</script></body></html>`;
}

function header({ city, L, root, brands }) {
  const others = CITIES.filter((c) => c !== city).map((c) => `<a href="${root}${c.slug}/">${esc(c.name)}</a>`).join(' · ');
  return `<header class="w-header w-block" data-n="0" data-name="Шапка" data-question="Это сервис для моей машины в моём городе? Как связаться?" data-proof="город, адрес и телефон точки, марки в меню">
<div class="w-wrap"><a class="w-logo" href="${L('/')}">${SITE.name}</a>
<span class="w-descr">${esc(SITE.descr)} ${esc(city.in)}</span>
<span class="w-contacts-top"><a href="tel:${tel(city)}">${phone(city)}</a><span class="w-muted">${esc(city.address)}${city.hours ? ', ' + esc(city.hours) : ''}</span></span>
<a class="w-btn ghost" href="#zayavka">Записаться</a></div>
<nav class="w-wrap w-nav">${brands.map((b) => `<a href="${L(`/${b.slug}/`)}">${esc(b.name)}</a>`).join('')}<a href="${L('/services/')}">Услуги</a><a href="${L('/russification/')}">Русификация</a><a href="${L('/detailing/')}">Детейлинг</a>${city.extra.includes('tires') ? `<a href="${L('/tire-service/')}">Шиномонтаж</a>` : ''}<a href="${L('/prices/')}">Цены</a><a href="${L('/reviews/')}">Отзывы</a><a href="${L('/contacts/')}">Контакты</a></nav>
<p class="w-wrap w-muted" style="font-size:14px;display:block">Город: <b>${esc(city.name)}</b> · другие: ${others}</p>
<p class="w-wrap w-note" style="display:block">Переключатель города ведёт на поддомен (${esc(CITIES.filter((c) => !c.main).map((c) => c.host).join(', '))}). Город определяем по IP и спрашиваем один раз, выбор запоминаем. Главный сайт – Москва.</p>
</header>`;
}

function footer({ city, L, root }) {
  return `<footer class="w-footer"><div class="w-wrap w-stack">
<b>${SITE.name} – ${esc(SITE.descr.toLowerCase())} ${esc(city.in)}</b>
<span>${city.org ? esc(city.org) : ask(`юрлицо точки ${city.gen}`)} · ${esc(SITE.mail)}</span>
<span>${CITIES.map((c) => `<a href="${root}${c.slug}/">${esc(c.name)}</a>: ${esc(c.address)}`).join(' · ')}</span>
<span><a href="${L('/services/')}">Услуги</a> · <a href="${L('/russification/')}">Русификация</a> · <a href="${L('/prices/')}">Цены</a> · <a href="${L('/about/')}">О компании</a> · <a href="${L('/contacts/')}">Контакты</a>${city.main ? ` · <a href="${L('/blog/')}">Блог</a> · <a href="${L('/franchise/')}">Франшиза</a>` : ''} · <a href="${L('/sitemap/')}">Карта сайта</a></span>
<span><a href="${L('/privacy-policy/')}">Политика обработки персональных данных</a> · <a href="${L('/personal-data-consent/')}">Согласие на обработку</a> · Cookie – окно при первом заходе, Метрика только после согласия</span>
<span class="w-muted">Не является официальным дилером. Товарные знаки принадлежат владельцам.</span>
</div></footer>`;
}

export function block(n, name, question, proof, inner, extra = '') {
  return `<section class="w-block${extra}" data-n="${n}" data-name="${esc(name)}" data-question="${esc(question)}" data-proof="${esc(proof)}"><div class="w-wrap w-stack">${inner}</div></section>`;
}

export function hero(n, ctx, { h1, sub, bullets, photo, alt, btn = 'Записаться в техцентр' }) {
  return block(n, 'Первый экран', 'Куда я попал и решат ли здесь мою задачу?', 'марка и модель в заголовке, город, цена и запись',
    `<div class="w-hero"><div class="w-stack"><h1>${esc(h1)}</h1><p>${esc(sub)}</p>
<ul>${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
<div class="w-actions"><a class="w-btn" href="#zayavka">${esc(btn)}</a><a class="w-btn ghost" href="tel:${tel(ctx.city)}">Позвонить</a></div>
<p class="w-hint">Мастер перезвонит в течение 15 минут в рабочее время, уточнит модель и пробег и назовёт цену до записи.</p></div>
<div class="w-media" data-alt="${esc(alt)}">${esc(photo)}</div></div>`);
}

export function faq(n, items, M) {
  return block(n, 'Вопросы', 'Что меня ещё останавливает?', 'ответы на частые вопросы владельцев',
    `<div class="w-faq w-stack"><h2>Что спрашивают владельцы ${esc(M)} перед записью</h2>${items.map(([q, a]) => `<details><summary>${esc(q.replaceAll('{M}', M))}</summary><p>${a.includes('[запросить:') ? a.replace(/\[запросить: ([^\]]+)\]/g, (_, t) => ask(t)) : esc(a.replaceAll('{M}', M))}</p></details>`).join('')}</div>`);
}

export function form(n, ctx, { title, what }) {
  const c = ctx.city;
  return `<section class="w-block" id="zayavka" data-n="${n}" data-name="Заявка" data-question="Как записаться и сколько это будет стоить?" data-proof="перезвон с ценой до записи">
<div class="w-wrap"><form class="w-form" onsubmit="event.preventDefault()">
<h2>${esc(title)}</h2>
<label class="w-field">Имя<input autocomplete="name"></label>
<label class="w-field">Телефон<input inputmode="tel" placeholder="+7 (___) ___-__-__"></label>
<label class="w-field">Марка, модель и год<input placeholder="${esc(what)}"></label>
<label class="w-field">Что нужно сделать<input placeholder="Например: ТО, стук спереди, русификация"></label>
<p class="w-muted" style="font-size:14px">Техцентр: ${esc(c.name)}, ${esc(c.address)}</p>
<label class="w-check"><input type="checkbox" data-agree> <span>Согласен на <a href="${ctx.L('/personal-data-consent/')}">обработку персональных данных</a></span></label>
<button class="w-btn" type="submit" disabled>Записаться</button>
<p class="w-hint">Перезвоним в течение 15 минут в рабочее время, уточним пробег и симптомы, назовём цену и свободное время.</p>
<div class="w-success"><p><b>Заявка принята.</b></p><p>Перезвоним в течение 15 минут в рабочее время (${esc(c.hours ?? 'часы точки уточнить')}).</p>
<p>Срочно – <a href="tel:${tel(c)}">позвонить</a> или написать в Telegram / WhatsApp</p><p>Подготовьте: пробег, VIN или фото СТС, фото ошибки на экране, если есть.</p></div>
</form></div></section>`;
}

export const intro = (ctx, h1, text = '') => `<h1>${esc(h1)}</h1>${text ? `<p>${esc(text)}</p>` : ''}<div class="w-actions"><a class="w-btn" href="#zayavka">Записаться</a><a class="w-btn ghost" href="tel:${tel(ctx.city)}">Позвонить</a></div>`;

export function cta(n, text, btn = 'Записаться') {
  return block(n, 'Плашка призыва', 'Мне хватает – что сделать сейчас?', 'предложение по блоку выше',
    `<div class="w-cta"><p>${esc(text)}</p><a class="w-btn" href="#zayavka">${esc(btn)}</a></div>`, ' w-cta-strip');
}

export function steps(n, list, title) {
  return block(n, 'Этапы', 'Что будет и в каком порядке?', 'регламент работы',
    `<h2>${esc(title)}</h2><ol class="w-steps" style="--cols:${Math.min(list.length, 5)}">${list.map((s, i) => `<li><b>Шаг ${i + 1}</b><span>${esc(s[0].toUpperCase() + s.slice(1))}</span></li>`).join('')}</ol>`);
}

export function signs(n, list, title) {
  return block(n, 'Когда нужно', 'Это моя ситуация?', 'признаки, по которым владелец узнаёт проблему',
    `<h2>${esc(title)}</h2><ul>${list.map((s) => `<li>${esc(s[0].toUpperCase() + s.slice(1))}</li>`).join('')}</ul>`);
}

export function why(n, ctx, about = 'китайских гибридов и электромобилей') {
  const items = [
    ['Только китайские гибриды и электромобили', 'Lixiang, Zeekr, Voyah, Avatr, Lynk & Co – знаем их батареи, генераторы, пневмоподвеску и электронику.'],
    ['Гарантия 12 месяцев', `На работы, по данным сайта. ${ask('подтвердить: на что именно и есть ли гарантия на запчасти')}`],
    ['Бесплатный осмотр по 39 параметрам', 'Ходовая, жидкости, герметичность, высоковольтные провода – до записи на ремонт.'],
    ['Марочные сканеры', ask('какое оборудование: ZDS для Zeekr, сканеры Lixiang и др. – фото')],
    ['Допуск к высокому напряжению', ask('есть ли у мастеров допуск к высоковольтным работам')],
    ctx.city.extra.includes('tow') ? ['Выездная бригада', 'По Москве и области: заберём машину, сделаем работы и привезём обратно.'] : ['Цена до начала работ', 'Согласуем список и стоимость заранее. Без согласования ничего не меняем.'],
  ];
  return block(n, 'Почему GRAFIT', 'Почему сюда, а не к дилеру или в обычный сервис?', 'специализация, гарантия, оборудование, бесплатный осмотр',
    `<h2>Почему владельцы ${esc(about)} едут в GRAFIT</h2><div class="w-grid" style="--cols:3;--cols-m:2">${items.map(([h, t]) => `<article class="w-card"><h3>${esc(h)}</h3><p>${t.startsWith('<') || t.includes('w-ask') ? t : esc(t)}</p></article>`).join('')}</div>
<p class="w-note">Факты «6 лет», «12 месяцев», «39 параметров», «6000 клиентов» взяты с текущего сайта – у каждого должно быть подтверждение (фото, документ, ссылка на карты). Без подтверждения карточку убрать.</p>`);
}

export function reviews(n, ctx, about) {
  return block(n, 'Работы и отзывы', 'Здесь уже чинили такие машины, как моя?', 'фото работ с моделью и отзывы с карт этого города',
    `<h2>Работы и отзывы: ${esc(about)} ${esc(ctx.city.in)}</h2><div class="w-grid" style="--cols:3;--cols-m:2">${[1, 2, 3].map(() => `<article class="w-card"><div class="w-media small" data-alt="Работа в GRAFIT ${esc(ctx.city.name)}">Фото работы: машина на подъёмнике, модель видна, госномер размыт строго по рамке</div><h3>${ask('модель, что сделали')}</h3><p>${ask('задача клиента, срок, цена')}</p></article>`).join('')}</div>
<p>${ask(`рейтинг и число отзывов точки ${ctx.city.gen} на Яндекс Картах и 2ГИС`)}</p>`);
}

export function priceTable(rows, head = ['Работа', 'Цена', 'Срок']) {
  return `<div class="w-table-wrap"><table class="w-table"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
