const briefs={
 mts:['Понятно показать условия акций и продукты МТС на промостраницах.','Разрабатывал макеты и адаптации, рекламные материалы. Делал дизайн и HTML-вёрстку сервисных писем.','В кейсе собраны промостраницы и рекламные материалы. Данных об изменении конверсии нет.'],
 'fashion-fund':['Подготовить визуальные материалы для BRICS Fashion Summit и Московской недели моды.','Разрабатывал основные визуалы и адаптировал их для экранов, публикаций, приглашений и печати.','Материалы для двух событий: примеры показаны ниже по направлениям.'],
 'seo-geo':['Сделать сервис для маркетологов из прототипа, который выдавал сплошной текстовый отчёт.','Сам разобрался в логике продукта, спроектировал разделы, действия пользователя и UI Kit.','Сервис запущен. Компания и название закрыты NDA; в макетах демонстрационные данные.'],
 'gds-branding':['Разработать оформление маркетингового агентства, которое работает с инфлюенсерами.','Сделал сайт, логотип, карусели и концепцию персонажа: маску, одежду, позы и манеру речи.','Подготовлены сайт и материалы бренда. Ниже показаны макеты и презентация персонажа.'],
 masterok:['Обновить оформление строительного магазина и рассказать покупателям о снижении цен.','Сам сделал логотип, рекламные тексты, баннеры, дисконтные карты, мерч и товарный шаблон.','Материалы напечатаны и используются в магазине. Отзывы клиента приведены в конце кейса.'],
 'ai-concepts':['Попробовать идеи рекламных изображений с помощью нейросетей.','Подбирал референсы, задавал направление генерации, отбирал изображения и собирал композиции.','Три серии концептов: GDS, SKR Merch и KINO. Это не запущенные кампании.']
};
const key=location.pathname.split('/').filter(Boolean).find(s=>briefs[s.replace('.html','')])?.replace('.html','');
if(briefs[key]){
 const style=document.createElement('style');style.textContent='.case-brief{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin:28px 0 36px;padding:24px 0;border-top:1px solid #ddd;border-bottom:1px solid #ddd}.case-brief dt{font-size:14px;font-weight:650;margin-bottom:10px}.case-brief dd{margin:0;font-size:16px;line-height:1.5}.case-actions{display:flex;flex-wrap:wrap;gap:12px;padding-top:32px;padding-bottom:40px}.case-actions a{display:inline-flex;align-items:center;min-height:44px;padding:10px 16px;border:1px solid #ccc;border-radius:8px;color:inherit;text-decoration:none}@media(max-width:700px){.case-brief{grid-template-columns:1fr;gap:18px}.case-actions a{width:100%}}';document.head.append(style);
 const brief=document.createElement('dl');brief.className='case-brief';
 ['Задача','Моя роль','Что получилось'].forEach((label,i)=>{const item=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=briefs[key][i];item.append(dt,dd);brief.append(item);});
 const cover=document.querySelector('.case-cover, .hero-screen, .case-hero > .master-figure');
 if(key==='seo-geo')document.querySelector('.hero-lead')?.after(cover);
 if(cover)cover.after(brief);else document.querySelector('.case-heading, .hero-description')?.after(brief);
 if(window.self!==window.top){
  document.documentElement.classList.add('embedded-case');
  const embedded=document.createElement('style');
  embedded.textContent='.embedded-case .header,.embedded-case .back-link{display:none!important}.embedded-case .case-hero,.embedded-case .hero{padding-top:20px!important}.embedded-case .case-heading{margin-bottom:20px}.embedded-case .hero-screen{margin-top:20px}';
  document.head.append(embedded);
 }
 const nav=document.createElement('nav');nav.className='shell case-actions';nav.setAttribute('aria-label','После просмотра кейса');
 nav.innerHTML='<a href="/#/projects">Другие работы</a><a href="/#/resume">Резюме</a><a href="https://t.me/kal4shnikoff" target="_blank" rel="noopener">Обсудить проект</a>';
 document.querySelector('main')?.append(nav);
}
