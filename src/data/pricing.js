// The one source of every price and package fact on the site. All amounts are in lari (₾) and final.
export const TIERS = ['BASIC', 'PLUS', 'PRO', 'MAX'];
export const RECOMMENDED = 'PRO';

export const PRICES = {
  BASIC: { month: 100, setup: 150, year: 1200, buyout: 2000 },
  PLUS: { month: 160, setup: 150, year: 1728, buyout: 2400 },
  PRO: { month: 250, setup: 250, year: 2700, buyout: 3200 },
  MAX: { month: 350, setup: 450, year: 3780, buyout: 4200 },
};

// A year paid up front is −10%; on BASIC the setup is free instead.
export const YEAR_NOTE = { BASIC: 'setupFree', PLUS: 'minus10', PRO: 'minus10', MAX: 'minus10' };

export const ADDONS = [
  { key: 'ai', month: 60, once: 100, tiers: ['PLUS', 'PRO', 'MAX'] },
  { key: 'lang', month: 15, once: 150, tiers: ['BASIC', 'PLUS', 'PRO', 'MAX'] },
];

const L = (en, ka, ru) => ({ en, ka, ru });
const YES = true, NO = false;

// The comparison table: groups of rows, one value per tier (true = ✓, false = —, or text per language).
export const MATRIX = [
  {
    group: L('Included in every package', 'რა შედის ყველა პაკეტში', 'Входит в каждый пакет'),
    rows: [
      { label: L('Mobile-ready site, hosting, SSL, domain management, monthly backup', 'მობილურზე მორგებული საიტი, ჰოსტინგი, SSL, დომენის მართვა, ყოველთვიური ასლი', 'Адаптивный сайт, хостинг, SSL, управление доменом, ежемесячная копия'), v: [YES, YES, YES, YES] },
      { label: L('Privacy policy text', 'კონფიდენციალურობის პოლიტიკის ტექსტი', 'Текст политики конфиденциальности'), v: [YES, YES, YES, YES] },
      { label: L('.ge domain in your name — first year in the setup', 'დომენი (.ge) თქვენს სახელზე — პირველი წელი setup-ში', 'Домен .ge на ваше имя — первый год входит в setup'), v: [YES, YES, YES, YES] },
    ],
  },
  {
    group: L('Service', 'მომსახურება', 'Обслуживание'),
    rows: [
      { label: L('Changes per month', 'ცვლილებები თვეში', 'Изменений в месяц'), v: ['1', L('1 + chatbot update', '1 + ჩატბოტის განახლება', '1 + обновление чат-бота'), '3', '4'] },
      { label: L('Time to make a change', 'ცვლილების შესრულების ვადა', 'Срок внесения изменений'), v: [L('3 working days', '3 სამუშაო დღე', '3 рабочих дня'), L('3 working days', '3 სამუშაო დღე', '3 рабочих дня'), L('2 working days', '2 სამუშაო დღე', '2 рабочих дня'), L('2 working days', '2 სამუშაო დღე', '2 рабочих дня')] },
      { label: L('Response to a fault', 'ხარვეზზე რეაგირება', 'Реакция на неисправность'), v: [L('1 working day', '1 სამუშაო დღე', '1 рабочий день'), L('1 working day', '1 სამუშაო დღე', '1 рабочий день'), L('4 working hours', '4 სამუშაო საათი', '4 рабочих часа'), L('4 working hours; payments the same day', '4 სამუშაო საათი; გადახდაზე იმავე დღეს', '4 рабочих часа; оплата — в тот же день')] },
    ],
  },
  {
    group: L('Features', 'ფუნქციები', 'Функции'),
    rows: [
      { label: L('FAQ chatbot (your approved answers)', 'FAQ ჩატბოტი (თქვენი დადასტურებული პასუხებით)', 'FAQ чат-бот (ваши утверждённые ответы)'), v: [NO, YES, YES, YES] },
      { label: L('Booking / enquiry forms (≤ 2)', 'ჯავშნის / მოთხოვნის ფორმები (≤ 2)', 'Формы бронирования / заявки (≤ 2)'), v: [NO, NO, YES, YES] },
      { label: L('Short monthly report (visits, calls)', 'ყოველთვიური მოკლე ანგარიში (ვიზიტები, ზარები)', 'Краткий ежемесячный отчёт (визиты, звонки)'), v: [NO, NO, YES, YES] },
      { label: L('Google Business Profile link', 'Google Business Profile-ის ბმული', 'Связка с Google Business Profile'), v: [NO, NO, YES, YES] },
      { label: L('Online payment (≤ 10 products / services)', 'ონლაინ გადახდა (≤ 10 პროდუქტი / სერვისი)', 'Онлайн-оплата (≤ 10 товаров / услуг)'), v: [NO, NO, NO, YES] },
    ],
  },
];
