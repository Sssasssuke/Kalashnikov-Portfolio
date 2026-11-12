const phoneStyles=document.createElement('link');phoneStyles.rel='stylesheet';phoneStyles.href='/assets/portfolio-os-20261112/phone-shell.css';document.head.append(phoneStyles);
document.body.insertAdjacentHTML('beforeend',`<div class="phone-status" aria-hidden="true"><time></time><span><i data-lucide="signal"></i><i data-lucide="wifi"></i><i data-lucide="battery-full"></i></span></div><section class="phone-launcher" aria-label="Домашний экран"><div class="phone-widget"><img src="/assets/portfolio-os-20261112/alexander-avatar-new.png" alt=""><div><b>Александр Калашников</b><p>Коммуникационный<br>и UX/UI-дизайнер</p></div></div><div class="phone-apps">${projects.map(p=>shortcut(p[0],p[1])).join('')}${shortcut('notes','Заметки')}${shortcut('photos','Фото')}${shortcut('about','Обо мне')}${shortcut('resume','Резюме')}</div><nav class="phone-dock" aria-label="Основные приложения">${shortcut('projects','Работы')}<button class="shortcut" data-phone-chat><span class="icon phone-chat-icon"><i data-lucide="message-circle"></i></span><span>Чат</span></button>${shortcut('telegram','Telegram')}${shortcut('email','Почта')}</nav></section><button class="phone-home" aria-label="На домашний экран"><span></span></button>`);
document.querySelector('.phone-widget').insertAdjacentHTML('afterend','<button class="phone-chat-widget" data-phone-chat aria-label="Открыть чат-бота" aria-expanded="false"><span class="phone-chat-widget-title"><i data-lucide="message-circle"></i><b>Чат-бот</b><i data-lucide="arrow-up-right"></i></span><span class="phone-chat-widget-message">Расскажу о проектах и опыте Александра.</span><span class="phone-chat-widget-input">Спросить о портфолио<i data-lucide="arrow-up"></i></span></button>');
let chatAnimation;
document.querySelector('.chat header').insertAdjacentHTML('beforeend','<button class="phone-chat-close" aria-label="Закрыть чат" title="Закрыть чат"><i data-lucide="x"></i></button>');
document.querySelector('.phone-chat-close').onclick=()=>document.querySelector('.phone-home').click();
function openPhoneChat(button){
 const source=button.getBoundingClientRect();
 closeApp();chatAnimation?.cancel();document.body.classList.add('phone-chat-open');
 document.querySelector('.phone-chat-widget').setAttribute('aria-expanded','true');
 const chat=document.querySelector('.chat'),target=chat.getBoundingClientRect();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  chatAnimation=chat.animate([
   {clipPath:`inset(${Math.max(0,source.top-target.top)}px ${Math.max(0,target.right-source.right)}px ${Math.max(0,target.bottom-source.bottom)}px ${Math.max(0,source.left-target.left)}px round 24px)`,opacity:.6},
   {clipPath:'inset(0px 0px 0px 0px round 0px)',opacity:1}
  ],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
 }
 chat.querySelector('header').tabIndex=-1;chat.querySelector('header').focus({preventScroll:true});
}
function phoneClock(){document.querySelector('.phone-status time').textContent=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});}
phoneClock();setInterval(phoneClock,60000);repaint();
document.querySelectorAll('[data-phone-chat]').forEach(button=>button.onclick=()=>openPhoneChat(button));
document.querySelector('.phone-home').onclick=()=>{chatAnimation?.cancel();closeApp();document.body.classList.remove('phone-chat-open');document.querySelector('.phone-chat-widget').setAttribute('aria-expanded','false');document.querySelector('[data-phone-chat]').focus({preventScroll:true});};
let homeStart;
const homeBar=document.querySelector('.phone-home');
homeBar.addEventListener('pointerdown',e=>{homeStart=e.clientY;homeBar.setPointerCapture(e.pointerId);});
homeBar.addEventListener('pointerup',e=>{if(homeStart-e.clientY>25)homeBar.click();homeStart=null;});
