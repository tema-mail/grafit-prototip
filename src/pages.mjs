// Страницы одного города. build.mjs вызывает buildCity(city) и получает дерево [путь, тип, html].
import { BRANDS } from '../data/models.mjs';
import { GROUPS, SERVICES } from '../data/services.mjs';
import { SITE, CITIES, PRICES, ZERO_TO, RUS, RUS_WORKS, DETAILING } from '../data/grafit.mjs';
import { OLD_MSK } from '../data/old-paths.mjs';
import { features, ptLine, DEMAND_MIN } from './features.mjs';
import { modelNote } from './model-note.mjs';
import { page, block, hero, faq, form, intro, cta, steps, signs, why, reviews, priceTable, ask, askPrice, askTime, sitePrice, phone, esc } from './render.mjs';

const fill = (t, M) => t.replaceAll('{M}', M);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const WORKS = SERVICES.filter((s) => s.group !== 'software'); // ПО и русификация – отдельный раздел /russification/
const WGROUPS = GROUPS.filter((g) => g.slug !== 'software');
const svcPath = (s) => `/services/${s.group}/${s.slug}/`;
const fits = (m, s) => features(m).has(s.req);

export function buildCity(city, root) {
  const main = !!city.main;
  const L = (p) => `${root}${city.slug}${p}`;
  const ctx = { city, L, root, brands: BRANDS };
  const tree = [];
  const add = (path, type, html) => tree.push([path, type, html]);
  const C = city.in;
  // На поддоменах – только частые работы (model: true), на главном – все.
  const worksOf = (b) => WORKS.filter((s) => (main || s.model) && b.models.some((m) => fits(m, s)));
  const msOn = (b, m, s) => main && s.model && (m.d ?? 0) >= DEMAND_MIN && fits(m, s);
  const workLink = (b, m, s) => (msOn(b, m, s) ? `/${b.slug}/${m.slug}/${s.slug}/` : `/${b.slug}/${s.slug}/`);
  // Цена с сайта – только на главном и только для моделей, под которые она написана; на уровне марки – с пометкой моделей.
  const price = (b, s, m) => {
    const P = PRICES[b.slug]; const v = P?.works[s.slug];
    if (!main || !v || (m && !P.models.includes(m.slug))) return askPrice();
    return sitePrice(m || !P.label ? v : `${v}, ${P.label}`);
  };
  const zeroTo = (b, m) => (main && ZERO_TO[b.slug] && (!m || PRICES[b.slug]?.models.includes(m.slug)) ? sitePrice(ZERO_TO[b.slug]) : askPrice());
  // Русификация: цены прайса Москвы – только на главном, на поддоменах свои (в Уфе уже другие).
  const rusPrice = (p) => (main ? sitePrice(p) : askPrice());
  const cityWorks = WORKS.filter((s) => BRANDS.some((b) => worksOf(b).includes(s)));
  const allModels = BRANDS.flatMap((b) => b.models.map((m) => `${b.name} ${m.name}`));

  // ── Главная
  add('/', 'Главная', page(ctx, {
    pageName: 'Главная', title: `Ремонт и обслуживание китайских электромобилей и гибридов ${C} – GRAFIT`,
    description: `Техцентр GRAFIT ${C}: ТО, диагностика, ремонт, русификация и детейлинг Lixiang, Zeekr, Voyah, Avatr, Lynk & Co. ${city.address}.`,
    h1: `Сервис китайских гибридов и электромобилей ${C}`, zapros: `сервис китайских электромобилей ${city.name.toLowerCase()}; ремонт китайских гибридов ${city.name.toLowerCase()}`,
    schema: 'AutoRepair (адрес и телефон ЭТОЙ точки, часы, рейтинг), WebSite, BreadcrumbList', links: BRANDS.map((b) => `/${b.slug}/ – сервис ${b.name}`).concat(['/russification/', '/services/', '/prices/']),
    blocks: [
      hero(1, ctx, { h1: `Сервис китайских гибридов и электромобилей ${C}`, sub: 'Lixiang, Zeekr, Voyah, Avatr и Lynk & Co: ТО по регламенту, диагностика батареи, ремонт пневмоподвески, русификация и детейлинг.',
        bullets: ['<b>Бесплатный осмотр</b> – 39 параметров до записи на ремонт', `<b>Гарантия</b> – 12 месяцев на работы ${ask('подтвердить')}`, main ? '<b>Выездная бригада</b> – заберём и привезём машину по Москве и области' : `<b>Телефон точки</b> – ${phone(city)}`],
        photo: `Бокс техцентра ${city.gen}: Lixiang и Zeekr на подъёмниках, мастер с ноутбуком диагностики`, alt: `Техцентр GRAFIT ${C}` }),
      block(2, 'Марки', 'Обслуживаете мою машину?', 'пять марок, модели под каждой',
        `<h2>Выберите марку</h2><div class="w-grid" style="--cols:5;--cols-m:2">${BRANDS.map((b) => `<article class="w-card"><div class="w-media small" data-alt="${esc(b.name)}">Фото ${esc(b.name)} сбоку</div><h3><a href="${L(`/${b.slug}/`)}">${esc(b.name)}</a></h3><p>${b.models.map((m) => `<a href="${L(`/${b.slug}/${m.slug}/`)}">${esc(m.name)}</a>`).join(', ')}</p></article>`).join('')}</div>
<p class="w-note">Другие марки из формы старого сайта (Geely, BYD, Denza, Changan, Leopard, Hongqi, Chery, Haval и др.) в меню не вынесены – решение владельца нужно до вёрстки.</p>`),
      block(3, 'Частые работы', 'С чем сюда обычно едут?', 'популярные работы со ссылками',
        `<h2>С чем чаще всего приезжают</h2><div class="w-grid" style="--cols:3;--cols-m:2">${cityWorks.filter((s) => s.model).slice(0, 6).map((s) => `<article class="w-card"><h3><a href="${L(svcPath(s))}">${esc(s.name)}</a></h3><p>${esc(fill(s.lead, 'китайского автомобиля').split('. ')[0])}.</p></article>`).join('')}</div><p><a href="${L('/services/')}">Все услуги →</a></p>`),
      why(4, ctx),
      cta('4а', 'Не знаете, что с машиной? Начните с бесплатного осмотра по 39 параметрам – после него назовём цену ремонта.', 'Записаться на осмотр'),
      block(5, 'Русификация', 'А русский язык и приложения сделаете?', 'марки и цены из прайса',
        `<h2>Русификация Lixiang, Zeekr, Voyah и Lynk & Co 900</h2><p>Перевод всех экранов, карты, слот под российскую SIM, магазин приложений, мастер-аккаунт.</p>${priceTable(Object.entries(RUS).map(([slug, r]) => [`<a href="${L(`/russification/${slug}/`)}">${esc(BRANDS.find((b) => b.slug === slug).name)}</a>`, rusPrice(r.from)]), ['Марка', 'Цена'])}`),
      block(6, 'Детейлинг', 'Можно заодно защитить кузов?', 'услуги детейлинга',
        `<h2>Детейлинг</h2><p>${DETAILING.map((d) => main ? `<a href="${L(`/detailing/${d.slug}/`)}">${esc(d.name)}</a>` : esc(d.name)).join(' · ')}</p>${main ? '' : `<p>${ask(`какие работы детейлинга делают ${city.in}`)}</p>`}`),
      cta('6а', 'Русификация, детейлинг и ТО можно сделать за один визит – скажите, что нужно, посчитаем вместе.'),
      steps(7, ['заявка или звонок – уточняем модель, пробег и симптомы', 'бесплатный осмотр и цена до начала работ', 'работы с фото и отчётом', 'выдача машины и гарантия 12 месяцев'], 'Как проходит визит'),
      reviews(8, ctx, 'китайские автомобили'),
      cta('8а', 'Посмотрели работы – запишитесь, назовём цену по вашей машине до приезда.'),
      block(9, 'Города', 'Есть техцентр ближе ко мне?', 'все точки сети',
        `<h2>Техцентры GRAFIT</h2><div class="w-grid" style="--cols:4;--cols-m:2">${CITIES.map((c) => `<article class="w-card"><h3><a href="${root}${c.slug}/">${esc(c.name)}</a></h3><p>${esc(c.address)}</p><p>${phone(c)}</p></article>`).join('')}</div><p>${ask('пятый город: адрес и телефон')}</p>`),
      faq(10, [['Вы официальный дилер?', 'Нет, мы независимый техцентр. Для привозных машин это часто единственный вариант: дилер берёт не все машины.'], ['Берёте машины, привезённые из Китая?', 'Да, с китайской прошивкой тоже: русифицируем, обновляем и обслуживаем по регламенту.'], ['Сохранится ли гарантия производителя?', 'ТО в независимом сервисе гарантию не снимает, если работы по регламенту и с допущенными расходниками. Все работы записываем в отчёт.'], ['Можно привезти свои запчасти?', '[запросить: правило техцентра по запчастям клиента]']], 'китайских авто'),
      form(11, ctx, { title: 'Запишитесь – перезвоним и назовём цену', what: 'Lixiang L9, 2024' }),
    ],
  }));

  // ── Марка, модель, модель × работа, марка × работа
  for (const b of BRANDS) {
    const B = b.name;
    const works = worksOf(b);
    const rows = works.filter((s) => s.group === 'maintenance' && b.models.some((m) => fits(m, s)));
    add(`/${b.slug}/`, 'Хаб', page(ctx, {
      pageName: `Сервис ${B}`, title: `Сервис ${B} ${C} – ТО, диагностика и ремонт ${b.ru}`, description: `Ремонт и обслуживание ${B} (${b.ru}) ${C}: ${b.models.map((m) => m.name).join(', ')}. ТО по регламенту, диагностика, ходовая${b.models.some((m) => m.air !== 'no') ? ', пневмоподвеска' : ''}.`,
      h1: `Сервис ${B} ${C}`, zapros: `сервис ${B.toLowerCase()} ${city.name.toLowerCase()}; ремонт ${b.ru.toLowerCase()}; то ${B.toLowerCase()}`, schema: 'AutoRepair + Service (brand), BreadcrumbList, FAQPage',
      links: b.models.map((m) => `/${b.slug}/${m.slug}/`).concat(works.slice(0, 6).map((s) => `/${b.slug}/${s.slug}/`)), crumbs: [[`Сервис ${B}`, `/${b.slug}/`]],
      blocks: [
        hero(1, ctx, { h1: `Сервис ${B} ${C}`, sub: b.about, bullets: [`<b>Модели</b> – ${esc(b.models.map((m) => m.name).join(', '))}`, `<b>Нулевое ТО</b> – ${zeroTo(b)}`, RUS[b.slug] ? `<b>Русификация</b> – ${rusPrice(RUS[b.slug].from)}` : `<b>Русификация Avatr</b> – ${ask('делаете или нет: в прайсе её нет, а старые страницы есть')}`], photo: `${B} в боксе GRAFIT ${city.gen}`, alt: `Сервис ${B} ${C}` }),
        block(2, 'Модели', 'Обслуживаете мою модель?', 'модели с типом привода', `<h2>Модели ${esc(B)}</h2><div class="w-grid" style="--cols:4;--cols-m:2">${b.models.map((m) => `<article class="w-card"><div class="w-media small" data-alt="${esc(B + ' ' + m.name)}">Фото ${esc(B + ' ' + m.name)}</div><h3><a href="${L(`/${b.slug}/${m.slug}/`)}">${esc(B + ' ' + m.name)}</a></h3><p>${esc(cap(m.body))}, ${esc(ptLine(m))}</p></article>`).join('')}</div>`),
        block(3, 'Цены на ТО', 'Сколько стоит обслуживание?', 'цены с сайта по работам ТО',
          `<h2>ТО ${esc(B)}: цены</h2>${priceTable([['Нулевое ТО', zeroTo(b), askTime()], ...rows.map((s) => [`<a href="${L(`/${b.slug}/${s.slug}/`)}">${esc(s.name)}</a>`, price(b, s), askTime()])])}${main ? '' : `<p>${ask(`цены ${city.gen} – совпадают с московскими или свои`)}</p>`}`),
        cta('3а', `Нулевое ТО ${B} – запишитесь, назовём цену и свободное время.`),
        block(4, 'Все работы', `Что вы делаете на ${B}?`, 'работы по группам', `<h2>Все работы по ${esc(B)}</h2><div class="w-grid" style="--cols:3;--cols-m:2">${WGROUPS.filter((g) => works.some((s) => s.group === g.slug)).map((g) => `<article class="w-card"><h3>${esc(g.name)}</h3><p>${works.filter((s) => s.group === g.slug).map((s) => `<a href="${L(`/${b.slug}/${s.slug}/`)}">${esc(s.name)}</a>`).join(', ')}</p></article>`).join('')}</div>${RUS[b.slug] ? `<p><a href="${L(`/russification/${b.slug}/`)}">Русификация ${esc(B)} →</a></p>` : ''}`),
        why(5, ctx, B),
        cta('5а', `Запишитесь на бесплатный осмотр ${B} – назовём цену ТО и ремонта по вашей машине.`),
        reviews(6, ctx, B),
        faq(7, [['Обслуживаете {M}, привезённый из Китая?', 'Да. Русифицируем, обновляем и обслуживаем по регламенту производителя.'], ['Как часто делать ТО {M}?', 'По регламенту производителя для вашей модели и пробега – список составим до начала работ.'], ['Есть запчасти {M} в наличии?', `[запросить: склад запчастей ${B} ${city.in}, сроки привоза]`]], B),
        form(8, ctx, { title: `Записаться на сервис ${B}`, what: `${B} ${b.models[0].name}, 2024` }),
      ],
    }));

    for (const m of b.models) {
      const M = `${B} ${m.name}`;
      const mw = works.filter((s) => fits(m, s));
      add(`/${b.slug}/${m.slug}/`, 'Хаб', page(ctx, {
        pageName: M, title: `Ремонт и обслуживание ${M} ${C}`, description: `Сервис ${M} ${C}: ТО, диагностика, ремонт${features(m).has('air') ? ', пневмоподвеска' : ''}${RUS[b.slug]?.models.includes(m.slug) ? ', русификация' : ''}. ${cap(ptLine(m))}.`,
        h1: `Ремонт и обслуживание ${M} ${C}`, zapros: `ремонт ${M.toLowerCase()}; то ${M.toLowerCase()}`, schema: 'Service, BreadcrumbList, FAQPage',
        links: mw.filter((s) => msOn(b, m, s)).map((s) => `/${b.slug}/${m.slug}/${s.slug}/`), crumbs: [[`Сервис ${B}`, `/${b.slug}/`], [M, `/${b.slug}/${m.slug}/`]],
        blocks: [
          hero(1, ctx, { h1: `Ремонт и обслуживание ${M} ${C}`, sub: `${m.note} Обслуживаем по регламенту производителя.`, bullets: [`<b>Тип</b> – ${esc(cap(m.body))}, ${esc(ptLine(m))}`, `<b>Пневмоподвеска</b> – ${{ yes: 'во всех версиях', part: 'в части версий', no: 'нет' }[m.air]}`, m.check ? ask(`подтвердить версии и силовые установки ${M}`) : '<b>Цена до начала работ</b> – после бесплатного осмотра'], photo: `${M} в боксе GRAFIT`, alt: `Сервис ${M} ${C}` }),
          block(2, 'ТО модели', 'Когда мне на ТО и сколько это стоит?', 'работы ТО и цены', `<h2>ТО ${esc(M)}</h2>${priceTable(mw.filter((s) => s.group === 'maintenance').map((s) => [`<a href="${L(workLink(b, m, s))}">${esc(s.name)}</a>`, ask('интервал по регламенту'), price(b, s, m)]), ['Работа', 'Интервал', 'Цена'])}`),
          block(3, 'Все работы', `Что вы делаете на ${M}?`, 'работы по группам', `<h2>Все работы по ${esc(M)}</h2><div class="w-grid" style="--cols:3;--cols-m:2">${WGROUPS.filter((g) => g.slug !== 'maintenance' && mw.some((s) => s.group === g.slug)).map((g) => `<article class="w-card"><h3>${esc(g.name)}</h3><p>${mw.filter((s) => s.group === g.slug).map((s) => `<a href="${L(workLink(b, m, s))}">${esc(s.name)}</a>`).join(', ')}</p></article>`).join('')}</div>${RUS[b.slug]?.models.includes(m.slug) ? `<p><a href="${L(`/russification/${b.slug}/${m.slug}/`)}">Русификация ${esc(M)} →</a></p>` : ''}`),
          cta('3а', `Бесплатный осмотр ${M} по 39 параметрам – после него назовём точную цену.`),
          reviews(4, ctx, M),
          `<p class="w-wrap w-note">Интерес к «${esc(M)}» по Wordstat РФ: ${m.d ?? 'не собран'} в месяц (июль–сентябрь 2026). ${main ? ((m.d ?? 0) >= DEMAND_MIN ? 'Частые работы вынесены отдельными страницами.' : `Ниже порога ${DEMAND_MIN} – отдельных страниц работ нет.`) : 'На поддомене города страниц «модель × работа» нет: местного спроса на них мало, они живут на главном сайте.'}</p>`,
          faq(5, [[`Обслуживаете ${M}, привезённый из Китая?`, 'Да. Русифицируем, обновляем и обслуживаем по регламенту производителя.'], [`Где найти регламент ТО ${M}?`, 'В сервисной книжке или в меню машины. Если книжки нет, составим список работ по пробегу.']], M),
          form(6, ctx, { title: `Записаться на сервис ${M}`, what: `${M}, год, пробег` }),
        ],
      }));
      for (const s of mw.filter((x) => msOn(b, m, x))) {
        const sib = mw.filter((x) => x !== s && msOn(b, m, x));
        const others = b.models.filter((a) => a !== m && msOn(b, a, s));
        add(`/${b.slug}/${m.slug}/${s.slug}/`, 'Страница', page(ctx, {
          pageName: `${s.name} ${M}`, title: `${s.name} ${M} ${C}`, description: `${fill(s.lead, M)} Цена и срок – до начала работ.`,
          h1: `${s.name} ${M}`, zapros: `${s.name.toLowerCase()} ${M.toLowerCase()}`, schema: 'Service (offers – когда будет цена), FAQPage, BreadcrumbList',
          links: [`/${b.slug}/${m.slug}/`, `/${b.slug}/${s.slug}/`, ...sib.slice(0, 4).map((x) => `/${b.slug}/${m.slug}/${x.slug}/`)],
          crumbs: [[`Сервис ${B}`, `/${b.slug}/`], [M, `/${b.slug}/${m.slug}/`], [s.name, `/${b.slug}/${m.slug}/${s.slug}/`]],
          blocks: [
            hero(1, ctx, { h1: `${s.name} ${M}`, sub: fill(s.lead, M), bullets: [`<b>Цена</b> – ${price(b, s, m)}`, `<b>Срок</b> – ${askTime()}`, '<b>Гарантия</b> – 12 месяцев на работы'], photo: `${s.name} на ${M}: процесс в боксе`, alt: `${s.name} ${M}` }),
            block(2, `Особенности ${m.name}`, `Чем эта работа на ${M} отличается от других машин?`, 'тип привода и устройство модели', `<h2>Что важно знать про ${esc(M)}</h2><p>${esc(m.note)} ${esc(cap(ptLine(m)))}.</p><p>${esc(modelNote(m, s, M))}</p>${m.check ? `<p>${ask(`подтвердить данные по ${M}`)}</p>` : ''}<p class="w-note">Блок отличает страницу от соседних моделей. Сюда – факты из практики GRAFIT по этой модели: объёмы, типовые неисправности, фото.</p>`),
            signs(3, s.signs, 'Когда пора: признаки'),
            steps(4, s.steps, `Как делаем: ${s.name.toLowerCase()} ${M}`),
            cta('4а', `${s.name} ${M}: запишитесь – назовём цену до приезда.`),
            faq(5, s.faq, M),
            block(6, 'Перелинковка', 'Что ещё может понадобиться?', 'соседние работы и та же работа на других моделях', `<h2>Ещё по ${esc(M)}</h2><p>${sib.map((x) => `<a href="${L(`/${b.slug}/${m.slug}/${x.slug}/`)}">${esc(x.name)}</a>`).join(' · ')}</p>${others.length ? `<h3>${esc(s.name)} на других моделях</h3><p>${others.map((a) => `<a href="${L(`/${b.slug}/${a.slug}/${s.slug}/`)}">${esc(B + ' ' + a.name)}</a>`).join(' · ')}</p>` : ''}`),
            form(7, ctx, { title: `Записаться: ${s.name.toLowerCase()} ${M}`, what: `${M}, год, пробег` }),
          ],
        }));
      }
    }

    for (const s of works) {
      const ms = b.models.filter((m) => fits(m, s));
      add(`/${b.slug}/${s.slug}/`, 'Страница', page(ctx, {
        pageName: `${s.name} ${B}`, title: `${s.name} ${B} ${C}`, description: `${fill(s.lead, B)} Модели: ${ms.map((m) => m.name).join(', ')}.`,
        h1: `${s.name} ${B} ${C}`, zapros: `${s.name.toLowerCase()} ${B.toLowerCase()}; ${s.name.toLowerCase()} ${b.ru.toLowerCase()}`, schema: 'Service, FAQPage, BreadcrumbList',
        links: ms.map((m) => workLink(b, m, s)), crumbs: [[`Сервис ${B}`, `/${b.slug}/`], [s.name, `/${b.slug}/${s.slug}/`]],
        blocks: [
          hero(1, ctx, { h1: `${s.name} ${B} ${C}`, sub: fill(s.lead, B), bullets: [`<b>Модели</b> – ${esc(ms.map((m) => m.name).join(', '))}`, `<b>Цена</b> – ${price(b, s)}`, `<b>Срок</b> – ${askTime()}`], photo: `${s.name} на ${B}`, alt: `${s.name} ${B}` }),
          signs(2, s.signs, 'Когда нужна эта работа'),
          block(3, 'Цены по моделям', 'Сколько это стоит на моей модели?', 'цена по каждой модели', `<h2>${esc(s.name)}: цены по моделям ${esc(B)}</h2>${priceTable(ms.map((m) => [`<a href="${L(msOn(b, m, s) ? `/${b.slug}/${m.slug}/${s.slug}/` : `/${b.slug}/${m.slug}/`)}">${esc(B + ' ' + m.name)}</a>`, price(b, s, m), askTime()]), ['Модель', 'Цена', 'Срок'])}<p>Цена без запчастей. Точную стоимость назовём после осмотра – до начала работ.</p>`),
          steps(4, s.steps, 'Как делаем'),
          cta('4а', `${s.name} ${B} – запишитесь, назовём цену по вашей модели.`),
          faq(5, s.faq, B),
          form(6, ctx, { title: `Записаться: ${s.name.toLowerCase()} ${B}`, what: `${B}, модель, год` }),
        ],
      }));
    }
  }

  // ── Каталог работ по всем маркам
  add('/services/', 'Хаб', page(ctx, {
    pageName: 'Услуги', title: `Услуги техцентра GRAFIT ${C}`, description: `Все работы по китайским гибридам и электромобилям ${C}: ТО, диагностика, тормоза, пневмоподвеска, рулевое, электрика, климат, кузов.`,
    h1: `Услуги техцентра ${C}`, zapros: `ремонт китайских электромобилей ${city.name.toLowerCase()}`, schema: 'ItemList, BreadcrumbList', crumbs: [['Услуги', '/services/']],
    blocks: [block(1, 'Группы работ', 'Что вы умеете?', 'полный перечень по группам', `${intro(ctx, `Услуги техцентра ${C}`)}<div class="w-grid" style="--cols:3;--cols-m:2">${WGROUPS.filter((g) => cityWorks.some((s) => s.group === g.slug)).map((g) => `<article class="w-card"><h3><a href="${L(`/services/${g.slug}/`)}">${esc(g.name)}</a></h3><p>${cityWorks.filter((s) => s.group === g.slug).map((s) => `<a href="${L(svcPath(s))}">${esc(s.name)}</a>`).join(', ')}</p></article>`).join('')}<article class="w-card"><h3><a href="${L('/russification/')}">Русификация и ПО</a></h3><p>Отдельный раздел</p></article><article class="w-card"><h3><a href="${L('/detailing/')}">Детейлинг</a></h3><p>Плёнка, керамика, шумоизоляция</p></article></div>`), form(2, ctx, { title: 'Не нашли работу? Опишите – скажем, делаем ли', what: 'Марка, модель' })],
  }));
  for (const g of WGROUPS) {
    const gs = cityWorks.filter((s) => s.group === g.slug);
    if (!gs.length) continue;
    add(`/services/${g.slug}/`, 'Хаб', page(ctx, {
      pageName: g.name, title: `${g.name} китайских авто ${C}`, description: `${g.name} Lixiang, Zeekr, Voyah, Avatr, Lynk & Co ${C}: ${gs.map((s) => s.name.toLowerCase()).join(', ')}.`,
      h1: `${g.name} ${C}`, zapros: `${g.name.toLowerCase()} китайских авто`, schema: 'ItemList, BreadcrumbList', crumbs: [['Услуги', '/services/'], [g.name, `/services/${g.slug}/`]],
      blocks: [block(1, 'Работы группы', 'Какая работа мне нужна?', 'описание каждой работы', `${intro(ctx, `${g.name} ${C}`, g.lead)}<div class="w-grid" style="--cols:3;--cols-m:2">${gs.map((s) => `<article class="w-card"><h3><a href="${L(svcPath(s))}">${esc(s.name)}</a></h3><p>${esc(fill(s.lead, 'автомобиля'))}</p></article>`).join('')}</div>`), form(2, ctx, { title: `Записаться: ${g.name.toLowerCase()}`, what: 'Марка, модель' })],
    }));
    for (const s of gs) {
      const bs = BRANDS.filter((b) => worksOf(b).includes(s));
      add(svcPath(s), 'Страница', page(ctx, {
        pageName: s.name, title: `${s.name} китайских автомобилей ${C}`, description: `${fill(s.lead, 'китайского автомобиля')} Марки: ${bs.map((b) => b.name).join(', ')}.`,
        h1: `${s.name} ${C}`, zapros: `${s.name.toLowerCase()} ${city.name.toLowerCase()}`, schema: 'Service, FAQPage, BreadcrumbList',
        links: bs.map((b) => `/${b.slug}/${s.slug}/`), crumbs: [['Услуги', '/services/'], [g.name, `/services/${g.slug}/`], [s.name, svcPath(s)]],
        blocks: [
          hero(1, ctx, { h1: `${s.name} ${C}`, sub: fill(s.lead, 'китайского гибрида или электромобиля'), bullets: [`<b>Марки</b> – ${esc(bs.map((b) => b.name).join(', '))}`, `<b>Цена</b> – ${askPrice()}`, '<b>Гарантия</b> – 12 месяцев на работы'], photo: `${s.name}: мастер за работой`, alt: s.name }),
          block(2, 'Выбор марки', 'Есть отдельная страница под мою марку?', 'ссылки на работу по каждой марке', `<h2>${esc(s.name)} по маркам</h2>${priceTable(bs.map((b) => [`<a href="${L(`/${b.slug}/${s.slug}/`)}">${esc(b.name)}</a>`, esc(b.models.filter((m) => fits(m, s)).map((m) => m.name).join(', ')), price(b, s)]), ['Марка', 'Модели', 'Цена'])}`),
          cta('2а', `${s.name}: выберите марку выше или запишитесь – подскажем по телефону.`),
          signs(3, s.signs, 'Когда нужна эта работа'),
          steps(4, s.steps, 'Как делаем'),
          faq(5, s.faq, 'китайского авто'),
          form(6, ctx, { title: `Записаться: ${s.name.toLowerCase()}`, what: 'Марка, модель, год' }),
        ],
      }));
    }
  }

  // ── Русификация (сжатый набор марок по прайсу)
  add('/russification/', 'Хаб', page(ctx, {
    pageName: 'Русификация', title: `Русификация китайских автомобилей ${C} – Lixiang, Zeekr, Voyah, Lynk & Co 900`, description: `Русификация ${C}: перевод всех экранов, карты, SIM, приложения, мастер-аккаунт. Lixiang ${RUS.lixiang.from}, Zeekr ${RUS.zeekr.from}, Voyah ${RUS.voyah.from}.`,
    h1: `Русификация китайских автомобилей ${C}`, zapros: `русификация китайских автомобилей ${city.name.toLowerCase()}; русификация lixiang; русификация zeekr`, schema: 'Service, OfferCatalog, FAQPage, BreadcrumbList', crumbs: [['Русификация', '/russification/']],
    blocks: [
      hero(1, ctx, { h1: `Русификация китайских автомобилей ${C}`, sub: 'Lixiang, Zeekr, Voyah и Lynk & Co 900: русский язык на всех экранах, карты, слот под российскую SIM, магазин приложений, мастер-аккаунт.', bullets: ['<b>За 2–4 часа</b> – сложные прошивки Zeekr и Lixiang до 6 часов', '<b>Гарантия 1 год</b> на установку слота SIM', '<b>Другие марки</b> – только по звонку: проверим, возможно ли'], photo: 'Экран мультимедиа Zeekr на русском с Яндекс Навигатором', alt: `Русификация ${C}`, btn: 'Узнать цену для моей машины' }),
      block(2, 'Цены', 'Сколько стоит на моей марке?', 'прайс с сайта', `<h2>Цены на русификацию</h2>${Object.entries(RUS).map(([slug, r], i) => `<details${i ? '' : ' open'}><summary><b>${esc(BRANDS.find((b) => b.slug === slug).name)}</b>${main ? ' – ' + esc(r.from) : ''}</summary>${priceTable(r.rows.map(([n, p]) => [esc(n), rusPrice(p)]), ['Работа', 'Цена'])}<p><a href="${L(`/russification/${slug}/`)}">Подробнее →</a></p></details>`).join('')}${main ? '' : `<p>${ask(`цены на русификацию ${city.gen}: в Уфе Zeekr 8X/9X – 300 000 ₽, в Москве 9X – от 350 000 ₽`)}</p>`}`),
      block(3, 'Что входит', 'Что именно сделаете?', 'состав работ', `<h2>Что входит в русификацию</h2><div class="w-grid" style="--cols:3;--cols-m:2">${RUS_WORKS.map(([h, t]) => `<article class="w-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}</div>`),
      cta('3а', 'Назовите модель и год – скажем, что получится русифицировать и сколько это стоит.'),
      faq(4, [['Пропадёт ли гарантия после русификации?', 'Русификация меняет языковой пакет и региональные настройки, механика и электрика не затрагиваются.'], ['Можно вернуть китайский язык?', 'Да, возврат к заводскому пакету возможен – уточним по модели.'], ['Машина стала «кирпичом» после другого сервиса – поможете?', 'Да: разблокировка Zeekr, восстановление связи с мастер-аккаунтом, прописание ключа.'], ['Avatr русифицируете?', '[запросить: Avatr – да или нет; в прайсе его нет, а на старом сайте есть страницы русификации Avatr 07, 11, 12]']], 'китайских авто'),
      form(5, ctx, { title: 'Узнать цену русификации', what: 'Zeekr 001, 2024' }),
    ],
  }));
  for (const [slug, r] of Object.entries(RUS)) {
    const b = BRANDS.find((x) => x.slug === slug);
    const ms = b.models.filter((m) => r.models.includes(m.slug));
    add(`/russification/${slug}/`, 'Хаб', page(ctx, {
      pageName: `Русификация ${b.name}`, title: `Русификация ${b.name} ${C} – цены`, description: `Русификация ${b.name} (${b.ru}) ${C}: ${ms.map((m) => m.name).join(', ')}. ${r.from}. Карты, SIM, приложения.`,
      h1: `Русификация ${b.name} ${C}`, zapros: `русификация ${b.name.toLowerCase()}; русификация ${b.ru.toLowerCase()}`, schema: 'Service, Offer, FAQPage, BreadcrumbList', crumbs: [['Русификация', '/russification/'], [b.name, `/russification/${slug}/`]],
      blocks: [
        hero(1, ctx, { h1: `Русификация ${b.name} ${C}`, sub: `Русский язык на всех экранах ${b.name}, карты, российская SIM и приложения.`, bullets: [`<b>Цена</b> – ${rusPrice(r.from)}`, `<b>Модели</b> – ${esc(ms.map((m) => m.name).join(', '))}`, '<b>Срок</b> – 2–4 часа, сложные прошивки до 6 часов'], photo: `Экран ${b.name} на русском`, alt: `Русификация ${b.name}` }),
        block(2, 'Цены', 'Сколько стоит?', 'прайс марки', `<h2>Цены на русификацию ${esc(b.name)}</h2>${priceTable(r.rows.map(([n, p]) => [esc(n), rusPrice(p)]), ['Работа', 'Цена'])}${main ? '' : `<p>${ask(`прайс русификации ${city.gen}`)}</p>`}`),
        block(3, 'Модели', 'Моя модель есть?', 'модели марки', `<h2>Модели</h2><p>${ms.map((m) => `<a href="${L(`/russification/${slug}/${m.slug}/`)}">${esc(b.name + ' ' + m.name)}</a>`).join(' · ')}</p>`),
        block(4, 'Что входит', 'Что именно сделаете?', 'состав работ', `<div class="w-grid" style="--cols:3;--cols-m:2">${RUS_WORKS.map(([h, t]) => `<article class="w-card"><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}</div>`),
        form(5, ctx, { title: `Русификация ${b.name}: узнать цену`, what: `${b.name} ${ms[0].name}, 2024` }),
      ],
    }));
    for (const m of ms) {
      const M = `${b.name} ${m.name}`;
      add(`/russification/${slug}/${m.slug}/`, 'Страница', page(ctx, {
        pageName: `Русификация ${M}`, title: `Русификация ${M} ${C}`, description: `Русификация ${M} ${C}: перевод всех экранов, карты, SIM, приложения. Цену по версии прошивки назовём до работ.`,
        h1: `Русификация ${M}`, zapros: `русификация ${M.toLowerCase()}`, schema: 'Service, Offer, BreadcrumbList', crumbs: [['Русификация', '/russification/'], [b.name, `/russification/${slug}/`], [m.name, `/russification/${slug}/${m.slug}/`]],
        blocks: [
          hero(1, ctx, { h1: `Русификация ${M}`, sub: `${m.note} Список экранов и приложений зависит от версии прошивки – смотрим её до работы.`, bullets: [`<b>Цена</b> – ${r.price[m.slug] ? rusPrice(r.price[m.slug]) : ask(`цена русификации ${M}`)}`, '<b>Срок</b> – 2–4 часа', `<b>Сервис ${esc(M)}</b> – <a href="${L(`/${slug}/${m.slug}/`)}">ТО и ремонт</a>`], photo: `Экраны ${M} на русском`, alt: `Русификация ${M}` }),
          block(2, 'Что входит', `Что будет на ${M}?`, 'состав по модели', `<h2>Что входит</h2><ul>${RUS_WORKS.map(([h, t]) => `<li><b>${esc(h)}</b> – ${esc(t)}</li>`).join('')}</ul><p>${ask(`что именно русифицируется на ${M}: какие экраны, голосовой ассистент, есть ли ограничения`)}</p>`),
          form(3, ctx, { title: `Русификация ${M}`, what: `${M}, год` }),
        ],
      }));
    }
  }

  // ── Детейлинг: на главном – хаб и работы, на поддоменах – только хаб с вопросом
  add('/detailing/', 'Хаб', page(ctx, {
    pageName: 'Детейлинг', title: `Детейлинг ${C} – плёнка, керамика, шумоизоляция`, description: `Детейлинг китайских автомобилей ${C}: оклейка плёнкой, бронирование стекла, керамика, шумоизоляция, антикор арок, химчистка.`,
    h1: `Детейлинг ${C}`, zapros: `детейлинг ${city.name.toLowerCase()}; оклейка плёнкой zeekr`, schema: 'Service, BreadcrumbList', crumbs: [['Детейлинг', '/detailing/']],
    blocks: [block(1, 'Работы', 'Что можно сделать с кузовом и салоном?', 'перечень работ и цены', `${intro(ctx, `Детейлинг ${C}`, 'Защита кузова и салона: остановить износ, убрать мелкие дефекты и сохранить заводской вид.')}<div class="w-grid" style="--cols:3;--cols-m:2">${DETAILING.map((d) => `<article class="w-card"><div class="w-media small" data-alt="${esc(d.name)}">Фото до / после</div><h3>${main ? `<a href="${L(`/detailing/${d.slug}/`)}">${esc(d.name)}</a>` : esc(d.name)}</h3><p>${esc(d.lead)}</p><span class="w-price">${d.price && main ? sitePrice(d.price) : askPrice()}</span></article>`).join('')}</div>${main ? '' : `<p>${ask(`какие работы детейлинга есть ${city.in}`)}</p>`}`), form(2, ctx, { title: 'Записаться на детейлинг', what: 'Zeekr 001, 2024' })],
  }));
  if (main) for (const d of DETAILING) add(`/detailing/${d.slug}/`, 'Страница', page(ctx, {
    pageName: d.name, title: `${d.name} ${C}`, description: `${d.lead} Lixiang, Zeekr, Voyah, Avatr, Lynk & Co.`,
    h1: `${d.name} ${C}`, zapros: `${d.name.toLowerCase()} ${city.name.toLowerCase()}`, schema: 'Service, BreadcrumbList', crumbs: [['Детейлинг', '/detailing/'], [d.name, `/detailing/${d.slug}/`]],
    blocks: [hero(1, ctx, { h1: `${d.name} ${C}`, sub: d.lead, bullets: [`<b>Цена</b> – ${d.price ? sitePrice(d.price) : askPrice()}`, `<b>Срок</b> – ${askTime()}`, `<b>Материалы</b> – ${ask('марка плёнки или составов, гарантия')}`], photo: `${d.name}: фото до и после на китайском авто`, alt: d.name }), reviews(2, ctx, d.name.toLowerCase()), form(3, ctx, { title: `Записаться: ${d.name.toLowerCase()}`, what: 'Марка, модель' })],
  }));

  if (city.extra.includes('tires')) add('/tire-service/', 'Страница', page(ctx, {
    pageName: 'Шиномонтаж', title: `Шиномонтаж ${C} – скидка равна диаметру колёс`, description: `Шиномонтаж, развал-схождение и хранение шин ${C}. Скидка на комплекс равна диаметру колёс: R20 – минус 20%.`,
    h1: `Шиномонтаж ${C}`, zapros: `шиномонтаж ${city.name.toLowerCase()}`, schema: 'Service, Offer, BreadcrumbList', crumbs: [['Шиномонтаж', '/tire-service/']],
    blocks: [hero(1, ctx, { h1: `Шиномонтаж ${C}`, sub: 'Комплекс: шиномонтаж, развал-схождение и хранение шин. Скидка на комплекс равна диаметру колёс – R20 значит минус 20% (акция с сайта Уфы).', bullets: [`<b>Цена</b> – ${ask('прайс шиномонтажа по диаметрам')}`, `<b>Акция до</b> – ${ask('срок акции')}`, '<b>Калькулятор</b> – тип авто, диаметр, подвеска'], photo: 'Шиномонтажный бокс, колесо китайского кроссовера на станке', alt: `Шиномонтаж ${C}` }), form(2, ctx, { title: 'Записаться на шиномонтаж', what: 'Lixiang L7, R21' })],
  }));

  // ── Служебные
  const simple = (path, type, pageName, h1, title, description, inner, q, withForm = true) => add(path, type, page(ctx, {
    pageName, title, description, h1, zapros: title.toLowerCase(), schema: 'BreadcrumbList', crumbs: [[pageName, path]],
    blocks: [block(1, pageName, q, 'факты техцентра', `${intro(ctx, h1)}${inner}`), ...(withForm ? [form(2, ctx, { title: 'Записаться или задать вопрос', what: 'Марка, модель' })] : [])],
  }));
  simple('/prices/', 'Страница', 'Цены', `Цены на ремонт и обслуживание ${C}`, `Цены на ТО и ремонт китайских авто ${C}`, `Прайс техцентра GRAFIT ${C}: ТО Lixiang, Zeekr, Voyah, Avatr, Lynk & Co, русификация, детейлинг.`,
    BRANDS.map((b) => `<details><summary><b>${esc(b.name)}</b></summary>${priceTable([['Нулевое ТО', zeroTo(b), askTime()], ...worksOf(b).map((s) => [`<a href="${L(`/${b.slug}/${s.slug}/`)}">${esc(s.name)}</a>`, price(b, s), askTime()])])}</details>`).join('') + `<p><a href="${L('/russification/')}">Цены на русификацию →</a> · <a href="${L('/detailing/')}">Детейлинг →</a></p><p>Цены без запчастей. Итог зависит от модели и состояния – называем до начала работ.</p>`, 'Сколько стоит?');
  simple('/reviews/', 'Страница', 'Отзывы', `Отзывы и работы GRAFIT ${C}`, `Отзывы о техцентре GRAFIT ${C}`, `Выполненные работы с фото и отзывы клиентов техцентра GRAFIT ${C}.`,
    `<p>${ask(`кейсы ${city.gen}: модель, задача, что сделали, срок, фото до и после`)}</p><p>${ask(`отзывы точки ${city.gen} с Яндекс Карт и 2ГИС со ссылками`)}</p><p class="w-note">Отзывы и работы – только этого города: так у поддомена своё содержание, а не копия Москвы. Номера на фото размыты строго по рамке.</p>`, 'Здесь чинили такие машины, как моя?');
  simple('/about/', 'Страница', 'О компании', `О техцентре GRAFIT ${C}`, `О техцентре GRAFIT ${C}`, `GRAFIT – сеть техцентров китайских гибридов и электромобилей: ${CITIES.map((c) => c.name).join(', ')}.`,
    `<p>Работаем с китайскими гибридами и электромобилями: Lixiang, Zeekr, Voyah, Avatr, Lynk & Co. ${ask('история, сколько лет, сколько машин – только проверяемые цифры (на сайте: «6 лет», «6000 довольных клиентов»)')}</p><p>${ask(`мастера ${city.gen}: имена, опыт, допуски`)}</p><div class="w-media" data-alt="Команда GRAFIT ${esc(city.name)}">Фото команды в боксе</div>`, 'Кто эти люди и можно ли им доверять?');
  simple('/contacts/', 'Страница', 'Контакты', `Контакты GRAFIT ${C}`, `Контакты техцентра GRAFIT ${C}`, `Адрес, телефон и часы работы техцентра GRAFIT ${C}: ${city.address}.`,
    `<p><b>${esc(city.address)}</b><br>${phone(city)} · ${city.hours ? esc(city.hours) : ask('часы работы')}<br>Telegram · WhatsApp · ${esc(SITE.mail)}</p>${city.note ? `<p>${ask(`подтвердить адрес: ${city.note}`)}</p>` : ''}<div class="w-media" data-alt="Карта проезда">Карта Яндекса (после согласия на cookie) и фото въезда</div><p>${city.org ? esc(city.org) : ask(`юрлицо точки ${city.gen}`)}</p>`, 'Где вы и как доехать?');
  if (main) {
    const blog = OLD_MSK.filter(([p]) => /^\/blog\/[^/]+\/$/.test(p));
    simple('/blog/', 'Хаб', 'Блог', 'Блог GRAFIT о китайских электромобилях', 'Блог GRAFIT – ремонт и эксплуатация китайских авто', 'Статьи об обслуживании, батареях, прошивках и русификации Lixiang, Zeekr, Voyah.',
      `<p>Статьи переносятся со старыми адресами, ${blog.length} шт. В каждой статье – ссылки на страницы марки, модели и работы и форма записи: сейчас блог даёт половину поиска, но почти без заявок.</p><ul>${blog.map(([p, s]) => `<li>${esc(p)}${s ? ' <span class="w-muted">· был поиск</span>' : ''}</li>`).join('')}</ul>`, 'Где почитать про мою машину?', false);
    simple('/franchise/', 'Страница', 'Франшиза', 'Франшиза GRAFIT', 'Франшиза техцентра GRAFIT', 'Откройте техцентр китайских автомобилей под брендом GRAFIT.',
      '<p>Лендинг франшизы переносится как есть: у него свой счётчик Метрики и своя реклама. Адрес /franchise/ сохраняется.</p>', 'Как открыть GRAFIT в своём городе?', false);
  }
  simple('/privacy-policy/', 'Юридическая', 'Политика ПДн', 'Политика обработки персональных данных', 'Политика обработки персональных данных', 'Политика обработки персональных данных ООО «ГРАФИТ».', `<p>${ask('текст политики – перенести с текущего сайта и проверить юристом')}</p>`, 'Как обрабатываются мои данные?', false);
  simple('/personal-data-consent/', 'Юридическая', 'Согласие на обработку ПДн', 'Согласие на обработку персональных данных', 'Согласие на обработку персональных данных', 'Согласие на обработку персональных данных ООО «ГРАФИТ».', `<p>${ask('текст согласия')}</p>`, 'На что я соглашаюсь?', false);

  return { tree, L, ctx, worksOf, allModels };
}
