/* واجهة مشتركة: ترويسة، تذييل، بحث، تنبيهات، أدوات عرض الموضوعات */
'use strict';

/* ---------- أدوات مساعدة ---------- */
function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function esc(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&' + 'amp;')
    .replace(/</g, '&' + 'lt;')
    .replace(/>/g, '&' + 'gt;')
    .replace(/"/g, '&' + 'quot;');
}

function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = el('div', 'toast');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('is-visible'), 2600);
}

/* ---------- الترويسة والتذييل ---------- */
function renderChrome(activeSectionId) {
  const header = document.querySelector('[data-header]');
  if (header) {
    const nav = RPO_SECTIONS.map((s) =>
      `<a href="${s.page}" ${s.id === activeSectionId ? 'class="is-active"' : ''}>${esc(s.name.split('—')[0].trim())}</a>`
    ).join('');
    header.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 10a2 2 0 1 0 0.001 4.001A2 2 0 0 0 12 10z"/><path d="M12 9V3M10.2 10.6 4.8 8M10.2 13.4 4.8 16M13.8 10.6 19.2 8M13.8 13.4 19.2 16"/></svg>
          </span>
          <span class="brand-text">منصة الاستعداد<small>مسؤول الحماية من الإشعاع — التصوير الصناعي</small></span>
        </a>
        <nav class="main-nav" aria-label="أقسام المنصة">${nav}</nav>
        <div class="header-actions">
          <button class="icon-btn" type="button" data-search-open aria-label="بحث في المنصة" title="بحث">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <button class="icon-btn" type="button" data-theme-toggle aria-label="تبديل الوضع الليلي" title="الوضع الليلي"></button>
        </div>
      </div>`;
  }

  const footer = document.querySelector('[data-footer]');
  if (footer) {
    const storageNote = window.PERSISTENT_STORAGE
      ? 'يُحفظ التقدم محليًا في متصفحك ويبقى بعد إغلاق الصفحة.'
      : 'في هذه البيئة يُحفظ التقدم خلال الجلسة الحالية فقط — استخدم «تصدير نسخة احتياطية» للحفاظ عليه.';
    footer.innerHTML = `
      <div class="container foot-inner">
        <span>منصة تعليمية شخصية للاستعداد لاختبار مسؤول الحماية من الإشعاع — التصوير الإشعاعي الصناعي. ${storageNote}</span>
        <div class="foot-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-export-progress>تصدير نسخة احتياطية</button>
          <button class="btn btn-ghost btn-sm" type="button" data-import-progress>استيراد نسخة</button>
          <input type="file" accept="application/json" class="sr-only" data-import-file>
        </div>
      </div>`;
  }

  initThemeToggle();
  initSearchOverlay();
  initProgressIO();
}

/* ---------- الوضع الليلي ---------- */
function initThemeToggle() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const root = document.documentElement;
  let mode = 'light';
  try {
    mode = SafeStore.getItem('rpo_theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (e) { /* تجاهل */ }
  root.setAttribute('data-theme', mode);
  const icon = () => {
    btn.innerHTML = mode === 'dark'
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', mode === 'dark' ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي');
  };
  icon();
  btn.addEventListener('click', () => {
    mode = mode === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', mode);
    try { SafeStore.setItem('rpo_theme', mode); } catch (e) { /* تجاهل */ }
    icon();
  });
}

/* ---------- البحث ---------- */
function initSearchOverlay() {
  const openBtn = document.querySelector('[data-search-open]');
  let overlay = document.querySelector('.search-overlay');
  if (!overlay) {
    overlay = el('div', 'search-overlay');
    overlay.innerHTML = `
      <div class="search-panel" role="dialog" aria-label="بحث">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="color:var(--color-text-faint)"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" placeholder="ابحث في موضوعات المنصة…" aria-label="بحث" autocomplete="off">
          <button class="icon-btn" type="button" data-search-close aria-label="إغلاق">✕</button>
        </div>
        <div class="search-results" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(overlay);
  }
  const input = overlay.querySelector('input');
  const results = overlay.querySelector('.search-results');

  const run = () => {
    const q = input.value.trim();
    if (q.length < 2) {
      results.innerHTML = '<div class="search-empty">اكتب كلمتين على الأقل للبحث في كل الأقسام.</div>';
      return;
    }
    Search.buildIndex();
    const hits = Search.query(q);
    if (!hits.length) {
      results.innerHTML = '<div class="search-empty">لا توجد نتائج مطابقة. جرّب كلمات أخرى (عربية أو إنجليزية).</div>';
      return;
    }
    results.innerHTML = '';
    hits.forEach((h) => {
      const a = el('a', 'search-result');
      a.href = h.entry.url;
      a.innerHTML = `
        <span class="sr-section">${esc(h.entry.section.name)}</span>
        <div class="sr-title">${esc(h.entry.topic.title)}</div>
        <div class="sr-snippet">${esc(Search.snippet(h.entry, q))}</div>`;
      results.appendChild(a);
    });
  };

  input.addEventListener('input', run);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });
  overlay.querySelector('[data-search-close]').addEventListener('click', () => {
    overlay.classList.remove('is-open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('is-open');
  });
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      overlay.classList.add('is-open');
      input.focus();
    });
  }
}

/* ---------- تصدير/استيراد التقدم ---------- */
function initProgressIO() {
  const exportBtn = document.querySelector('[data-export-progress]');
  const importBtn = document.querySelector('[data-import-progress]');
  const fileInput = document.querySelector('[data-import-file]');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      Progress.exportJSON();
      toast('تم تنزيل ملف النسخة الاحتياطية للتقدم.');
    });
  }
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files[0];
      if (!f) return;
      try {
        await Progress.importJSON(f);
        toast('تم استيراد التقدم بنجاح. ستُحدَّث الصفحة.');
        setTimeout(() => location.reload(), 900);
      } catch (err) {
        toast('تعذر الاستيراد: ' + err.message);
      }
    });
  }
}

/* ---------- عرض بطاقة موضوع (تستخدمها صفحات الأقسام) ---------- */
function renderLevels(topic) {
  const levels = topic.levels || [];
  return levels.map((lv) => `
    <div class="level lvl-${lv.level}" data-level>
      <button class="level-head" type="button" aria-expanded="false">
        <span class="lvl-tag">${lv.level === 1 ? 'ملخص سريع' : lv.level === 2 ? 'شرح منظم' : 'مراجع وتفاصيل'}</span>
        <span>${esc(lv.title)}</span>
        <span class="chev" aria-hidden="true">‹</span>
      </button>
      <div class="level-body">${lv.html}</div>
    </div>`).join('');
}

function renderTerms(topic) {
  if (!topic.terms || !topic.terms.length) return '';
  const rows = topic.terms.map((t) => `
    <tr>
      <td class="term-en">${esc(t.en)}</td>
      <td><strong>${esc(t.ar)}</strong></td>
      <td>${esc(t.expl)}</td>
    </tr>`).join('');
  return `
    <div class="level" data-level>
      <button class="level-head" type="button" aria-expanded="false">
        <span class="lvl-tag">المصطلحات</span>
        <span>المصطلحات الإنجليزية ومعانيها</span>
        <span class="chev" aria-hidden="true">‹</span>
      </button>
      <div class="level-body">
        <table class="terms-table">
          <thead><tr><th>المصطلح</th><th>المعنى</th><th>شرح مبسط</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderReview(topic) {
  if (!topic.review || !topic.review.length) return '';
  const items = topic.review.map((q) => `
    <div class="review-q">
      <div class="rq-text">${esc(q.q)}</div>
      <button class="rq-answer-btn" type="button">إظهار الإجابة</button>
      <div class="rq-answer">${q.a}</div>
    </div>`).join('');
  return `
    <div class="level" data-level>
      <button class="level-head" type="button" aria-expanded="false">
        <span class="lvl-tag">أسئلة مراجعة</span>
        <span>اختبر فهمك</span>
        <span class="chev" aria-hidden="true">‹</span>
      </button>
      <div class="level-body">${items}
        <p class="src-note">أسئلة المراجعة من إعداد المنصة بناءً على أهداف الموضوع في المرجع، وليست من بنك أسئلة رسمي.</p>
      </div>
    </div>`;
}

function renderRelated(topic) {
  if (!topic.related || !topic.related.length) return '';
  const links = topic.related.map((r) => {
    const [secId, topicId] = r.split(':');
    const sec = RPO_SECTIONS.find((s) => s.id === secId);
    if (!sec) return '';
    const t = getSectionTopics(secId).find((x) => x.id === topicId);
    if (!t) return '';
    return `<a href="${sec.page}#${t.id}">${esc(sec.name.split('—')[0].trim())} ← ${esc(t.title)}</a>`;
  }).join('');
  if (!links) return '';
  return `
    <div class="related-links">
      <span class="sr-label" style="align-self:center;font-size:0.75rem;font-weight:700;color:var(--color-text-muted)">مواضيع ذات صلة:</span>
      ${links}
    </div>`;
}

function renderStatusRow(topic) {
  const current = Progress.getStatus(topic.id);
  const buttons = [
    { key: 'not_started', label: 'لم يبدأ' },
    { key: 'studying', label: 'قيد الدراسة' },
    { key: 'complete', label: 'مكتمل' },
    { key: 'review', label: 'يحتاج مراجعة' }
  ].map((b) => {
    const cls = 'status-btn' + (current === b.key ? ' is-active' : '');
    return `<button class="${cls}" type="button" data-status="${b.key}" data-topic-id="${esc(topic.id)}">${b.label}</button>`;
  }).join('');
  return `
    <div class="status-row">
      <span class="sr-label">حالة الموضوع:</span>
      ${buttons}
    </div>`;
}

function renderTopicCard(topic, opts) {
  opts = opts || {};
  const meta = [];
  if (topic.minutes) meta.push(`⏱ ${topic.minutes} دقيقة تدريبية`);
  if (topic.source) meta.push(`المصدر: ${esc(topic.source)}`);
  return `
  <article class="topic" id="${esc(topic.id)}">
    <div class="topic-head">
      <h2>${esc(topic.title)}<span class="topic-en">${esc(topic.titleEn || '')}</span></h2>
      ${topic.chip ? `<span class="topic-chip">${esc(topic.chip)}</span>` : ''}
      ${meta.length ? `<span class="topic-meta">${meta.join(' · ')}</span>` : ''}
    </div>
    <div class="topic-body">
      ${renderLevels(topic)}
      ${renderTerms(topic)}
      ${renderReview(topic)}
      ${renderRelated(topic)}
      ${opts.noStatus ? '' : renderStatusRow(topic)}
    </div>
  </article>`;
}

/* فتح/إغلاق المستويات القابلة للطي */
function initCollapsibles(scope) {
  (scope || document).querySelectorAll('.level-head').forEach((head) => {
    head.addEventListener('click', () => {
      const level = head.closest('.level');
      const open = level.classList.toggle('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  (scope || document).querySelectorAll('.rq-answer-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ans = btn.nextElementSibling;
      const open = ans.classList.toggle('is-open');
      btn.textContent = open ? 'إخفاء الإجابة' : 'إظهار الإجابة';
    });
  });
}

/* أزرار حالة التقدم */
function initStatusButtons(scope) {
  (scope || document).querySelectorAll('.status-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const topicId = btn.dataset.topicId;
      const status = btn.dataset.status;
      Progress.setStatus(topicId, status);
      const card = btn.closest('.topic, .problem, .section-card');
      if (card) {
        const row = card.querySelector('.status-row') || btn.parentElement;
        row.querySelectorAll('.status-btn').forEach((b) => {
          b.classList.toggle('is-active', b.dataset.status === status);
        });
      }
      toast('حُفظت الحالة: ' + (STATUS_LABELS[status] || status));
      refreshChromeIndicators();
    });
  });
}

/* تحديث بطاقات التقدم في الصفحة الرئيسية بعد أي تغيير */
function refreshChromeIndicators() {
  document.dispatchEvent(new CustomEvent('rpo:refresh-home'));
}
