/* سجل الأقسام الخمسة + البيانات الوصفية للمنصة
   كل قسم: معرّف، اسم، وصف، حالة المحتوى، ملف الصفحة */
'use strict';

const RPO_SECTIONS = [
  {
    id: 'nrrc',
    num: '01',
    name: 'اللوائح السعودية NRRC',
    nameEn: 'Saudi NRRC Regulations',
    desc: 'المتطلبات التنظيمية السعودية للتصوير الإشعاعي الصناعي (هيئة الرقابة النووية والإشعاعية).',
    page: 'nrrc.html',
    stage: 1,
    contentState: 'ready', // نُقل المحتوى من المشروع السابق (NRRC.html)
    pendingNote: 'المحتوى مكتمل في مشروعك السابق وسيُنقل إلى هذه الصفحة لاحقًا. أُنشئ هيكل الموضوعات فقط دون محتوى بديل.'
  },
  {
    id: 'tcs85',
    num: '02',
    name: 'التدريب النظري لمسؤول الحماية من الإشعاع',
    nameEn: 'RPO Theoretical Training — IAEA TCS-85',
    desc: 'منهج التدريب وفق IAEA TCS-85: Syllabus for the Training of Radiation Protection Officers (Industrial Radiography) مع شرح موسّع من كتاب التدريب المرفق.',
    page: 'tcs-85.html',
    stage: 1,
    contentState: 'ready'
  },
  {
    id: 'ssg11',
    num: '03',
    name: 'الممارسة والسلامة في التصوير الصناعي',
    nameEn: 'Safety in Industrial Radiography — IAEA SSG-11',
    desc: 'تنظيم محتوى الدليل IAEA SSG-11 (Radiation Safety in Industrial Radiography) إلى موضوعات عملية مع التمييز بين التوصيات الدولية والمتطلبات السعودية.',
    page: 'ssg-11.html',
    stage: 1,
    contentState: 'ready'
  },
  {
    id: 'calculations',
    num: '04',
    name: 'المسائل والحسابات الإشعاعية',
    nameEn: 'Radiation Calculations',
    desc: 'مسائل محلولة خطوة بخطوة من ملف «مسائل الحماية من الإشعاع» وسلايدات دورة التدريب، مع مرجع القوانين والتحويلات.',
    page: 'calculations.html',
    stage: 1,
    contentState: 'ready'
  },
  {
    id: 'qbank',
    num: '05',
    name: 'بنك الأسئلة',
    nameEn: 'Question Bank',
    desc: 'بنك أسئلة مسؤول الحماية من الإشعاع منقول من مشروعك السابق كما هو: خمسة بنوك (928 سؤالًا) بوضع التدريب والاختبار والبطاقات والتصفح.',
    page: 'question-bank.html',
    stage: 2,
    contentState: 'ready', // نُقل البنك من المشروع السابق (RSO_Question_Bank.html)
    questionCount: 928 // مجموع أسئلة البنوك الخمسة في qbank-data.js (تُعرض في الرئيسية دون تحميل ملف البيانات)
  }
];

const RPO_META = {
  title: 'منصة الاستعداد لاختبار مسؤول الحماية من الإشعاع',
  subtitle: 'التصوير الإشعاعي الصناعي',
  exam: 'اختبار مسؤول الحماية من الإشعاع (RPO) — التصوير الإشعاعي الصناعي'
};

const STATUS_LABELS = {
  'not_started': 'لم يبدأ',
  'studying': 'قيد الدراسة',
  'complete': 'مكتمل',
  'review': 'يحتاج إلى مراجعة'
};

/* الترتيب الإرشادي للمسار التعليمي */
const RPO_PATH = {
  stages: [
    { label: 'الدراسة', sections: ['nrrc', 'tcs85', 'ssg11', 'calculations'] },
    { label: 'التدرب', sections: ['qbank'] },
    { label: 'المراجعة النهائية', sections: [] } // تُبنى من الموضوعات الموسومة "يحتاج مراجعة"
  ]
};

/* يجمع كل موضوعات الأقسام من ملفات البيانات (تُعرَّف قبل استدعاء هذه الدالة) */
function getSectionTopics(sectionId) {
  const dataMap = {
    nrrc: typeof NRRC_TOPICS !== 'undefined' ? NRRC_TOPICS : [],
    tcs85: typeof TCS85_TOPICS !== 'undefined' ? TCS85_TOPICS : [],
    ssg11: typeof SSG11_TOPICS !== 'undefined' ? SSG11_TOPICS : [],
    calculations: typeof CALC_PROBLEMS !== 'undefined' ? CALC_PROBLEMS : [],
    qbank: typeof QBANK_TOPICS !== 'undefined' ? QBANK_TOPICS : []
  };
  return dataMap[sectionId] || [];
}
