/* قسم «قاموس المصطلحات» — تصفح، وضع تعلم، بطاقات، اختبارات قصيرة، متابعة التقدم، إدارة التصنيفات.
   البيانات: VOCAB_TERMS / VOCAB_CATEGORIES (vocab.js). التخزين: VocabStore (progress.js) عبر SafeStore. */
'use strict';

window.VocabApp = {
  mount(host) {
    if (!host || typeof VOCAB_TERMS === 'undefined') return;
    const V = VOCAB_TERMS;
    const byId = {};
    V.forEach((t) => { byId[t.id] = t; });
    let D = VocabStore.read();
    const save = () => VocabStore.write(D);

    /* ---------- أدوات ---------- */
    const MLAB = { new: 'جديد', learning: 'قيد التعلم', mastered: 'متقن' };
    const norm = (s) => Search.normalize(s);
    const rnd = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const st = (id) => Object.assign({ m: 'new', fav: false, hard: false, seen: 0, box: 0 }, D.terms[id] || {});
    const setT = (id, patch) => { D.terms[id] = Object.assign({}, st(id), patch, { at: Date.now() }); save(); };
    const touchSession = () => { D.lastSession = Date.now(); save(); };
    const fmtDate = (ts) => ts ? new Date(ts).toLocaleString('ar-SA-u-ca-gregory', { dateStyle: 'medium', timeStyle: 'short' }) : 'لا توجد جلسة بعد';

    const cats = () => VOCAB_CATEGORIES.map((c) => ({ id: c.id, ar: (D.cats.rename || {})[c.id] || c.ar, en: c.en, extra: c.extra }))
      .concat((D.cats.custom || []).map((c) => ({ id: c.id, ar: (D.cats.rename || {})[c.id] || c.ar, en: '', extra: true, custom: true })));
    const catOf = (t) => (D.cats.assign || {})[t.id] || t.c;
    const catName = (id) => { const c = cats().find((x) => x.id === id); return c ? c.ar : '—'; };

    /* ---------- النطق (Web Speech API) ---------- */
    const synth = window.speechSynthesis;
    const ttsOk = !!synth && typeof SpeechSynthesisUtterance !== 'undefined';
    let voices = [];
    let activeBtn = null;
    const setStatus = (msg, err) => { const s = host.querySelector('#vc-status'); if (s) { s.textContent = msg || ''; s.className = 'vc-status' + (err ? ' err' : ''); } };
    const cfg = () => Object.assign({ accent: 'en-US', voice: '', rate: '0.8' }, D.settings || {});
    function loadVoices() {
      if (!ttsOk) return;
      voices = synth.getVoices().filter((v) => /^en/i.test(v.lang));
      const sel = host.querySelector('#vc-voice');
      if (sel) {
        const c = cfg();
        sel.innerHTML = '<option value="">صوت تلقائي</option>' + voices.map((v) => `<option value="${esc(v.name)}">${esc(v.name)} (${esc(v.lang)})</option>`).join('');
        sel.value = c.voice || '';
      }
      if (!voices.length) setStatus('لا توجد أصوات إنجليزية على هذا الجهاز. جرّب Chrome أو Edge أو Safari.', true);
    }
    function pickVoice() {
      const c = cfg();
      let v = voices.find((x) => x.name === c.voice);
      if (!v) v = voices.find((x) => x.lang.toLowerCase().replace('_', '-') === c.accent.toLowerCase()) || voices[0];
      return v;
    }
    function stopSpeech() {
      if (ttsOk) synth.cancel();
      if (activeBtn) { activeBtn.classList.remove('is-on'); activeBtn = null; }
      setStatus('تم إيقاف النطق.');
    }
    function speak(text, slow, btn) {
      if (!ttsOk) { setStatus('متصفحك لا يدعم النطق الصوتي. استخدم Chrome أو Edge أو Safari حديثًا.', true); return; }
      const t = String(text || '').replace(/[\u0600-\u06FF]+/g, ' ').replace(/[\/_]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!/[A-Za-z]/.test(t)) { setStatus('لا يوجد نص إنجليزي لنطقه.', true); return; }
      synth.cancel();
      if (activeBtn) activeBtn.classList.remove('is-on');
      activeBtn = btn || null;
      if (btn) btn.classList.add('is-on');
      const u = new SpeechSynthesisUtterance(t);
      const v = pickVoice();
      u.lang = v ? v.lang : cfg().accent;
      if (v) u.voice = v;
      const r = parseFloat(cfg().rate) || 0.8;
      u.rate = slow ? Math.min(r, 0.6) : r;
      u.onstart = () => setStatus('جارٍ النطق: ' + (t.length > 45 ? t.slice(0, 45) + '…' : t));
      u.onend = () => { if (btn) btn.classList.remove('is-on'); if (activeBtn === btn) activeBtn = null; setStatus('انتهى النطق.'); };
      u.onerror = (e) => { if (btn) btn.classList.remove('is-on'); if (e.error !== 'canceled' && e.error !== 'interrupted') setStatus('تعذّر تشغيل الصوت (' + e.error + ').', true); };
      setTimeout(() => synth.speak(u), 60);
    }
    const speakBtn = (kind, id, label, slow) => `<button class="vc-b" type="button" data-say="${kind}" data-id="${id}"${slow ? ' data-slow="1"' : ''}>${label}</button>`;
    function sayText(t, kind) { return kind === 'def' ? t.def : kind === 'ex' ? t.ex : t.t; }

    /* ---------- الهيكل العام ---------- */
    host.innerHTML = `
      <div class="vc-voice" role="group" aria-label="إعدادات النطق">
        <span>🔊 النطق:</span>
        <select id="vc-accent" aria-label="اللهجة"><option value="en-US">English (US)</option><option value="en-GB">English (UK)</option></select>
        <select id="vc-voice" aria-label="الصوت"></select>
        <select id="vc-rate" aria-label="السرعة"><option value="0.6">بطيء جدًا</option><option value="0.8">بطيء</option><option value="1">عادي</option></select>
        <button class="vc-b vc-b-warn" type="button" id="vc-stop">⏹ إيقاف</button>
        <span id="vc-status" class="vc-status" aria-live="polite"></span>
      </div>
      <nav class="vc-tabs" aria-label="أقسام القاموس">
        <a class="vc-tab" data-tab="browse" href="#/">القاموس</a>
        <a class="vc-tab" data-tab="learn" href="#/learn">وضع التعلم</a>
        <a class="vc-tab" data-tab="cards" href="#/cards">البطاقات</a>
        <a class="vc-tab" data-tab="quiz" href="#/quiz">الاختبارات</a>
        <a class="vc-tab" data-tab="progress" href="#/progress">متابعة التقدم</a>
        <a class="vc-tab" data-tab="cats" href="#/cats">التصنيفات</a>
      </nav>
      <div id="vc-view"></div>`;
    const view = host.querySelector('#vc-view');
    const c0 = cfg();
    host.querySelector('#vc-accent').value = c0.accent;
    host.querySelector('#vc-rate').value = c0.rate;
    host.querySelector('#vc-accent').addEventListener('change', (e) => { D.settings = Object.assign(cfg(), { accent: e.target.value, voice: '' }); save(); loadVoices(); });
    host.querySelector('#vc-voice').addEventListener('change', (e) => { D.settings = Object.assign(cfg(), { voice: e.target.value }); save(); });
    host.querySelector('#vc-rate').addEventListener('change', (e) => { D.settings = Object.assign(cfg(), { rate: e.target.value }); save(); });
    host.querySelector('#vc-stop').addEventListener('click', stopSpeech);
    if (!ttsOk) setStatus('متصفحك لا يدعم النطق الصوتي. استخدم Chrome أو Edge أو Safari حديثًا.', true);
    else { loadVoices(); synth.addEventListener('voiceschanged', loadVoices); }

    /* النقر على أزرار النطق والمفضلة وغيرها (تفويض الأحداث) */
    host.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.say) {
        const t = byId[b.dataset.id];
        if (t) speak(sayText(t, b.dataset.say), !!b.dataset.slow, b);
      } else if (b.dataset.fav) {
        const id = b.dataset.fav;
        setT(id, { fav: !st(id).fav });
        b.textContent = st(id).fav ? '★' : '☆';
        b.setAttribute('aria-pressed', st(id).fav ? 'true' : 'false');
      }
    });

    /* ---------- التوجيه ---------- */
    function parseHash() {
      const raw = decodeURIComponent((location.hash || '#/').slice(1));
      const [path, query] = raw.split('?');
      const params = {};
      (query || '').split('&').forEach((p) => { const i = p.indexOf('='); if (i > 0) params[p.slice(0, i)] = p.slice(i + 1); });
      return { path: path || '/', params };
    }
    let navIds = [];      // ترتيب المصطلحات الحالي للتنقل بين التالي والسابق
    let lastRoute = '';
    function route() {
      stopSpeechQuiet();
      const { path, params } = parseHash();
      let tab = 'browse';
      if (path.startsWith('/learn')) { tab = 'learn'; renderLearn(params); }
      else if (path.startsWith('/cards')) { tab = 'cards'; renderCards(params); }
      else if (path.startsWith('/quiz')) { tab = 'quiz'; renderQuiz(params); }
      else if (path.startsWith('/progress')) { tab = 'progress'; renderProgress(); }
      else if (path.startsWith('/cats')) { tab = 'cats'; renderCats(); }
      else if (path.startsWith('/term/')) { renderDetail(parseInt(path.split('/')[2], 10)); }
      else { renderBrowse(params); }
      host.querySelectorAll('.vc-tab').forEach((a) => a.classList.toggle('is-active', a.dataset.tab === tab));
      lastRoute = path;
    }
    function stopSpeechQuiet() { if (ttsOk) synth.cancel(); activeBtn = null; }
    const go = (h) => { if (location.hash === h) route(); else location.hash = h; };
    window.addEventListener('hashchange', route);

    /* ---------- عناصر مشتركة ---------- */
    const importance = (t) => t.lv;
    const chips = (t) => {
      const s = st(t.id);
      return `<span class="vc-chip m-${s.m}">${MLAB[s.m]}</span>${s.hard ? '<span class="vc-chip m-hard">يحتاج مراجعة</span>' : ''}<span class="vc-chip">${esc(catName(catOf(t)))}</span>`;
    };
    const poolOptions = (sel) => {
      const opts = [['all', 'كل المصطلحات'], ['hard', 'الصعبة / تحتاج مراجعة'], ['new', 'الجديدة فقط'], ['learning', 'قيد التعلم'], ['fav', 'المفضلة']]
        .map(([v, l]) => `<option value="${v}"${sel === v ? ' selected' : ''}>${l}</option>`).join('');
      const cs = cats().map((c) => `<option value="cat:${c.id}"${sel === 'cat:' + c.id ? ' selected' : ''}>${esc(c.ar)}</option>`).join('');
      return opts + '<optgroup label="حسب الموضوع">' + cs + '</optgroup>';
    };
    function poolList(pool) {
      pool = pool || 'all';
      return V.filter((t) => {
        const s = st(t.id);
        if (pool === 'hard') return s.hard;
        if (pool === 'new') return s.m === 'new';
        if (pool === 'learning') return s.m === 'learning';
        if (pool === 'fav') return s.fav;
        if (pool.startsWith('cat:')) return catOf(t) === pool.slice(4);
        if (pool.startsWith('lesson:')) return (t.l || []).includes(pool.slice(7));
        return true;
      });
    }
    function sessionHeader(title, left, total) {
      const pct = total ? Math.round((left / total) * 100) : 0;
      return `<h2 style="font-size:1.1rem;margin-bottom:.3rem">${title}</h2><div class="vc-progress" role="img" aria-label="تقدم الجلسة"><span style="width:${pct}%"></span></div>`;
    }
    const lessonLinks = (t) => (t.l || []).map((k) => {
      const [sid, tid] = k.split(':');
      const sec = RPO_SECTIONS.find((s) => s.id === sid);
      const top = sec && getSectionTopics(sid).find((x) => x.id === tid);
      return sec && top ? `<a href="${sec.page}#${top.id}">${esc(sec.name.split('—')[0].trim())} ← ${esc(top.title)}</a>` : '';
    }).filter(Boolean);

    /* ================= القاموس (تصفح) ================= */
    const F = { q: '', cat: '', m: '', lv: '', fav: false, hard: false, sort: 'default', lesson: '', shown: 60 };
    function filtered() {
      const q = norm(F.q);
      let r = V.filter((t) => {
        const s = st(t.id);
        if (F.cat && catOf(t) !== F.cat) return false;
        if (F.m && s.m !== F.m) return false;
        if (F.lv && t.lv !== F.lv) return false;
        if (F.fav && !s.fav) return false;
        if (F.hard && !s.hard) return false;
        if (F.lesson && !(t.l || []).includes(F.lesson)) return false;
        if (q && !norm([t.t, t.ar, t.ap, t.def, t.defAr, t.ex].join(' ')).includes(q)) return false;
        return true;
      });
      if (F.sort === 'az') r = r.slice().sort((a, b) => a.t.localeCompare(b.t));
      else if (F.sort === 'za') r = r.slice().sort((a, b) => b.t.localeCompare(a.t));
      return r;
    }
    function renderBrowse(params) {
      if (params && params.cat) { F.cat = params.cat; }
      if (params && params.lesson) { F.lesson = params.lesson; F.shown = 60; }
      else if (params && params.clear) { F.lesson = ''; }
      const catOpts = '<option value="">كل الموضوعات</option>' + cats().map((c) => `<option value="${c.id}"${F.cat === c.id ? ' selected' : ''}>${esc(c.ar)}</option>`).join('');
      let lessonBanner = '';
      if (F.lesson) {
        const [sid, tid] = F.lesson.split(':');
        const sec = RPO_SECTIONS.find((s) => s.id === sid);
        const top = sec && getSectionTopics(sid).find((x) => x.id === tid);
        lessonBanner = `<div class="vc-feedback">المصطلحات المرتبطة بالدرس: <strong>${top ? esc(top.title) : esc(F.lesson)}</strong>
          ${top ? `<a href="${sec.page}#${top.id}">— فتح الدرس</a>` : ''} · <a href="#/?clear=1" data-clear-lesson>عرض كل المصطلحات</a></div>`;
      }
      view.innerHTML = `
        <div class="vc-warn">تصنيف الموضوعات أدناه تنظيم دراسي مبدئي من المنصة، ولم يُتحقق من كونه موضوعات رسمية للاختبار. التعريفات والأمثلة شروحات مبسطة من ملف القاموس المرفق، وليست نصًا منقولًا من لائحة رسمية.</div>
        ${lessonBanner}
        <div class="vc-filters">
          <input class="vc-search" type="search" id="f-q" placeholder="ابحث بالإنجليزية أو العربية…" aria-label="بحث" value="${esc(F.q)}">
          <select id="f-cat" aria-label="الموضوع">${catOpts}</select>
          <select id="f-m" aria-label="مستوى الإتقان">
            <option value="">كل مستويات الإتقان</option>${Object.keys(MLAB).map((k) => `<option value="${k}"${F.m === k ? ' selected' : ''}>${MLAB[k]}</option>`).join('')}
          </select>
          <select id="f-lv" aria-label="الأهمية (من ملف القاموس)">
            <option value="">كل مستويات الأهمية</option>${['أساسي', 'مهم', 'إضافي'].map((k) => `<option${F.lv === k ? ' selected' : ''}>${k}</option>`).join('')}
          </select>
          <select id="f-sort" aria-label="الفرز">
            <option value="default"${F.sort === 'default' ? ' selected' : ''}>الترتيب الأصلي</option>
            <option value="az"${F.sort === 'az' ? ' selected' : ''}>أبجدي A→Z</option>
            <option value="za"${F.sort === 'za' ? ' selected' : ''}>أبجدي Z→A</option>
          </select>
          <label class="vc-chk"><input type="checkbox" id="f-fav"${F.fav ? ' checked' : ''}> المفضلة فقط</label>
          <label class="vc-chk"><input type="checkbox" id="f-hard"${F.hard ? ' checked' : ''}> تحتاج مراجعة فقط</label>
        </div>
        <div class="vc-count" id="vc-count"></div>
        <div class="vc-list" id="vc-list"></div>
        <div style="text-align:center;margin:1rem 0"><button class="vc-b" type="button" id="vc-more" hidden>عرض المزيد</button></div>`;
      const bind = (id, key, isChk) => view.querySelector(id).addEventListener(isChk ? 'change' : 'input', (e) => { F[key] = isChk ? e.target.checked : e.target.value; F.shown = 60; drawList(); });
      bind('#f-q', 'q'); bind('#f-cat', 'cat'); bind('#f-m', 'm'); bind('#f-lv', 'lv'); bind('#f-sort', 'sort'); bind('#f-fav', 'fav', true); bind('#f-hard', 'hard', true);
      view.querySelector('#vc-more').addEventListener('click', () => { F.shown += 60; drawList(); });
      const cl = view.querySelector('[data-clear-lesson]');
      if (cl) cl.addEventListener('click', (e) => { e.preventDefault(); F.lesson = ''; history.replaceState(null, '', '#/'); renderBrowse(); });
      drawList();
    }
    function drawList() {
      const list = filtered();
      navIds = list.map((t) => t.id);
      view.querySelector('#vc-count').textContent = `${list.length} مصطلح من ${V.length}`;
      view.querySelector('#vc-list').innerHTML = list.slice(0, F.shown).map((t) => `
        <article class="vc-card">
          <div class="vc-card-top">
            <div>
              <span class="vc-term">${esc(t.t)}</span> <span class="vc-pos">${esc(t.pos)}</span>
              <div class="vc-ap">النطق التقريبي: ${esc(t.ap)}</div>
            </div>
            <button class="vc-star" type="button" data-fav="${t.id}" aria-label="مفضلة" aria-pressed="${st(t.id).fav}">${st(t.id).fav ? '★' : '☆'}</button>
          </div>
          <div class="vc-meaning">${esc(t.ar)}</div>
          <div class="vc-btns">
            ${speakBtn('term', t.id, '🔊 استمع')}
            ${speakBtn('term', t.id, '🐢 بطيء', true)}
            <a class="vc-b" href="#/term/${t.id}">التفاصيل</a>
          </div>
          <div>${chips(t)}</div>
        </article>`).join('') || '<p class="vc-note">لا توجد مصطلحات مطابقة للتصفية الحالية.</p>';
      view.querySelector('#vc-more').hidden = list.length <= F.shown;
    }

    /* ================= تفاصيل مصطلح ================= */
    function renderDetail(id) {
      const t = byId[id];
      if (!t) { go('#/'); return; }
      if (!navIds.includes(id)) navIds = filtered().map((x) => x.id);
      const i = navIds.indexOf(id);
      const s = st(id);
      const prev = i > 0 ? navIds[i - 1] : null;
      const next = i >= 0 && i < navIds.length - 1 ? navIds[i + 1] : null;
      const links = lessonLinks(t);
      if (!s.seen) setT(id, { seen: 1, m: s.m === 'new' ? 'learning' : s.m }); else setT(id, {});
      touchSession();
      const ctypes = cats().map((c) => `<option value="${c.id}"${catOf(t) === c.id ? ' selected' : ''}>${esc(c.ar)}</option>`).join('');
      view.innerHTML = `
        <p><a href="#/">← العودة إلى القاموس</a></p>
        <article class="vc-card">
          <div class="vc-card-top">
            <div><span class="vc-term" style="font-size:1.8rem">${esc(t.t)}</span> <span class="vc-pos">${esc(t.pos)}</span>
              <div class="vc-ap">النطق التقريبي بالعربية: <strong>${esc(t.ap)}</strong></div></div>
            <button class="vc-star" type="button" data-fav="${t.id}" aria-label="مفضلة" aria-pressed="${st(id).fav}">${st(id).fav ? '★' : '☆'}</button>
          </div>
          <div class="vc-meaning" style="font-size:1.15rem">${esc(t.ar)}</div>
          <div class="vc-btns">
            ${speakBtn('term', t.id, '🔊 المصطلح')}${speakBtn('term', t.id, '🐢 بطيء', true)}${speakBtn('def', t.id, '🎧 التعريف')}${t.ex ? speakBtn('ex', t.id, '🗣️ المثال') : ''}
          </div>
          <p class="vc-src">النطق الصوتي يعتمد على أصوات جهازك. رموز IPA غير متاحة في ملف القاموس المصدر ولذلك لا تُعرض.</p>
          <div class="vc-sec"><h4>التعريف المبسط (English)</h4><div class="vc-en">${esc(t.def)}</div></div>
          <div class="vc-sec"><h4>ترجمة التعريف</h4><div>${esc(t.defAr)}</div></div>
          ${t.ex ? `<div class="vc-sec"><h4>مثال</h4><div class="vc-en">«${esc(t.ex)}»</div><div>${esc(t.exAr)}</div></div>` : ''}
          <div class="vc-sec"><h4>التصنيف</h4>
            <div>${chips(t)}<span class="vc-chip">الموضوع في ملف القاموس: ${esc(t.src)}</span><span class="vc-chip">الأهمية: ${esc(importance(t))}</span></div>
            <label class="vc-src" style="display:block;margin-top:.4rem">نقل المصطلح إلى تصنيف آخر:
              <select id="d-cat" class="vc-input" style="max-width:22rem">${ctypes}</select></label>
          </div>
          <div class="vc-sec"><h4>المرجع</h4>
            <div class="vc-src">المرجع ورقم الصفحة: غير متاحين في ملف القاموس المصدر، ولذلك لا يُنسب هذا المصطلح إلى مرجع رسمي.</div>
            ${links.length ? `<div class="related-links" style="margin-top:.4rem"><span class="sr-label" style="align-self:center;font-size:.75rem;font-weight:700;color:var(--color-text-muted)">يرد في دروس المنصة:</span>${links.join('')}</div>` : '<div class="vc-src">لم يُعثر على هذا المصطلح في نصوص دروس المنصة الحالية.</div>'}
          </div>
          <div class="vc-sec"><h4>مستوى الإتقان</h4>
            <div class="vc-btns" id="d-m">${Object.keys(MLAB).map((k) => `<button class="vc-b${st(id).m === k ? ' is-on' : ''}" type="button" data-m="${k}">${MLAB[k]}</button>`).join('')}
              <button class="vc-b vc-b-warn${st(id).hard ? ' is-on' : ''}" type="button" id="d-hard">${st(id).hard ? '✓ يحتاج مراجعة' : 'تحديد كصعب / يحتاج مراجعة'}</button></div>
          </div>
        </article>
        <div class="vc-nav">
          ${prev ? `<a class="vc-b" href="#/term/${prev}">→ السابق: ${esc(byId[prev].t)}</a>` : '<span></span>'}
          ${next ? `<a class="vc-b" href="#/term/${next}">التالي: ${esc(byId[next].t)} ←</a>` : '<span></span>'}
        </div>`;
      view.querySelector('#d-cat').addEventListener('change', (e) => {
        D.cats.assign = D.cats.assign || {};
        if (e.target.value === t.c) delete D.cats.assign[t.id]; else D.cats.assign[t.id] = e.target.value;
        save(); toast('تم نقل المصطلح إلى: ' + catName(e.target.value));
      });
      view.querySelectorAll('#d-m [data-m]').forEach((b) => b.addEventListener('click', () => {
        setT(id, { m: b.dataset.m, hard: b.dataset.m === 'mastered' ? false : st(id).hard });
        renderDetail(id);
      }));
      view.querySelector('#d-hard').addEventListener('click', () => { setT(id, { hard: !st(id).hard }); renderDetail(id); });
    }
    document.addEventListener('keydown', (e) => {
      if (!/^\/term\//.test(parseHash().path) || /INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ''))) return;
      const id = parseInt(parseHash().path.split('/')[2], 10);
      const i = navIds.indexOf(id);
      /* في واجهة RTL: السهم الأيسر = التالي، الأيمن = السابق */
      if (e.key === 'ArrowLeft' && i >= 0 && i < navIds.length - 1) go('#/term/' + navIds[i + 1]);
      else if (e.key === 'ArrowRight' && i > 0) go('#/term/' + navIds[i - 1]);
    });

    /* ================= وضع التعلم ================= */
    let L = null;
    function renderLearn(params) {
      if (L && !params.restart) { drawLearn(); return; }
      const pool = params.pool || 'all';
      view.innerHTML = `
        <h2 style="font-size:1.1rem;margin-bottom:.4rem">وضع التعلم</h2>
        <p class="vc-note">يظهر المصطلح الإنجليزي أولًا مع النطق؛ حاول تذكر معناه ثم اكشف المعنى والتعريف.</p>
        <div class="vc-filters">
          <select id="l-pool" aria-label="المجموعة">${poolOptions(pool)}</select>
          <select id="l-n" aria-label="عدد المصطلحات"><option>10</option><option selected>20</option><option>40</option></select>
        </div>
        <button class="vc-b vc-b-primary" type="button" id="l-start">ابدأ الجلسة</button>
        <p class="vc-note" id="l-info"></p>`;
      const info = () => { const n = poolList(view.querySelector('#l-pool').value).length; view.querySelector('#l-info').textContent = `عدد المصطلحات في هذه المجموعة: ${n}`; };
      view.querySelector('#l-pool').addEventListener('change', info); info();
      view.querySelector('#l-start').addEventListener('click', () => {
        const list = poolList(view.querySelector('#l-pool').value);
        if (!list.length) { toast('لا توجد مصطلحات في هذه المجموعة.'); return; }
        /* الجديدة والصعبة أولًا */
        const ordered = list.slice().sort((a, b) => (st(b.id).hard - st(a.id).hard) || (st(a.id).seen - st(b.id).seen));
        const n = parseInt(view.querySelector('#l-n').value, 10);
        L = { q: ordered.slice(0, n).map((t) => t.id), i: 0, show: false, known: 0, hard: 0 };
        drawLearn();
      });
    }
    function drawLearn() {
      if (!L) { renderLearn({}); return; }
      if (L.i >= L.q.length) {
        touchSession();
        view.innerHTML = `<div class="vc-big"><h2>انتهت الجلسة 🎉</h2>
          <p>درست ${L.q.length} مصطلحًا — أتقنت ${L.known}، ووسمت ${L.hard} للمراجعة.</p>
          <div class="vc-btns"><button class="vc-b vc-b-primary" type="button" id="l-again">جلسة جديدة</button><a class="vc-b" href="#/cards">البطاقات التعليمية</a><a class="vc-b" href="#/quiz">اختبار قصير</a></div></div>`;
        view.querySelector('#l-again').addEventListener('click', () => { L = null; renderLearn({ restart: 1 }); });
        return;
      }
      const t = byId[L.q[L.i]];
      view.innerHTML = `${sessionHeader(`المصطلح ${L.i + 1} من ${L.q.length}`, L.i, L.q.length)}
        <div class="vc-big">
          <span class="vc-term">${esc(t.t)}</span><span class="vc-pos">${esc(t.pos)}</span>
          <div class="vc-btns" style="justify-content:center">${speakBtn('term', t.id, '🔊 استمع', false)}${speakBtn('term', t.id, '🐢 بطيء', true)}</div>
          ${L.show ? `
            <div class="vc-back">
              <div class="vc-ap">النطق التقريبي: ${esc(t.ap)}</div>
              <div class="vc-meaning" style="font-size:1.3rem">${esc(t.ar)}</div>
              <div class="vc-en" style="text-align:center">${esc(t.def)}</div>
              <div>${esc(t.defAr)}</div>
              ${t.ex ? `<div class="vc-en" style="text-align:center;margin-top:.5rem">«${esc(t.ex)}»</div><div>${esc(t.exAr)}</div>` : ''}
            </div>` : '<p class="vc-note">حاول تذكر المعنى قبل الكشف…</p>'}
        </div>
        <div class="vc-btns" style="justify-content:center">
          ${L.show ? `
            <button class="vc-b vc-b-warn" type="button" id="l-hard">صعب — أحتاج مراجعة</button>
            <button class="vc-b vc-b-ok" type="button" id="l-mast">أتقنته</button>
            <button class="vc-b vc-b-primary" type="button" id="l-next">التالي ←</button>`
          : '<button class="vc-b vc-b-primary" type="button" id="l-show">إظهار المعنى والتعريف</button>'}
        </div>`;
      const mark = () => { const s = st(t.id); setT(t.id, { seen: s.seen + 1, m: s.m === 'new' ? 'learning' : s.m }); };
      const q = (id) => view.querySelector(id);
      if (q('#l-show')) q('#l-show').addEventListener('click', () => { L.show = true; mark(); drawLearn(); });
      if (q('#l-hard')) q('#l-hard').addEventListener('click', () => { setT(t.id, { hard: true, m: 'learning', box: 0 }); L.hard++; L.show = false; L.i++; drawLearn(); });
      if (q('#l-mast')) q('#l-mast').addEventListener('click', () => { setT(t.id, { m: 'mastered', hard: false, box: 3 }); L.known++; L.show = false; L.i++; drawLearn(); });
      if (q('#l-next')) q('#l-next').addEventListener('click', () => { L.show = false; L.i++; drawLearn(); });
    }

    /* ================= البطاقات التعليمية ================= */
    let C = null;
    function renderCards(params) {
      if (C && !params.pool && !params.restart) { drawCard(); return; }
      const pool = params.pool || 'all';
      view.innerHTML = `
        <h2 style="font-size:1.1rem;margin-bottom:.4rem">البطاقات التعليمية</h2>
        <p class="vc-note">تُعرض المصطلحات الصعبة أولًا في كل جلسة، ثم الأقل إتقانًا.</p>
        <div class="vc-filters"><select id="c-pool" aria-label="المجموعة">${poolOptions(pool)}</select>
          <select id="c-n" aria-label="العدد"><option>10</option><option selected>20</option><option>40</option></select></div>
        <button class="vc-b vc-b-primary" type="button" id="c-start">ابدأ المراجعة</button>
        <p class="vc-note" id="c-info"></p>`;
      const info = () => { const n = poolList(view.querySelector('#c-pool').value).length; view.querySelector('#c-info').textContent = `عدد المصطلحات في هذه المجموعة: ${n}`; };
      view.querySelector('#c-pool').addEventListener('change', info); info();
      view.querySelector('#c-start').addEventListener('click', () => {
        const list = poolList(view.querySelector('#c-pool').value);
        if (!list.length) { toast('لا توجد مصطلحات في هذه المجموعة.'); return; }
        const ordered = rnd(list).sort((a, b) => {
          const sa = st(a.id), sb = st(b.id);
          return (sb.hard - sa.hard) || (sa.box - sb.box) || (sa.seen - sb.seen);
        });
        C = { q: ordered.slice(0, parseInt(view.querySelector('#c-n').value, 10)).map((t) => t.id), i: 0, flip: false, know: 0, again: [] };
        history.replaceState(null, '', '#/cards');
        drawCard();
      });
    }
    function drawCard() {
      if (!C) { renderCards({}); return; }
      if (C.i >= C.q.length) {
        touchSession();
        const hardN = poolList('hard').length;
        view.innerHTML = `<div class="vc-big"><h2>انتهت المراجعة</h2>
          <p>عرفت ${C.know} من ${C.q.length}، ووُسم ${C.again.length} للمراجعة لاحقًا.</p>
          <div class="vc-btns"><button class="vc-b vc-b-primary" type="button" id="c-hardrun"${hardN ? '' : ' disabled'}>مراجعة المصطلحات الصعبة (${hardN})</button>
          <button class="vc-b" type="button" id="c-new">مجموعة جديدة</button></div></div>`;
        view.querySelector('#c-hardrun').addEventListener('click', () => { C = null; go('#/cards?pool=hard&restart=1'); });
        view.querySelector('#c-new').addEventListener('click', () => { C = null; renderCards({ restart: 1 }); });
        return;
      }
      const t = byId[C.q[C.i]];
      view.innerHTML = `${sessionHeader(`البطاقة ${C.i + 1} من ${C.q.length}`, C.i, C.q.length)}
        <div class="vc-big">
          ${C.flip ? `
            <div class="vc-back">
              <span class="vc-term" style="font-size:1.4rem">${esc(t.t)}</span>
              <div class="vc-meaning" style="font-size:1.4rem">${esc(t.ar)}</div>
              <div class="vc-ap">النطق التقريبي: ${esc(t.ap)}</div>
              <div class="vc-en" style="text-align:center">${esc(t.def)}</div><div>${esc(t.defAr)}</div>
              ${t.ex ? `<div class="vc-en" style="text-align:center;margin-top:.4rem">«${esc(t.ex)}»</div><div>${esc(t.exAr)}</div>` : ''}
            </div>` : `
            <button type="button" class="vc-flip" id="c-flip" aria-label="اقلب البطاقة لإظهار المعنى">
              <span class="vc-term">${esc(t.t)}</span><br><span class="vc-pos">${esc(t.pos)}</span>
              <p class="vc-note">اضغط لقلب البطاقة (أو Enter / مسافة)</p></button>`}
          <div class="vc-btns" style="justify-content:center">${speakBtn('term', t.id, '🔊 استمع')}${speakBtn('term', t.id, '🐢 بطيء', true)}${C.flip && t.ex ? speakBtn('ex', t.id, '🗣️ المثال') : ''}</div>
        </div>
        <div class="vc-btns" style="justify-content:center">
          ${C.flip ? '' : '<button class="vc-b" type="button" id="c-flip2">إظهار المعنى</button>'}
          <button class="vc-b vc-b-warn" type="button" id="c-again">أحتاج إلى مراجعته</button>
          <button class="vc-b vc-b-ok" type="button" id="c-know">أعرفه</button>
        </div>`;
      const q = (id) => view.querySelector(id);
      const flip = () => { C.flip = true; drawCard(); setTimeout(() => { const b = view.querySelector('#c-know'); if (b) b.focus(); }, 30); };
      if (q('#c-flip')) { q('#c-flip').addEventListener('click', flip); q('#c-flip').focus(); }
      if (q('#c-flip2')) q('#c-flip2').addEventListener('click', flip);
      q('#c-know').addEventListener('click', () => {
        const s = st(t.id); const box = Math.min(4, s.box + 1);
        setT(t.id, { seen: s.seen + 1, box, m: box >= 3 ? 'mastered' : 'learning', hard: box >= 2 ? false : s.hard });
        C.know++; C.flip = false; C.i++; drawCard();
      });
      q('#c-again').addEventListener('click', () => {
        const s = st(t.id);
        setT(t.id, { seen: s.seen + 1, box: 0, hard: true, m: s.m === 'mastered' ? 'learning' : (s.m === 'new' ? 'learning' : s.m) });
        C.again.push(t.id); C.flip = false; C.i++; drawCard();
      });
    }

    /* ================= الاختبارات القصيرة ================= */
    let Q = null;
    const uniqTerms = (arr) => { const seen = new Set(); return arr.filter((t) => (seen.has(t.t) ? false : (seen.add(t.t), true))); };
    function distract(t, n, key) {
      const same = rnd(V.filter((x) => x.id !== t.id && x.t !== t.t && catOf(x) === catOf(t)));
      const other = rnd(V.filter((x) => x.id !== t.id && x.t !== t.t && catOf(x) !== catOf(t)));
      const out = []; const seen = new Set([String(t[key]).toLowerCase()]);
      for (const x of same.concat(other)) {
        const k = String(x[key]).toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k); out.push(x);
        if (out.length >= n) break;
      }
      return out;
    }
    const wordRe = (w) => new RegExp('(^|[^A-Za-z0-9])(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=$|[^A-Za-z0-9])', 'i');
    function maskWord(w) {
      let k = 0;
      return w.split('').map((ch) => { if (!/[A-Za-z]/.test(ch)) return ch; k++; return k === 1 || k % 2 === 1 ? ch : '_'; }).join('');
    }
    function buildQuestion(type, t) {
      const mkOpts = (correct, wrongs) => rnd([correct].concat(wrongs));
      if (type === 'meaning') {
        const o = mkOpts(t.ar, distract(t, 3, 'ar').map((x) => x.ar));
        return { type, t, title: 'اختر المعنى العربي الصحيح', prompt: `<span class="vc-term">${esc(t.t)}</span>`, speak: 1, opts: o, ans: t.ar, ltr: false,
          fb: `المعنى: <strong>${esc(t.ar)}</strong> — ${esc(t.defAr)}` };
      }
      if (type === 'term') {
        const o = mkOpts(t.t, distract(t, 3, 't').map((x) => x.t));
        return { type, t, title: 'اختر المصطلح الإنجليزي المناسب للتعريف', prompt: `<div class="vc-en">${esc(t.def)}</div><div class="vc-note">${esc(t.defAr)}</div>`, opts: o, ans: t.t, ltr: true,
          fb: `الإجابة: <strong>${esc(t.t)}</strong> — ${esc(t.ar)}` };
      }
      if (type === 'mcq') {
        const o = mkOpts(t.def, distract(t, 3, 'def').map((x) => x.def));
        return { type, t, title: 'Multiple choice', prompt: `<div class="vc-en">Which definition best matches the term <strong>“${esc(t.t)}”</strong>?</div>`, speak: 1, opts: o, ans: t.def, ltr: true,
          fb: `الشرح بالعربية: <strong>${esc(t.t)}</strong> تعني <strong>${esc(t.ar)}</strong> — ${esc(t.defAr)}` };
      }
      if (type === 'listen') {
        const o = mkOpts(t.t, distract(t, 3, 't').map((x) => x.t));
        return { type, t, title: 'استمع إلى المصطلح وحدد الكلمة الصحيحة', prompt: speakBtn('term', t.id, '🔊 استمع'), autoplay: 1, opts: o, ans: t.t, ltr: true,
          fb: `المصطلح: <strong>${esc(t.t)}</strong> — ${esc(t.ar)} (النطق التقريبي: ${esc(t.ap)})` };
      }
      if (type === 'cloze') {
        const re = t.ex ? wordRe(t.t) : null;
        const inEx = re && re.test(t.ex);
        const prompt = inEx
          ? `<div class="vc-en">${esc(t.ex.replace(re, (m, a) => a + '_____'))}</div><div class="vc-note">${esc(t.exAr)}</div>`
          : `<div class="vc-blank">${esc(maskWord(t.t))}</div><div class="vc-note">${esc(t.ar)} — ${esc(t.defAr)}</div>`;
        return { type, t, title: 'أكمل الكلمة الناقصة (اكتب بالإنجليزية)', prompt, input: 1, ans: t.t,
          fb: `الإجابة الصحيحة: <strong>${esc(t.t)}</strong> — ${esc(t.ar)}` };
      }
      return null;
    }
    function buildMatch(pool) {
      const items = uniqTerms(rnd(pool)).slice(0, 5);
      if (items.length < 3) return null;
      return { type: 'match', title: 'طابق المصطلحات مع معانيها', items, left: rnd(items), right: rnd(items), done: {}, errors: 0, sel: null };
    }
    const QTYPES = [['mixed', 'متنوعة'], ['meaning', 'اختر المعنى العربي'], ['term', 'اختر المصطلح للتعريف'], ['cloze', 'أكمل الكلمة'], ['match', 'مطابقة'], ['listen', 'استماع'], ['mcq', 'اختيار من متعدد (English)']];
    function renderQuiz(params) {
      if (Q && !params.restart) { drawQ(); return; }
      view.innerHTML = `
        <h2 style="font-size:1.1rem;margin-bottom:.4rem">الاختبارات القصيرة</h2>
        <div class="vc-warn">أسئلة تدريبية مُنشأة تلقائيًا من مصطلحات القاموس لأغراض التعلم، وليست من الاختبار الرسمي.</div>
        <div class="vc-filters">
          <select id="q-type" aria-label="نوع الأسئلة">${QTYPES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>
          <select id="q-pool" aria-label="المجموعة">${poolOptions(params.pool || 'all')}</select>
          <select id="q-n" aria-label="عدد الأسئلة"><option>5</option><option selected>10</option><option>20</option></select>
        </div>
        <button class="vc-b vc-b-primary" type="button" id="q-start">ابدأ الاختبار</button>`;
      view.querySelector('#q-start').addEventListener('click', () => {
        const pool = poolList(view.querySelector('#q-pool').value);
        if (pool.length < 4) { toast('المجموعة صغيرة جدًا — اختر مجموعة فيها 4 مصطلحات على الأقل.'); return; }
        const type = view.querySelector('#q-type').value;
        const n = parseInt(view.querySelector('#q-n').value, 10);
        const terms = uniqTerms(rnd(pool));
        const types = type === 'mixed' ? ['meaning', 'term', 'cloze', 'mcq', 'match', 'listen'] : [type];
        const qs = [];
        let k = 0;
        while (qs.length < n && k < n * 4) {
          const ty = types[k % types.length]; const t = terms[k % terms.length]; k++;
          if (ty === 'listen' && !ttsOk) continue;
          const q = ty === 'match' ? buildMatch(pool) : buildQuestion(ty, t);
          if (q) qs.push(q);
        }
        if (!qs.length) { toast('تعذر إنشاء أسئلة لهذا النوع.'); return; }
        Q = { qs, i: 0, score: 0, type, pool: view.querySelector('#q-pool').value, answered: false };
        history.replaceState(null, '', '#/quiz');
        drawQ();
      });
    }
    function finishQuiz() {
      touchSession();
      const total = Q.qs.length; const score = Math.round(Q.score * 10) / 10;
      D.quiz.push({ at: Date.now(), type: Q.type, score, total, pool: Q.pool });
      D.quiz = D.quiz.slice(-100); save();
      const pct = Math.round((score / total) * 100);
      view.innerHTML = `<div class="vc-big"><h2>نتيجة الاختبار</h2>
        <div style="font-size:2rem;font-weight:700;color:var(--color-primary)">${score} / ${total} (${pct}%)</div>
        <p class="vc-note">أسئلة تدريبية مُنشأة من القاموس — ليست من الاختبار الرسمي. المصطلحات التي أخطأت فيها وُسمت «تحتاج مراجعة».</p>
        <div class="vc-btns"><button class="vc-b vc-b-primary" type="button" id="q-again">اختبار جديد</button><a class="vc-b" href="#/cards?pool=hard&restart=1">مراجعة الصعبة</a><a class="vc-b" href="#/progress">متابعة التقدم</a></div></div>`;
      view.querySelector('#q-again').addEventListener('click', () => { Q = null; renderQuiz({ restart: 1 }); });
    }
    function wrong(t) { const s = st(t.id); setT(t.id, { hard: true, box: 0, m: s.m === 'mastered' ? 'learning' : (s.m === 'new' ? 'learning' : s.m) }); }
    function right(t) { const s = st(t.id); setT(t.id, { seen: s.seen + 1 }); }
    function drawQ() {
      if (!Q) { renderQuiz({}); return; }
      if (Q.i >= Q.qs.length) { finishQuiz(); Q = null; return; }
      const q = Q.qs[Q.i];
      const head = `${sessionHeader(`السؤال ${Q.i + 1} من ${Q.qs.length}`, Q.i, Q.qs.length)}<p class="vc-note">${esc(q.title)} · <em>سؤال تدريبي مُنشأ من القاموس</em></p>`;
      if (q.type === 'match') { drawMatch(q, head); return; }
      const body = q.input
        ? `<div class="vc-card">${q.prompt}<div class="vc-btns"><input class="vc-input" id="q-in" style="direction:ltr;max-width:20rem" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="اكتب الإجابة"><button class="vc-b vc-b-primary" type="button" id="q-check">تحقق</button></div></div>`
        : `<div class="vc-card">${q.prompt}${q.speak ? `<div class="vc-btns">${speakBtn('term', q.t.id, '🔊 استمع')}</div>` : ''}</div>
           <div class="vc-opts" role="group">${q.opts.map((o, i) => `<button class="vc-opt${q.ltr ? ' ltr' : ''}" type="button" data-o="${i}">${esc(o)}</button>`).join('')}</div>`;
      view.innerHTML = head + body + '<div id="q-fb"></div><div class="vc-btns"><button class="vc-b vc-b-primary" type="button" id="q-next" hidden>التالي ←</button></div>';
      Q.answered = false;
      const done = (ok) => {
        Q.answered = true;
        if (ok) { Q.score += 1; right(q.t); } else wrong(q.t);
        view.querySelector('#q-fb').innerHTML = `<div class="vc-feedback">${ok ? '✅ إجابة صحيحة. ' : '❌ إجابة غير صحيحة. '}${q.fb}</div>`;
        const nx = view.querySelector('#q-next'); nx.hidden = false; nx.textContent = Q.i + 1 >= Q.qs.length ? 'عرض النتيجة' : 'التالي ←'; nx.focus();
      };
      view.querySelector('#q-next').addEventListener('click', () => { Q.i++; drawQ(); });
      if (q.input) {
        const check = () => {
          if (Q.answered) return;
          const nz = (s) => String(s).toLowerCase().replace(/[\s\-_]+/g, ' ').trim();
          done(nz(view.querySelector('#q-in').value) === nz(q.ans));
          view.querySelector('#q-in').disabled = true;
        };
        view.querySelector('#q-check').addEventListener('click', check);
        view.querySelector('#q-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
        view.querySelector('#q-in').focus();
      } else {
        view.querySelectorAll('.vc-opt').forEach((b) => b.addEventListener('click', () => {
          if (Q.answered) return;
          const pick = q.opts[parseInt(b.dataset.o, 10)];
          view.querySelectorAll('.vc-opt').forEach((x) => { x.disabled = true; if (q.opts[parseInt(x.dataset.o, 10)] === q.ans) x.classList.add('is-right'); });
          if (pick !== q.ans) b.classList.add('is-wrong');
          done(pick === q.ans);
        }));
        if (q.autoplay) setTimeout(() => { const sb = view.querySelector('[data-say]'); if (sb) speak(q.t.t, false, sb); }, 250);
      }
    }
    function drawMatch(q, head) {
      const remaining = q.items.length - Object.keys(q.done).length;
      view.innerHTML = head + `<div class="vc-match">
        <div class="col">${q.left.map((t) => `<button class="vc-opt ltr${q.done[t.id] ? ' is-done' : ''}${q.sel === t.id ? ' is-sel' : ''}" type="button" data-l="${t.id}"${q.done[t.id] ? ' disabled' : ''}>${esc(t.t)}</button>`).join('')}</div>
        <div class="col">${q.right.map((t) => `<button class="vc-opt${q.done[t.id] ? ' is-done' : ''}" type="button" data-r="${t.id}"${q.done[t.id] ? ' disabled' : ''}>${esc(t.ar)}</button>`).join('')}</div></div>
        <p class="vc-note">اختر مصطلحًا ثم معناه. الأخطاء: ${q.errors}</p><div id="q-fb"></div>
        <div class="vc-btns"><button class="vc-b vc-b-primary" type="button" id="q-next"${remaining ? ' hidden' : ''}>${Q.i + 1 >= Q.qs.length ? 'عرض النتيجة' : 'التالي ←'}</button></div>`;
      if (!remaining && !q.scored) {
        q.scored = true;
        const sc = Math.max(0, (q.items.length - q.errors) / q.items.length);
        Q.score += sc;
        q.items.forEach((t) => ((q.bad && q.bad[t.id]) ? wrong(t) : right(t)));
        view.querySelector('#q-fb').innerHTML = `<div class="vc-feedback">✅ اكتملت المطابقة — الأخطاء: ${q.errors}.</div>`;
      }
      view.querySelector('#q-next').addEventListener('click', () => { Q.i++; drawQ(); });
      view.querySelectorAll('[data-l]').forEach((b) => b.addEventListener('click', () => { q.sel = parseInt(b.dataset.l, 10); drawMatch(q, head); }));
      view.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => {
        if (!q.sel) { toast('اختر المصطلح الإنجليزي أولًا.'); return; }
        const rid = parseInt(b.dataset.r, 10);
        if (rid === q.sel) { q.done[rid] = true; q.sel = null; }
        else { q.errors++; q.bad = q.bad || {}; q.bad[q.sel] = true; q.bad[rid] = true; q.sel = null; toast('غير صحيح، حاول مرة أخرى.'); }
        drawMatch(q, head);
      }));
    }

    /* ================= متابعة التقدم ================= */
    function renderProgress() {
      const total = V.length;
      const studied = V.filter((t) => st(t.id).seen > 0).length;
      const mastered = V.filter((t) => st(t.id).m === 'mastered').length;
      const learning = V.filter((t) => st(t.id).m === 'learning').length;
      const hard = V.filter((t) => st(t.id).hard).length;
      const favs = V.filter((t) => st(t.id).fav).length;
      const pct = Math.round((mastered / total) * 100);
      const qz = D.quiz.slice();
      const avg = qz.length ? Math.round((qz.reduce((a, x) => a + x.score / x.total, 0) / qz.length) * 100) : null;
      const qlabel = (k) => (QTYPES.find((x) => x[0] === k) || [0, k])[1];
      const rows = qz.slice(-8).reverse().map((x) => `<tr><td>${fmtDate(x.at)}</td><td>${esc(qlabel(x.type))}</td><td>${x.score} / ${x.total}</td><td>${Math.round((x.score / x.total) * 100)}%</td></tr>`).join('');
      const byCat = cats().map((c) => {
        const list = V.filter((t) => catOf(t) === c.id);
        if (!list.length) return '';
        const m = list.filter((t) => st(t.id).m === 'mastered').length;
        return `<tr><td>${esc(c.ar)}${c.extra ? ' <span class="vc-src">(مساندة)</span>' : ''}</td><td>${m} / ${list.length}</td><td style="width:35%"><div class="vc-progress"><span style="width:${Math.round(m / list.length * 100)}%"></span></div></td></tr>`;
      }).join('');
      view.innerHTML = `
        <h2 style="font-size:1.1rem;margin-bottom:.4rem">متابعة التقدم</h2>
        <div class="vc-stats">
          <div class="vc-stat"><b>${total}</b><span>إجمالي المصطلحات</span></div>
          <div class="vc-stat"><b>${studied}</b><span>تمت دراستها</span></div>
          <div class="vc-stat"><b>${mastered}</b><span>متقنة</span></div>
          <div class="vc-stat"><b>${hard}</b><span>تحتاج مراجعة</span></div>
          <div class="vc-stat"><b>${learning}</b><span>قيد التعلم</span></div>
          <div class="vc-stat"><b>${favs}</b><span>مفضلة</span></div>
        </div>
        <p><strong>نسبة التقدم الإجمالية (المتقن / الكل):</strong> ${pct}%</p>
        <div class="vc-progress" role="img" aria-label="نسبة التقدم"><span style="width:${pct}%"></span></div>
        <p class="vc-note">آخر جلسة تعلم: ${fmtDate(D.lastSession)}</p>
        <div class="vc-card" style="margin:.8rem 0">
          <strong>اقتراح جلسة مراجعة</strong>
          <p class="vc-note">${hard ? `لديك ${hard} مصطلحًا يحتاج إلى مراجعة.` : 'لا توجد مصطلحات صعبة حاليًا — جرّب وضع التعلم لمصطلحات جديدة.'}</p>
          <div class="vc-btns">${hard ? '<a class="vc-b vc-b-primary" href="#/cards?pool=hard&restart=1">ابدأ مراجعة الصعبة (بطاقات)</a><a class="vc-b" href="#/quiz?pool=hard&restart=1">اختبرني فيها</a>' : '<a class="vc-b vc-b-primary" href="#/learn?pool=new&restart=1">تعلّم مصطلحات جديدة</a>'}</div>
        </div>
        <h3 style="font-size:1rem;margin:1rem 0 .4rem">نتائج الاختبارات ${avg === null ? '' : `— المتوسط ${avg}%`}</h3>
        ${rows ? `<table class="vc-table"><thead><tr><th>التاريخ</th><th>النوع</th><th>الدرجة</th><th>النسبة</th></tr></thead><tbody>${rows}</tbody></table>` : '<p class="vc-note">لم تجرِ أي اختبار بعد.</p>'}
        <h3 style="font-size:1rem;margin:1rem 0 .4rem">الإتقان حسب الموضوع</h3>
        <table class="vc-table"><tbody>${byCat}</tbody></table>
        <h3 style="font-size:1rem;margin:1rem 0 .4rem">النسخ الاحتياطي</h3>
        <p class="vc-note">${window.PERSISTENT_STORAGE ? 'التقدم محفوظ في تخزين هذا المتصفح على هذا الجهاز فقط (لا ينتقل بين الأجهزة، ويُمسح إن مسحت بيانات المتصفح).' : 'التخزين الدائم غير متاح في هذه البيئة؛ يُحفظ التقدم لهذه الجلسة فقط.'} استخدم التصدير للاحتفاظ بنسخة، والاستيراد لاسترجاعها. النسخة تشمل تقدم الدروس والقاموس معًا.</p>
        <div class="vc-btns"><button class="vc-b" type="button" id="p-exp">تصدير نسخة احتياطية</button><button class="vc-b" type="button" id="p-imp">استيراد نسخة</button>
          <button class="vc-b vc-b-warn" type="button" id="p-reset">تصفير تقدم القاموس</button><input type="file" accept="application/json" id="p-file" class="sr-only"></div>`;
      view.querySelector('#p-exp').addEventListener('click', () => { Progress.exportJSON(); toast('تم تنزيل النسخة الاحتياطية.'); });
      view.querySelector('#p-imp').addEventListener('click', () => view.querySelector('#p-file').click());
      view.querySelector('#p-file').addEventListener('change', async (e) => {
        const f = e.target.files[0]; if (!f) return;
        try { await Progress.importJSON(f); D = VocabStore.read(); toast('تم الاستيراد.'); renderProgress(); } catch (err) { toast('تعذر الاستيراد: ' + err.message); }
      });
      view.querySelector('#p-reset').addEventListener('click', () => {
        if (!confirm('سيُمسح تقدم القاموس (الإتقان والمفضلة ونتائج الاختبارات) من هذا المتصفح. هل أنت متأكد؟')) return;
        const keep = D.cats; D = VocabStore.empty(); D.cats = keep; save(); renderProgress();
      });
    }

    /* ================= إدارة التصنيفات ================= */
    function renderCats() {
      const rows = cats().map((c) => {
        const n = V.filter((t) => catOf(t) === c.id).length;
        return `<tr><td><input class="vc-input" data-rename="${c.id}" value="${esc(c.ar)}" aria-label="اسم التصنيف"></td>
          <td>${n}</td><td>${c.extra ? 'مساند' : 'أساسي'}</td>
          <td>${c.custom ? `<button class="vc-b vc-b-warn" type="button" data-del="${c.id}">حذف</button>` : ''}<a class="vc-b" href="#/?cat=${c.id}" data-view-cat="${c.id}">عرض</a></td></tr>`;
      }).join('');
      view.innerHTML = `
        <h2 style="font-size:1.1rem;margin-bottom:.4rem">التصنيفات</h2>
        <div class="vc-warn">التصنيفات تنظيم دراسي مبدئي أعدته المنصة، ولم يُتحقق من كونها موضوعات رسمية للاختبار. عدّل الأسماء أو أضف تصنيفات، ويمكنك نقل أي مصطلح إلى تصنيف آخر من صفحة تفاصيله.</div>
        <table class="vc-table"><thead><tr><th>الاسم (قابل للتعديل)</th><th>المصطلحات</th><th>النوع</th><th></th></tr></thead><tbody>${rows}</tbody></table>
        <div class="vc-btns" style="margin-top:.8rem"><input class="vc-input" id="cat-new" placeholder="اسم تصنيف جديد" style="max-width:20rem"><button class="vc-b vc-b-primary" type="button" id="cat-add">إضافة تصنيف</button></div>`;
      view.querySelectorAll('[data-rename]').forEach((i) => i.addEventListener('change', () => {
        const v = i.value.trim(); if (!v) return;
        const id = i.dataset.rename; D.cats.rename = D.cats.rename || {}; D.cats.rename[id] = v;
        const cc = (D.cats.custom || []).find((x) => x.id === id); if (cc) cc.ar = v;
        save(); toast('تم حفظ الاسم.');
      }));
      view.querySelectorAll('[data-view-cat]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); F.cat = a.dataset.viewCat; F.lesson = ''; go('#/'); }));
      view.querySelector('#cat-add').addEventListener('click', () => {
        const v = view.querySelector('#cat-new').value.trim(); if (!v) return;
        D.cats.custom = D.cats.custom || []; D.cats.custom.push({ id: 'u' + Date.now().toString(36), ar: v }); save(); renderCats();
      });
      view.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
        const id = b.dataset.del;
        D.cats.custom = D.cats.custom.filter((c) => c.id !== id);
        Object.keys(D.cats.assign || {}).forEach((k) => { if (D.cats.assign[k] === id) delete D.cats.assign[k]; });
        save(); renderCats();
      }));
    }

    route();
  }
};
