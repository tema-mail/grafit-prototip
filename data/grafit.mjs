// Данные GRAFIT. Источник – живой grafit-service.ru и ufa.grafit-service.ru, снято 03.11.2026.
// Что на сайте есть – пишем как есть (с пометкой «с сайта»), чего нет – метка «запросить» в прототипе.

const SITE_ORG = 'ООО «ГРАФИТ», ИНН 2310241602, ОГРН 1252300044611';
export const SITE = {
  name: 'GRAFIT', host: 'grafit-service.ru',
  descr: 'Технический центр китайских гибридов и электромобилей',
  org: SITE_ORG,
  mail: 'grafit.business@yandex.ru',
  // с сайта, требуют подтверждения – в прототипе идут с пометкой
  facts: ['6 лет работаем с автомобилями премиум-класса', '12 месяцев гарантии на работы', 'бесплатный осмотр по 39 параметрам', 'выездная бригада по Москве и области'],
};

// Главный сайт – Москва, остальные города – поддомены. phone: null – номера города на сайте нет.
export const CITIES = [
  { slug: 'msk', main: true, org: SITE_ORG, host: 'grafit-service.ru', name: 'Москва', in: 'в Москве', gen: 'Москвы',
    address: 'Маломосковская ул., 22, стр. 2', phone: '+7 996 299-69-39', hours: 'ежедневно 10:00–20:00', extra: ['tow'] },
  { slug: 'ufa', host: 'ufa.grafit-service.ru', name: 'Уфа', in: 'в Уфе', gen: 'Уфы',
    org: 'ИП Маломожнов Д.А., ИНН 027403525905, ОГРНИП 306027616600041', address: 'ул. 50 лет СССР, 39к11', phone: '+7 347 285-22-55', hours: 'ежедневно 10:00–20:00', extra: ['tires'], live: true },
  { slug: 'krasnodar', host: 'krasnodar.grafit-service.ru', name: 'Краснодар', in: 'в Краснодаре', gen: 'Краснодара',
    address: 'Ростовское шоссе, 12/3', phone: null, hours: 'ежедневно 10:00–20:00', extra: [] },
  { slug: 'makhachkala', host: 'makhachkala.grafit-service.ru', name: 'Махачкала', in: 'в Махачкале', gen: 'Махачкалы',
    address: 'пр. Насрутдинова, 252Б', phone: null, hours: null, extra: [], note: 'адрес только на странице франшизы' },
];
export const CITY_PENDING = 'Пятый город – владелец назвал пять точек, на сайте найдено четыре';

// Цены сервиса Москвы с grafit-service.ru (03.11.2026). works – ключ slug работы из data/services.mjs.
// models – к каким моделям цена относится (страница сайта писалась под них); label – пометка у цены на уровне марки.
export const PRICES = {
  lixiang: { models: ['l6', 'l7', 'l8', 'l9'], label: 'L6–L9', works: { 'scheduled-maintenance': 'от 36 000 ₽ (полное ТО)', 'engine-oil-change': 'от 22 000 ₽', 'spark-plug-replacement': 'от 10 000 ₽', 'coolant-replacement': 'от 15 000 ₽', 'brake-fluid-replacement': 'от 5 000 ₽' } },
  zeekr: { models: ['001', '007', '009', 'x', '7x'], label: 'электрические', works: { 'scheduled-maintenance': 'от 22 000 ₽ (полное ТО)', 'computer-diagnostics': 'от 10 000 ₽ (ZDS)', 'hv-battery-diagnostics': 'от 10 000 ₽ (в составе ZDS)', 'coolant-replacement': 'от 15 000 ₽', 'brake-fluid-replacement': 'от 5 000 ₽' } },
  voyah: { models: ['free', 'dreamer', 'passion'], label: 'гибридные версии', works: { 'scheduled-maintenance': 'от 20 000 ₽ (полное ТО, гибрид)', 'engine-oil-change': 'от 22 000 ₽', 'spark-plug-replacement': 'от 10 000 ₽', 'coolant-replacement': 'от 15 000 ₽', 'brake-fluid-replacement': 'от 5 000 ₽' } },
  avatr: { models: ['07', '11', '12'], works: { 'reducer-oil-change': 'от 60 000 ₽' } },
  'lynk-co': { models: ['900'], label: '900', works: { 'scheduled-maintenance': 'от 29 000 ₽', 'engine-oil-change': 'от 22 440 ₽ (ТО-0)', 'reducer-oil-change': 'от 22 600 ₽' } },
};
export const ZERO_TO = { lixiang: 'от 12 000 ₽ (L6)', zeekr: 'от 17 000 ₽', voyah: 'от 15 000 ₽', 'lynk-co': 'от 22 440 ₽ (900)' };

// Расхождения в ценах на сайте – вопросы владельцу.
export const PRICE_ISSUES = [
  'Voyah: «Полное ТО» от 20 000 ₽ дешевле «ТО двигателя» от 22 000 ₽, хотя включает его.',
  'Avatr: замена масла в редукторах от 60 000 ₽ – в 3 раза дороже, чем у Lynk & Co (22 600 ₽). Опечатка?',
  'Lynk & Co: русификация на странице марки от 45 000 ₽, в прайсе русификации Lynk & Co 900 – от 135 000 ₽.',
  'Zeekr: русификация в прайсе «от 35 000 ₽» в итоге и «от 45 000 ₽» за 001/X; в Уфе 8X/9X – 300 000 ₽, в Москве 9X – от 350 000 ₽.',
  'Lynk & Co: «Полная оклейка» от 36 000 ₽ дешевле «Оклейки зон риска» от 125 000 ₽.',
];

// Русификация – сжатый набор марок по прайсу /russification (Avatr в прайсе нет).
export const RUS = {
  lixiang: { models: ['l6', 'l7', 'l8', 'l9', 'mega'], from: 'от 55 000 ₽', price: { l6: 'от 55 000 ₽', l7: 'от 55 000 ₽', l8: 'от 55 000 ₽', l9: 'от 55 000 ₽' }, rows: [['Lixiang Air / Pro / Max', 'от 55 000 ₽'], ['Lixiang Ultra', 'от 55 000 ₽'], ['Установка SIM-карты', 'от 15 000 ₽'], ['Приложения и ассистент', 'от 5 000 ₽']] },
  zeekr: { models: ['001', '007', '009', 'x', '7x', '8x', '9x'], from: 'от 45 000 ₽', price: { '001': 'от 45 000 ₽', x: 'от 45 000 ₽', '007': 'от 55 000 ₽', '009': 'от 95 000 ₽', '7x': 'от 95 000 ₽', '9x': 'от 350 000 ₽' }, rows: [['Zeekr 001 / Zeekr X', 'от 45 000 ₽'], ['Zeekr 007', 'от 55 000 ₽'], ['Zeekr 009 / Zeekr 7X', 'от 95 000 ₽'], ['Zeekr 9X', 'от 350 000 ₽'], ['Обновление ПО', 'от 55 000 ₽'], ['Установка SIM-карты', 'от 25 000 ₽'], ['Разблокировка Zeekr 001 / X / 7X', 'от 50 000 ₽'], ['Прописание ключа', 'от 20 000 ₽'], ['Восстановление связи с мастер-аккаунтом', 'от 60 000 ₽']] },
  voyah: { models: ['free', 'dreamer', 'passion'], from: 'от 18 000 ₽', price: { free: 'от 18 000 ₽' }, rows: [['Voyah Free', 'от 18 000 ₽'], ['Приложения Passion', 'от 10 000 ₽'], ['Установка SIM-карты', 'от 25 000 ₽'], ['Обновление ПО', 'от 20 000 ₽']] },
  'lynk-co': { models: ['900'], from: 'от 135 000 ₽', price: { '900': 'от 135 000 ₽' }, rows: [['Lynk & Co 900', 'от 135 000 ₽'], ['Lynk & Co 900 Discovery', 'от 140 000 ₽'], ['Установка SIM-карты', 'от 30 000 ₽'], ['Обновление ПО', 'от 30 000 ₽'], ['Русификация только заднего экрана', 'от 40 000 ₽']] },
};
export const RUS_WORKS = [
  ['Перевод интерфейса', 'Меню мультимедиа, приборная панель, климат, системные сообщения – на русском.'],
  ['Российские карты и навигация', 'Яндекс Навигатор или 2ГИС в штатной мультимедиа, пробки и голосовые подсказки.'],
  ['Слот под российскую SIM', 'Впайка слота и настройка интернета: китайская eSIM в России не работает.'],
  ['Магазин приложений', 'На всех экранах, включая экран второго ряда: Яндекс Музыка, Кинопоиск, VK Видео и другие.'],
  ['Мастер-аккаунт', 'Привязка, передача и восстановление аккаунта, доступ к официальному приложению.'],
  ['Обновление ПО', 'Прошивка до версии с русским пакетом, исправление ошибок региональных настроек.'],
];

// Детейлинг – по странице /detailing и ценам со страницы Lynk & Co.
export const DETAILING = [
  { slug: 'ppf-wrap', name: 'Оклейка кузова плёнкой', lead: 'Полиуретановая плёнка от сколов и царапин: с разбором деталей и заворотом плёнки внутрь.', price: 'зоны риска от 125 000 ₽' },
  { slug: 'windshield-protection', name: 'Бронирование лобового стекла', lead: 'Полиуретановая плёнка на лобовое стекло защищает от сколов и трещин.', price: 'от 45 000 ₽' },
  { slug: 'film-removal', name: 'Снятие плёнки с кузова', lead: 'Снятие старой плёнки без повреждения лакокрасочного покрытия.', price: 'от 80 000 ₽' },
  { slug: 'noise-insulation', name: 'Шумоизоляция', lead: 'Оклейка арок и подкрылков виброизоляцией или жидкая шумоизоляция.', price: null },
  { slug: 'wheel-arch-anticorrosion', name: 'Антикор арок', lead: 'Составы на основе масел, смол и воска против коррозии от реагентов и влаги.', price: null },
  { slug: 'ceramic-coating', name: 'Керамика кузова', lead: 'Покрытие от реагентов, УФ и мелких повреждений, с полировкой до блеска.', price: null },
  { slug: 'leather-care', name: 'Обработка кожи', lead: 'Керамическое покрытие салона: кожа не впитывает жидкости и меньше выгорает.', price: null },
  { slug: 'interior-cleaning', name: 'Химчистка салона', lead: 'Сухая и влажная чистка обивки и пластика, удаление пятен и запахов.', price: null },
];

// Старые адреса Тильды → новые. Порядок важен: первое совпадение.
export const REDIRECT_RULES = [
  [/^\/$/, () => '/'],
  [/^\/blog\/?$/, () => '/blog/'],
  [/^\/russification2\/?$/, () => '/russification/'],
  [/^\/remont-batarei\/?$/, () => '/services/diagnostics/hv-battery-diagnostics/'],
  [/^\/(chto-takoe-elektroprivod-v-mashine)\/?$/, (m) => `/blog/${m[1]}/`],
  [/^\/(lixiang|zeekr|voyah|avatr|lynk-co)-service\/?$/, (m) => `/${m[1]}/`],
  [/^\/(lixiang|zeekr|voyah|avatr|lynk-co)\/?$/, (m) => `/${m[1]}/`],
  [/^\/zeekr-001-service\/?$/, () => '/zeekr/001/'],
  [/^\/service\/voyah\/dream\/?$/, () => '/voyah/dreamer/'],
  [/^\/service\/([a-z-]+)\/([a-z0-9-]+)\/?$/, (m) => `/${m[1]}/${m[2]}/`],
  [/^\/russification\/voyah\/dream\/?$/, () => '/russification/voyah/dreamer/'],
  [/^\/russification\/zeekr\/zeekr-([a-z0-9]+)\/?$/, (m) => `/russification/zeekr/${m[1]}/`],
  [/^\/russification\/avatr\/([0-9]+)\/?$/, (m) => `/avatr/${m[1]}/`],
  [/^\/russification\/([a-z-]+)\/([a-z0-9-]+)\/?$/, (m) => `/russification/${m[1]}/${m[2]}/`],
  [/^\/russification\/([a-z-]+)\/?$/, (m) => `/russification/${m[1]}/`],
  [/^\/russification-([a-z-]+)\/?$/, (m) => `/russification/${m[1]}/`],
  [/^\/russification\/?$/, () => '/russification/'],
  [/^\/(detailing|reviews|contacts|franchise)\/?$/, (m) => `/${m[1]}/`],
  [/^\/franchise&/, () => '/franchise/'],
  [/^\/(kontakty)\/?$/, () => '/contacts/'],
  [/^\/(o-kompanii)\/?$/, () => '/about/'],
  [/^\/(uslugi|china-service)\/?$/, () => '/services/'],
  [/^\/(privacy|politica)\/?$/, () => '/privacy-policy/'],
  [/^\/(agreement|soglasie)\/?$/, () => '/personal-data-consent/'],
  [/^\/kasko-osago-lixiang-zeekr-voyah\/?$/, () => '/blog/kasko-osago-lixiang-zeekr-voyah/'],
  [/^\/blog\//, (m, p) => p.endsWith('/') ? p : p + '/'],
  [/^\/page\d+\.html$/, () => '/'],
];
// Не страницы: служебные адреса Тильды, счётчики, квиз, файлы с чужих компьютеров – 301 не нужен.
export const NOT_PAGES = /^\/(tilda\/|an\/count|watch\/|C:\/|[0-9a-f]{24}$|thanks|r$|api\/|product\/|produkciya|root_files_storage|\|\|)/;
