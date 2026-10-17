/* منطق الصفحات: الرئيسية (الخريطة) + صفحات الأقسام + صفحة المسائل */
'use strict';

/* ---------- الصفحة الرئيسية ---------- */
function renderHomePage() {
  const main = document.querySelector('[data-main]');
  const data = Progress.read();
  const last = data.lastTopic;

  /* البطاقات */
  const cards = RPO_SECTIONS.map((sec) => {
    const topics = getSectionTopics(sec.id);
    const stats = Progress.sectionStats(sec.id, topics);
    const isQ = sec.id === 'qbank';
    const totalReal = sec.contentState === 'ready' && !isQ ? stats.total : 0;
    const pct = totalReal > 0 ? Math.round((stats.complete / totalReal) * 100) : 0;
    const statePill = sec.contentState === 'pending'
      ? '<span class="pill pill-pending">بانتظار نقل المحتوى</span>'
      : (isQ ? '<span class="pill pill-ready">محتوى مكتمل</span>' : stats.started === 0 && stats.total > 0
          ? '<span class="pill pill-ready">جاهز للدراسة</span>'
          : '<span class="pill pill-ready">محتوى مكتمل</span>');
    const nextHint = sectionNextHint(sec, stats);
    return `
    <article class="section-card">
      <span class="sec-num">${sec.num}</span>
      <h2>${esc(sec.name)}</h2>
      <p class="sec-desc">${esc(sec.desc)}</p>
      <div class="sec-meta">
        ${statePill}
        ${isQ ? `<span class="pill pill-ready">${sec.questionCount} سؤالًا</span>` : sec.contentState === 'ready' ? `<span class="pill pill-ready">${stats.total} موضوعًا${stats.started > 0 ? ` — بدأت ${stats.started}` : ''}</span>` : ''}
      </div>
      ${sec.contentState === 'ready' && !isQ ? `
      <div class="progress-track" role="img" aria-label="نسبة التقدم">
        <div class="progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="sec-meta" style="margin-top:0.4rem">
        <span>قيد الدراسة: ${stats.studying}</span><span>مكتمل: ${stats.complete}</span><span>يحتاج مراجعة: ${stats.review}</span>
      </div>` : ''}
      <div class="sec-next">${nextHint}</div>
      <a class="btn btn-ghost" href="${sec.page}" style="margin-top:0.6rem;align-self:flex-start">افتح القسم</a>
    </article>`;
  }).join('');

  /* لوحة الاستئناف */
  const resumeHtml = last
    ? `<div class="resume-card">
        <span class="rc-label">آخر موضوع درسته:</span>
        <span class="rc-topic">${esc(last.title)}</span>
        <a class="btn btn-sm" href="${resumeUrl(last)}">متابعة الدراسة</a>
        <button class="btn btn-ghost btn-sm" type="button" data-clear-resume>إخفاء</button>
      </div>` : '';

  /* المسار التعليمي */
  const flow = renderPathFlow();

  /* لوحات المتابعة */
  const reviewTopics = Progress.topicsByStatus('review');
  const studying = Progress.topicsByStatus('studying');
  const complete = Progress.topicsByStatus('complete');
  const reviewPanel = reviewTopics.length
    ? `<ul>${reviewTopics.slice(0, 8).map((r) => `<li><span class="tag-dot dot-review"></span><a href="${r.section.page}#${r.topic.id}">${esc(r.topic.title)}</a></li>`).join('')}${reviewTopics.length > 8 ? `<li class="empty-note">و${reviewTopics.length - 8} موضوعات أخرى…</li>` : ''}</ul>`
    : '<p class="empty-note">لا توجد موضوعات موسومة «يحتاج مراجعة» بعد — استخدم زر الحالة داخل أي موضوع.</p>';
  const studyingPanel = studying.length
    ? `<ul>${studying.slice(0, 8).map((r) => `<li><span class="tag-dot dot-studying"></span><a href="${r.section.page}#${r.topic.id}">${esc(r.topic.title)}</a></li>`).join('')}</ul>`
    : '<p class="empty-note">لم تبدأ أي موضوع بعد. ابدأ من «التدريب النظري — الموضوع 1» أو من القسم الذي تفضله.</p>';
  const completePanel = complete.length
    ? `<ul>${complete.slice(0, 8).map((r) => `<li><span class="tag-dot dot-complete"></span><a href="${r.section.page}#${r.topic.id}">${esc(r.topic.title)}</a></li>`).join('')}${complete.length > 8 ? `<li class="empty-note">و${complete.length - 8} موضوعات أخرى…</li>` : ''}</ul>`
    : '<p class="empty-note">لم تكمل أي موضوع بعد. لا تُعرض هنا نسب إنجاز تقديرية — فقط ما تحدده بنفسك.</p>';

  main.innerHTML = `
    <section class="hero">
      <div class="container">
        <span class="eyebrow">خريطة تعليمية — التصوير الإشعاعي الصناعي</span>
        <h1>منصة الاستعداد لاختبار مسؤول الحماية من الإشعاع</h1>
        <p>مسار متكامل: لوائح سعودية، تدريب نظري وفق TCS-85، ممارسة السلامة وفق SSG-11، ومسائل محسوبة — وصولًا إلى بنك الأسئلة والمراجعة النهائية.</p>
      </div>
    </section>
    <div class="container">
      ${resumeHtml}
      <section aria-label="المسار التعليمي المقترح">
        <h2 style="font-size:1.1rem;margin-bottom:0.9rem">المسار التعليمي المقترح</h2>
        ${flow}
        <p class="src-note" style="margin-bottom:2rem">هذا مسار إرشادي مرن وليس ترتيبًا إلزاميًا — يمكنك فتح أي قسم مباشرة من البطاقات أدناه.</p>
      </section>
      <section aria-label="الأقسام">
        <h2 style="font-size:1.1rem;margin-bottom:0.9rem">الأقسام الخمسة</h2>
        <div class="sections-grid">${cards}</div>
      </section>
      <section aria-label="متابعة التقدم">
        <h2 style="font-size:1.1rem;margin-bottom:0.9rem">لوحة المتابعة</h2>
        <div class="panels-grid">
          <div class="panel"><h3><span class="tag-dot dot-studying"></span>قيد الدراسة</h3>${studyingPanel}</div>
          <div class="panel"><h3><span class="tag-dot dot-complete"></span>مكتمل</h3>${completePanel}</div>
          <div class="panel"><h3><span class="tag-dot dot-review"></span>المراجعة النهائية</h3>${reviewPanel}</div>
        </div>
      </section>
    </div>`;

  const clearBtn = main.querySelector('[data-clear-resume]');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Progress.clearLastTopic();
      clearBtn.closest('.resume-card').remove();
      toast('أُخفي شريط المتابعة. سيظهر مجددًا عند دراسة موضوع جديد.');
    });
  }
}

function resumeUrl(last) {
  const sec = RPO_SECTIONS.find((s) => s.id === last.sectionId);
  return sec ? `${sec.page}#${last.topicId}` : 'index.html';
}

function sectionNextHint(sec, stats) {
  if (sec.contentState === 'pending') {
    return `<strong>الخطوة التالية:</strong> نقل المحتوى من مشروعك السابق إلى هذا القسم.`;
  }
  if (sec.id === 'qbank') {
    return `<strong>الخطوة التالية:</strong> تدرّب على الأسئلة بعد إنهاء دراسة الأقسام، وراجع أخطاءك من تبويب «مراجعتي».`;
  }
  if (stats.started === 0) {
    return `<strong>الخطوة التالية:</strong> ابدأ بالموضوع الأول في هذا القسم.`;
  }
  if (stats.review > 0) {
    return `<strong>الخطوة التالية:</strong> مراجعة ${stats.review} موضوعًا موسومًا «يحتاج مراجعة» في لوحة المتابعة.`;
  }
  if (stats.notStarted > 0) {
    return `<strong>الخطوة التالية:</strong> لديك ${stats.notStarted} موضوعًا لم يبدأ — تابع من حيث توقفت.`;
  }
  if (stats.studying > 0) {
    return `<strong>الخطوة التالية:</strong> لديك ${stats.studying} موضوعًا قيد الدراسة (غير مكتمل) — أكملها أولًا.`;
  }
  return `<strong>الخطوة التالية:</strong> أكملت كل موضوعات هذا القسم — انتقل إلى بنك الأسئلة ثم المراجعة النهائية.`;
}

function renderPathFlow() {
  const stages = RPO_PATH.stages.map((stage) => {
    const cards = stage.sections.map((secId) => {
      const sec = RPO_SECTIONS.find((s) => s.id === secId);
      const topics = getSectionTopics(secId);
      const stats = Progress.sectionStats(secId, topics);
      const stateTxt = sec.contentState === 'pending'
        ? 'بانتظار النقل'
        : secId === 'qbank' ? `${sec.questionCount} سؤالًا` : stats.started === 0 ? 'لم يبدأ' : `${stats.complete}/${stats.total} مكتمل`;
      return `<a class="stage-card" href="${sec.page}">
        <span class="sc-name">${esc(sec.name.split('—')[0].trim())}</span>
        <span class="sc-state" style="color:${stats.started > 0 ? 'var(--color-success)' : 'var(--color-text-muted)'}">${stateTxt}</span>
      </a>`;
    }).join('');
    return `<div class="path-stage">
      <span class="stage-label">${esc(stage.label)}</span>
      <div class="stage-cards">${cards || '<span class="stage-card"><span class="sc-name">من الموضوعات الموسومة «يحتاج مراجعة»</span></span>'}</div>
    </div>`;
  }).join('<span class="path-arrow" aria-hidden="true">←</span>');
  return `<div class="path-flow">${stages}</div>`;
}

/* ---------- صفحات الأقسام ---------- */
function renderSectionPage(sectionId) {
  const sec = RPO_SECTIONS.find((s) => s.id === sectionId);
  if (!sec) return;
  const main = document.querySelector('[data-main]');
  const topics = getSectionTopics(sectionId);

  document.title = `${sec.name} — منصة الاستعداد RPO`;

  /* الفهرس */
  const tocItems = topics.map((t) => {
    const st = Progress.getStatus(t.id);
    /* منع انكسار الأسماء اللاتينية بين قوسين عند ضيق الفهرس */
    const title = esc(t.title).replace(/\(([^)]*[A-Za-z][^)]*)\)/g, '<span class="nowrap">($1)</span>');
    return `<a href="#${t.id}"><span class="toc-status st-${st}"></span>${title}</a>`;
  }).join('');

  /* بطاقات الموضوعات */
  let cardsHtml = '';
  if (sectionId === 'calculations') {
    cardsHtml = topics.map((p) => renderProblemCard(p)).join('');
    cardsHtml += renderPracticeArea();
    cardsHtml += renderFormulasRef();
  } else if (sectionId === 'qbank') {
    cardsHtml = renderQBankPage();
  } else {
    cardsHtml = topics.map((t) => renderSectionTopicCard(sec, t)).join('');
  }

  main.innerHTML = `
    <div class="container page-layout"${sectionId === 'qbank' ? ' style="grid-template-columns:minmax(0,1fr)"' : ''}>
      ${sectionId === 'qbank' ? '' : `<nav class="toc" aria-label="فهرس الموضوعات">
        <div class="toc-title">فهرس الموضوعات</div>
        ${tocItems || '<div class="empty-note">لا توجد موضوعات بعد.</div>'}
        <a href="index.html" style="margin-top:0.7rem;font-weight:600">→ العودة إلى الخريطة</a>
      </nav>`}
      <div>
        <header class="section-hero">
          <span class="sec-eyebrow">${esc(sec.nameEn)}</span>
          <h1>${esc(sec.name)}</h1>
          <p class="sec-desc">${esc(sec.desc)}</p>
          <div class="ref-strip">
            <span class="ref-chip">${sectionId === 'tcs85' ? 'المرجع: IAEA TCS-85' : sectionId === 'ssg11' ? 'المرجع: IAEA SSG-11' : sectionId === 'calculations' ? 'المرجع: ملف المسائل + سلايدات الدورة' : sectionId === 'nrrc' ? 'المرجع: لوائح NRRC' : 'المصدر: مشروعك السابق'}</span>
            ${sec.contentState === 'pending' ? '<span class="ref-chip" style="background:var(--color-amber-highlight);color:var(--color-amber)">بانتظار نقل المحتوى</span>' : sectionId === 'qbank' ? `<span class="ref-chip">${sec.questionCount} سؤالًا في 5 بنوك واختبار تجريبي</span>` : `<span class="ref-chip">${topics.length} موضوعًا</span>`}
          </div>
        </header>
        ${cardsHtml}
      </div>
    </div>`;

  initCollapsibles(main);
  initStatusButtons(main);
  markLastTopic(sectionId);
  if (sectionId === 'qbank' && window.QBankApp && window.QB) {
    window.QBankApp.mount(main.querySelector('#qb-host'));
  }
}

/* بطاقة موضوع في صفحات الأقسام (غير المسائل) */
function renderSectionTopicCard(sec, t) {
  if (t.contentPending) {
    return `
    <article class="topic" id="${esc(t.id)}">
      <div class="topic-head">
        <h2>${esc(t.title)}<span class="topic-en">${esc(t.titleEn || '')}</span></h2>
        <span class="topic-chip" style="background:var(--color-amber-highlight);color:var(--color-amber)">${esc(t.chip || '')}</span>
      </div>
      <div class="topic-body">
        <div class="pending-box">
          <div class="pb-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
          </div>
          <h3>هذا الموضوع بانتظار نقل المحتوى</h3>
          <p>${esc(t.summary)}</p>
          <p class="src-note" style="margin-top:0.5rem">${esc(t.refs || '')}</p>
        </div>
        ${renderRelated(t)}
        ${renderStatusRow(t)}
      </div>
    </article>`;
  }
  return renderTopicCard(t);
}

/* بطاقة مسألة حسابية */
function renderProblemCard(p) {
  const meta = [];
  if (p.chip) meta.push(p.chip);
  const steps = (p.steps || []).map((s) => `
    <li>
      ${esc(s.text)}
      ${s.math ? `<span class="step-math">${esc(s.math)}</span>` : ''}
    </li>`).join('');
  return `
  <article class="problem" id="${esc(p.id)}">
    <div class="problem-head">
      <h2>${esc(p.title)}<span class="topic-en">${esc(p.titleEn || '')}</span></h2>
      <span class="topic-chip">${esc(p.chip || '')}</span>
      ${p.topic ? `<span class="topic-meta">الموضوع: ${esc(p.topic)}</span>` : ''}
    </div>
    <div class="problem-body">
      <div class="spec-grid">
        <div class="spec-box"><div class="sb-title">المعطيات</div><ul>${(p.given || []).map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>
        <div class="spec-box"><div class="sb-title">المطلوب</div><p>${esc(p.required)}</p></div>
      </div>
      <div class="law-card">
        <span class="law-formula">${esc(p.law)}</span>
        <span class="law-why">${esc(p.lawWhy)}</span>
      </div>
      <div class="level" data-level data-solution>
        <button class="level-head" type="button" aria-expanded="false">
          <span class="lvl-tag">حل</span>
          <span>أظهر الحل خطوة بخطوة والنتيجة النهائية</span>
          <span class="chev" aria-hidden="true">‹</span>
        </button>
        <div class="level-body">
          <ol class="steps-list">${steps}</ol>
          <div class="result-box">
            <span class="rb-label">النتيجة النهائية:</span>
            <span class="rb-value">${esc(p.result)}</span>
          </div>
        </div>
      </div>
      <p class="src-note">${esc(p.source)}</p>
      ${p.refs ? `<p class="src-note">${esc(p.refs)}</p>` : ''}
      ${renderRelated(p)}
      ${renderStatusRow(p)}
      ${p.levels && p.levels.length ? `<p class="src-note">الملخص والشرح والمراجع أدناه من إعداد المنصة استنادًا إلى مصدر المسألة، وهي منفصلة عن نص المسألة وحلها.</p>${renderLevels(p)}` : ''}
    </div>
  </article>`;
}

function renderPracticeArea() {
  return `
  <article class="topic" id="practice-area">
    <div class="topic-head">
      <h2>مساحة المسائل التدريبية<span class="topic-en">Practice Area</span></h2>
      <span class="topic-chip" style="background:var(--color-amber-highlight);color:var(--color-amber)">مساحة شخصية</span>
    </div>
    <div class="topic-body">
      <div class="pending-box">
        <p>${esc(CALC_PRACTICE_NOTE)}</p>
      </div>
    </div>
  </article>`;
}

function renderFormulasRef() {
  const groups = CALC_FORMULAS.map((g) => `
    <div class="level" data-level>
      <button class="level-head" type="button" aria-expanded="false">
        <span class="lvl-tag">قوانين</span>
        <span>${esc(g.group)}</span>
        <span class="chev" aria-hidden="true">‹</span>
      </button>
      <div class="level-body">
        <ul>${g.items.map((f) => `<li><span class="step-math" style="display:inline-block;padding:0.15rem 0.5rem">${esc(f)}</span></li>`).join('')}</ul>
      </div>
    </div>`).join('');
  return `
  <article class="topic" id="formulas-ref">
    <div class="topic-head">
      <h2>مرجع القوانين والتحويلات<span class="topic-en">Formulas Reference</span></h2>
      <span class="topic-chip">من صفحات القوانين في الملف وسلايدات الدورة</span>
    </div>
    <div class="topic-body">${groups}
      <p class="src-note">المصدر: صفحات القوانين في ملف «مسائل الحماية من الإشعاع» وسلايدات دورة «النواة» — الجزء الخامس.</p>
    </div>
  </article>`;
}

function renderQBankPage() {
  return `
  <div id="qb-host"></div>
  <p class="src-note" style="margin-top:1rem">${esc(QBANK_NOTE.disclaimer)}</p>`;
}

/* تسجيل آخر موضوع تمت دراسته: عند فتح الصفحة نقفز لأقرب مرساة، وعند النقر على مستوى أو زر حالة نسجل الموضوع */
function markLastTopic(sectionId) {
  const topics = getSectionTopics(sectionId);
  if (!topics.length) return;
  /* ربط أزرار الحالة بالتسجيل */
  document.querySelectorAll('.status-btn[data-topic-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = topics.find((x) => x.id === btn.dataset.topicId);
      if (t) Progress.setLastTopic(sectionId, t.id, t.title);
    }, { once: false });
  });
  /* تسجيل الموضوع عند فتح مستوياته (شرح/مراجع) */
  document.querySelectorAll('.topic[id], .problem[id]').forEach((card) => {
    card.querySelectorAll('.level-head').forEach((head) => {
      head.addEventListener('click', () => {
        const t = topics.find((x) => x.id === card.id);
        if (t) Progress.setLastTopic(sectionId, t.id, t.title);
      });
    });
  });
  /* عند فتح الصفحة على مرساة موضوع، سجّله مباشرة */
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash) {
    const t = topics.find((x) => x.id === hash);
    if (t) Progress.setLastTopic(sectionId, t.id, t.title);
  }
  /* تسجيل المرساة عند التمرير إليها عبر النقر على الفهرس */
  document.querySelectorAll('.toc a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      const id = a.getAttribute('href').slice(1);
      const t = topics.find((x) => x.id === id);
      if (t) Progress.setLastTopic(sectionId, t.id, t.title);
    });
  });
}

/* ---------- الإقلاع حسب الصفحة ---------- */
function boot(sectionId) {
  renderChrome(sectionId);
  if (sectionId === 'home') {
    renderHomePage();
    document.addEventListener('rpo:refresh-home', renderHomePage);
  } else {
    renderSectionPage(sectionId);
    /* التنقل داخل نفس الصفحة عبر المرساة (مثل نتائج البحث) يحدّث آخر موضوع */
    window.addEventListener('hashchange', () => { markLastTopic(sectionId); });
    document.addEventListener('rpo:refresh-home', () => {
      /* تحديث الفهرس بعد تغيير الحالة */
      document.querySelectorAll('.toc .toc-status').forEach((dot) => {
        const href = dot.closest('a') && dot.closest('a').getAttribute('href');
        if (!href) return;
        const id = href.slice(1);
        dot.className = 'toc-status st-' + Progress.getStatus(id);
      });
    });
  }
}
