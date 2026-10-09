<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>خريطة مذاكرة RPO / RSO</title>
<style>
:root{
  --bg:#f6f7f9;--card:#fff;--ink:#16202b;--muted:#5b6876;--line:#e1e5ea;
  --accent:#0b6b5c;--accent-soft:#e1f3ef;--hi:#c0392b;--hi-soft:#fdecea;--mid:#c76a00;--mid-soft:#fff2e0;--warn:#fff8dc;
  --code:#f0f2f5;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#0f1418;--card:#171e24;--ink:#e8edf2;--muted:#9aa7b4;--line:#27313a;
    --accent:#4fd1b8;--accent-soft:#12302a;--hi:#ff7b6b;--hi-soft:#3a1c19;--mid:#ffb04d;--mid-soft:#3a2a12;--warn:#332e12;--code:#1f282f;
  }
}
:root[data-theme="dark"]{
  --bg:#0f1418;--card:#171e24;--ink:#e8edf2;--muted:#9aa7b4;--line:#27313a;
  --accent:#4fd1b8;--accent-soft:#12302a;--hi:#ff7b6b;--hi-soft:#3a1c19;--mid:#ffb04d;--mid-soft:#3a2a12;--warn:#332e12;--code:#1f282f;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:76px}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Segoe UI",Tahoma,"Noto Naskh Arabic",system-ui,sans-serif;line-height:1.9;font-size:16px}
.wrap{max-width:980px;margin:0 auto;padding:0 16px}
header.hero{background:linear-gradient(135deg,#0b6b5c,#124a63);color:#fff;padding:36px 0 28px}
header.hero h1{margin:0 0 6px;font-size:clamp(1.5rem,4vw,2.2rem)}
header.hero p{margin:0;opacity:.9}
.bar{position:sticky;top:0;z-index:10;background:var(--card);border-bottom:1px solid var(--line)}
.bar .wrap{display:flex;gap:10px;align-items:center;padding-top:8px;padding-bottom:8px}
.bar input[type=search]{flex:1;min-width:0;padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit}
.prog{display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--muted);white-space:nowrap}
.prog .track{width:90px;height:8px;background:var(--line);border-radius:6px;overflow:hidden}
.prog .fill{height:100%;width:0;background:var(--accent);transition:width .3s}
button.theme{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:10px;padding:6px 10px;cursor:pointer;font:inherit}
nav.chips{display:flex;flex-wrap:wrap;gap:6px;padding:14px 0}
nav.chips a{display:inline-flex;gap:6px;align-items:center;padding:4px 10px;border:1px solid var(--line);background:var(--card);border-radius:999px;color:var(--ink);text-decoration:none;font-size:.85rem}
nav.chips a.done{background:var(--accent-soft);border-color:var(--accent)}
nav.chips a b{color:var(--accent)}
section.card,.panel{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px 20px;margin:16px 0}
section.card h2{margin:0 0 8px;font-size:1.25rem;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
section.card h2 .num{background:var(--accent);color:#fff;border-radius:8px;padding:0 10px;font-size:1rem}
h3{margin:18px 0 6px;font-size:1.02rem;color:var(--accent)}
.tag{font-size:.75rem;padding:1px 10px;border-radius:999px;font-weight:600}
.tag.hi{background:var(--hi-soft);color:var(--hi)}
.tag.mid{background:var(--mid-soft);color:var(--mid)}
.tag.way{background:var(--code);color:var(--muted)}
.ref{font-size:.85rem;color:var(--muted);margin:0 0 8px}
ul{margin:6px 0;padding-inline-start:22px}
.terms{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.terms span{background:var(--code);border-radius:8px;padding:0 10px;font-size:.88rem;direction:ltr;unicode-bidi:isolate}
.note{border-inline-start:4px solid var(--mid);background:var(--warn);padding:8px 14px;border-radius:8px;margin:12px 0}
.note.red{border-color:var(--hi);background:var(--hi-soft)}
.note.green{border-color:var(--accent);background:var(--accent-soft)}
.tbl{overflow-x:auto;margin:10px 0}
table{border-collapse:collapse;width:100%;font-size:.92rem}
th,td{border:1px solid var(--line);padding:6px 10px;text-align:start;vertical-align:top}
th{background:var(--code)}
.ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.formula{direction:ltr;text-align:center;background:var(--code);border-radius:10px;padding:8px 12px;margin:8px 0;font-family:"Cambria Math",Georgia,serif;font-size:1.05rem;overflow-x:auto}
.formula small{display:block;direction:rtl;font-family:inherit;font-size:.8rem;color:var(--muted)}
.done-row{margin-top:14px;padding-top:10px;border-top:1px dashed var(--line)}
.done-row label{cursor:pointer;display:inline-flex;gap:8px;align-items:center;font-weight:600}
.calc{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.calc .panel{margin:0}
.calc label{display:block;font-size:.85rem;color:var(--muted)}
.calc input{width:100%;padding:6px 8px;margin:2px 0 8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;direction:ltr;text-align:left}
.calc .out{background:var(--accent-soft);padding:6px 10px;border-radius:8px;min-height:2.2em;font-weight:600;direction:ltr;text-align:left}
.top10 li{margin:4px 0}
footer{padding:28px 0 50px;color:var(--muted);font-size:.85rem;text-align:center}
.hidden{display:none!important}
@media print{.bar,nav.chips,.done-row,.calc{display:none}section.card{break-inside:avoid}}

.tabs{display:flex;gap:6px;flex-wrap:wrap;padding:14px 0 6px}
.tabs button,.bd,.op{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:3px 12px;font-size:.88rem}
.tabs button.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.flt{display:flex;gap:8px;flex-wrap:wrap;padding:6px 0}
.flt select{padding:6px 10px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);font:inherit;max-width:100%}
.it{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin:10px 0}
.it .hd{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:4px}
.ax{font-size:.8rem;color:var(--muted)}
.bd.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}
.bd.off{background:var(--mid-soft);border-color:var(--mid);color:var(--mid)}
.opts{display:grid;gap:6px;margin-top:6px}
.op{text-align:start;border-radius:10px;padding:6px 12px}
.op.ok{background:var(--accent-soft);border-color:var(--accent)}
.op.bad{background:var(--hi-soft);border-color:var(--hi)}
.hid2{display:none!important}
.sref{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
</style>
</head>
<body>

<header class="hero"><div class="wrap">
  <h1>IR-01 Exam Reference <small>التصوير الإشعاعي الصناعي والحماية من الإشعاع</small></h1>
</div></header>

<div class="bar"><div class="wrap">
  <input type="search" id="q" placeholder="ابحث في المحاور… (مثال: Ir-192، ALARA، R-01)" aria-label="بحث">
  <div class="prog"><span id="pt">0/15</span><div class="track"><div class="fill" id="pf"></div></div></div>
  <button class="theme" id="th" title="تبديل الوضع" aria-label="تبديل الوضع">◐</button>
</div></div>

<main class="wrap">

<div class="tabs" id="tabs"></div>
<div class="flt"><select id="fa" aria-label="المحور"></select><select id="fs" aria-label="الحالة"><option value="">كل الحالات</option><option value="1">✓ موثّق</option><option value="0">⚠ يحتاج مراجعة</option></select></div>
<div id="views" class="hid2"></div>
<nav class="chips" id="chips"></nav>

<div class="panel">
  <h3 style="margin-top:0">المراجع المعتمدة</h3>
  <div class="tbl"><table>
    <tr><th>الرمز</th><th>المرجع</th></tr>
    <tr><td><span class="ltr">TCS-85</span></td><td>IAEA Training Course Series No. 85 — المنهج التدريبي لـ RPO في التصوير الصناعي (12 Topic)</td></tr>
    <tr><td><span class="ltr">R-01</span></td><td>NRRC-R-01 — لائحة السلامة الإشعاعية (هيئة الرقابة النووية والإشعاعية)</td></tr>
    <tr><td><span class="ltr">SG-002</span></td><td>NRRC-SG-002 — دليل التصوير الصناعي ومتطلبات الترخيص</td></tr>
    <tr><td><span class="ltr">SSG-11</span></td><td>IAEA SSG-11 — Radiation Safety in Industrial Radiography</td></tr>
    <tr><td>الشرائح</td><td>شرائح الدورة التدريبية في الحماية من الإشعاع (Technology Experts)</td></tr>
  </table></div>
  <p class="ref">ملاحظة: أرقام صفحات TCS-85 هي أرقام الصفحات المطبوعة حسب فهرس الوثيقة.</p>
</div>

<div class="panel">
  <h3 style="margin-top:0">جدول الخريطة</h3>
  <div class="tbl"><table>
    <tr><th>#</th><th>المحور</th><th>الأولوية</th><th>طريقة المذاكرة</th><th>المرجع الأساسي</th></tr>
    <tr><td>01</td><td>RPO/RSO — الدور والمسؤوليات</td><td>🔴 عالية جدًا</td><td>حفظ + فهم</td><td>TCS-85 Topic 1 (ص 9) + R-01 م 69، 76–80 (ص 34–35)</td></tr>
    <tr><td>02</td><td>أساسيات الإشعاع والفيزياء النووية</td><td>🔴 عالية جدًا</td><td>فهم</td><td>TCS-85 Topic 2 (ص 11) + الشرائح (الفصلان 1–2)</td></tr>
    <tr><td>03</td><td>الكميات والوحدات الإشعاعية</td><td>🔴 عالية جدًا</td><td>فهم + حساب</td><td>TCS-85 Topic 3 (ص 12) + الشرائح (الفصل 3)</td></tr>
    <tr><td>04</td><td>المصادر المشعة والمواد المشعة</td><td>🔴 عالية جدًا</td><td>فهم + حفظ</td><td>TCS-85 Topic 4 (ص 13) + SSG-11 Annex II (Table II–1)</td></tr>
    <tr><td>05</td><td>أجهزة ومعدات التصوير الصناعي</td><td>🔴 عالية جدًا</td><td>فهم + تمييز</td><td>TCS-85 Topic 4 (ص 13) + SSG-11 Annex II + SG-002 (6.6.3)</td></tr>
    <tr><td>06</td><td>التأثيرات الصحية للإشعاع</td><td>🔴 عالية جدًا</td><td>فهم + حفظ</td><td>TCS-85 Topic 5 (ص 14) + الشرائح (الفصل 3)</td></tr>
    <tr><td>07</td><td>مبادئ الحماية من الإشعاع</td><td>🔴 عالية جدًا</td><td>فهم + حفظ</td><td>TCS-85 Topic 6 (ص 15) + R-01 م 21–24 (ص 27)</td></tr>
    <tr><td>08</td><td>وسائل التحكم وتقليل الجرعة</td><td>🔴 عالية جدًا</td><td>فهم + تطبيق</td><td>TCS-85 Topic 7 (ص 16) + SSG-11 (11.11–11.15)</td></tr>
    <tr><td>09</td><td>أجهزة الكشف والقياس والمراقبة</td><td>🔴 عالية جدًا</td><td>فهم + تطبيق</td><td>TCS-85 Topics 4/7/10 + الشرائح (الفصل 5) + SG-002</td></tr>
    <tr><td>10</td><td>برنامج الحماية الإشعاعية RPP</td><td>🔴 عالية جدًا</td><td>فهم + حفظ</td><td>TCS-85 Topic 10 (ص 22) + R-01 م 73–75 + SG-002 (ق 8، 8.5)</td></tr>
    <tr><td>11</td><td>التنظيم والترخيص وتقييم السلامة</td><td>🔴 عالية جدًا</td><td>حفظ + فهم</td><td>TCS-85 Topics 8–9 (ص 18–19) + R-01 + SG-002 + الشرائح (الفصل 6)</td></tr>
    <tr><td>12</td><td>أمن المصادر المشعة</td><td>🟠 عالية</td><td>فهم + حفظ</td><td>SG-002 (ق 9: Security Plan) + SSG-11</td></tr>
    <tr><td>13</td><td>نقل المصادر المشعة</td><td>🟠 عالية</td><td>حفظ + فهم</td><td>TCS-85 Topic 11 (ص 26) — SSR-6 Rev.1</td></tr>
    <tr><td>14</td><td>الطوارئ والحوادث والاستجابة</td><td>🔴 عالية جدًا</td><td>فهم + سيناريوهات</td><td>TCS-85 Topic 12 (ص 27) + SSG-11 (13.12–13.13) + R-01 م 302–304</td></tr>
    <tr><td>15</td><td>الحسابات والمسائل التطبيقية</td><td>🔴 عالية جدًا</td><td>حل مسائل</td><td>TCS-85 Topics 2/3/7 (تمارين) + الشرائح (الفصل 4)</td></tr>
  </table></div>
  <h3>التسلسل المنطقي للمذاكرة</h3>
  <p class="ltr" style="direction:ltr;text-align:left">RPO → Physics → Quantities → Sources → Equipment → Health → Principles → Control → Monitoring → RPP → Regulation → Security → Transport → Emergency → Calculations</p>

  <h3>ربط المحاور بموضوعات TCS-85</h3>
  <div class="tbl"><table>
    <tr><th>Topic في TCS-85</th><th>المحور</th></tr>
    <tr><td class="ltr">Topic 1 — Concept of the RPO</td><td>01</td></tr>
    <tr><td class="ltr">Topic 2 — Basic Concepts of Ionizing Radiation</td><td>02</td></tr>
    <tr><td class="ltr">Topic 3 — Quantities and Units</td><td>03</td></tr>
    <tr><td class="ltr">Topic 4 — Sources, Facilities and Equipment</td><td>04 + 05</td></tr>
    <tr><td class="ltr">Topic 5 — Health Effects</td><td>06</td></tr>
    <tr><td class="ltr">Topic 6 — Principles of Radiation Protection</td><td>07</td></tr>
    <tr><td class="ltr">Topic 7 — Control Measures and Dose Reduction</td><td>08 (+ 09 + 15)</td></tr>
    <tr><td class="ltr">Topic 8 — Framework for Radiation Protection</td><td>11</td></tr>
    <tr><td class="ltr">Topic 9 — Responsibilities of Employers &amp; Authorized Parties</td><td>01 + 11</td></tr>
    <tr><td class="ltr">Topic 10 — Radiation Protection Programme</td><td>10 (+ 09 + 12)</td></tr>
    <tr><td class="ltr">Topic 11 — Transport Safety</td><td>13</td></tr>
    <tr><td class="ltr">Topic 12 — Emergency Preparedness and Response</td><td>14</td></tr>
  </table></div>
</div>

<!-- 01 -->
<section class="card" id="s01" data-n="01" data-t="RPO/RSO — الدور والمسؤوليات">
  <h2><span class="num">01</span>RPO / RSO: الدور والمسؤوليات <span class="tag hi">عالية جدًا</span><span class="tag way">حفظ + فهم</span></h2>
  <h3>ذاكر</h3>
  <ul>
    <li>تعريف Radiation Protection Officer / Radiation Safety Officer</li>
    <li>دور RPO في المنشأة</li>
    <li>مسؤوليات RPO وصلاحياته</li>
    <li>العلاقة بين: Authorized Person — RPO/RSO — Qualified Expert — Workers — Employer — Regulator (NRRC)</li>
    <li>المسؤولية الأساسية عن الحماية والسلامة (Prime Responsibility)</li>
    <li>التدريب والكفاءة</li>
    <li>التواصل مع الجهة الرقابية</li>
    <li>الإبلاغ عن المشاكل والحوادث</li>
    <li>متابعة Radiation Protection Program</li>
    <li>متى يمكن إيقاف النشاط عند وجود خطر</li>
  </ul>
  <h3>نصوص R-01 التي يجب حفظها (ص 34–35)</h3>
  <div class="tbl"><table>
    <tr><th>المادة</th><th>المضمون</th></tr>
    <tr><td>69</td><td>الـ Authorized Person يحتفظ بالمسؤولية الأساسية عن الحماية والسلامة طوال مدة الممارسة</td></tr>
    <tr><td>76</td><td>الـ Authorized Person يعيّن RSO وفق المعايير التي تحددها NRRC</td></tr>
    <tr><td>77</td><td>مهمة RSO: مساعدة الـ Authorized Person في تنفيذ الحماية، والإشراف على تنفيذ RPP، والعمل كحلقة اتصال مع NRRC</td></tr>
    <tr><td>78</td><td>تعيين أو استبدال RSO يتطلب موافقة NRRC</td></tr>
    <tr><td>80</td><td>يجب منح RSO صلاحية كافية لأداء مهامه، مع ضمان وجوده المستمر طوال مدة الممارسة</td></tr>
  </table></div>
  <div class="note red"><b>مهم جدًا:</b> المسؤولية الأساسية لا تنتقل إلى RSO أو Qualified Expert بمجرد تعيينهما — تبقى على الـ Authorized Person ولا يمكن تفويضها.</div>
  <p><b>أسئلة متوقعة:</b> من يتحمل المسؤولية الأساسية؟ من يعيّن RSO؟ هل يحتاج تغيير RSO إلى موافقة؟ ما الفرق بين RSO وQualified Expert؟</p>
</section>

<!-- 02 -->
<section class="card" id="s02" data-n="02" data-t="أساسيات الإشعاع والفيزياء النووية">
  <h2><span class="num">02</span>أساسيات الإشعاع والفيزياء النووية <span class="tag hi">عالية جدًا</span><span class="tag way">فهم</span></h2>
  <h3>Atomic &amp; Nuclear Structure</h3>
  <div class="terms"><span>Atom</span><span>Proton</span><span>Neutron</span><span>Electron</span><span>Atomic number Z</span><span>Mass number A</span><span>Isotopes</span><span>Nuclides</span><span>Stable / unstable atoms</span><span>Radioisotopes</span></div>
  <h3>Ionizing Radiation</h3>
  <div class="terms"><span>Ionization</span><span>Excitation</span><span>Ionizing vs non-ionizing radiation</span><span>Electromagnetic radiation</span></div>
  <h3>أنواع الإشعاع</h3>
  <div class="terms"><span>Alpha</span><span>Beta⁻</span><span>Positron</span><span>Electron capture</span><span>Gamma</span><span>X-ray</span><span>Neutron</span></div>
  <h3>Radioactive Decay</h3>
  <div class="terms"><span>Radioactive decay</span><span>Half-life</span><span>Decay constant</span><span>Activity</span></div>
  <h3>X-ray Production</h3>
  <div class="terms"><span>X-ray generator</span><span>Accelerating voltage (kV)</span><span>Tube current (mA)</span><span>Filtration</span><span>Bremsstrahlung</span><span>Characteristic X-rays</span><span>X-ray spectrum</span><span>Primary radiation</span><span>Scattered radiation</span></div>
  <h3>Interactions</h3>
  <div class="terms"><span>Photoelectric effect</span><span>Compton scattering</span><span>Pair production</span><span>Attenuation</span></div>
  <div class="note green"><b>تمييز مهم:</b>
    <ul>
      <li><b>Gamma:</b> من النواة، طيف خطي (طاقات محددة)، لا يمكن إيقافه — المصدر يشع دائمًا.</li>
      <li><b>X-ray:</b> من إلكترونات مسرّعة، طيف مستمر (Bremsstrahlung) + خطوط مميزة، يتوقف بفصل الكهرباء.</li>
      <li><b>Pair production</b> يحتاج طاقة فوتون ≥ 1.022 MeV.</li>
    </ul>
  </div>
</section>

<!-- 03 -->
<section class="card" id="s03" data-n="03" data-t="الكميات والوحدات الإشعاعية">
  <h2><span class="num">03</span>الكميات والوحدات <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + حساب</span></h2>
  <div class="tbl"><table>
    <tr><th>الكمية</th><th>الوحدة</th><th>ملاحظة</th></tr>
    <tr><td>Activity</td><td>Bq (تحلل/ث) — Ci</td><td>1 Ci = 3.7 × 10¹⁰ Bq = 37 GBq</td></tr>
    <tr><td>Specific activity</td><td>Bq/kg (أو Bq/g)</td><td>النشاط لكل وحدة كتلة</td></tr>
    <tr><td>Energy</td><td>eV — keV — MeV</td><td></td></tr>
    <tr><td>Absorbed dose</td><td>Gy = J/kg</td><td>كمية فيزيائية</td></tr>
    <tr><td>Equivalent dose</td><td>Sv</td><td class="ltr">H<sub>T</sub> = Σ w<sub>R</sub> D<sub>T,R</sub></td></tr>
    <tr><td>Effective dose</td><td>Sv</td><td class="ltr">E = Σ w<sub>T</sub> H<sub>T</sub></td></tr>
    <tr><td>Committed dose</td><td>Sv</td><td>للتعرض الداخلي</td></tr>
    <tr><td>Dose rate</td><td>Sv/h — mSv/h — μSv/h</td><td></td></tr>
  </table></div>
  <h3>Operational Quantities</h3>
  <ul>
    <li><span class="ltr">H*(10)</span> — Ambient dose equivalent → لقياس المنطقة (Survey meter)</li>
    <li><span class="ltr">Hp(10)</span> — Personal dose equivalent (عمق 10 mm) → للجرعة الفعالة</li>
    <li><span class="ltr">Hp(0.07)</span> → للجلد والأطراف</li>
    <li><span class="ltr">Hp(3)</span> → لعدسة العين</li>
  </ul>
  <h3>Exposure</h3>
  <div class="terms"><span>External exposure</span><span>Internal exposure</span></div>
  <h3>Weighting Factors</h3>
  <ul>
    <li>Radiation weighting factor w<sub>R</sub>: فوتونات وإلكترونات = 1، ألفا = 20 (SG-002)</li>
    <li>Tissue weighting factor w<sub>T</sub></li>
    <li>RBE</li>
  </ul>
  <p class="ref">TCS-85 يميّز بين physical quantities وprotection quantities وoperational quantities، ويتضمن تمارين على تحويل Ci إلى Bq والاضمحلال وحساب الجرعة.</p>
</section>

<!-- 04 -->
<section class="card" id="s04" data-n="04" data-t="المصادر المشعة والمواد المشعة Co-60 Ir-192 Se-75">
  <h2><span class="num">04</span>المصادر المشعة والمواد المشعة <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + حفظ</span></h2>
  <h3>ركز على</h3>
  <div class="terms"><span>Sealed source</span><span>Radioactive material</span><span>Source capsule</span><span>Source assembly</span><span>Source strength/activity</span><span>Source size</span><span>Gamma energy</span><span>Source categorization</span></div>
  <h3>المصادر الشائعة في Industrial Radiography (SSG-11 — Table II–1)</h3>
  <div class="tbl"><table>
    <tr><th>المصدر</th><th>طاقة جاما</th><th>Half-life</th><th>ناتج المصدر عند 1 m (mSv/h لكل 37 GBq)</th><th>سماكة الحديد النموذجية</th></tr>
    <tr><td>Co-60</td><td>1.17 و1.33 MeV</td><td>5.3 سنة</td><td>13.0</td><td>50–120 mm</td></tr>
    <tr><td>Ir-192</td><td>206–612 keV</td><td>74 يوم</td><td>4.8</td><td>12–70 mm</td></tr>
    <tr><td>Se-75</td><td>97–401 keV</td><td>120 يوم</td><td>2.03</td><td>8–30 mm</td></tr>
    <tr><td>Yb-169</td><td>63–308 keV</td><td>32 يوم</td><td>1.25</td><td>4–20 mm</td></tr>
    <tr><td>Tm-170</td><td>51–84 keV</td><td>128 يوم</td><td>0.25</td><td>2.5–12.5 mm</td></tr>
  </table></div>
  <div class="note green"><b>Ir-192</b> هو الأكثر استخدامًا في التصوير الصناعي.</div>
  <div class="note"><b>تصحيح:</b> Cs-137 ليس من المصادر الشائعة في التصوير الصناعي ولا يرد في جدول SSG-11؛ استُبدل بـ Se-75. يمكن أن تعرفه عامةً (عمر نصف ~30 سنة، 662 keV) لأنه يظهر في أسئلة الفيزياء والمعايرة.</div>
  <h3>اربط كل مصدر بـ</h3>
  <div class="terms"><span>Half-life</span><span>Gamma energy</span><span>Activity</span><span>Penetration</span><span>الاستخدام</span></div>
  <h3>كذلك</h3>
  <div class="terms"><span>Source accountancy</span><span>Leak testing (وفق ISO وشهادة سارية)</span><span>Source identification</span><span>Source security</span><span>Source storage</span></div>
</section>

<!-- 05 -->
<section class="card" id="s05" data-n="05" data-t="أجهزة ومعدات التصوير الصناعي">
  <h2><span class="num">05</span>أجهزة ومعدات التصوير الصناعي <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + تمييز</span></h2>
  <p>افهم وظيفة كل جزء، لا الأسماء فقط.</p>
  <h3>Gamma Radiography</h3>
  <div class="terms"><span>Exposure device</span><span>Source changer</span><span>Guide tube</span><span>Control tube</span><span>Drive cable</span><span>Wind-out cable</span><span>Pigtail</span><span>Source assembly</span><span>Collimator</span><span>Shielded container</span></div>
  <h3>تصنيف أجهزة التعريض (SSG-11 — II–4)</h3>
  <div class="tbl"><table>
    <tr><th>الفئة</th><th>المعنى</th></tr>
    <tr><td>Class P</td><td>Portable — يُحمل باليد، لا تتجاوز كتلته 50 kg</td></tr>
    <tr><td>Class M</td><td>Mobile — يُنقل بعربة أو وسيلة مخصصة</td></tr>
    <tr><td>Class F</td><td>Fixed — ثابت أو مقيّد داخل موقع محدد مثل Shielded enclosure</td></tr>
  </table></div>
  <h3>X-ray Radiography</h3>
  <div class="terms"><span>X-ray generator</span><span>X-ray tube</span><span>Control console</span><span>kV</span><span>mA</span><span>Filtration</span><span>Beam</span><span>Interlock</span><span>Warning lights</span><span>Radiation alarms</span></div>
  <h3>Facility</h3>
  <div class="terms"><span>Shielded enclosure</span><span>Shielding</span><span>Controlled area</span><span>Supervised area</span><span>Site radiography</span></div>
  <p class="ref">SG-002 (6.6.3 — Location for site radiography) يذكر معدات الموقع: X-ray generators، collimators، guide tubes، monitoring equipment، personal dosimeters وalarm dosimeters، ومعدات الطوارئ.</p>
</section>

<!-- 06 -->
<section class="card" id="s06" data-n="06" data-t="التأثيرات الصحية للإشعاع">
  <h2><span class="num">06</span>التأثيرات الصحية للإشعاع <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + حفظ</span></h2>
  <h3>Biological Effects</h3>
  <div class="terms"><span>Ionization</span><span>Molecular damage</span><span>DNA damage</span><span>Chromosome damage</span><span>Cell sensitivity</span></div>
  <h3>نوعا التأثيرات</h3>
  <div class="tbl"><table>
    <tr><th></th><th>Deterministic / Tissue Reactions</th><th>Stochastic</th></tr>
    <tr><td>العتبة</td><td>لها عتبة (Threshold)</td><td>بلا عتبة</td></tr>
    <tr><td>الجرعة تؤثر على</td><td>الشدة (Severity)</td><td>الاحتمال (Probability)</td></tr>
    <tr><td>أمثلة</td><td>Cataract — Erythema — Hair loss — ARS — Tissue injury</td><td>Cancer — Hereditary effects</td></tr>
  </table></div>
  <h3>العلاقة المحورية</h3>
  <p class="ltr" style="direction:ltr"><b>Dose → Biological effect → Probability / Severity</b></p>
  <p class="ref">TCS-85 Topic 5 يستخدم حادث Yanango (Peru) لتوضيح التأثيرات الحتمية في حوادث التصوير الصناعي.</p>
</section>

<!-- 07 -->
<section class="card" id="s07" data-n="07" data-t="مبادئ الحماية من الإشعاع ALARA حدود الجرعة">
  <h2><span class="num">07</span>مبادئ الحماية من الإشعاع <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + حفظ</span></h2>
  <div class="tbl"><table>
    <tr><th>المبدأ</th><th>السؤال</th></tr>
    <tr><td>1. Justification</td><td>هل استخدام الإشعاع مبرر (الفائدة &gt; الضرر)؟</td></tr>
    <tr><td>2. Optimization</td><td>هل الحماية محسّنة إلى أدنى مستوى معقول (ALARA)؟</td></tr>
    <tr><td>3. Dose Limitation</td><td>هل الجرعات ضمن الحدود المقررة؟</td></tr>
  </table></div>
  <p class="ltr" style="direction:ltr"><b>ALARA = As Low As Reasonably Achievable</b></p>
  <p>واربط معها: Dose constraints — Reference levels — Dose limits</p>
  <div class="note red">⚠️ لا تعتبر ALARA = Dose Limit. ALARA مرتبط بالـ Optimization، أما Dose Limit فحد تنظيمي.</div>
  <ul>
    <li><b>Dose constraint</b> → للتعرض المخطط (Planned)</li>
    <li><b>Reference level</b> → للطوارئ والتعرض القائم (R-01 م 21)</li>
  </ul>
  <h3>حدود الجرعة في R-01 (م 22–24، ص 27) — احفظها</h3>
  <div class="tbl"><table>
    <tr><th>الفئة</th><th>Effective dose</th><th>عدسة العين</th><th>الجلد / الأطراف</th></tr>
    <tr><td>العاملون (&gt; 18 سنة)</td><td>20 mSv/سنة متوسط 5 سنوات (100 mSv/5 سنوات)، وبحد أقصى 50 mSv في سنة واحدة</td><td>20 mSv/سنة متوسط 5 سنوات، وبحد أقصى 50 mSv في سنة واحدة</td><td>500 mSv/سنة</td></tr>
    <tr><td>المتدربون والطلاب (16–18 سنة)</td><td>6 mSv/سنة</td><td>20 mSv/سنة</td><td>150 mSv/سنة</td></tr>
    <tr><td>الجمهور</td><td>1 mSv/سنة</td><td>15 mSv/سنة</td><td>50 mSv/سنة</td></tr>
    <tr><td>الجنين / الرضيع (بعد إبلاغ العاملة)</td><td>1 mSv</td><td>—</td><td>—</td></tr>
  </table></div>
</section>

<!-- 08 -->
<section class="card" id="s08" data-n="08" data-t="وسائل التحكم وتقليل الجرعة الزمن المسافة التدريع">
  <h2><span class="num">08</span>وسائل التحكم وتقليل الجرعة <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + تطبيق</span></h2>
  <p class="ltr" style="direction:ltr"><b>Time — Distance — Shielding</b></p>
  <ul>
    <li><b>Time:</b> تقليل زمن التعرض</li>
    <li><b>Distance:</b> زيادة المسافة (Inverse Square Law)</li>
    <li><b>Shielding:</b> التدريع المناسب (HVL / TVL)</li>
  </ul>
  <h3>كذلك</h3>
  <div class="terms"><span>Controlled area</span><span>Supervised area</span><span>Barriers</span><span>Warning signs</span><span>Warning lights</span><span>Audible alarms</span><span>Interlocks</span><span>Collimators</span><span>Remote operation</span><span>Administrative controls</span><span>Engineering controls</span><span>PPE</span></div>
  <h3>Site Radiography (SSG-11 — 11.11–11.15)</h3>
  <ul>
    <li>العمل يجب أن يكون داخل Controlled area ولا يُسمح بأي عمل آخر فيها.</li>
    <li>قد تحدد الجهة الرقابية معدل جرعة أقصى عند الحواجز — قيم نموذجية 2.5–20 μSv/h.</li>
    <li>استخدم الـ Collimator والتدريع الموضعي (مثل ألواح الرصاص) لتصغير المنطقة.</li>
    <li>حدد الحدود ماديًا (جدران، حواجز مؤقتة، شريط) وامنع الدخول غير المصرح.</li>
    <li>انتبه للطوابق العليا والسفلى والسلالم.</li>
    <li>ضع لوحة التحكم أو Wind-out في موقع يقلل جرعة المصوّر.</li>
  </ul>
  <h3>معادلات أساسية</h3>
  <div class="formula">I₁·d₁² = I₂·d₂² &nbsp;⇒&nbsp; I₂ = I₁ · (d₁ / d₂)²<small>قانون التربيع العكسي</small></div>
  <p class="ref">TCS-85 Topic 7 يتضمن مسائل مثل حساب Dose rate والمسافة اللازمة لحاجز Controlled area.</p>
</section>

<!-- 09 -->
<section class="card" id="s09" data-n="09" data-t="أجهزة الكشف والقياس والمراقبة Survey meter dosimeter">
  <h2><span class="num">09</span>أجهزة الكشف والقياس والمراقبة <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + تطبيق</span></h2>
  <h3>Detection</h3>
  <div class="terms"><span>Ionization chamber</span><span>Proportional counter</span><span>GM detector</span><span>Scintillation detector</span><span>Neutron detector</span></div>
  <h3>Monitoring</h3>
  <div class="terms"><span>Survey meter</span><span>Dose rate meter</span><span>Personal dosimeter</span><span>Alarm dosimeter</span><span>Area monitoring</span><span>Workplace monitoring</span><span>Individual monitoring</span></div>
  <h3>افهم المنطق</h3>
  <p><b>الجهاز → ماذا يقيس؟ → أين يُستخدم؟ → لماذا يُستخدم؟</b></p>
  <div class="tbl"><table>
    <tr><th>الجهاز</th><th>يقيس</th><th>الاستخدام</th></tr>
    <tr><td>Survey meter</td><td>Dose rate (μSv/h)</td><td>مسح المنطقة، حدود Controlled area، التأكد من عودة المصدر</td></tr>
    <tr><td>Personal dosimeter (TLD/OSL)</td><td>الجرعة المتراكمة Hp(10)</td><td>سجل الجرعة الرسمي للعامل</td></tr>
    <tr><td>Alarm dosimeter</td><td>جرعة/معدل جرعة لحظي مع إنذار</td><td>تحذير فوري في الموقع — لا يغني عن Survey meter</td></tr>
  </table></div>
  <div class="note red"><b>قاعدة ذهبية:</b> بعد كل Exposure بمصدر جاما يجب استخدام Survey meter للتأكد من عودة المصدر إلى الوضع الآمن داخل الجهاز (SG-002 / SSG-11).</div>
</section>

<!-- 10 -->
<section class="card" id="s10" data-n="10" data-t="برنامج الحماية الإشعاعية RPP">
  <h2><span class="num">10</span>Radiation Protection Program — RPP <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + حفظ</span></h2>
  <h3>نصوص R-01 (م 73–75)</h3>
  <ul>
    <li><b>73:</b> الـ Authorized Person يصمم وينفذ RPP قادرًا على ضمان الحماية والسلامة.</li>
    <li><b>74:</b> يقدّم المتقدم وثائق RPP ضمن طلب الترخيص.</li>
    <li><b>75:</b> تُراجع الوثائق وتُحدّث لتعكس الوضع الفعلي للتدابير المطبقة.</li>
  </ul>
  <h3>محتوى RPP</h3>
  <div class="terms"><span>Radiation protection policy</span><span>Responsibilities</span><span>Local rules</span><span>Procedures</span><span>Worker training</span><span>Information</span><span>Individual monitoring</span><span>Workplace monitoring</span><span>Health surveillance</span><span>Exposure assessment</span><span>Equipment testing</span><span>Maintenance</span><span>Calibration</span><span>Source accountancy</span><span>Leak testing</span><span>Records</span><span>Reporting</span><span>Periodic review</span><span>Audit</span><span>Corrective actions</span></div>
  <h3>Site Radiography ضمن RPP</h3>
  <div class="terms"><span>Site assessment</span><span>Coordination with client</span><span>Time schedule</span><span>Controlled area</span><span>Temporary shielding</span><span>Warning signs</span><span>Warning signals</span><span>Monitoring</span><span>Emergency preparedness</span></div>
  <p class="ref">SG-002 القسم 8 و8.5 (Arrangements for the RPP) يطلب: التحكم في التعرض، التسجيل والإبلاغ، المراقبة الفردية، والتدقيق والمراجعة.</p>
</section>

<!-- 11 -->
<section class="card" id="s11" data-n="11" data-t="التنظيم والترخيص وتقييم السلامة Qualified Expert">
  <h2><span class="num">11</span>التنظيم والترخيص وتقييم السلامة <span class="tag hi">عالية جدًا</span><span class="tag way">حفظ + فهم</span></h2>
  <h3>Regulatory Framework</h3>
  <div class="terms"><span>NRRC</span><span>Authorized Person</span><span>Licensee</span><span>Authorization</span><span>Notification</span><span>Licensing</span><span>Regulatory requirements</span></div>
  <h3>Safety Assessment</h3>
  <div class="terms"><span>Purpose</span><span>Scope</span><span>Identification of hazards</span><span>Assessment of risks</span><span>Control measures</span><span>Review</span></div>
  <h3>Management System</h3>
  <div class="terms"><span>Safety culture</span><span>Responsibilities</span><span>Training</span><span>Competence</span><span>Records</span><span>Corrective actions</span><span>Lessons learned</span></div>
  <h3>Qualified Expert</h3>
  <div class="terms"><span>Role</span><span>Qualifications</span><span>When expert advice is needed (مثل: زيادة تكرار Leak test أو تقييم المصدر — SSG-11)</span></div>
  <div class="note red"><b>نقطة مهمة جدًا:</b> <span class="ltr">Authorized Person ≠ RSO ≠ Qualified Expert</span></div>
  <div class="tbl"><table>
    <tr><th></th><th>Authorized Person</th><th>RSO</th><th>Qualified Expert</th></tr>
    <tr><td>الدور</td><td>صاحب الترخيص</td><td>ينفذ ويشرف على RPP، حلقة اتصال مع NRRC</td><td>يقدم المشورة المتخصصة</td></tr>
    <tr><td>المسؤولية الأساسية</td><td>نعم — لا تُفوَّض</td><td>لا</td><td>لا</td></tr>
  </table></div>
</section>

<!-- 12 -->
<section class="card" id="s12" data-n="12" data-t="أمن المصادر المشعة Security">
  <h2><span class="num">12</span>أمن المصادر المشعة <span class="tag mid">عالية</span><span class="tag way">فهم + حفظ</span></h2>
  <h3>Source Security</h3>
  <div class="terms"><span>Source categorization</span><span>Security levels</span><span>Physical security</span><span>Access control</span><span>Barriers</span><span>Source storage</span><span>Source inventory/accountancy</span><span>Security responsibilities</span><span>Security training</span><span>Security program</span><span>Protection against unauthorized access</span><span>Loss/theft prevention</span></div>
  <p class="ref">SG-002 القسم 9 (Radioactive Sources Security Plan) يطلب: تصنيف المصادر، مستويات الأمن، وصف الموقع والعمليات، ومتطلبات تدريب وتأهيل الأشخاص ذوي المسؤوليات الأمنية.</p>
  <div class="note green"><b>ميّز:</b> Safety (منع الحوادث غير المقصودة) ≠ Security (منع الأفعال المتعمدة: سرقة، تخريب، وصول غير مصرح).</div>
</section>

<!-- 13 -->
<section class="card" id="s13" data-n="13" data-t="نقل المصادر المشعة Transport Index">
  <h2><span class="num">13</span>نقل المصادر المشعة <span class="tag mid">عالية</span><span class="tag way">حفظ + فهم</span></h2>
  <h3>احفظ</h3>
  <div class="terms"><span>Consignor</span><span>Consignee</span><span>Carrier</span><span>Driver</span><span>Packaging</span><span>Labelling</span><span>Marking</span><span>Transport Index (TI)</span><span>Placarding</span><span>Transport documents</span><span>Checks and measurements</span><span>Emergency response</span><span>Training</span><span>Management system</span></div>
  <div class="note green"><b>Transport Index (TI):</b> أعلى معدل جرعة عند 1 m من سطح الطرد بوحدة mSv/h × 100.</div>
  <p class="ref">TCS-85 Topic 11 يعتمد على SSR-6 Rev.1.</p>
</section>

<!-- 14 -->
<section class="card" id="s14" data-n="14" data-t="الطوارئ والحوادث والاستجابة مصدر عالق">
  <h2><span class="num">14</span>الطوارئ والحوادث والاستجابة <span class="tag hi">عالية جدًا</span><span class="tag way">فهم + سيناريوهات</span></h2>
  <h3>Emergency Preparedness</h3>
  <div class="terms"><span>Emergency plan</span><span>Emergency preparedness</span><span>Emergency response</span><span>Accident prevention</span><span>Accident mitigation</span><span>Lost source</span><span>Stuck source</span><span>Source recovery</span><span>Source security</span><span>Notification/reporting</span><span>Radiation survey</span><span>Controlled area</span><span>Prevent unauthorized approach</span></div>
  <h3>سيناريوهات جاما التي يجب أن تغطيها خطة الطوارئ (SSG-11 — 13.12)</h3>
  <ul>
    <li>مصدر عالق في Guide tube أو Collimator أو قرب مدخل الجهاز</li>
    <li>ضرر مادي يؤثر على التدريع</li>
    <li>انفصال المصدر عن Drive cable وبقاؤه في Guide tube</li>
    <li>خروج المصدر من نهاية Guide tube</li>
    <li>Pipeline crawler عالق والمصدر مكشوف</li>
    <li>فقدان المصدر</li>
    <li>حريق</li>
    <li>وجود أشخاص غير مصرح لهم في Controlled area أثناء التعريض</li>
  </ul>
  <h3>الجرعات في الطوارئ (R-01 م 302–304)</h3>
  <p>لا يتعرض أي شخص لأكثر من 50 mSv في حالة الطوارئ إلا ضمن الحالات المحددة، ويجب إبلاغ عمال الطوارئ الذين قد تتجاوز جرعاتهم 50 mSv بالمخاطر مسبقًا.</p>
  <div class="note red"><b>مهم:</b> لا تحفظ "خطوات إنقاذ" من مصادر غير رسمية. ركز على المبدأ والتسلسل:<br>ابتعد ← وسّع المنطقة وامنع الاقتراب ← قِس ← أبلغ RSO والجهة الرقابية ← نفّذ الإجراء المعتمد في الخطة المحلية.</div>
  <h3>حوادث حقيقية في TCS-85</h3>
  <div class="terms"><span>Yanango (Peru)</span><span>Gilan (Iran)</span><span>Cochabamba (Bolivia)</span><span>Chilca (Peru)</span></div>
</section>

<!-- 15 -->
<section class="card" id="s15" data-n="15" data-t="الحسابات والمسائل التطبيقية HVL TVL decay">
  <h2><span class="num">15</span>الحسابات والمسائل التطبيقية <span class="tag hi">عالية جدًا</span><span class="tag way">حل مسائل</span></h2>

  <h3>A — Radioactive Decay</h3>
  <div class="formula">A = A₀·e<sup>−λt</sup> &nbsp;,&nbsp; λ = 0.693 / T<sub>½</sub> &nbsp;,&nbsp; A = A₀·(½)<sup>t / T½</sup></div>
  <h3>B — Attenuation</h3>
  <div class="formula">I = I₀·e<sup>−μx</sup><small>μ: Linear attenuation coefficient — μ/ρ: Mass attenuation coefficient</small></div>
  <h3>C — HVL</h3>
  <div class="formula">HVL = 0.693 / μ &nbsp;,&nbsp; I / I₀ = (½)<sup>x / HVL</sup></div>
  <h3>D — TVL</h3>
  <div class="formula">I / I₀ = (0.1)<sup>x / TVL</sup> &nbsp;,&nbsp; TVL ≈ 3.32 × HVL</div>
  <h3>E — Inverse Square Law</h3>
  <div class="formula">I₁·d₁² = I₂·d₂²</div>
  <h3>F — Absorbed Dose</h3>
  <div class="formula">D = dε̄ / dm</div>
  <h3>G — Dose from Dose Rate</h3>
  <div class="formula">D = Ḋ × t</div>
  <h3>H — Activity</h3>
  <div class="formula">A = dN/dt = λN</div>
  <h3>I — Equivalent Dose</h3>
  <div class="formula">H<sub>T</sub> = Σ<sub>R</sub> w<sub>R</sub> · D<sub>T,R</sub></div>
  <h3>J — Effective Dose</h3>
  <div class="formula">E = Σ<sub>T</sub> w<sub>T</sub> · H<sub>T</sub></div>
  <h3>K — Dose Rate من مصدر (باستخدام جدول SSG-11)</h3>
  <div class="formula">Ḋ(1 m) = ناتج المصدر × (A ÷ 37 GBq) &nbsp;،&nbsp; Ḋ(d) = Ḋ(1 m) ÷ d²</div>
  <p>مثال: Ir-192 بنشاط 370 GBq (10 Ci) ← عند 1 m: 4.8 × 10 = 48 mSv/h، وعند 10 m: 0.48 mSv/h.</p>
  <h3>L — مسافة حاجز Controlled area</h3>
  <div class="formula">d = d₁ · √( Ḋ₁ / Ḋ<sub>limit</sub> )</div>
  <p>مثال: 48 mSv/h عند 1 m، والحد عند الحاجز 20 μSv/h ← d = √(48000/20) ≈ 49 m (بدون تدريع أو Collimator).</p>

  <h3>نموذج مسائل للتدريب</h3>
  <ol>
    <li>مصدر Ir-192 نشاطه 100 Ci، كم نشاطه بعد 148 يومًا؟ ← 2 Half-lives ← <b>25 Ci</b></li>
    <li>حوّل 50 Ci إلى GBq ← 50 × 37 = <b>1850 GBq</b></li>
    <li>معدل الجرعة 8 mSv/h عند 2 m، كم يكون عند 8 m؟ ← 8 × (2/8)² = <b>0.5 mSv/h</b></li>
    <li>معدل جرعة 400 μSv/h، كم HVL نحتاج لخفضه إلى 25 μSv/h؟ ← 400→200→100→50→25 ← <b>4 HVL</b></li>
    <li>عامل يعمل 30 دقيقة في 60 μSv/h ← <b>30 μSv</b></li>
  </ol>

  <h3>حاسبات تفاعلية</h3>
  <div class="calc">
    <div class="panel">
      <b>الاضمحلال الإشعاعي</b>
      <label>النشاط الابتدائي A₀</label><input id="c1a" type="number" value="100" step="any">
      <label>عمر النصف T½</label><input id="c1b" type="number" value="74" step="any">
      <label>الزمن t (بنفس وحدة T½)</label><input id="c1c" type="number" value="148" step="any">
      <div class="out" id="o1"></div>
    </div>
    <div class="panel">
      <b>التربيع العكسي</b>
      <label>معدل الجرعة عند d₁</label><input id="c2a" type="number" value="8" step="any">
      <label>المسافة d₁</label><input id="c2b" type="number" value="2" step="any">
      <label>المسافة d₂</label><input id="c2c" type="number" value="8" step="any">
      <div class="out" id="o2"></div>
    </div>
    <div class="panel">
      <b>عدد HVL المطلوب</b>
      <label>معدل الجرعة الابتدائي</label><input id="c3a" type="number" value="400" step="any">
      <label>معدل الجرعة المطلوب</label><input id="c3b" type="number" value="25" step="any">
      <div class="out" id="o3"></div>
    </div>
    <div class="panel">
      <b>مسافة حاجز Controlled area</b>
      <label>معدل الجرعة عند 1 m (mSv/h)</label><input id="c4a" type="number" value="48" step="any">
      <label>الحد عند الحاجز (μSv/h)</label><input id="c4b" type="number" value="20" step="any">
      <div class="out" id="o4"></div>
    </div>
    <div class="panel">
      <b>تحويل Ci ↔ GBq</b>
      <label>Ci</label><input id="c5a" type="number" value="50" step="any">
      <div class="out" id="o5"></div>
    </div>
  </div>
</section>

<div class="panel">
  <h2 style="margin-top:0">الخلاصة</h2>
  <p>أصبحت قائمتك 15 محورًا تغطي منهج RPO في TCS-85 بموضوعاته الـ12، وتربطه بالمتطلبات السعودية في NRRC-R-01 وNRRC-SG-002، مع أرقام فنية من SSG-11.</p>
  <h3>أعلى 10 نقاط تكرارًا في الاختبار</h3>
  <ol class="top10">
    <li>المسؤولية الأساسية للـ Authorized Person ولا تُفوَّض (R-01 م 69)</li>
    <li>تعيين RSO واستبداله يحتاج موافقة NRRC (م 76–78)</li>
    <li>حدود الجرعة: 20 / 50 / 100 mSv للعاملين — 1 mSv للجمهور</li>
    <li>Deterministic (عتبة + شدة) مقابل Stochastic (بلا عتبة + احتمال)</li>
    <li>ALARA ≠ Dose Limit</li>
    <li>Time — Distance — Shielding + Inverse Square Law</li>
    <li>خصائص Ir-192 (74 يوم) وCo-60 (5.3 سنة)</li>
    <li>Survey meter بعد كل تعريض</li>
    <li>السيناريوهات الطارئة: Stuck / Disconnected / Lost source</li>
    <li>HVL / TVL / الاضمحلال / تحويل Ci ↔ Bq</li>
  </ol>
</div>

</main>
<footer><div class="wrap">خريطة مذاكرة RPO / RSO — التصوير الإشعاعي الصناعي</div></footer>

<script>
(function(){
  var cards=[].slice.call(document.querySelectorAll('section.card'));
  var KEY='rpo-done-v1', done={};
  function load(){try{done=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){done={}}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
  load();

  // chips + checkboxes
  var chips=document.getElementById('chips');
  cards.forEach(function(c){
    var n=c.dataset.n;
    var a=document.createElement('a');a.href='#'+c.id;a.dataset.for=c.id;
    a.innerHTML='<b>'+n+'</b><span>'+c.dataset.t.split(' ').slice(0,3).join(' ')+'</span>';
    chips.appendChild(a);
    var row=document.createElement('div');row.className='done-row';
    row.innerHTML='<label><input type="checkbox"> تمت مذاكرة هذا المحور</label>';
    var cb=row.querySelector('input');cb.checked=!!done[c.id];
    cb.addEventListener('change',function(){done[c.id]=cb.checked;save();upd()});
    c.appendChild(row);
  });
  function upd(){
    var k=cards.filter(function(c){return done[c.id]}).length;
    document.getElementById('pt').textContent=k+'/'+cards.length;
    document.getElementById('pf').style.width=(k/cards.length*100)+'%';
    [].forEach.call(chips.children,function(a){a.classList.toggle('done',!!done[a.dataset.for])});
  }
  upd();

  // search
  var q=document.getElementById('q');
  q.addEventListener('input',function(){
    var v=q.value.trim().toLowerCase();
    cards.forEach(function(c){
      c.classList.toggle('hidden',v&&c.textContent.toLowerCase().indexOf(v)<0);
    });
  });

  // theme
  var th=document.getElementById('th'),root=document.documentElement;
  try{var t=localStorage.getItem('rpo-theme');if(t)root.dataset.theme=t}catch(e){}
  th.addEventListener('click',function(){
    var dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme=dark?'light':'dark';
    try{localStorage.setItem('rpo-theme',root.dataset.theme)}catch(e){}
  });

  // calculators
  function g(id){return parseFloat(document.getElementById(id).value)}
  function f(x){return isFinite(x)?(Math.abs(x)>=1000||(Math.abs(x)<0.01&&x!==0)?x.toExponential(3):+x.toPrecision(5)):'—'}
  function calc(){
    document.getElementById('o1').textContent='A = '+f(g('c1a')*Math.pow(.5,g('c1c')/g('c1b')))+'   ('+f(g('c1c')/g('c1b'))+' half-lives)';
    document.getElementById('o2').textContent='Ḋ₂ = '+f(g('c2a')*Math.pow(g('c2b')/g('c2c'),2));
    document.getElementById('o3').textContent=f(Math.log(g('c3a')/g('c3b'))/Math.LN2)+' HVL  |  '+f(Math.log10(g('c3a')/g('c3b')))+' TVL';
    document.getElementById('o4').textContent='d ≈ '+f(Math.sqrt(g('c4a')*1000/g('c4b')))+' m';
    var ci=g('c5a');document.getElementById('o5').textContent=f(ci*37)+' GBq = '+f(ci*3.7e10)+' Bq';
  }
  [].forEach.call(document.querySelectorAll('.calc input'),function(i){i.addEventListener('input',calc)});
  calc();
})();
</script>
<script>
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var NAMES={},REF={};
$$('tr').forEach(function(tr){var d=tr.children,n=d[0]&&d[0].textContent.trim();if(d.length==5&&/^\d\d$/.test(n)){NAMES[n]=d[1].textContent.trim();REF[n]=d[4].textContent.trim()}});
var V=[
['01','المسؤولية الأساسية','على الـ Authorized Person ولا تُفوَّض','R-01 م 69 (ص 34–35)',1],
['01','تعيين RSO','يعيّنه الـ Authorized Person وفق معايير NRRC','R-01 م 76 (ص 34–35)',1],
['01','تعيين/استبدال RSO','يتطلب موافقة NRRC','R-01 م 78 (ص 34–35)',1],
['01','صلاحية RSO','صلاحية كافية ووجود مستمر طوال الممارسة','R-01 م 80 (ص 34–35)',1],
['02','Pair production','طاقة الفوتون ≥ 1.022 MeV','',0],
['03','1 Ci','3.7×10¹⁰ Bq = 37 GBq','',0],
['03','w_R','فوتونات وإلكترونات = 1 ، ألفا = 20','SG-002 (بدون رقم بند)',0],
['04','Ir-192','206–612 keV | 74 يوم | 4.8 mSv/h لكل 37 GBq عند 1 m | حديد 12–70 mm','SSG-11 جدول II–1',1],
['04','Co-60','1.17 و1.33 MeV | 5.3 سنة | 13.0 | حديد 50–120 mm','SSG-11 جدول II–1',1],
['04','Se-75','97–401 keV | 120 يوم | 2.03 | حديد 8–30 mm','SSG-11 جدول II–1',1],
['04','Yb-169','63–308 keV | 32 يوم | 1.25 | حديد 4–20 mm','SSG-11 جدول II–1',1],
['04','Tm-170','51–84 keV | 128 يوم | 0.25 | حديد 2.5–12.5 mm','SSG-11 جدول II–1',1],
['05','Class P','محمول باليد، كتلته ≤ 50 kg','SSG-11 II–4',1],
['07','حد العاملين (فعّالة)','20 mSv/سنة متوسط 5 سنوات (100/5 سنوات) وأقصى 50 mSv في سنة','R-01 م 22–24 (ص 27)',1],
['07','حد العاملين (عدسة / جلد)','عدسة: 20 متوسط 5 سنوات وأقصى 50 | جلد وأطراف: 500 mSv/سنة','R-01 م 22–24 (ص 27)',1],
['07','المتدربون 16–18 سنة','6 mSv فعّالة | 20 عدسة | 150 جلد (سنويًا)','R-01 م 22–24 (ص 27)',1],
['07','الجمهور','1 mSv فعّالة | 15 عدسة | 50 جلد (سنويًا)','R-01 م 22–24 (ص 27)',1],
['07','الجنين / الرضيع','1 mSv (بعد إبلاغ العاملة)','R-01 م 22–24 (ص 27)',1],
['08','حد معدل الجرعة عند الحاجز','قيم نموذجية 2.5–20 μSv/h (تحددها الجهة الرقابية)','SSG-11 (11.11–11.15)',1],
['13','Transport Index','أعلى معدل جرعة عند 1 m من سطح الطرد (mSv/h) × 100','TCS-85 Topic 11 (ص 26)',0],
['14','حد جرعة الطوارئ','لا أكثر من 50 mSv إلا في حالات محددة','R-01 م 302–304',1],
['15','TVL','≈ 3.32 × HVL','',0]];
var F=[
['15','الاضمحلال','A = A₀·(½)^(t/T½) ، λ = 0.693 / T½','TCS-85 Topic 3 (ص 12)',1],
['15','التوهين','I = I₀·e^(−μx)','الشرائح (الفصل 4)',0],
['15','HVL','HVL = 0.693 / μ ، I/I₀ = (½)^(x/HVL)','الشرائح (الفصل 4)',0],
['15','TVL','I/I₀ = (0.1)^(x/TVL)','الشرائح (الفصل 4)',0],
['08','التربيع العكسي','I₂ = I₁·(d₁/d₂)²','TCS-85 Topic 7 (ص 16)',1],
['15','الجرعة من معدل الجرعة','D = Ḋ × t','TCS-85 Topic 3 (ص 12)',1],
['03','الجرعة المكافئة','H_T = Σ w_R · D_T,R','TCS-85 Topic 3 (ص 12)',1],
['03','الجرعة الفعّالة','E = Σ w_T · H_T','TCS-85 Topic 3 (ص 12)',1],
['15','معدل الجرعة من مصدر','Ḋ(1 m) = ناتج المصدر × (A ÷ 37 GBq) ، Ḋ(d) = Ḋ(1 m) ÷ d²','SSG-11 جدول II–1',1],
['15','مسافة الحاجز','d = d₁·√(Ḋ₁ / Ḋ_limit)','TCS-85 Topic 7 (ص 16)',1]];
var Q=[
['01','من يتحمل المسؤولية الأساسية عن الحماية والسلامة؟',['RSO','Authorized Person','Qualified Expert'],1],
['01','تغيير الـ RSO يتطلب:',['إشعارًا فقط','موافقة NRRC','قرار RSO نفسه'],1],
['02','تحدث Pair production عند طاقة فوتون:',['≥ 0.511 MeV','≥ 1.022 MeV','≥ 1 keV'],1],
['02','أي إشعاع يتوقف بفصل الكهرباء؟',['Gamma','X-ray','Alpha'],1],
['03','1 Ci يساوي:',['3.7×10¹⁰ Bq','3.7×10⁷ Bq','10⁹ Bq'],0],
['03','الكمية التشغيلية لقياس المنطقة (Survey meter):',['Hp(10)','H*(10)','Hp(0.07)'],1],
['04','عمر النصف لـ Ir-192:',['74 يوم','120 يوم','5.3 سنة'],0],
['04','أي مصدر غير مدرج في جدول SSG-11 للتصوير الصناعي؟',['Se-75','Cs-137','Yb-169'],1],
['05','Class P في أجهزة التعريض يعني:',['ثابت','محمول ≤ 50 kg','متنقل بعربة'],1],
['05','الفئة الثابتة داخل Shielded enclosure:',['P','M','F'],2],
['06','تأثير له عتبة وتزداد شدته مع الجرعة:',['Deterministic','Stochastic','كلاهما'],0],
['06','السرطان يُصنَّف:',['Deterministic','Stochastic','لا هذا ولا ذاك'],1],
['07','حد الجمهور (فعّالة) سنويًا:',['1 mSv','6 mSv','20 mSv'],0],
['07','ALARA مرتبطة بمبدأ:',['Justification','Optimization','Dose Limitation'],1],
['08','عند مضاعفة المسافة يصبح معدل الجرعة:',['النصف','الربع','الثُمن'],1],
['08','أي مما يلي ليس من Time–Distance–Shielding؟',['Time','Distance','Activity'],2],
['09','بعد كل تعريض بمصدر جاما نستخدم:',['Alarm dosimeter فقط','Survey meter','TLD فقط'],1],
['09','Personal dosimeter (TLD/OSL) يقيس:',['معدل جرعة لحظي','الجرعة المتراكمة Hp(10)','النشاط'],1],
['10','من يصمم وينفذ RPP؟',['RSO','Authorized Person','NRRC'],1],
['10','وثائق RPP تُراجع وتُحدَّث لتعكس:',['الوضع الفعلي للتدابير','خطة الترخيص الأولى','لا تُحدَّث'],0],
['11','من يقدم المشورة المتخصصة؟',['Authorized Person','RSO','Qualified Expert'],2],
['11','هل تنتقل المسؤولية الأساسية إلى RSO بتعيينه؟',['نعم','لا، تبقى على Authorized Person','بالتفويض فقط'],1],
['12','Security تعني:',['منع الحوادث غير المقصودة','منع الأفعال المتعمدة (سرقة/وصول غير مصرح)','الوقاية الصحية'],1],
['12','مستويات الأمن ترتبط بـ:',['تصنيف المصادر','لون الجهاز','بلد الصنع'],0],
['13','Transport Index =',['dose rate عند 1 m × 100','dose rate عند 1 m × 10','dose rate عند 10 m'],0],
['13','Consignor هو:',['المرسِل','المستلِم','الناقل'],0],
['14','الحد العام لجرعة الطوارئ:',['10 mSv','50 mSv','100 mSv'],1],
['14','تسلسل الاستجابة:',['ابتعد ← وسّع المنطقة ← قِس ← أبلغ','أنقذ المصدر فورًا','أبلغ ثم انتظر'],0],
['15','Ir-192 بنشاط 100 Ci بعد 148 يومًا:',['50 Ci','25 Ci','12.5 Ci'],1],
['15','50 Ci بالـ GBq:',['1850','185','18500'],0]];
var TG=$$('section.card').map(function(c){var n=c.dataset.n;return{n:n,t:$$('.terms span',c).map(function(s){return s.textContent}),d:/ص\s*\d|م\s*\d|\d\.\d|Table|ق\s*\d/.test(REF[n])?1:0}}).filter(function(g){return g.t.length});
var OV={};try{OV=JSON.parse(localStorage.getItem('rpo-st')||'{}')||{}}catch(e){}
function st(k,d){return k in OV?OV[k]:d}
function bd(k,d){var s=st(k,d);return '<button class="bd '+(s?'on':'off')+'" data-k="'+k+'" title="اضغط لتغيير الحالة بعد مراجعة المصدر">'+(s?'✓ موثّق':'⚠ يحتاج مراجعة')+'</button>'}
var tab='topics',ans={};
var fa=$('#fa'),fs=$('#fs'),q=$('#q');
fa.innerHTML='<option value="">كل المحاور</option>'+Object.keys(NAMES).map(function(n){return '<option value="'+n+'">'+n+' · '+NAMES[n]+'</option>'}).join('');
var TABS=[['topics','الموضوعات'],['formulas','المعادلات'],['values','القيم'],['terms','المصطلحات'],['quiz','اختبار قصير']];
function tabs(){$('#tabs').innerHTML=TABS.map(function(t){return '<button data-t="'+t[0]+'" class="'+(t[0]==tab?'on':'')+'">'+t[1]+'</button>'}).join('')}
function pass(n,k,d,txt){var a=fa.value,s=fs.value,v=q.value.trim().toLowerCase();if(a&&n!=a)return 0;if(s!==''&&(st(k,d)?'1':'0')!==s)return 0;return !v||(txt+' '+NAMES[n]).toLowerCase().indexOf(v)>=0}
function head(n,k,d){return '<div class="hd"><span class="ax">'+n+' · '+NAMES[n]+'</span>'+bd(k,d)+'</div>'}
function facts(L,p,isF){var o='';L.forEach(function(r,i){var k=p+i;if(!pass(r[0],k,r[4],r.join(' ')))return;o+='<div class="it">'+head(r[0],k,r[4])+'<b>'+r[1]+'</b>'+(isF?'<div class="formula">'+r[2]+'</div>':'<div dir="auto">'+r[2]+'</div>')+'<p class="ref">المرجع: '+(r[3]||'لا يوجد مرجع محدد بعد — راجع الوثيقة الأصلية')+'</p></div>'});return o||'<p class="ref">لا نتائج.</p>'}
function terms(){var o='',a=fa.value,s=fs.value,v=q.value.trim().toLowerCase();TG.forEach(function(g){var k='t'+g.n;if(a&&g.n!=a)return;if(s!==''&&(st(k,g.d)?'1':'0')!==s)return;var ts=g.t.filter(function(t){return !v||t.toLowerCase().indexOf(v)>=0});if(!ts.length)return;o+='<div class="it">'+head(g.n,k,g.d)+'<p class="ref">المرجع: '+REF[g.n]+'</p><div class="terms">'+ts.map(function(t){return '<span>'+t+'</span>'}).join('')+'</div></div>'});return o||'<p class="ref">لا نتائج.</p>'}
function quiz(){var a=fa.value,sc=0,dn=0,o='',L=Q.map(function(r,i){return [r,i]}).filter(function(x){return !a||x[0][0]==a});L.forEach(function(x){var r=x[0],i=x[1],g=ans[i];if(g!=null){dn++;if(g==r[3])sc++}o+='<div class="it"><div class="hd"><span class="ax">'+r[0]+' · '+NAMES[r[0]]+'</span></div><b>'+r[1]+'</b><div class="opts">'+r[2].map(function(t,j){var c=g==null?'':j==r[3]?' ok':j==g?' bad':'';return '<button dir="auto" class="op'+c+'" data-q="'+i+'" data-j="'+j+'"'+(g!=null?' disabled':'')+'>'+t+'</button>'}).join('')+'</div>'+(g!=null?'<p class="ref">المرجع: '+REF[r[0]]+'</p>':'')+'</div>'});return '<div class="note green">النتيجة: '+sc+' / '+L.length+' (أُجيب عن '+dn+') <button class="op" id="rs">إعادة</button></div>'+(o||'<p class="ref">لا أسئلة لهذا المحور.</p>')}
function secb(){$$('section.card').forEach(function(c){var n=c.dataset.n,b=$('.sb',c);if(!b)return;var g=TG.filter(function(x){return x.n==n})[0],d=g?g.d:/ص\s*\d|م\s*\d|\d\.\d|Table|ق\s*\d/.test(REF[n])?1:0;b.innerHTML=bd('t'+n,d)})}
function apply(){
 var topic=tab=='topics',a=fa.value,s=fs.value,v=$('#views');
 $$('main > .panel, #chips').forEach(function(e){e.classList.toggle('hid2',!topic||!!a)});
 $$('section.card').forEach(function(c){var n=c.dataset.n,g=TG.filter(function(x){return x.n==n})[0],d=g?g.d:/ص\s*\d|م\s*\d|\d\.\d|Table|ق\s*\d/.test(REF[n])?1:0;
  c.classList.toggle('hid2',!topic||(a&&n!=a)||(s!==''&&(st('t'+n,d)?'1':'0')!==s))});
 v.classList.toggle('hid2',topic);
 if(!topic)v.innerHTML=tab=='formulas'?facts(F,'f',1):tab=='values'?facts(V,'v',0):tab=='terms'?terms():quiz();
 tabs();secb();
}
$$('section.card').forEach(function(c){var n=c.dataset.n,p=document.createElement('p');p.className='ref sref';p.innerHTML='المرجع: '+REF[n]+' <span class="sb"></span>';$('h2',c).after(p)});
document.addEventListener('click',function(e){var t=e.target;
 if(t.dataset.t){tab=t.dataset.t;apply()}
 else if(t.classList.contains('bd')){var k=t.dataset.k,cur=t.classList.contains('on')?1:0;OV[k]=cur?0:1;try{localStorage.setItem('rpo-st',JSON.stringify(OV))}catch(x){}apply()}
 else if(t.dataset.q){ans[t.dataset.q]=+t.dataset.j;apply()}
 else if(t.id=='rs'){ans={};apply()}});
fa.addEventListener('change',apply);fs.addEventListener('change',apply);q.addEventListener('input',apply);
apply();
})();
</script>
</body>
</html>
