/* البحث داخل المحتوى — فهرس يُبنى من ملفات البيانات وقت التشغيل */
'use strict';

const Search = {
  index: [],

  buildIndex() {
    this.index = [];
    (typeof RPO_SECTIONS !== 'undefined' ? RPO_SECTIONS : []).forEach((sec) => {
      getSectionTopics(sec.id).forEach((topic) => {
        const parts = [];
        const push = (v) => {
          if (typeof v === 'string') parts.push(v);
        };
        push(topic.title);
        push(topic.titleEn);
        push(topic.summary);
        if (topic.keywords) topic.keywords.forEach(push);
        if (topic.levels) topic.levels.forEach((l) => { push(l.title); push(l.html); });
        if (topic.terms) topic.terms.forEach((t) => { push(t.en); push(t.ar); push(t.expl); });
        /* المسائل الحسابية: المعطيات والقانون والخطوات والنتيجة */
        if (topic.given) topic.given.forEach(push);
        push(topic.required);
        push(topic.law);
        push(topic.lawWhy);
        if (topic.steps) topic.steps.forEach((s) => { push(s.text); push(s.math); });
        push(topic.result);
        push(topic.source);
        if (Array.isArray(topic.refs)) topic.refs.forEach((r) => push(r.label));
        if (typeof topic.refs === 'string') push(topic.refs);
        const fullText = parts.join(' \n ');
        this.index.push({
          section: sec,
          topic,
          url: `${sec.page}#${topic.id}`,
          title: topic.title,
          text: fullText
        });
      });
    });
    this.addVocab();
  },

  /* مصطلحات القاموس تُفهرس كعناصر مستقلة وتفتح بطاقتها في القاموس */
  addVocab() {
    if (typeof VOCAB_TERMS === 'undefined') return;
    const sec = RPO_SECTIONS.find((s) => s.id === 'vocab');
    if (!sec) return;
    VOCAB_TERMS.forEach((v) => {
      this.index.push({
        section: sec,
        topic: { id: 'v' + v.id, title: v.t + ' — ' + v.ar },
        url: `${sec.page}#/term/${v.id}`,
        title: v.t,
        text: [v.t, v.ar, v.ap, v.def, v.defAr].join(' \n ')
      });
    });
  },

  normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[\u0640]/g, '') // تطويل
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[^\u0600-\u06FFa-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  query(q) {
    const nq = this.normalize(q);
    if (nq.length < 2) return [];
    const words = nq.split(' ');
    const results = [];
    this.index.forEach((entry) => {
      const hay = this.normalize(entry.text);
      let score = 0;
      let allMatch = true;
      words.forEach((w) => {
        if (hay.includes(w)) score++;
        else allMatch = false;
      });
      if (allMatch && score > 0) {
        results.push({ entry, score });
      }
    });
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 12);
  },

  snippet(entry, q) {
    const plain = entry.text.replace(/<[^>]+>/g, ' ');
    const nq = this.normalize(q);
    const first = nq.split(' ')[0];
    if (!first) return '';
    const nPlain = this.normalize(plain);
    const idx = nPlain.indexOf(first);
    if (idx < 0) return plain.slice(0, 110);
    const start = Math.max(0, idx - 35);
    return '…' + plain.slice(start, start + 130).trim() + '…';
  }
};
