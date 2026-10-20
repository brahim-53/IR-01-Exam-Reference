/* نظام إدارة التقدم — تخزين محلي آمن (عبر SafeStore) + تصدير/استيراد
   الحالات: not_started | studying | complete | review */
'use strict';

const PROGRESS_KEY = 'rpo_platform_progress_v1';


/* ---------- تخزين القاموس (مفضلة، إتقان، مراجعة، نتائج الاختبارات، تعديلات التصنيف) ---------- */
const VOCAB_KEY = 'rpo_vocab_v1';

const VocabStore = {
  empty() {
    return { terms: {}, quiz: [], lastSession: null, cats: { custom: [], rename: {}, assign: {} }, settings: {} };
  },
  read() {
    try {
      const raw = SafeStore.getItem(VOCAB_KEY);
      if (!raw) return this.empty();
      const d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return this.empty();
      const e = this.empty();
      return {
        terms: d.terms && typeof d.terms === 'object' ? d.terms : e.terms,
        quiz: Array.isArray(d.quiz) ? d.quiz : e.quiz,
        lastSession: d.lastSession || null,
        cats: Object.assign(e.cats, d.cats || {}),
        settings: d.settings && typeof d.settings === 'object' ? d.settings : {}
      };
    } catch (err) {
      return this.empty();
    }
  },
  write(d) {
    try { SafeStore.setItem(VOCAB_KEY, JSON.stringify(d)); return true; } catch (err) { return false; }
  },
  /* دمج نسخة مستوردة: الأحدث (حسب at) يفوز لكل مصطلح */
  merge(incoming) {
    const cur = this.read();
    if (!incoming || typeof incoming !== 'object') return cur;
    const inTerms = incoming.terms || {};
    Object.keys(inTerms).forEach((id) => {
      const a = cur.terms[id];
      const b = inTerms[id];
      if (!a || (b && (b.at || 0) >= (a.at || 0))) cur.terms[id] = b;
    });
    const seen = new Set(cur.quiz.map((q) => q.at + '|' + q.type));
    (incoming.quiz || []).forEach((q) => { if (!seen.has(q.at + '|' + q.type)) cur.quiz.push(q); });
    cur.quiz.sort((x, y) => x.at - y.at);
    cur.lastSession = Math.max(cur.lastSession || 0, incoming.lastSession || 0) || null;
    const ic = incoming.cats || {};
    cur.cats.custom = cur.cats.custom || [];
    (ic.custom || []).forEach((c) => { if (!cur.cats.custom.some((x) => x.id === c.id)) cur.cats.custom.push(c); });
    Object.assign(cur.cats.rename, ic.rename || {});
    Object.assign(cur.cats.assign, ic.assign || {});
    cur.settings = Object.assign({}, incoming.settings || {}, cur.settings);
    this.write(cur);
    return cur;
  }
};

const Progress = {
  read() {
    try {
      const raw = SafeStore.getItem(PROGRESS_KEY);
      if (!raw) return { topics: {}, lastTopic: null };
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || !data.topics) {
        return { topics: {}, lastTopic: null };
      }
      return data;
    } catch (e) {
      return { topics: {}, lastTopic: null };
    }
  },

  write(data) {
    try {
      SafeStore.setItem(PROGRESS_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },

  getStatus(topicId) {
    const data = this.read();
    return (data.topics && data.topics[topicId]) || 'not_started';
  },

  setStatus(topicId, status) {
    if (!['not_started', 'studying', 'complete', 'review'].includes(status)) return;
    const data = this.read();
    if (status === 'not_started') {
      delete data.topics[topicId];
    } else {
      data.topics[topicId] = status;
    }
    this.write(data);
    document.dispatchEvent(new CustomEvent('rpo:progress-changed', {
      detail: { topicId, status }
    }));
  },

  setLastTopic(sectionId, topicId, title) {
    const data = this.read();
    data.lastTopic = { sectionId, topicId, title, at: new Date().toISOString() };
    this.write(data);
  },

  clearLastTopic() {
    const data = this.read();
    data.lastTopic = null;
    this.write(data);
  },

  /* إحصاءات قسم: يُرجع {total, started, complete, review, studying, notStarted} */
  sectionStats(sectionId, topics) {
    const data = this.read();
    const stats = {
      total: topics.length,
      studying: 0, complete: 0, review: 0, notStarted: 0, started: 0
    };
    topics.forEach((t) => {
      const s = (data.topics && data.topics[t.id]) || 'not_started';
      if (s === 'not_started') stats.notStarted++;
      else stats.started++;
      if (s === 'studying') stats.studying++;
      if (s === 'complete') stats.complete++;
      if (s === 'review') stats.review++;
    });
    return stats;
  },

  /* قائمة الموضوعات بحالة معينة عبر كل الأقسام */
  topicsByStatus(status) {
    const data = this.read();
    const result = [];
    (typeof RPO_SECTIONS !== 'undefined' ? RPO_SECTIONS : []).forEach((sec) => {
      getSectionTopics(sec.id).forEach((t) => {
        const s = (data.topics && data.topics[t.id]) || 'not_started';
        if (s === status) result.push({ section: sec, topic: t });
      });
    });
    return result;
  },

  exportJSON() {
    const data = Object.assign({}, this.read(), { vocab: VocabStore.read() });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `rpo-progress-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  },

  importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (!parsed || typeof parsed !== 'object' || ((!parsed.topics || typeof parsed.topics !== 'object') && !parsed.vocab)) {
            reject(new Error('ملف غير صالح'));
            return;
          }
          if (parsed.vocab) VocabStore.merge(parsed.vocab);
          if (!parsed.topics || typeof parsed.topics !== 'object') { resolve(true); return; }
          // دمج: القيم الأحدث للملف المستورد فقط عند غيابها محليًا
          const current = this.read();
          const merged = {
            topics: Object.assign({}, current.topics, parsed.topics),
            lastTopic: parsed.lastTopic || current.lastTopic
          };
          this.write(merged);
          resolve(true);
        } catch (e) {
          reject(new Error('تعذر قراءة الملف'));
        }
      };
      reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
      reader.readAsText(file);
    });
  }
};
