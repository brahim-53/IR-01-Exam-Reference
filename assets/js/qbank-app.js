window.QBankApp={mount:function(host){
'use strict';
/* الواجهة تعمل داخل Shadow DOM كي لا تتداخل أنماطها مع أنماط المنصة */
const sr=host.shadowRoot||host.attachShadow({mode:'open'});
sr.innerHTML='<link rel="stylesheet" href="assets/css/qbank.css">'
 +'<nav class="tabs topnav" aria-label="تنقل بنك الأسئلة"><a data-nav="home" href="#/">البنوك</a><a data-nav="browse" href="#/browse">تصفّح</a><a data-nav="review" href="#/review">مراجعتي <span class="pill" id="revCount">0</span></a></nav><div id="app"></div>';
const $=(s,r=sr)=>r.querySelector(s);
const app=$('#app');
const L='ABCDE';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/&lt;(\/?)(sup|sub)&gt;/g,'<$1$2>');
/* نص عادي للقوائم المنسدلة (لا تعرض وسوم sup/sub) */
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',SUB='₀₁₂₃₄₅₆₇₈₉';
const uni=s=>String(s??'').replace(/<sup>(\d+)<\/sup>/g,(_,d)=>[...d].map(c=>SUP[c]).join('')).replace(/<sub>(\d+)<\/sub>/g,(_,d)=>[...d].map(c=>SUB[c]).join('')).replace(/<[^>]+>/g,'');

/* ---------- seeded RNG ---------- */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuffle(a,r=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/* ---------- bank A: answer at its original letter, hand-written distractors ---------- */
let rawC,rawD,rawE;const rawA=window.QB.A, rawB=window.QB.B;
const Q=[];
rawA.forEach(x=>{
  const r=rng(x.id*7919);
  let pos=L.indexOf(x.l);if(pos<0||pos>3)pos=Math.floor(r()*4);
  const opts=shuffle(x.d,r);opts.splice(pos,0,x.a);
  Q.push({key:'A-'+x.id,bank:'A',num:x.id,q:x.q,opts,ans:pos,ex:null,flag:null,cat:'RPO 2025',ansText:x.a});
});
rawB.forEach(x=>{
  Q.push({key:'B-'+x.id,bank:'B',num:x.id,q:x.q,opts:x.o,ans:x.a,ex:x.e,flag:x.f,cat:x.c,ansText:x.a!=null?x.o[x.a]:null});
});

rawC=window.QB.C||[];rawD=window.QB.D||[];rawE=window.QB.E||[];
rawC.forEach(x=>Q.push({key:'C-'+x.id,bank:'C',num:x.id,q:x.q,opts:x.o,ans:x.a,ex:x.e,flag:x.f,cat:x.c,ansText:x.a!=null?x.o[x.a]:null,ar:true,nokey:x.a==null}));
rawD.forEach(x=>Q.push({key:'D-'+x.id,bank:'D',num:x.id,q:x.q,opts:x.o,ans:x.a,ex:x.e,flag:x.f,cat:x.c,ansText:x.a!=null?x.o[x.a]:null,nokey:x.a==null}));
rawE.forEach(x=>Q.push({key:'E-'+x.id,bank:'E',num:x.id,q:x.q,opts:[],ans:null,ex:x.sol,flag:null,cat:x.ch,ansText:x.ans,open:true}));
const rawF=window.QB.F||[];
const PARTS=[...new Set(rawF.map(x=>x.c))];
rawF.forEach(x=>Q.push(x.m
  ?{key:'F-'+x.id,bank:'F',num:x.id,q:x.q,opts:[],ans:x.a,ex:x.e,flag:null,cat:x.c,match:x.m,ansText:x.m.l.map((l,k)=>l+' '+x.m.r[x.a[k]]).join('\n')}
  :{key:'F-'+x.id,bank:'F',num:x.id,q:x.q,opts:x.o,ans:x.a,ex:x.e,flag:null,cat:x.c,ansText:x.o[x.a]}));
const isOK=(q,p)=>q.match?(Array.isArray(p)&&q.ans.every((v,k)=>p[k]===v)):p===q.ans;
const isDone=(q,p)=>q.match?(Array.isArray(p)&&q.match.l.every((_,k)=>p[k]!=null)):p!=null;
const byKey=Object.fromEntries(Q.map(q=>[q.key,q]));
const BANKS={
  A:{title:'RPO 2025 — أسئلة الدورة',desc:'200 سؤال إجاباتها من الملف. الملف لم يتضمن الخيارات الخاطئة، فأضفنا لكل سؤال ثلاثة خيارات معقولة للتدريب.',cats:null},
  B:{title:'اختيار من متعدد — لوائح وفيزياء',desc:'197 سؤالًا بخياراتها الأصلية في قسمين: اللوائح، والفيزياء والحماية. الإجابات مقترحة، والحسابية منها مشروحة.',cats:['Regulations','Physics & Protection'],sug:true,short:null},
  C:{title:'نماذج أسئلة مسؤول الحماية (بالعربية)',desc:'أسئلة اختيار من متعدد بالعربية بخياراتها وإجاباتها كما وردت في الملف. استُبعدت الأسئلة التي لم تُستخرج خياراتها سليمة. بعضها بلا إجابة محددة وبعضها عليه ملاحظة مراجعة.',cats:null,short:'نماذج'},
  D:{title:'RSO 2023 — اختيار من متعدد',desc:'164 سؤالًا بخياراتها الأصلية، وإجاباتها من علامة ✅ في الملف. أربعة منها بلا إجابة محددة.',cats:null,short:'RSO 2023'},
  E:{title:'RSO 2023 — مسائل حسابية (بطاقات)',desc:'مسائل حسابية بجوابها النهائي وخطوات الحل المستخرجة من الملف، وقد تكون الصيغ فيها مشوّهة. للمذاكرة بالبطاقات فقط.',cats:null,short:'حسابية',flashOnly:true}
};
BANKS.F={title:'اختبار تجريبي — الحماية الإشعاعية',desc:'اختبار كامل من 75 سؤالًا في 5 أجزاء، مدته 180 دقيقة على نمط الاختبار الأصلي. الإجابات وُضعت بالحساب والمراجعة العلمية وليست مفتاحًا رسميًا، والأسئلة المشكوك فيها عليها ملاحظة.',cats:PARTS,sug:true,short:'تجريبي',perQ:144,wide:true,mode:'exam',n:'all',order:'seq'};
const BANK_IDS=Object.keys(BANKS);
const bankLab=q=>q.bank==='A'?'RPO':q.bank==='B'?CAT_AR[q.cat]:q.bank==='F'?'تجريبي · '+CAT_AR[q.cat]:BANKS[q.bank].short+(q.bank==='E'?' · '+q.cat:'');
const dirCls=q=>q.ar?'':'en';
const CAT_AR={'Regulations':'اللوائح','Physics & Protection':'الفيزياء والحماية','RPO 2025':'RPO 2025'};
PARTS.forEach((p,i)=>CAT_AR[p]='الجزء '+(i+1));

/* ---------- state (memory only) ---------- */
const S={
  wrong:new Set(),flags:new Set(),correct:new Set(),
  cfg:Object.fromEntries(Object.keys(BANKS).map(b=>[b,{mode:BANKS[b].flashOnly?'flash':(BANKS[b].mode||'practice'),n:BANKS[b].n||20,order:BANKS[b].order||'shuffle',cat:'all'}])),
  session:null
};
/* يتبع وضع المنصة (نهاري/ليلي) */
const syncTheme=()=>{host.setAttribute('data-theme',document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light')};
syncTheme();new MutationObserver(syncTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
function updRev(){$('#revCount').textContent=new Set([...S.wrong,...S.flags]).size}

/* ---------- router ---------- */
/* التوجيه داخلي (دون تغيير hash الصفحة) */
let V={path:'/',params:new URLSearchParams()},firstNav=true;
function parse(){return V}
function to(h){const [p,qs]=String(h).replace(/^#/,'').split('?');V={path:p||'/',params:new URLSearchParams(qs||'')};nav()}
sr.addEventListener('click',e=>{const t=e.target.closest('a[href^="#"]');if(!t)return;e.preventDefault();to(t.getAttribute('href'))});
function toTop(){if(firstNav){firstNav=false;return}host.scrollIntoView({block:'start'})}
function nav(){
  const {path,params}=parse();
  sr.querySelectorAll('.topnav a[data-nav]').forEach(a=>a.classList.toggle('on',('/'+(a.dataset.nav==='home'?'':a.dataset.nav))===path));
  stopTimer();
  if(path==='/quiz'&&S.session)renderQuiz();
  else if(path==='/result'&&S.session)renderResult();
  else if(path==='/browse')renderBrowse(params);
  else if(path==='/review')renderReview();
  else renderHome();
  toTop();
}

/* ---------- home ---------- */
function bankPool(b,cat){return Q.filter(q=>q.bank===b&&(cat==='all'||!cat||q.cat===cat))}
function renderHome(){
  const total=Q.length, done=S.correct.size+S.wrong.size;
  app.innerHTML=`
  <section class="hero">
    <div>
      <div class="eyebrow">استعداد اختبار مسؤول الحماية الإشعاعية</div>
      <h1>بنك أسئلة تدريبي يُظهر لك خطأك فور وقوعه</h1>
      <p>اختر البنك وطريقة المذاكرة: تدريب بتصحيح فوري، أو اختبار بوقت محدد، أو بطاقات للحفظ السريع. يحفظ الموقع أخطاءك والأسئلة التي علّمتها لتراجعها لاحقًا.</p>
    </div>
    <div class="stats">
      <div class="stat"><b>${total}</b><span>سؤالًا</span></div>
      <div class="stat"><b>${done}</b><span>حللتها في هذه الجلسة</span></div>
      <div class="stat"><b>${done?Math.round(S.correct.size/done*100):0}%</b><span>نسبة صحة إجاباتك</span></div>
    </div>
  </section>
  <div class="section-title">البنوك</div>
  <div class="banks">${BANK_IDS.filter(b=>!BANKS[b].wide).map(bankCard).join('')}</div>
  <div class="section-title">الاختبار التجريبي</div>
  <div class="banks one">${BANK_IDS.filter(b=>BANKS[b].wide).map(bankCard).join('')}</div>`;
  BANK_IDS.forEach(b=>wireBank(b));
}
function bankCard(b){
  const B=BANKS[b],c=S.cfg[b];
  const count=bankPool(b,c.cat).length;
  const modes=B.flashOnly?[['flash','بطاقات']]:[['practice','تدريب'],['exam','اختبار'],['flash','بطاقات']];
  const ns=[10,20,50,'all'];
  return `<article class="bank" data-bank="${b}">
    <div class="bank-h"><div><h2>${B.title}</h2><p>${B.desc}</p></div>${B.sug?'<span class="tag warn">إجابات مقترحة</span>':'<span class="tag">إجابات من الملف</span>'}</div>
    <div class="row" style="align-items:baseline;gap:8px"><span class="bigcount" data-count>${count}</span><span class="note" style="margin:0">سؤالًا متاحًا${B.wide?' · المدة الكاملة 180 دقيقة':''}</span></div>
    ${B.wide?`<ul class="partlist">${PARTS.map(p=>`<li>${esc(p)} <span>(${Q.filter(q=>q.bank===b&&q.cat===p).length})</span></li>`).join('')}</ul>`:''}
    ${B.cats?`<div class="field"><label>القسم</label><div class="seg" data-k="cat">
      ${[['all','الكل'],...B.cats.map(x=>[x,CAT_AR[x]])].map(([v,t])=>`<button data-v="${v}" class="${c.cat===v?'on':''}">${t}</button>`).join('')}</div></div>`:''}
    <div class="field"><label>الطريقة</label><div class="seg" data-k="mode">${modes.map(([v,t])=>`<button data-v="${v}" class="${c.mode===v?'on':''}">${t}</button>`).join('')}</div></div>
    <div class="field"><label>عدد الأسئلة</label><div class="seg" data-k="n">${ns.map(v=>`<button data-v="${v}" class="${String(c.n)===String(v)?'on':''}">${v==='all'?'الكل':v}</button>`).join('')}</div></div>
    <div class="field"><label>الترتيب</label><div class="seg" data-k="order"><button data-v="shuffle" class="${c.order==='shuffle'?'on':''}">عشوائي</button><button data-v="seq" class="${c.order==='seq'?'on':''}">بالتسلسل</button></div></div>
    <div class="row"><button class="btn" data-start>ابدأ</button><a class="btn ghost" href="#/browse?bank=${b}">تصفّح الأسئلة</a></div>
  </article>`;
}
function wireBank(b){
  const el=$(`.bank[data-bank="${b}"]`);
  el.querySelectorAll('.seg').forEach(seg=>seg.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    const k=seg.dataset.k;let v=t.dataset.v;if(k==='n'&&v!=='all')v=+v;
    S.cfg[b][k]=v;seg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===t));
    $('[data-count]',el).textContent=bankPool(b,S.cfg[b].cat).length;
  }));
  $('[data-start]',el).onclick=()=>{
    const c=S.cfg[b];let pool=bankPool(b,c.cat);
    if(c.order==='shuffle')pool=shuffle(pool);
    if(c.n!=='all')pool=pool.slice(0,c.n);
    startSession(pool,c.mode,BANKS[b].title,BANKS[b].wide?{perQ:BANKS[b].perQ,grid:true}:null);
  };
}

/* ---------- session ---------- */
function startSession(list,mode,title,opt){
  if(mode!=='flash'){list=list.filter(q=>!q.open);if(!list.length){alert('هذه الأسئلة حسابية وتُراجع بالبطاقات فقط.');return}}
  S.session={list:list.map(q=>q.key),mode,title,i:0,picks:{},revealed:{},start:Date.now(),limit:mode==='exam'?list.length*((opt&&opt.perQ)||60):0,grid:!!(opt&&opt.grid),done:false};
  to('/quiz');
}
let timerId=null;
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
function fmt(s){s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}

function renderQuiz(){
  const ss=S.session;const q=byKey[ss.list[ss.i]];const n=ss.list.length;
  const pick=ss.picks[q.key];const shown=ss.mode==='practice'&&isDone(q,pick);
  const flagged=S.flags.has(q.key);
  const answered=Object.keys(ss.picks).length;
  let body='';
  if(ss.mode==='flash'){
    const rev=ss.revealed[q.key];
    body=`<div class="qcard flash" id="flash">
      <div class="qtop"><span class="qnum">${bankLab(q)} · #${q.num}</span>${flagBtn(flagged)}</div>
      <p class="qtext ${dirCls(q)}">${esc(q.q)}</p>
      ${rev?`<div class="ans ${dirCls(q)}" ${q.match?'style="white-space:pre-line"':''}>${q.open||q.match?esc(q.ansText):q.ans!=null?L[q.ans]+'. '+esc(q.ansText):'—'}</div>${q.ex?`<div class="feedback na"><div class="ex en" style="white-space:pre-wrap">${esc(q.ex)}</div></div>`:''}${q.flag?`<div class="note">ملاحظة على السؤال: ${esc(q.flag)}</div>`:''}`:`<div class="hint">اضغط على البطاقة أو زر المسافة لإظهار الإجابة</div>`}
    </div>`;
  }else{
    body=`<div class="qcard">
      <div class="qtop"><span class="qnum">${bankLab(q)} · #${q.num}</span>${flagBtn(flagged)}</div>
      <p class="qtext ${dirCls(q)}">${esc(q.q)}</p>
      ${q.match?matchRows(q,pick,shown):`<div class="opts ${dirCls(q)}">${q.opts.map((o,i)=>{
        let cls='';
        if(shown){if(i===q.ans)cls='ok';else if(i===pick)cls='bad'}
        else if(i===pick)cls='sel';
        return `<button class="opt ${cls}" data-i="${i}" ${shown?'disabled':''}><span class="k">${L[i]}</span><span>${esc(o)}</span></button>`}).join('')}</div>`}
      ${shown?feedback(q,pick):''}
      ${q.flag?`<div class="note">ملاحظة على السؤال: ${esc(q.flag)}</div>`:''}
    </div>`;
  }
  app.innerHTML=`
  <div class="qhead">
    <div class="meta"><a class="btn ghost sm" href="#/">خروج</a><b style="color:var(--ink)">${esc(ss.title)}</b><span>· ${ss.mode==='practice'?'تدريب':ss.mode==='exam'?'اختبار':'بطاقات'}</span></div>
    <div class="meta"><span class="en" style="font-family:var(--mono)">${ss.i+1} / ${n}</span>${ss.mode==='exam'?`<span class="timer" id="timer">${fmt(ss.limit-(Date.now()-ss.start)/1000)}</span>`:''}</div>
  </div>
  <div class="progress"><i style="width:${(ss.mode==='flash'?(ss.i+1):answered)/n*100}%"></i></div>
  ${body}
  <div class="qnav">
    <button class="btn ghost" id="prev" ${ss.i===0?'disabled':''}>→ السابق</button>
    <div class="row">
      ${ss.mode!=='flash'?`<button class="btn ghost" id="finish">إنهاء وعرض النتيجة</button>`:''}
      <button class="btn" id="next">${ss.i===n-1?(ss.mode==='flash'?'إنهاء':'النتيجة'):'التالي ←'}</button>
    </div>
  </div>
  ${ss.grid?qmap(ss):''}
  <div class="kbd">اختصارات: A–E أو 1–5 للاختيار · Enter أو ← للتالي · F لتعليم السؤال</div>`;
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>choose(+b.dataset.i));
  app.querySelectorAll('.mrow select').forEach(el=>el.onchange=()=>chooseMatch(+el.dataset.k,el.value));
  app.querySelectorAll('.qgrid button').forEach(b=>b.onclick=()=>{ss.i=+b.dataset.i;renderQuiz();toTop()});
  $('.qmap')&&($('.qmap').ontoggle=e=>{ss.mapOpen=e.target.open});
  $('#flash')&&($('#flash').onclick=e=>{if(e.target.closest('.flag'))return;ss.revealed[q.key]=!ss.revealed[q.key];renderQuiz()});
  $('.flag')&&($('.flag').onclick=()=>toggleFlag(q.key));
  $('#prev').onclick=()=>go(-1);$('#next').onclick=()=>go(1);
  $('#finish')&&($('#finish').onclick=finish);
  if(ss.mode==='exam'){stopTimer();timerId=setInterval(()=>{const left=ss.limit-(Date.now()-ss.start)/1000;const t=$('#timer');if(t)t.textContent=fmt(left);if(left<=0){stopTimer();finish()}},500)}
}
function flagBtn(on){return `<button class="flag ${on?'on':''}" aria-pressed="${on}"><svg width="14" height="14" viewBox="0 0 24 24" fill="${on?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>${on?'معلَّم للمراجعة':'علِّم للمراجعة'}</button>`}
function matchRows(q,pick,shown){
  const p=Array.isArray(pick)?pick:[];
  return `<div class="match en">${q.match.l.map((l,k)=>{
    const st=shown?(p[k]===q.ans[k]?'ok':'bad'):'';
    return `<div class="mrow ${st}"><div class="ml">${esc(l)}</div><select data-k="${k}" ${shown?'disabled':''}><option value="">— اختر —</option>${q.match.r.map((r,j)=>`<option value="${j}" ${p[k]===j?'selected':''}>${esc(uni(r))}</option>`).join('')}</select>${shown&&st==='bad'?`<div class="mfix">✓ ${esc(uni(q.match.r[q.ans[k]]))}</div>`:''}</div>`}).join('')}</div>`;
}
function chooseMatch(k,v){
  const ss=S.session;const q=byKey[ss.list[ss.i]];
  if(ss.mode==='practice'&&isDone(q,ss.picks[q.key]))return;
  const cur=Array.isArray(ss.picks[q.key])?ss.picks[q.key]:[];
  const arr=q.match.l.map((_,i)=>cur[i]);arr[k]=v===''?undefined:+v;
  if(arr.every(x=>x==null))delete ss.picks[q.key];else ss.picks[q.key]=arr;
  if(ss.mode==='practice'&&isDone(q,arr))record(q,arr);
  renderQuiz();
}
function qmap(ss){
  return `<details class="qmap" ${ss.mapOpen?'open':''}><summary>خريطة الأسئلة · أُجيب ${Object.keys(ss.picks).length} من ${ss.list.length}</summary><div class="qgrid">${ss.list.map((k,i)=>`<button data-i="${i}" class="${[i===ss.i?'cur':'',ss.picks[k]!=null?'a':'',S.flags.has(k)?'f':''].join(' ')}">${i+1}</button>`).join('')}</div></details>`;
}
function feedback(q,pick){
  if(q.ans==null)return `<div class="feedback na"><b>${q.nokey?'لم تُحدَّد إجابة صحيحة في الملف':'لا يوجد خيار صحيح ضمن الخيارات'}</b><div class="ex">${esc(q.ex||'')}</div></div>`;
  const ok=isOK(q,pick);
  return `<div class="feedback ${ok?'ok':'bad'}"><b>${ok?'إجابة صحيحة':'إجابة خاطئة'}${ok?'':q.match?' — الصحيح مبيَّن بجانب كل بند':' — الصحيح: '+L[q.ans]}</b>${BANKS[q.bank].sug?'<span class="note" style="margin:0">إجابة مقترحة</span>':''}${q.ex?`<div class="ex">${esc(q.ex)}</div>`:''}</div>`;
}
function record(q,pick){
  if(q.ans==null)return;
  if(isOK(q,pick)){S.correct.add(q.key);S.wrong.delete(q.key)}else{S.wrong.add(q.key);S.correct.delete(q.key)}
  updRev();
}
function choose(i){
  const ss=S.session;const q=byKey[ss.list[ss.i]];
  if(ss.mode==='practice'&&ss.picks[q.key]!=null)return;
  ss.picks[q.key]=i;
  if(ss.mode==='practice')record(q,i);
  renderQuiz();
}
function toggleFlag(k){S.flags.has(k)?S.flags.delete(k):S.flags.add(k);updRev();renderQuiz()}
function go(d){
  const ss=S.session;const ni=ss.i+d;
  if(ni<0)return;
  if(ni>=ss.list.length){if(ss.mode==='flash'){to('/');return}finish();return}
  ss.i=ni;renderQuiz();toTop();
}
function finish(){
  const ss=S.session;stopTimer();
  if(ss.mode==='exam'&&!ss.done){ss.list.forEach(k=>{if(ss.picks[k]!=null)record(byKey[k],ss.picks[k])})}
  ss.done=true;ss.elapsed=(Date.now()-ss.start)/1000;
  to('/result');
}
function renderResult(){
  const ss=S.session;
  const items=ss.list.map(k=>byKey[k]).filter(q=>q.ans!=null);
  const right=items.filter(q=>isOK(q,ss.picks[q.key])).length;
  const skipped=items.filter(q=>ss.picks[q.key]==null).length;
  const pct=items.length?Math.round(right/items.length*100):0;
  const C=2*Math.PI*88;
  const wrongs=items.filter(q=>!isOK(q,ss.picks[q.key]));
  const parts=PARTS.map(p=>{const it=items.filter(q=>q.bank==='F'&&q.cat===p);return [p,it.filter(q=>isOK(q,ss.picks[q.key])).length,it.length]}).filter(x=>x[2]);
  app.innerHTML=`
  <div class="result">
    <div class="ring"><svg width="200" height="200"><circle cx="100" cy="100" r="88" stroke="var(--line)" stroke-width="14" fill="none"/>
      <circle cx="100" cy="100" r="88" stroke="${pct>=70?'var(--ok)':pct>=50?'var(--accent)':'var(--bad)'}" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}"/></svg><b>${pct}%</b></div>
    <div>
      <h2>${pct>=80?'أداء ممتاز':pct>=60?'أداء جيد، وفيه مجال للتحسن':'يحتاج مراجعة'}</h2>
      <p class="note" style="font-size:15px">${right} صحيحة من ${items.length} · ${wrongs.length-skipped} خاطئة · ${skipped} بلا إجابة · الوقت ${fmt(ss.elapsed)}</p>
      <div class="row" style="margin-top:14px">
        ${wrongs.length?`<button class="btn" id="redo">أعد الأسئلة الخاطئة (${wrongs.length})</button>`:''}
        <a class="btn ghost" href="#/">العودة للرئيسية</a>
      </div>
    </div>
  </div>
  ${parts.length?`<div class="section-title">النتيجة حسب الجزء</div><div class="parts">${parts.map(([p,r,n])=>`<div class="prow"><span>${esc(p)}</span><div class="pbar"><i style="width:${Math.round(r/n*100)}%"></i></div><b class="en">${r} / ${n}</b></div>`).join('')}</div>`:''}
  <div class="section-title">${wrongs.length?'مراجعة الأسئلة التي أخطأت فيها أو تركتها':'أجبت عن كل الأسئلة إجابة صحيحة'}</div>
  <div class="list">${wrongs.map(q=>itemHTML(q,ss.picks[q.key])).join('')}</div>`;
  $('#redo')&&($('#redo').onclick=()=>startSession(wrongs,'practice','إعادة الأخطاء'));
}
function itemHTML(q,pick,hl){
  const h=s=>hl?esc(s).replace(new RegExp('('+hl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')(?![^<]*>)','gi'),'<mark>$1</mark>'):esc(s);
  return `<div class="item">
    <div class="itop"><span class="qnum">${bankLab(q)} · #${q.num}</span>${BANKS[q.bank].sug?'<span class="tag warn">مقترحة</span>':''}</div>
    <p class="q ${dirCls(q)}">${h(q.q)}</p>
    ${pick!=null&&!q.match&&pick!==q.ans?`<div class="y">✗ ${L[pick]}. ${esc(q.opts[pick])}</div>`:''}
    <div class="a ${dirCls(q)}" ${q.match?'style="white-space:pre-line"':''}>${q.open||q.match?'✓ '+h(q.ansText):q.ans!=null?'✓ '+L[q.ans]+'. '+h(q.ansText):q.nokey?'— لم تُحدَّد إجابة في الملف':'— لا يوجد خيار صحيح'}</div>
    ${q.ex?`<div class="ex ${q.open?'en':''}" ${q.open?'style="white-space:pre-wrap"':''}>${esc(q.ex)}</div>`:''}
    ${q.flag?`<div class="ex">ملاحظة: ${esc(q.flag)}</div>`:''}
  </div>`;
}

/* ---------- browse ---------- */
let browseState={bank:'all',cat:'all',term:''};
function renderBrowse(params){
  if(params.get('bank'))browseState.bank=params.get('bank');
  app.innerHTML=`
  <div class="toolbar">
    <input class="search" id="term" type="search" placeholder="ابحث في الأسئلة والإجابات (بالإنجليزية)…" value="${esc(browseState.term)}">
    <div class="seg" id="bseg">${[['all','الكل'],['A','RPO 2025'],['B-Regulations','اللوائح'],['B-Physics & Protection','الفيزياء والحماية'],['C','نماذج بالعربية'],['D','RSO 2023'],['E','RSO 2023 حسابية'],['F','الاختبار التجريبي']].map(([v,t])=>`<button data-v="${v}">${t}</button>`).join('')}</div>
  </div>
  <p class="note" id="bcount"></p>
  <div class="list" id="blist"></div>`;
  const seg=$('#bseg');
  const cur=()=>browseState.bank==='B'&&browseState.cat!=='all'?'B-'+browseState.cat:browseState.bank;
  seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v===cur()));
  seg.onclick=e=>{const t=e.target.closest('button');if(!t)return;const v=t.dataset.v;
    if(v.startsWith('B-')){browseState.bank='B';browseState.cat=v.slice(2)}else{browseState.bank=v;browseState.cat='all'}
    seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===t));draw()};
  $('#term').oninput=e=>{browseState.term=e.target.value;draw()};
  draw();
  function draw(){
    const t=browseState.term.trim().toLowerCase();
    const list=Q.filter(q=>(browseState.bank==='all'||q.bank===browseState.bank)&&(browseState.cat==='all'||q.cat===browseState.cat)&&(!t||(q.q+' '+q.opts.join(' ')).replace(/<[^>]+>/g,'').toLowerCase().includes(t)));
    $('#bcount').textContent=list.length+' سؤالًا';
    $('#blist').innerHTML=list.length?list.slice(0,400).map(q=>itemHTML(q,null,t)).join(''):`<div class="empty"><h3>لا توجد نتائج</h3>جرّب كلمة أخرى، مثل dose أو TI أو shielding.</div>`;
  }
}

/* ---------- review ---------- */
function renderReview(){
  const keys=[...new Set([...S.wrong,...S.flags])];
  const qs=keys.map(k=>byKey[k]);
  app.innerHTML=`
  <div class="qhead"><div><h2 style="margin:0">مراجعتي</h2><p class="note" style="margin:0">${S.wrong.size} خاطئة · ${S.flags.size} معلَّمة</p></div>
  ${qs.length?`<div class="row"><button class="btn" id="go">تدرّب عليها الآن (${qs.length})</button><button class="btn ghost" id="clr">مسح القائمة</button></div>`:''}</div>
  ${qs.length?`<div class="list">${qs.map(q=>itemHTML(q)).join('')}</div>`:`<div class="empty"><h3>لا توجد أسئلة للمراجعة بعد</h3>ستظهر هنا الأسئلة التي أخطأت فيها أو علّمتها أثناء التدريب.<div style="margin-top:16px"><a class="btn" href="#/">ابدأ التدريب</a></div></div>`}`;
  $('#go')&&($('#go').onclick=()=>startSession(shuffle(qs),'practice','مراجعة الأخطاء والمعلَّمة'));
  $('#clr')&&($('#clr').onclick=()=>{S.wrong.clear();S.flags.clear();updRev();renderReview()});
}

/* ---------- keyboard ---------- */
addEventListener('keydown',e=>{
  if(parse().path!=='/quiz'||!S.session||e.target.matches('input,textarea,select'))return;
  const ss=S.session;const k=e.key.toLowerCase();
  const q=byKey[ss.list[ss.i]];
  if(ss.mode!=='flash'){
    let idx='abcde'.indexOf(k);if(idx<0)idx='12345'.indexOf(k);
    if(idx>=0&&idx<q.opts.length){choose(idx);return}
  }else if(k===' '){e.preventDefault();ss.revealed[q.key]=!ss.revealed[q.key];renderQuiz();return}
  if(k==='enter'||e.key==='ArrowLeft')go(1);
  else if(e.key==='ArrowRight')go(-1);
  else if(k==='f')toggleFlag(q.key);
});

updRev();nav();
}};
