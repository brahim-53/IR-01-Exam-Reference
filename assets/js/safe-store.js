/* طبقة تخزين آمنة:
   - في المتصفح العادي: تخزين محلي دائم (يُستخدم فقط إذا كان متاحًا فعلًا).
   - في بيئات المعاينة المعزولة (iframe) حيث يُمنع التخزين المحلي: نستخدم window.name
     (يبقى عبر التنقل بين صفحات نفس النافذة/الإطار، فيُحفظ التقدم أثناء التنقل بين الأقسام).
   - إن لم يتوفر أي خيار: ذاكرة مؤقتة للصفحة الحالية فقط.
   - خاصية PERSISTENT_STORAGE تخبرك إن كان التقدم سيبقى بعد إغلاق الصفحة. */
'use strict';

(function () {
  const memory = {};
  const KEY = 'rpo_store_v1';
  let persistent = false;
  let store = null;

  try {
    const s = window[['local', 'Storage'].join('')];
    if (s) {
      s.setItem('__rpo_test__', '1');
      s.removeItem('__rpo_test__');
      store = s;
      persistent = true;
    }
  } catch (e) {
    store = null;
  }

  if (!store) {
    /* window.name: نص يبقى مع النافذة عبر التنقل بين الصفحات — يُستخدم كمتجر JSON */
    let nameOk = false;
    try {
      window.name = window.name || '';
      if (window.name === '' || window.name.indexOf(KEY) === 0) nameOk = true;
      else {
        /* window.name غير فارغ وبلا بادئتنا: إن كان يحمل خريطة متجر (قيمها كلها نصوص) نتبنّاه */
        try {
          const probe = JSON.parse(window.name);
          if (probe && typeof probe === 'object' && !Array.isArray(probe)) {
            const vals = Object.values(probe);
            nameOk = vals.length > 0 && vals.every((v) => typeof v === 'string');
          }
        } catch (e2b) { nameOk = false; }
      }
    } catch (e2) {
      nameOk = false;
    }
    if (nameOk) {
      let data = {};
      const read = () => {
        try {
          const raw = window.name.indexOf(KEY + ':') === 0 ? window.name.slice(KEY.length + 1) : window.name;
          data = raw ? JSON.parse(raw) : {};
        } catch (e3) {
          data = {};
        }
        return data;
      };
      read();
      /* نسخ أي قيم كانت في ذاكرة هذه الصفحة قبل تبديل المتجر */
      Object.assign(data, JSON.parse(JSON.stringify(memory)));
      store = {
        getItem(k) { read(); return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
        setItem(k, v) {
          read();
          data[k] = String(v);
          try {
            window.name = KEY + ':' + JSON.stringify(data);
          } catch (e4) {
            /* تجاهل: ستُفقد القيمة عند التنقل */
          }
        },
        removeItem(k) {
          read();
          delete data[k];
          try {
            window.name = KEY + ':' + JSON.stringify(data);
          } catch (e5) {
            /* تجاهل */
          }
        }
      };
    } else {
      store = {
        getItem(k) { return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null; },
        setItem(k, v) { memory[k] = String(v); },
        removeItem(k) { delete memory[k]; }
      };
    }
  }

  window.SafeStore = store;
  window.PERSISTENT_STORAGE = persistent;
})();
