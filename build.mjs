// Сборка прототипа GRAFIT: node build.mjs [base]  →  dist/<город>/…/index.html, dist/redirects/, dist/index.html (разбор и карта).
// base – префикс адресов на Pages (по умолчанию /grafit-prototip). Каждый город – отдельный сайт (поддомен), главный – Москва.
import { mkdirSync, writeFileSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CITIES, CITY_PENDING, PRICE_ISSUES, REDIRECT_RULES, NOT_PAGES } from './data/grafit.mjs';
import { OLD_MSK, OLD_UFA } from './data/old-paths.mjs';
import { SERP, LEADERS } from './data/razbor.mjs';
import { buildCity } from './src/pages.mjs';
import { page, block, intro, esc, DATE } from './src/render.mjs';

const BASE = process.argv[2] ?? '/grafit-prototip';
const ROOT = `${BASE}/`;
const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
const write = (p, html) => { const f = join(OUT, p, 'index.html'); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, html); };
const stats = [];
const allPaths = {};

for (const city of CITIES) {
  const { tree, L, ctx } = buildCity(city, ROOT);
  tree.push(['/sitemap/', 'Техническая', null]);
  allPaths[city.slug] = new Set(tree.map(([p]) => p));
  const counts = tree.reduce((a, [, t]) => ((a[t] = (a[t] || 0) + 1), a), {});
  // Карта сайта деревом: группируем по первому сегменту
  const groups = {};
  for (const [p, t] of tree) { const k = p === '/' ? '/' : `/${p.split('/')[1]}/`; (groups[k] ??= []).push([p, t]); }
  const li = ([p, t]) => `<li><a href="${L(p)}">${esc(p)}</a> <span class="w-muted">· ${t}</span></li>`;
  tree.find(([p]) => p === '/sitemap/')[2] = page(ctx, {
    pageName: 'Карта сайта', title: `Карта сайта – ${city.host}`, description: `Все страницы сайта GRAFIT ${city.in}.`, h1: `Карта сайта ${city.host}`, zapros: '–', schema: 'BreadcrumbList', crumbs: [['Карта сайта', '/sitemap/']],
    blocks: [block(1, 'Карта сайта', 'Где нужная страница?', 'все страницы деревом', `${intro(ctx, `Карта сайта ${city.host}`)}<p>Всего страниц: <b>${tree.length}</b> · ${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
${Object.entries(groups).map(([k, list]) => list.length > 12 ? `<details><summary><b>${esc(k)}</b> – ${list.length} стр.</summary><ul>${list.map(li).join('')}</ul></details>` : `<ul>${list.map(li).join('')}</ul>`).join('')}`)],
  });
  for (const [p, , html] of tree) write(`${city.slug}${p}`, html);
  stats.push({ city, total: tree.length, counts });
}

// ── 301: старые адреса Тильды → новые
const target = (p) => { for (const [re, fn] of REDIRECT_RULES) { const m = p.match(re); if (m) return fn(m, p); } return null; };
const junk = OLD_MSK.filter(([p]) => NOT_PAGES.test(p)).length;
const redirRows = (list, slug, host) => list.filter(([p]) => !NOT_PAGES.test(p)).map(([p, s]) => { const t = target(p); const ok = t && (allPaths[slug].has(t) || t.startsWith('/blog/') || t === '/franchise/'); return { host, p, t, s, ok }; });
const redirectsAll = [...redirRows(OLD_MSK, 'msk', 'grafit-service.ru'), ...redirRows(OLD_UFA.map((p) => [p, 0]), 'ufa', 'ufa.grafit-service.ru')];
// Адрес, который не меняется, в 301 не пишем: иначе бесконечная переадресация.
const same = redirectsAll.filter((r) => r.t === r.p);
const redirects = redirectsAll.filter((r) => r.t !== r.p);
const bad = redirects.filter((r) => !r.ok);
writeFileSync(join(OUT, 'redirects.csv'), 'host,old,new\n' + redirects.filter((r) => r.t).map((r) => `${r.host},${r.p},${r.t}`).join('\n') + '\n');
const sh = `<style>body{font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;max-width:1100px;margin:0 auto;padding:24px 16px 80px;color:#141414}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top;overflow-wrap:anywhere}h1{font-size:28px;line-height:1.2}h2{margin-top:36px}.box{border:1px solid #ccc;border-radius:8px;padding:14px 18px;margin:18px 0}.m{color:#666}pre{overflow-x:auto;background:#f4f4f4;padding:12px;border-radius:6px}a{color:#141414}</style>`;
mkdirSync(join(OUT, 'redirects'), { recursive: true });
writeFileSync(join(OUT, 'redirects', 'index.html'), `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>GRAFIT – 301 со старых адресов</title>${sh}</head><body>
<p><a href="${ROOT}">← Разбор и карта</a> · ${DATE}</p><h1>301 со старых адресов Тильды</h1>
<p>${redirects.length} адресов: все страницы из Метрики и sitemap за весь период, без служебных адресов Тильды (кнопки, попапы, формы); ещё ${junk} мусорных адресов (боты, сохранённые на телефонах копии) отброшены. Ещё ${same.length} адресов не меняются (главная, статьи блога, часть русификации) – им 301 не нужен. «Был поиск» – заходили из поиска за последние 90 дней, их терять нельзя. Файл для сервера: <a href="${ROOT}redirects.csv">redirects.csv</a>.</p>
${bad.length ? `<p><b>Без пары: ${bad.length}</b> – решить вручную, иначе 404.</p>` : '<p>У всех адресов есть пара.</p>'}
<table><thead><tr><th>Сайт</th><th>Старый</th><th>Новый</th><th>Был поиск</th></tr></thead><tbody>${redirects.map((r) => `<tr><td>${esc(r.host)}</td><td>${esc(r.p)}</td><td>${r.t ? esc(r.t) : '<b>нет пары</b>'}${r.t && !r.ok ? ' <b>(страницы нет)</b>' : ''}</td><td>${r.s ? 'да' : ''}</td></tr>`).join('')}</tbody></table></body></html>`);

// ── Страница для владельца: разбор + схема + ссылки
const msk = stats.find((s) => s.city.main);
writeFileSync(join(OUT, 'index.html'), `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>GRAFIT – разбор Москвы, карта сайта и прототип</title>${sh}</head><body>
<p class="m">GRAFIT · grafit-service.ru · ${DATE} · чёрно-белый прототип, закрыт от поиска</p>
<h1>GRAFIT: кто первый в Москве, какой будет сайт и прототип</h1>
<audio controls src="itog.mp3" style="width:100%"></audio>
<div class="box"><b>Коротко.</b> Сейчас GRAFIT стоит в топ-10 Яндекса Москвы по ремонту и сервису всех пяти марок. Сайт держится на 7 страницах марок, а лидеров вытягивают матрицы «работа × модель» по 600–2 500 страниц. По общим запросам («ремонт китайских электромобилей», «пневмоподвеска lixiang», «батарея zeekr», «русификация zeekr») GRAFIT нет: у него нет страниц под работы. Новый сайт закрывает это: работа на марке и на модели, общий каталог работ, русификация отдельным разделом, города на поддоменах со своим адресом и отзывами.</div>

<h2>1. Кто в выдаче Москвы</h2>
<p class="m">Яндекс, органика без рекламы, Москва; последние две строки – Уфа и регионы. Снято через Chrome ${DATE}. В скобках – место GRAFIT.</p>
<table><thead><tr><th>Запрос</th><th>Сайты по порядку</th></tr></thead><tbody>${SERP.map(([q, s]) => `<tr><td>${esc(q)}</td><td>${esc(s)}</td></tr>`).join('')}</tbody></table>
<h2>2. Как устроены лидеры</h2>
<table><thead><tr><th>Сайт</th><th>Тип</th><th>Страниц</th><th>Устройство</th></tr></thead><tbody>${LEADERS.map(([d, t, n, s]) => `<tr><td>${esc(d)}</td><td>${esc(t)}</td><td>${n}</td><td>${esc(s)}</td></tr>`).join('')}</tbody></table>
<p><b>Вывод.</b> Работают два типа. Моносайты под марку (ruszeekr, ruslixiang, lixiang-sto) берут марочные запросы. Мультибренды с матрицей работ (elektroman, chinnamon) берут общие и «проблемные» запросы. У GRAFIT есть вес домена и бренд, но нет матрицы. Её и добавляем, но в меру: страница «работа × модель» только у моделей с интересом от 1 000 в месяц (Wordstat РФ). Так на 22 модели выходит ${msk.counts['Страница']} страниц вместо тысяч пустых.</p>

<h2>3. Как устроен новый сайт</h2>
<pre>grafit-service.ru                 Москва – главный
ufa.grafit-service.ru             Уфа (уже есть на Тильде, №1 по «сервис lixiang уфа»)
krasnodar.grafit-service.ru       Краснодар
makhachkala.grafit-service.ru     Махачкала
?                                 ${esc(CITY_PENDING)}

/                                 Главная города
/lixiang/ /zeekr/ /voyah/ /avatr/ /lynk-co/          Хаб марки  (было /lixiang-service)
/&lt;марка&gt;/&lt;модель&gt;/                Хаб модели  (было /service/&lt;марка&gt;/&lt;модель&gt;/)
/&lt;марка&gt;/&lt;модель&gt;/&lt;работа&gt;/       Работа на модели – только Москва, только модели от 1 000/мес
/&lt;марка&gt;/&lt;работа&gt;/               Работа на марке, цены по моделям
/services/&lt;группа&gt;/&lt;работа&gt;/     Работа по всем маркам («ремонт пневмоподвески в Москве»)
/russification/&lt;марка&gt;/&lt;модель&gt;/  Русификация – 4 марки из прайса (адреса как сейчас)
/detailing/&lt;работа&gt;/             Детейлинг (Москва); в городах – хаб
/tire-service/                    Шиномонтаж – только Уфа
/prices/ /reviews/ /about/ /contacts/ /sitemap/ /privacy-policy/ /personal-data-consent/
/blog/&lt;статья&gt;/  /franchise/      Только главный, адреса не меняются</pre>
<p>Поддомен города – не копия Москвы: свой адрес, телефон, часы, отзывы и работы этого города, свои цены. Страниц «работа × модель» и детейлинга по работам на поддоменах нет: местного спроса на них мало, а сотни одинаковых страниц на четырёх доменах Яндекс сочтёт дорвеями.</p>

<h2>4. Прототип – по городам</h2>
<table><thead><tr><th>Сайт</th><th>Страниц</th><th>По типам</th><th>Ссылки</th></tr></thead><tbody>${stats.map((s) => `<tr><td><b>${esc(s.city.host)}</b><br><span class="m">${esc(s.city.name)}, ${esc(s.city.address)}</span></td><td>${s.total}</td><td>${Object.entries(s.counts).map(([k, v]) => `${k} ${v}`).join(', ')}</td><td><a href="${ROOT}${s.city.slug}/">главная</a> · <a href="${ROOT}${s.city.slug}/sitemap/">карта сайта</a></td></tr>`).join('')}
<tr><td><b>Итого</b></td><td>${stats.reduce((a, s) => a + s.total, 0)}</td><td></td><td><a href="${ROOT}redirects/">301 со старых адресов</a> (${redirects.length})</td></tr></tbody></table>
<p>Образцы: <a href="${ROOT}msk/lixiang/">хаб Lixiang</a> · <a href="${ROOT}msk/lixiang/l9/">Lixiang L9</a> · <a href="${ROOT}msk/lixiang/l9/air-suspension-repair/">пневмоподвеска L9</a> · <a href="${ROOT}msk/zeekr/hv-battery-diagnostics/">батарея Zeekr</a> · <a href="${ROOT}msk/services/suspension/air-suspension-repair/">пневмоподвеска – все марки</a> · <a href="${ROOT}msk/russification/zeekr/">русификация Zeekr</a> · <a href="${ROOT}ufa/">Уфа</a> · <a href="${ROOT}ufa/tire-service/">шиномонтаж Уфы</a>. В верхней панели включите «Логика блоков» и «SEO страницы».</p>

<h2>5. Что решить до вёрстки</h2><ol>
<li><b>Пятый город</b> – на сайте найдены четыре: Москва, Уфа, Краснодар, Махачкала (Махачкала – только на странице франшизы).</li>
<li><b>Телефоны Краснодара и Махачкалы</b> – на сайте везде московский номер. Для местной выдачи и карт у каждой точки нужен свой.</li>
<li><b>Другие марки.</b> В форме старого сайта 18 марок, включая бензиновые Haval, Chery, Omoda. В прототипе пять марок из меню. Добавлять Geely, BYD, Denza и другие – только гибриды и электро?</li>
<li><b>Русификация Avatr</b> – в прайсе её нет, а на старом сайте страницы есть и дают заходы из поиска. Пока ведём их 301 на сервис Avatr.</li>
<li><b>Цены противоречат друг другу:</b><ul>${PRICE_ISSUES.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></li>
<li><b>Цены в городах</b> – как в Москве или свои.</li>
<li><b>Детейлинг и шиномонтаж по городам</b> – где что есть.</li>
<li>Факты с сайта «6 лет», «6000 клиентов», «12 месяцев гарантии», «39 параметров» – чем подтверждаем.</li>
</ol>
<p class="m">Данные: выдача Яндекса через Chrome ${DATE}; sitemap конкурентов ${DATE}; сайт GRAFIT ${DATE}; Метрика и Вебмастер GRAFIT 02.11.2026 (разбор переезда); спрос по моделям – Wordstat РФ июль–сентябрь 2026.</p>
</body></html>`);

if (existsSync('docs/itog.mp3')) copyFileSync('docs/itog.mp3', join(OUT, 'itog.mp3'));
console.log(JSON.stringify({ cities: stats.map((s) => ({ c: s.city.slug, total: s.total, ...s.counts })), redirects: redirects.length, noPair: bad.map((r) => r.host + r.p + ' -> ' + r.t) }));
