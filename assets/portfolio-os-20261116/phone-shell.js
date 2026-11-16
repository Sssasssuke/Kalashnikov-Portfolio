const phoneStyles=document.createElement('link');phoneStyles.rel='stylesheet';phoneStyles.href='/assets/portfolio-os-20261116/phone-shell.css';document.head.append(phoneStyles);
// Follow the visible viewport instead of letting the keyboard cover the composer.
const chatInput=document.querySelector('.composer input');
const viewport=window.visualViewport;
let viewportFrame;
function syncChatViewport(){
 cancelAnimationFrame(viewportFrame);
 viewportFrame=requestAnimationFrame(()=>{
  const mobile=matchMedia('(max-width:700px)').matches;
  const height=viewport?.height||innerHeight;
  document.body.style.setProperty('--chat-viewport-height',height+'px');
  document.body.style.setProperty('--chat-viewport-top',(viewport?.offsetTop||0)+'px');
  document.body.classList.toggle('keyboard-open',mobile&&document.activeElement===chatInput&&document.documentElement.clientHeight-height>100);
  if(mobile&&document.activeElement===chatInput){const messages=document.querySelector('.messages');messages.scrollTop=messages.scrollHeight;}
 });
}
viewport?.addEventListener('resize',syncChatViewport);
viewport?.addEventListener('scroll',syncChatViewport);
window.addEventListener('resize',syncChatViewport);
chatInput.addEventListener('focus',syncChatViewport);
chatInput.addEventListener('blur',syncChatViewport);
document.querySelector('.composer').addEventListener('submit',()=>{
 if(innerWidth<=700&&chatInput.value.trim())chatInput.blur();
},true);
syncChatViewport();
document.body.insertAdjacentHTML('beforeend',`<div class="phone-status" aria-hidden="true"><time></time><span><i data-lucide="signal"></i><i data-lucide="wifi"></i><i data-lucide="battery-full"></i></span></div><section class="phone-launcher" aria-label="Домашний экран"><div class="phone-widget"><img src="/assets/portfolio-os-20261116/alexander-avatar-new.png" alt=""><div><b>Александр Калашников</b><p>Коммуникационный<br>и UX/UI-дизайнер</p></div></div><div class="phone-apps">${projects.map(p=>shortcut(p[0],p[1])).join('')}${shortcut('notes','Заметки')}${shortcut('photos','Фото')}${shortcut('about','Обо мне')}${shortcut('resume','Резюме')}</div><nav class="phone-dock" aria-label="Основные приложения">${shortcut('projects','Работы')}<button class="shortcut" data-phone-chat><span class="icon phone-chat-icon"><i data-lucide="message-circle"></i></span><span>Чат</span></button>${shortcut('telegram','Telegram')}${shortcut('email','Почта')}</nav></section><button class="phone-home" aria-label="На домашний экран"><span></span></button>`);
document.querySelector('.phone-widget').insertAdjacentHTML('afterend','<button class="phone-chat-widget" data-phone-chat aria-label="Открыть чат-бота" aria-expanded="false"><span class="phone-chat-widget-title"><i data-lucide="message-circle"></i><b>Чат-бот</b><i data-lucide="arrow-up-right"></i></span><span class="phone-chat-widget-message">Расскажу о проектах и опыте Александра.</span><span class="phone-chat-widget-input">Спросить о портфолио<i data-lucide="arrow-up"></i></span></button>');
// Decorative status indicators, not live device telemetry.
document.querySelector('.phone-status > span').innerHTML=`
 <svg class="ios-cellular" viewBox="0 0 19 12" aria-hidden="true"><g fill="currentColor"><rect x="0" y="8" width="3.5" height="4" rx=".8"/><rect x="5" y="5.5" width="3.5" height="6.5" rx=".8"/><rect x="10" y="3" width="3.5" height="9" rx=".8"/><rect x="15" width="3.5" height="12" rx=".8"/></g></svg>
 <svg class="ios-wifi" viewBox="0 0 17 12" aria-hidden="true"><path fill="currentColor" d="M.3 3.5a12.1 12.1 0 0 1 16.4 0l-1.9 2a9.3 9.3 0 0 0-12.6 0ZM3.5 6.8a7.4 7.4 0 0 1 10 0l-2 2a4.5 4.5 0 0 0-6 0ZM6.7 10.1a2.7 2.7 0 0 1 3.6 0L8.5 12Z"/></svg>
 <svg class="ios-battery" viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" opacity=".65"/></svg>`;
let chatAnimation;
document.querySelector('.chat header').insertAdjacentHTML('beforeend','<button class="phone-chat-close" aria-label="Закрыть чат" title="Закрыть чат"><i data-lucide="x"></i></button>');
document.querySelector('.phone-chat-close').onclick=()=>document.querySelector('.phone-home').click();
function openPhoneChat(button){
 const source=button.getBoundingClientRect();
 closeApp();chatAnimation?.cancel();document.body.classList.remove('phone-chat-closing');document.body.classList.add('phone-chat-open');
 document.querySelector('.phone-chat-widget').setAttribute('aria-expanded','true');
 const chat=document.querySelector('.chat'),target=chat.getBoundingClientRect();
 if(pointerInteraction&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  chatAnimation=chat.animate([
   {clipPath:`inset(${Math.max(0,source.top-target.top)}px ${Math.max(0,target.right-source.right)}px ${Math.max(0,target.bottom-source.bottom)}px ${Math.max(0,source.left-target.left)}px round 24px)`,opacity:.6},
   {clipPath:'inset(0px 0px 0px 0px round 0px)',opacity:1}
  ],{duration:260,easing:'cubic-bezier(.23,1,.32,1)'});
 }
 chat.querySelector('header').tabIndex=-1;chat.querySelector('header').focus({preventScroll:true});
}
function phoneClock(){document.querySelector('.phone-status time').textContent=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});}
phoneClock();setInterval(phoneClock,60000);repaint();
document.querySelectorAll('[data-phone-chat]').forEach(button=>button.onclick=()=>openPhoneChat(button));
let chatClosing=false;
document.querySelector('.phone-home').onclick=()=>{
 if(chatClosing)return;
 const chat=document.querySelector('.chat');
 const finish=()=>{chatClosing=false;closeApp();document.body.classList.remove('phone-chat-open','phone-chat-closing');chatAnimation?.cancel();document.querySelector('.phone-chat-widget').setAttribute('aria-expanded','false');document.querySelector('[data-phone-chat]').focus({preventScroll:true});};
 const style=getComputedStyle(chat),from={clipPath:style.clipPath,opacity:style.opacity};
 chatAnimation?.cancel();
 if(!document.body.classList.contains('phone-chat-open')||!pointerInteraction||matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
 chatClosing=true;document.body.classList.add('phone-chat-closing');chatInput.blur();
 const target=document.querySelector('.phone-chat-widget').getBoundingClientRect(),rect=chat.getBoundingClientRect();
 chatAnimation=chat.animate([from,{clipPath:`inset(${Math.max(0,target.top-rect.top)}px ${Math.max(0,rect.right-target.right)}px ${Math.max(0,rect.bottom-target.bottom)}px ${Math.max(0,target.left-rect.left)}px round 24px)`,opacity:0}],{duration:200,easing:'cubic-bezier(.32,.72,0,1)',fill:'forwards'});
 chatAnimation.finished.then(finish).catch(()=>{chatClosing=false;document.body.classList.remove('phone-chat-closing');});
};
let homeStart;
const homeBar=document.querySelector('.phone-home');
homeBar.addEventListener('pointerdown',e=>{homeStart=e.clientY;homeBar.setPointerCapture(e.pointerId);});
homeBar.addEventListener('pointerup',e=>{if(homeStart-e.clientY>25)homeBar.click();homeStart=null;});
