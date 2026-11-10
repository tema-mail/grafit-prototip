// Идеальные страницы «марка» и «марка + модель» по разбору топ-5 Москвы 10.11.2026
// (~/Documents/monobrend-msk-2026-11, отчёт kitay-to-msk): регламент ТО-0…ТО-10 с ценами в HTML, калькулятор,
// «что важно на модели», цены частых работ, «у нас и у дилера», кейсы, вопросы, перелинковка моделей.
import { SERVICES, GROUPS } from '../data/services.mjs';
import { SPROS_DATE } from '../data/kitay.mjs';
import { features, ptLine } from './features.mjs';
import { page, block, hero, faq, form, cta, reviews, priceTable, ask, askPrice, esc } from './render.mjs';

const S = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const fits = (m, s) => features(m).has(s.req);
// Ссылка только на существующую страницу работы, иначе – текст (H.link отдаёт null)
const lnk = (H, b, m, s) => { const p = H.link(b, m, s); return p ? `<a href="${H.L(p)}">${esc(s.name)}</a>` : esc(s.name); };
// Связка блока со следующим (правило владельца 06.11.2026): какой вопрос блок вызывает и как подводит к следующему
const isBlock = (h) => /^<section class="w-block(?! w-cta-strip)/.test(h || '') && !/w-cta-strip/.test((h || '').slice(0, 120));
const question = (h) => (h.match(/data-question="([^"]*)"/) || [])[1];
// Вопросы блоков идут цепочкой клиента: data-next = вопрос следующего блока (плашки призыва не в счёт), последний – без связки
const chain = (blocks) => blocks.map((b, i) => { if (!isBlock(b)) return b; const nb = blocks.slice(i + 1).find(isBlock); return nb ? b.replace(/^<section([^>]*?)>/, `<section$1 data-next="${question(nb)}">`) : b; });
const TO_N = 10;
// Что меняют на ТО: работа и каждое какое ТО. Интервалы – типовые для китайских машин, на странице «подтвердить по регламенту модели».
const SCHED = [
  ['computer-diagnostics', 1], ['engine-oil-change', 1], ['cabin-filter-replacement', 1], ['hv-battery-diagnostics', 1],
  ['air-filter-replacement', 2], ['brake-fluid-replacement', 3], ['reducer-oil-change', 3], ['spark-plug-replacement', 4],
  ['coolant-replacement', 6], ['gearbox-oil-change', 6],
];
const ZERO = ['computer-diagnostics', 'engine-oil-change', 'reducer-oil-change'];

export function toList(m) {
  const list = [{ n: 0, km: '1 000–3 000 км', works: ZERO.filter((w) => fits(m, S[w])) }];
  for (let n = 1; n <= TO_N; n++) {
    list.push({ n, km: `${n * 10} 000 км или ${n * 12} мес.`, works: SCHED.filter(([w, k]) => n % k === 0 && fits(m, S[w])).map(([w]) => w) });
  }
  return list;
}

const engineLine = (m) => (m.engine ? `${m.engine}, ${m.box}, привод ${m.drive}` : ptLine(m));
const typeLine = (m) => (m.engine ? (m.pt.includes('phev') ? 'подключаемый гибрид' : 'бензиновый двигатель') : ptLine(m));

// Фразы спроса Москвы, где названа модель (латиницей или кириллицей)
function modelPhrases(b, m) {
  const k = m.name.toLowerCase(); const ru = { f7: 'ф7', m6: 'м6', jolion: 'джолион', dargo: 'дарго', h9: 'н9', atlas: 'атлас', monjaro: 'монжаро', coolray: 'кулрей', x50: 'х50', x70: 'х70', t7: 'т7', t4: 'т4', c5: 'с5', dashing: 'дашинг', free: 'фри' }[m.slug];
  return (b.frazy || []).filter(([a]) => a.includes(k) || (ru && a.includes(ru)));
}

function grid(H, b, m) {
  const M = `${b.name} ${m.name}`;
  const tabs = toList(m).map((t) => `<details${t.n === 1 ? ' open' : ''}><summary><b>ТО-${t.n}</b> · ${esc(t.km)} · итого ${askPrice()}</summary>
${priceTable(t.works.map((w) => [lnk(H, b, m, S[w]) + (S[w].req === 'hv' && m.pt.includes('ice') ? ' <small class="w-muted">(гибридная версия)</small>' : ''), /diagnostics/.test(w) ? ask('входит в ТО или отдельно') : H.price(b, S[w], m)]), ['Работа', 'Цена'])}</details>`).join('');
  return block(2, 'Регламент с ценами', `Когда мне на ТО и сколько стоит каждое?`, 'сетка ТО-0…ТО-10 по пробегу: работы и цена каждой – как у лидеров выдачи',
    `<h2>Регламент ТО ${esc(M)}: что меняем и сколько стоит</h2>
<p>Каждое ТО – по пробегу или по времени, что наступит раньше. Внутри – работы и цена каждой. Запчасти: оригинал или проверенный аналог на выбор.</p>
<p>${ask(`интервалы ТО ${M} по регламенту производителя: ниже типовая сетка 10 000 км / 12 мес. и ТО-0 на 1 000–3 000 км – заменить точными`)}</p>
${tabs}
<p>${ask(`цены GRAFIT по каждой строке и итог каждого ТО`)}</p>
<p class="w-note">Главный блок страницы. Таблица – текстом в HTML, не картинкой и не скриптом: её читают Яндекс и нейросети. По этому блоку в топ-3 стоят ruslixiang, elektroman, rusgeely, geellux, БорисХоф, pandafix (разбор 10.11.2026).</p>`);
}

function calc(H, b, m) {
  const M = `${b.name} ${m.name}`;
  return block(3, 'Калькулятор ТО', 'Какое ТО у меня сейчас и сколько выйдет?', 'пробег → номер ТО и сумма',
    `<h2>Рассчитать ТО ${esc(M)} по пробегу</h2>
<div class="w-grid" style="--cols:3;--cols-m:1"><label class="w-field">Пробег сейчас<select>${toList(m).map((t) => `<option>${esc(t.km.split(' или')[0])}</option>`).join('')}</select></label>
<label class="w-field">Запчасти<select><option>Оригинал</option><option>Проверенный аналог</option></select></label>
<div class="w-card"><b>ТО-1 · ${askPrice()}</b><p>Состав – в сетке выше. <a href="#zayavka">Записаться на это ТО</a></p></div></div>
<p class="w-note">Остров Preact: пробег → номер ТО → строки и сумма из той же сетки. Калькуляторы держат bosch-avto и autospot в топе почти по каждой модели.</p>`);
}

function important(H, b, m, n) {
  const M = `${b.name} ${m.name}`;
  const ph = modelPhrases(b, m);
  const box = m.box || '';
  const tips = [
    m.engine ? ['Двигатель', `${m.engine}. Масло и фильтр – на каждом ТО: турбомотору важны интервал и допуск масла.`] : ['Силовая установка', cap(ptLine(m)) + '.'],
    /робот/.test(box) ? ['Робот с двумя сцеплениями', 'Рывки на старте и в пробках, толчки при переключении – повод для диагностики и адаптации сцеплений, а не только замены масла.'] : null,
    /вариатор/.test(box) ? ['Вариатор', 'Масло вариатора меняем по регламенту, при пробуксовке и гуле – диагностика до ремонта.'] : null,
    /автомат/.test(box) ? ['Автомат', 'Масло АКПП меняем по регламенту, при толчках – адаптация и диагностика.'] : null,
    features(m).has('hv') ? ['Высоковольтная часть', 'На каждом ТО – проверка батареи, разъёмов и охлаждения.'] : null,
    m.air !== 'no' && m.air ? ['Пневмоподвеска', 'Осмотр баллонов и компрессора на ТО, калибровка после ремонта.'] : null,
  ].filter(Boolean);
  return block(n, `Что важно на ${m.name}`, `Чем ${M} отличается и знают ли здесь эту модель?`, 'устройство по версиям и узлы, которые нельзя пропускать',
    `<h2>Что важно знать про обслуживание ${esc(M)}</h2>
<p>${esc(cap(m.body))}: ${esc(engineLine(m))}.${m.check ? ' ' + ask(`подтвердить версии ${M}: двигатели, коробки, привод`) : ''}</p>
<div class="w-grid" style="--cols:3;--cols-m:1">${tips.map(([h, t]) => `<article class="w-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}</div>
<p>${ask(`слабые места ${M} по практике GRAFIT: что чаще всего ломается и на каком пробеге`)}</p>
${ph.length ? `<p class="w-note">Что ищут владельцы ${esc(M)} в Москве и области (Wordstat, ${SPROS_DATE}): ${ph.map(([a, c]) => `«${esc(a)}» – ${c}`).join(', ')}. Каждому узлу – абзац и ссылка на работу.</p>` : ''}
<p class="w-note">Образец – zeekrlab.ru «почему обычный сервис не справится»: блок, которого нет у дилеров. Текст пишет и проверяет мастер, без общих слов.</p>`);
}

function oftenWorks(H, b, m, n) {
  const M = `${b.name} ${m.name}`;
  const list = SERVICES.filter((s) => s.group !== 'maintenance' && s.group !== 'software' && fits(m, s) && (s.model || /gearbox|engine-diag|wheel|shock|suspension-repair/.test(s.slug))).slice(0, 10);
  return block(n, 'Частые работы', `Сколько стоит ремонт ${M}?`, 'цены частых работ модели со ссылками',
    `<h2>Цены на ремонт ${esc(M)}</h2>${priceTable(list.map((s) => [lnk(H, b, m, s), H.price(b, s, m), ask('срок')]))}
<p>Цена с работой. Точную стоимость назовём после бесплатного осмотра – до начала работ.</p>`);
}

function vsDealer(n, M, C) {
  return block(n, 'У нас и у дилера', 'Почему не к дилеру?', 'цена ТО у нас и у дилеров, запись, запчасти',
    `<h2>ТО ${esc(M)} у нас и у дилера</h2>${priceTable([1, 2, 3].map((k) => [`ТО-${k}`, askPrice(), ask(`средняя у дилеров ${C} – собрать с autospot и калькуляторов дилеров`)]), ['ТО', 'GRAFIT', `Дилеры ${C}`])}
<ul><li><b>Запись</b> – ${ask('ближайшее окно: завтра?')}</li><li><b>Запчасти</b> – оригинал или проверенный аналог на выбор; старые детали – ${ask('отдаёте клиенту?')}</li><li><b>Гарантия производителя</b> – ${ask('сохраняется ли при ТО у нас: формулировка после юриста')}</li></ul>`);
}

const whyIce = (n, B) => block(n, 'Почему GRAFIT', 'Почему сюда, а не к дилеру или в обычный сервис?', 'цена, сроки, гарантия, оборудование',
  `<h2>Почему владельцы ${esc(B)} едут в GRAFIT</h2><div class="w-grid" style="--cols:3;--cols-m:2">${[
    ['Цена до начала работ', 'Согласуем список и стоимость заранее. Без согласования ничего не меняем.'],
    ['Гарантия 12 месяцев', `На работы, по данным сайта. ${ask('подтвердить: на что именно')}`],
    ['Бесплатный осмотр по 39 параметрам', 'Ходовая, жидкости, герметичность – до записи на ремонт.'],
    ['Сканер марки', ask(`каким сканером работаете с ${B}`)],
    ['Запчасти на выбор', 'Оригинал или проверенный аналог – решаете вы.'],
    ['Запись без очереди', ask('ближайшее окно на ТО')],
  ].map(([h, t]) => `<article class="w-card"><h3>${esc(h)}</h3><p>${t.includes('w-ask') ? t : esc(t)}</p></article>`).join('')}</div>`);

const sprosNote = (sp, what) => (sp ? `<p class="w-wrap w-note">Спрос Москвы и области (Wordstat, ${SPROS_DATE}) ${esc(what)}: ${Object.entries(sp).filter(([k, v]) => typeof v === 'number').map(([k, v]) => `${{ '+то': 'ТО', to: 'ТО', rem: 'ремонт', int: 'интерес', sum: 'всего' }[k] || k} ${v}`).join(', ')}.</p>` : '');

export function modelPage(H, b, m) {
  const B = b.name; const M = `${B} ${m.name}`; const C = H.C;
  const sib = b.models.filter((x) => x !== m);
  const msk = m.msk || H.spros?.models?.[m.slug];
  return page(H.ctx, {
    pageName: M, title: `ТО ${M} ${C} – цены, регламент по пробегу | GRAFIT`, description: `ТО и ремонт ${M} ${C}: регламент ТО-0…ТО-10 с ценой каждой работы, калькулятор по пробегу, запчасти на выбор. Цена до начала работ.`,
    h1: `ТО и сервис ${M} ${C}`, zapros: `то ${M.toLowerCase()}; регламент то ${M.toLowerCase()}; стоимость то ${M.toLowerCase()}; ремонт ${M.toLowerCase()}`,
    schema: 'AutoRepair + Service (brand, model), Offer на каждое ТО, FAQPage, BreadcrumbList', links: [`/${b.slug}/`, ...sib.map((x) => `/${b.slug}/${x.slug}/`)],
    crumbs: [[`Сервис ${B}`, `/${b.slug}/`], [M, `/${b.slug}/${m.slug}/`]],
    blocks: chain([
      hero(1, H.ctx, { h1: `ТО и сервис ${M} ${C}`, sub: `Регламент ТО ${M} с ценой каждой работы, ремонт и диагностика. ${cap(typeLine(m))}.`, bullets: [`<b>ТО</b> – от ${askPrice()}, ${ask('сколько часов')}`, `<b>Ближайшая запись</b> – ${ask('завтра?')}`, '<b>Цена до начала работ</b> – после бесплатного осмотра'], photo: `${M} в боксе GRAFIT, номер размыт`, alt: `ТО ${M} ${C}`, btn: 'Рассчитать ТО по пробегу' }),
      grid(H, b, m), calc(H, b, m), cta('3а', `ТО ${M}: запишитесь – назовём точную сумму по вашему пробегу.`),
      important(H, b, m, 4), oftenWorks(H, b, m, 5), vsDealer(6, M, C), cta('6а', `Запишитесь на ТО ${M} – назовём цену до приезда.`), reviews(7, H.ctx, M),
      faq(8, [[`Когда делать первое ТО ${M}?`, `Нулевое ТО – на 1 000–3 000 км, дальше по регламенту. [запросить: интервал по регламенту ${M}]`],
        [`Сохранится ли гарантия, если делать ТО не у дилера?`, '[запросить: формулировка после юриста]'],
        [`Какое масло заливаете в ${M}?`, '[запросить: марка и допуск масла]'],
        [`Сколько стоит ТО-2 ${M}?`, '[запросить: цена ТО-2]'], [`Можно со своими запчастями?`, '[запросить: правило по запчастям клиента]']], M),
      block(9, 'Другие модели', `А другие модели ${B} делаете?`, 'перелинковка на соседние модели', `<h2>Другие модели ${esc(B)}</h2><p>${sib.map((x) => `<a href="${H.L(`/${b.slug}/${x.slug}/`)}">ТО ${esc(B + ' ' + x.name)}</a>`).join(' · ')}</p><p><a href="${H.L(`/${b.slug}/`)}">Все работы по ${esc(B)} →</a></p>`),
      form(10, H.ctx, { title: `Записаться на ТО ${M}`, what: `${M}, пробег` }),
      sprosNote(msk, `по ${M}`),
    ].filter(Boolean)),
  });
}

export function brandPage(H, b) {
  const B = b.name; const C = H.C; const sp = b.spros || H.spros;
  const toWorks = (m) => toList(m)[1].works;
  return page(H.ctx, {
    pageName: `Сервис ${B}`, title: `ТО и ремонт ${B} ${C} – цены, регламент для всех моделей`, description: `Сервис ${B} (${b.ru}) ${C}: ТО по регламенту с ценой каждой работы для ${b.models.map((m) => m.name).join(', ')}. Ремонт, диагностика, запчасти на выбор.`,
    h1: `Сервис и ТО ${B} ${C}`, zapros: `то ${B.toLowerCase()}; сервис ${B.toLowerCase()}; ремонт ${b.ru.toLowerCase()}; стоимость то ${b.ru.toLowerCase()}`,
    schema: 'AutoRepair + OfferCatalog (ТО по моделям), FAQPage, BreadcrumbList', links: b.models.map((m) => `/${b.slug}/${m.slug}/`), crumbs: [[`Сервис ${B}`, `/${b.slug}/`]],
    blocks: chain([
      hero(1, H.ctx, { h1: `Сервис и ТО ${B} ${C}`, sub: b.about, bullets: [`<b>Нулевое ТО</b> – ${H.zeroTo ? H.zeroTo(b) : askPrice()}`, `<b>Модели</b> – ${esc(b.models.map((m) => m.name).join(', '))}`, `<b>Ближайшая запись</b> – ${ask('завтра?')}`], photo: `${B} в боксе GRAFIT`, alt: `Сервис ${B} ${C}`, btn: 'Рассчитать ТО' }),
      block(2, 'Модели', 'Моя модель есть и сколько стоит ТО?', 'карточка модели: тип, ТО от N ₽, ссылка',
        `<h2>ТО ${esc(B)} по моделям</h2><div class="w-grid" style="--cols:5;--cols-m:2">${b.models.map((m) => `<article class="w-card"><div class="w-media small" data-alt="${esc(B + ' ' + m.name)}">Фото ${esc(B + ' ' + m.name)} сбоку</div><h3><a href="${H.L(`/${b.slug}/${m.slug}/`)}">${esc(B + ' ' + m.name)}</a></h3><p>${esc(cap(m.body))}, ${esc(typeLine(m))}</p><p><b>ТО от ${askPrice()}</b></p></article>`).join('')}</div>`),
      block(3, 'Цены ТО по моделям', 'Сколько стоит ТО на моей модели?', 'модель × ТО-1, ТО-2, ТО-3 в одной таблице',
        `<h2>Сколько стоит ТО ${esc(B)}</h2>${priceTable(b.models.map((m) => [`<a href="${H.L(`/${b.slug}/${m.slug}/`)}">${esc(m.name)}</a>`, askPrice(), askPrice(), askPrice()]), ['Модель', 'ТО-1', 'ТО-2', 'ТО-3'])}
<p>Состав каждого ТО – на странице модели. На ТО-1 обычно: ${esc(toWorks(b.models[0]).map((w) => S[w].name.toLowerCase()).join(', '))}.</p>`),
      cta('3а', `ТО ${B} – запишитесь, назовём цену по вашей модели и пробегу.`),
      block(4, 'Регламент марки', `Как часто обслуживать ${B}?`, 'интервалы и что меняется', `<h2>Регламент ТО ${esc(B)}</h2><ul>${SCHED.filter(([w]) => b.models.some((m) => fits(m, S[w]))).map(([w, k]) => `<li>${esc(S[w].name)} – ${k === 1 ? 'на каждом ТО' : `каждое ${k}-е ТО`}</li>`).join('')}</ul><p>${ask(`интервалы ${B} по регламенту производителя: км и месяцы`)}</p>`),
      b.frazy?.length ? block(5, 'С чем приезжают', `С какими проблемами ${B} к вам едут?`, 'частые ремонты марки по спросу Москвы', `<h2>Частый ремонт ${esc(B)}</h2><ul>${b.frazy.slice(0, 8).map(([a]) => `<li>${esc(cap(a))} – ${ask('цена и срок')}</li>`).join('')}</ul><p class="w-note">Пункты – реальные запросы Москвы (Wordstat, ${SPROS_DATE}); в вёрстке – по-человечески названные работы со ссылками.</p>`) : '',
      block(6, 'Все работы', `Что вы делаете на ${B}?`, 'работы по группам со ссылками', `<h2>Все работы по ${esc(B)}</h2><div class="w-grid" style="--cols:3;--cols-m:2">${GROUPS.filter((g) => g.slug !== 'software').map((g) => [g, SERVICES.filter((s) => s.group === g.slug && b.models.some((m) => fits(m, s)))]).filter(([, l]) => l.length).map(([g, l]) => `<article class="w-card"><h3>${esc(g.name)}</h3><p>${l.map((s) => lnk(H, b, null, s)).join(', ')}</p></article>`).join('')}</div>`),
      b.ice ? whyIce(7, B) : H.why(7, H.ctx, B), cta('7а', `Запишитесь на ТО ${B} – назовём цену по вашей модели.`), vsDealer(8, B, C), reviews(9, H.ctx, B),
      faq(10, [[`Как часто делать ТО ${B}?`, `[запросить: интервал по регламенту ${B}]`], ['Сохранится ли гарантия, если делать ТО не у дилера?', '[запросить: формулировка после юриста]'], ['Есть запчасти в наличии?', `[запросить: склад запчастей ${B}, сроки привоза]`], ['Сколько длится ТО?', '[запросить: часы]']], B),
      form(11, H.ctx, { title: `Записаться на сервис ${B}`, what: `${B} ${b.models[0].name}, пробег` }),
      sprosNote(sp, `по марке ${B}`),
    ].filter(Boolean)),
  });
}
