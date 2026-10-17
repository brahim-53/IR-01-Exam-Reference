/* نظام إدارة التقدم — تخزين محلي آمن (عبر SafeStore) + تصدير/استيراد
   الحالات: not_started | studying | complete | review */
'use strict';

const PROGRESS_KEY = 'rpo_platform_progress_v1';

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
    const data = this.read();
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
          if (!parsed || typeof parsed !== 'object' || !parsed.topics || typeof parsed.topics !== 'object') {
            reject(new Error('ملف غير صالح'));
            return;
          }
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
