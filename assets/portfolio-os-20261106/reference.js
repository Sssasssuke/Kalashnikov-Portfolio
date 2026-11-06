const extraStyles = document.createElement('link');
extraStyles.rel = 'stylesheet'; extraStyles.href = '/assets/portfolio-os-20261106/reference-extra.css'; document.head.append(extraStyles);
const detailStyles=document.createElement('link');detailStyles.rel='stylesheet';detailStyles.href='/assets/portfolio-os-20261106/reference-details.css';document.head.append(detailStyles);
const $ = (selector) => document.querySelector(selector);
$('.profile > img').src = '/assets/portfolio-os-20261106/alexander-avatar-new.png';
const projects = [
  ['mts', 'МТС', 'Промостраницы и рекламные материалы', 'mts', 'МТС'],
  ['fashion-fund', 'Фонд Моды', 'Материалы для модных событий', 'fashion', 'М'],
  ['seo-geo', 'B2B SaaS', 'Интерфейс сервиса для маркетологов', 'saas', 'panels-top-left'],
  ['gds-branding', 'GDS', 'Айдентика и сайт агентства', 'gds', 'GDS'],
  ['masterok', 'мастер.ок', 'Айдентика строительного магазина', 'masterok', 'М'],
  ['ai-concepts', 'AI-концепты', 'Концепты с нейросетями', 'ai', 'sparkles']
];
$('.stats section:first-child strong').textContent=String(projects.length);
const icons = {projects:['folder','folder'],about:['person','user-round'],email:['mail','mail'],telegram:['send','send'],notes:['notes','notebook-pen'],photos:['photos','images'],resume:['resume','file-text']};
const names = {home:'Портфолио',projects:'Работы',about:'Обо мне',email:'Почта',telegram:'Telegram',notes:'Заметки',photos:'Фотографии',resume:'Резюме'};
const win = $('.app-window');
let current = '', lastFocus, toastTimer;
const photoGallery = import('/assets/portfolio-os-20261106/photo-gallery.js');
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function glyph(type, text) { return `<span class="icon ${type}">${['notes','photos'].includes(type) ? `<img src="/assets/portfolio-os-20261106/apple-${type}.svg" alt="">` : ['МТС','М','GDS'].includes(text) ? text : `<i data-lucide="${text}"></i>`}</span>`; }
function icon(id) { const p=projects.find(p=>p[0]===id); return p ? `<span class="icon case-icon"><img src="/assets/portfolio-os-20261106/case-icon-${id}.webp" alt="" width="256" height="256"></span>` : glyph(...icons[id]); }
function repaint(){window.lucide?.createIcons();}
function shortcut(id,label){return `<button class="shortcut" data-app="${id}" title="${label}">${icon(id)}<span>${label}</span></button>`;}
$('.desktop-icons').innerHTML=projects.map(p=>shortcut(p[0],p[1])).join('')+shortcut('notes','Заметки')+shortcut('photos','Фотографии');
$('.dock').innerHTML=['projects','about','email','telegram','notes','photos','resume'].map(id=>`<button data-app="${id}" title="${names[id]}" aria-label="${names[id]}">${icon(id)}</button>`).join('');
function bubble(text,mine=false){const div=document.createElement('div');div.className='bubble'+(mine?' mine':'');div.textContent=text;$('.messages').append(div);return div;}
$('.messages').innerHTML='<p class="date">Сегодня</p>';
bubble('Привет! Я Александр, digital- и UX/UI-дизайнер из Москвы.');
bubble('Делаю сайты, интерфейсы и рекламные материалы. Ниже собрал несколько проектов.');
const skills=bubble('В зависимости от задачи работаю со структурой страниц, оформлением или и тем и другим.');
skills.innerHTML+='<div class="tags"><span>UX/UI</span><span>Figma</span><span>Digital</span><span>Айдентика</span><span>AI</span></div>';
bubble('Покажи, что ты делал',true);
projects.forEach(p=>$('.messages').insertAdjacentHTML('beforeend',`<button class="chat-project" data-app="${p[0]}">${icon(p[0])}<span><strong>${p[1]}</strong><small>${p[2]}</small><em>Посмотреть кейс ↗</em></span></button>`));
bubble('А какой у тебя опыт?',true);
bubble('Для МТС делал промостраницы и рекламные материалы. Сервисные письма сам оформлял и верстал в HTML. Ещё работал над материалами Фонда Моды и айдентикой GDS.');
bubble('В проекте B2B SaaS на старте был только неработающий прототип с длинным текстовым отчётом. Я разобрался в его логике и спроектировал разделы и последовательность действий пользователя.');
bubble('В отдельных проектах ставил задачи двум дизайнерам, готовил ТЗ и следил за сроками.');
$('.messages').insertAdjacentHTML('beforeend','<div class="chat-links"><button data-app="about">Обо мне</button><button data-app="resume">Резюме</button><button data-app="notes">Заметки</button><button data-app="photos">Фотографии</button><a href="https://t.me/kal4shnikoff" target="_blank" rel="noopener">Telegram ↗</a></div>');
function explore(){document.body.classList.remove('intro');$('.explore').hidden=true;}
$('.explore').onclick=explore;
function toast(text){$('.toast').textContent=text;$('.toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').hidden=true,3000);}
async function copyEmail(){try{await navigator.clipboard.writeText('kal4shnikov@mail.ru');toast('Почта скопирована');}catch{toast('kal4shnikov@mail.ru');}}
function sidebar(id){$('.side-content').innerHTML='<small>Избранное</small>'+['projects','about','resume','photos','notes'].map(key=>`<button data-app="${key}" class="${id===key?'selected':''}"><i data-lucide="${icons[key][1]}"></i>${names[key]}</button>`).join('')+'<small>Связаться</small><button data-app="email"><i data-lucide="mail"></i>Почта</button><a href="https://t.me/kal4shnikoff" target="_blank" rel="noopener"><i data-lucide="send"></i>Telegram</a>';}
const notes=[
 ['Как я работаю','С чего начинаю и что проверяю','Сначала разбираюсь, для кого делаю дизайн и что нужно показать. В промостранице это могут быть условия акции, в сервисе — задача, которую человеку нужно выполнить.\n\nПотом собираю структуру, выбираю оформление и проверяю, как всё работает вместе. Отдельно смотрю мобильную версию: хватает ли места тексту, удобно ли нажимать кнопки, ничего ли не потерялось.'],
 ['С чего начался B2B SaaS','Что было в исходном прототипе','На старте был только неработающий прототип. На одной странице он выводил сплошным текстом, что на сайте хорошо, а что плохо. Рекомендаций и понятного продолжения не было.\n\nЯ самостоятельно разбирался в логике продукта. Определял, какие разделы нужны, какую информацию показать в каждом и что пользователь сможет сделать после чтения отчёта.'],
 ['Дизайн и вёрстка','Опыт с промостраницами и письмами','В МТС я работал с промо, лендингами и рекламными материалами. Для сервисных писем делал и дизайн, и HTML-вёрстку.\n\nКогда сам верстаешь макет, быстрее замечаешь, что стоит поправить в дизайне: слишком длинный заголовок, неудобную кнопку или блок, который не помещается на телефоне.'],
 ['Список продуктов','Огурцы точно нужны','Колбаса сырокопчёная\nОгурцы\nХлеб\nСыр\nЯйца\nЧто-нибудь к чаю\nЧай\n\nНе выбирать молоко по упаковке. В прошлый раз это был кефир.'],
 ['Планы на выходные','Ничего сложного','Выспаться.\nКупить продукты из соседней заметки.\nНе открывать Figma.\n\nЕсли открыл, хотя бы не создавать новый файл.'],
 ['Размеры','Чтобы опять не измерять','Стол: 120 × 60\nМесто под полку: 83\n\n83 чего и в какой комнате, уже не помню.\nПолку пока не покупать.'],
 ['Идея в 02:14','Утром разобраться','Приложение, которое напоминает, зачем открыл телефон.\n\nМонетизация: не давать закрыть, пока не вспомнишь.\n\n02:19\nНет.'],
 ['Важное','Не удалять','Файл «финал» не финальный.\n«Финал 2» тоже.\nНужный называется «копия копия новый».\n\nНавести порядок. Но не сегодня, сегодня я ещё помню.']
];
function openNote(n){$('.side-content').innerHTML='<small>Заметки</small>'+notes.map((note,i)=>`<button class="note-item ${i===n?'selected':''}" data-note="${i}"><b>${note[0]}</b><span>${note[1]}</span></button>`).join('');$('.window-content').innerHTML=`<div class="mobile-notes">${notes.map((note,i)=>`<button data-note="${i}">${note[0]}</button>`).join('')}</div><h2>${notes[n][0]}</h2><p style="white-space:pre-line">${notes[n][2]}</p>`;}
async function photoView(){const gallery=await photoGallery;if(current==='photos')gallery.renderGallery();}
function openApp(id){
 if(id==='email')return copyEmail();
 if(id==='telegram')return window.open('https://t.me/kal4shnikoff','_blank','noopener');
 if(current===id&&win.hidden){win.hidden=false;$('.window-back').focus();return;}
 lastFocus=document.activeElement;
 current=id; win.hidden=false;win.classList.toggle('notes-window',id==='notes');win.classList.toggle('case-window',projects.some(p=>p[0]===id));
 $('.window-content').className='window-content';$('.window-title').textContent=names[id]||projects.find(p=>p[0]===id)?.[1]||'Работы';$('.window-count').textContent='';sidebar(id);
 document.querySelectorAll('.dock [data-app]').forEach(el=>el.classList.toggle('active',el.dataset.app===id||(projects.some(p=>p[0]===id)&&el.dataset.app==='projects')));
 $('.window-back').disabled=id==='home';
 $('.window-back').setAttribute('aria-label',projects.some(p=>p[0]===id)?'Назад к работам':'Назад к разделам');
 if(id==='home')$('.window-content').innerHTML='<h2>Портфолио</h2><div class="section-launcher">'+['projects','about','resume','photos','notes','email','telegram'].map(key=>shortcut(key,names[key])).join('')+'</div>';
 else if(id==='projects')$('.window-content').innerHTML='<h2>Работы</h2><div class="project-list">'+projects.map(p=>`<button class="shortcut" data-app="${p[0]}">${icon(p[0])}<b>${p[1]}</b><small>${p[2]}</small></button>`).join('')+'</div>';
 else if(id==='about')$('.window-content').innerHTML='<h2>Привет, я Александр</h2><p>Я digital- и UX/UI-дизайнер. Делаю сайты, рекламные материалы и интерфейсы сервисов. В одних проектах работаю в рамках готового фирменного стиля, в других разрабатываю оформление с нуля.</p><p>Здесь собраны мои работы для МТС, Фонда Моды, GDS и магазина мастер.ок, а также интерфейс B2B-сервиса. Название сервиса не раскрываю по NDA. Работаю в Figma, Photoshop и Illustrator, собираю сайты на Tilda и верстаю в HTML и CSS. Нейросети использую для поиска идей и создания изображений.</p><p>На отдельных проектах распределял задачи между двумя дизайнерами, составлял ТЗ и контролировал сроки.</p><p>Живу в Москве. По поводу работы или проекта можно написать мне в Telegram.</p><div class="chat-links"><button data-app="email">Скопировать почту</button><a href="https://t.me/kal4shnikoff" target="_blank" rel="noopener">Telegram ↗</a><button data-app="resume">Резюме</button></div>';
 else if(id==='notes')openNote(0);
 else if(id==='photos')photoView();
else if(id==='resume')$('.window-content').innerHTML='<h2>Александр Калашников</h2><p>Коммуникационный дизайнер</p><p>МТС: промо-страницы, рекламные материалы и сервисные письма. Фонд Моды: визуальные коммуникации. GDS: айдентика и сайт. мастер.ок: оформление магазина, наружная реклама, карты и мерч. B2B SaaS: структура интерфейса и пользовательский путь.</p><p>На отдельных проектах распределял задачи между двумя дизайнерами, составлял ТЗ и контролировал сроки.</p><p>Figma · Photoshop · Illustrator · Tilda · HTML / CSS · AI-инструменты</p><p>Москва<br><a href="mailto:kal4shnikov@mail.ru">kal4shnikov@mail.ru</a><br><a href="tel:+79162919966">+7 916 291-99-66</a></p><a class="upload-button" href="/assets/portfolio-os-20261106/cv.pdf?v=communication-20261106" target="_blank" rel="noopener">Резюме в PDF ↗</a>';
 else if(projects.some(p=>p[0]===id)){
  $('.window-content').classList.add('case');$('.window-content').innerHTML=`<iframe title="Кейс ${escapeHTML($('.window-title').textContent)}" src="/assets/portfolio-os-20261106/cases/${id}.html"></iframe>`;
  const frame=$('.window-content iframe');
  frame.onload=()=>{
   const doc=frame.contentDocument;if(!doc)return;
   const sections=[...doc.querySelectorAll('main h2')].filter(h=>h.textContent.trim()).slice(0,12);
   sections.forEach((h,i)=>{if(!h.id)h.id='desktop-section-'+i;});
   $('.side-content').innerHTML='<button data-app="projects" class="selected"><i data-lucide="chevron-left"></i>Все проекты</button><small>В этом кейсе</small>'+sections.map((h,i)=>`<button data-section="${i}"><span class="section-dot"></span>${escapeHTML(h.innerText.trim().replace(/\s+/g,' '))}</button>`).join('')+'<small>Проекты</small>'+projects.map(p=>`<button data-app="${p[0]}" class="${id===p[0]?'selected':''}">${icon(p[0])}${p[1]}</button>`).join('');
   $('.side-content').querySelectorAll('[data-section]').forEach(btn=>btn.onclick=()=>sections[Number(btn.dataset.section)].scrollIntoView({behavior:'smooth',block:'start'}));
   doc.addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;const url=new URL(link.href);if(url.origin===location.origin&&(url.pathname==='/'||url.pathname==='/index.html')){e.preventDefault();openApp('projects');}else if(url.origin===location.origin){const match=projects.find(p=>url.pathname===`/${p[0]}`||url.pathname===`/${p[0]}.html`);if(match){e.preventDefault();openApp(match[0]);}}else{link.target='_blank';link.rel='noopener';}});repaint();
  };
 }
 repaint();$('.window-back').focus();
}
function closeApp(){win.querySelector('video')?.pause();win.hidden=true;current='';document.querySelectorAll('.dock .active').forEach(el=>el.classList.remove('active'));lastFocus?.focus();}
$('.red').onclick=closeApp;$('.mobile-close').onclick=closeApp;
$('.yellow').onclick=()=>{win.querySelector('video')?.pause();win.hidden=true;lastFocus?.focus();};
$('.green').onclick=()=>win.classList.toggle('zoomed');
$('.window-back').onclick=()=>{
 if(current==='photos'&&$('.personal-viewer')){win.querySelector('video')?.pause();photoView();}
 else if(projects.some(p=>p[0]===current))openApp('projects');
 else if(current!=='home')openApp('home');
};
document.addEventListener('click',e=>{const app=e.target.closest('[data-app]');if(app)openApp(app.dataset.app);const note=e.target.closest('[data-note]');if(note)openNote(Number(note.dataset.note));});

const chatEngine = import('/assets/portfolio-os-20261106/portfolio-chat.js').then(module => module.createPortfolioChat());
async function submitQuestion(text) {
 if(!text.trim())return;
 bubble(text,true);
 try {
  const answer = (await chatEngine)(text);
  const response = bubble(answer.text);
  if(answer.apps.length){
   const links=document.createElement('div');links.className='chat-links';
   answer.apps.forEach(id=>{const button=document.createElement('button');button.dataset.app=id;button.textContent=names[id]||projects.find(p=>p[0]===id)?.[1]||id;links.append(button);});
   response.append(links);
  }
  document.querySelectorAll('.chat-suggestions').forEach(el=>el.remove());
  if(answer.suggestions.length){
   const row=document.createElement('div');row.className='chat-links chat-suggestions';
   answer.suggestions.forEach(text=>{const button=document.createElement('button');button.textContent=text;button.onclick=()=>submitQuestion(text);row.append(button);});
   $('.messages').append(row);
  }
 }catch{bubble('Не удалось загрузить ответы. Обнови страницу или напиши Александру: @kal4shnikoff.');}
 $('.messages').scrollTo({top:$('.messages').scrollHeight,behavior:'smooth'});
}
$('.composer').onsubmit=e=>{e.preventDefault();const input=$('.composer input');const text=input.value.trim();if(!text)return;input.value='';submitQuestion(text);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!win.hidden)closeApp();else explore();}if(e.key==='Tab'&&!win.hidden){const items=[...win.querySelectorAll('button,a,input,iframe')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
for(const handle of [$('.window-toolbar'),$('.traffic')]){handle.addEventListener('pointerdown',e=>{if(innerWidth<=700||e.target.closest('button')||win.classList.contains('zoomed'))return;const rect=win.getBoundingClientRect();const dx=e.clientX-rect.left,dy=e.clientY-rect.top;handle.setPointerCapture(e.pointerId);const move=ev=>{win.style.transform='none';win.style.left=Math.max(0,Math.min(innerWidth-100,ev.clientX-dx))+'px';win.style.top=Math.max(32,Math.min(innerHeight-80,ev.clientY-dy))+'px';};const end=()=>{handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',end);handle.removeEventListener('pointercancel',end);};handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);});}
const battery=$('.menubar [data-lucide="battery-full"]');
battery.outerHTML='<span class="system-battery" role="img" aria-label="Индикатор батареи"><span></span></span>';
function clock(){const date=new Date();$('#clock').textContent=date.toLocaleTimeString('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit'});$('#date').textContent=date.toLocaleDateString('ru-RU',{weekday:'short',day:'numeric',month:'short'})+' '+date.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});}clock();setInterval(clock,60000);repaint();
