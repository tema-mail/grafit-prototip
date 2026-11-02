// Выдача Яндекса (органика, без рекламы), Москва lr=213, Уфа 172, Краснодар 35, Махачкала 28. Снято через Chrome 03.11.2026.
export const SERP = [
  ['ремонт lixiang москва', 'lihome.pro · lixiang-sto.ru · ruslixiang.ru · grafit-service.ru (4) · helperservice.ru · originalkitay-auto.ru · elektroman.pro · servis-lixiang.ru · 77volvo.ru · 77max.ru'],
  ['сервис lixiang москва', 'lixiang-sto.ru · ruslixiang.ru · lihome.pro · grafit-service.ru (4) · helperservice.ru · elektroman.pro · li-motors.ru · lixiang-km4.ru · 77max.ru'],
  ['ремонт zeekr москва', 'ruszeekr.ru · zmzeekr.ru · fanzy-cars.ru · originalkitay-auto.ru · zeekr.com.ru · r-ms.ru · evcar.ru · connectservicecar.ru · grafit-service.ru (9) · elektroman.pro'],
  ['сервис zeekr москва', 'zeekrlab.ru · zeekr-cars.com · ruszeekr.ru · zmzeekr.ru · grafit-service.ru (5) · evcar.ru · elektroman.pro · avtodom.ru'],
  ['ремонт voyah москва', 'originalkitay-auto.ru · grafit-service.ru (2, /service/voyah/free/) · remont-voyah.pro · service.e-n-cars.ru · elektroman.pro · evcar.ru · panavto.ru · r-ms.ru · voyah-borishof.ru · voyah-rc-warshavka.ru'],
  ['сервис voyah москва', 'voyah.ru · voyah-borishof.ru · elektroman.pro · panavto.ru · service.e-n-cars.ru · evcar.ru · grafit-service.ru (7) · remont-voyah.pro · favorit-motors.ru'],
  ['ремонт avatr москва', 'service.e-n-cars.ru · grafit-service.ru (2, /service/avatr/11/) · chinnamon.ru · avatr-avilon.ru · r-ms.ru · r-p-m.ru · tokyogarage.ru · frankauto.ru'],
  ['сервис avatr москва', 'avatr-avilon.ru · grafit-service.ru (2) · service.e-n-cars.ru · frankauto.ru · r-ms.ru · chinnamon.ru · panavto.ru · major-auto.ru'],
  ['ремонт lynk co москва', 'connectservicecar.ru · lynkco-avilon.ru · originalkitay-auto.ru · rolf.ru · grafit-service.ru (5) · service.e-n-cars.ru · r-ms.ru · vemas-auto.ru'],
  ['сервис lynk co москва', 'grafit-service.ru (1) · lynkco-avilon.ru · connectservicecar.ru · originalkitay-auto.ru · service.e-n-cars.ru · avtomir.ru'],
  ['ремонт китайских электромобилей москва', 'bcc-service.ru · chinnamon.ru · evruli.ru · lubanservice.ru · nevfix.net · lihome.pro · 2gis.ru · zeecar.ru – GRAFIT нет'],
  ['сервис китайских гибридов москва', 'bcc-service.ru · lubanservice.ru · 2gis.ru · chinnamon.ru · elektroman.pro · mta-sto.ru · ruslixiang.ru · originalkitay-auto.ru – GRAFIT нет'],
  ['русификация lixiang москва', 'helperservice.ru · provolta.ru · russification.ru · connectservicecar.ru · update-lixiang.ru · lixiang-km4.ru · liclub.ru · grafit-service.ru (8)'],
  ['русификация zeekr москва', 'ruszeekr.ru · zeekrlab.ru · bromise.ru · russification.ru · avito.ru · xmeta.ru · cdcar.ru · zih.su – GRAFIT нет'],
  ['ремонт пневмоподвески lixiang', 'ruslixiang.ru · elektroman.pro · pnevmozap.ru · rolf.ru · helperservice.ru · servis-lixiang.ru · lixiang-sto.ru · autopilot-lixiang.ru – GRAFIT нет'],
  ['диагностика высоковольтной батареи zeekr', 'zeekrlab.ru · ruszeekr.ru · connectservicecar.ru · el-ve.ru · carsalding.ru · chinnamon.ru · youcar.tech – GRAFIT нет'],
  ['сервис lixiang уфа', 'ufa.grafit-service.ru (1) · li-motors.ru · ufa.lixiang-remont.ru · ufa.tts.ru · 2gis.ru · avito.ru · drive2.ru'],
];

// Устройство сайтов лидеров – по их sitemap.xml, 03.11.2026.
export const LEADERS = [
  ['elektroman.pro', 'мультибренд', 2566, 'Матрица /uslugi/<группа>/<работа>/<марка>/<модель>/ – 2371 страница. Есть в топе по всем 5 маркам.'],
  ['chinnamon.ru', 'мультибренд, только Китай', 1515, '/service-model/<работа>/<марка>/<модель>/ – 1187 страниц, 104 работы, 30 марок. Ведёт общие запросы «ремонт китайских электромобилей».'],
  ['ruszeekr.ru', 'моносайт Zeekr', 858, '/uslugi/<работа>/<модель>/ – 663 страницы «работа × модель». №1 по «ремонт zeekr», «русификация zeekr».'],
  ['ruslixiang.ru', 'моносайт Lixiang', 748, 'Тот же шаблон, что ruszeekr.ru (похоже, одна сеть). Топ-3 по Lixiang и №1 по пневмоподвеске.'],
  ['originalkitay-auto.ru', 'мультибренд', 470, 'Мало страниц услуг (страница «ремонт <марки>»), 364 страницы тегов. Держится на возрасте и ссылках.'],
  ['evcar.ru', 'мультибренд EV', 150, '/services/<марка>/<работа>/ – 98 страниц.'],
  ['lixiang-sto.ru', 'моносайт Lixiang', 125, '63 услуги + 52 статьи. №1–2 по «сервис lixiang».'],
  ['service.e-n-cars.ru', 'дилерская группа', 16, 'Всего 16 страниц, но в топе Avatr/Voyah/Lynk – вес домена дилера.'],
];
