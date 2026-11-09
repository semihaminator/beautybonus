// Texts shared across the whole site: navigation, home page, footer.
const en = {
  metaTitle: "Salsa — Streamers, Agencies & Beauty Bonus",
  metaDescription: "Guides for Salsa streamers and agencies, the Beauty Bonus programme and contests.",
  nav: { home: "Home", guide: "Streamers", agency: "Agencies", beautyBonus: "Beauty Bonus", language: "Language" },
  hub: {
    eyebrow: "Salsa for creators",
    title: "Stream, grow your agency and win bonuses",
    lead: "Salsa is an international platform for live streams and chatting. Everything for streamers and agencies is here in one place.",
    start: "Start streaming",
    support: "Contact support",
    cards: {
      guide: { tag: "For streamers", title: "Streamer guide", text: "How to sign up, get verified, which formats to use, how much you can earn and how to withdraw.", cta: "Read the guide" },
      agency: { tag: "For agencies", title: "Agency guide", text: "How to open an agency, add streamers, weekly commissions, bonuses and the application form.", cta: "Become an agent" },
      beautyBonus: { tag: "Monthly contest", title: "Beauty Bonus", text: "$100–500 every month for streamers with bright, high-quality streams. Apply on the 1st–5th.", cta: "Apply" },
    },
    factsTitle: "Salsa in numbers",
    facts: [["1 $ = 650", "coins, the in-app currency"], ["Every Monday", "agency payouts"], ["$15", "first withdrawal for new streamers"]],
  },
  footer: { support: "Support", rights: "Salsa" },
  bbNav: { apply: "Apply", rules: "Rules", results: "Results" },
};

const ru = {
  metaTitle: "Salsa — стримерам, агентствам и Beauty Bonus",
  metaDescription: "Гайды для стримеров и агентств Salsa, программа Beauty Bonus и конкурсы.",
  nav: { home: "Главная", guide: "Стримерам", agency: "Агентствам", beautyBonus: "Beauty Bonus", language: "Язык" },
  hub: {
    eyebrow: "Salsa для креаторов",
    title: "Стримь, развивай агентство и получай бонусы",
    lead: "Salsa — международная платформа для прямых эфиров и общения. Всё для стримеров и агентств — в одном месте.",
    start: "Начать стримить",
    support: "Написать в поддержку",
    cards: {
      guide: { tag: "Для стримеров", title: "Гайд для стримера", text: "Как зарегистрироваться, пройти верификацию, какие форматы выбрать, сколько можно заработать и как вывести деньги.", cta: "Читать гайд" },
      agency: { tag: "Для агентств", title: "Гайд для агентов", text: "Как открыть агентство, добавлять стримеров, еженедельные комиссии, бонусы и анкета для регистрации.", cta: "Стать агентом" },
      beautyBonus: { tag: "Ежемесячный конкурс", title: "Beauty Bonus", text: "$100–500 каждый месяц для стримеров с яркими и качественными эфирами. Заявки — с 1-го по 5-е число.", cta: "Подать заявку" },
    },
    factsTitle: "Salsa в цифрах",
    facts: [["1 $ = 650", "монет — внутренняя валюта"], ["Каждый понедельник", "выплаты агентствам"], ["$15", "первый вывод для новых стримеров"]],
  },
  footer: { support: "Поддержка", rights: "Salsa" },
  bbNav: { apply: "Подать заявку", rules: "Правила", results: "Результаты" },
};

const uk = {
  metaTitle: "Salsa — стримерам, агентствам і Beauty Bonus",
  metaDescription: "Гайди для стримерів і агентств Salsa, програма Beauty Bonus і конкурси.",
  nav: { home: "Головна", guide: "Стримерам", agency: "Агентствам", beautyBonus: "Beauty Bonus", language: "Мова" },
  hub: {
    eyebrow: "Salsa для креаторів",
    title: "Стрим, розвивай агентство й отримуй бонуси",
    lead: "Salsa — міжнародна платформа для прямих ефірів і спілкування. Усе для стримерів і агентств — в одному місці.",
    start: "Почати стримити",
    support: "Написати в підтримку",
    cards: {
      guide: { tag: "Для стримерів", title: "Гайд для стримера", text: "Як зареєструватися, пройти верифікацію, які формати обрати, скільки можна заробити і як вивести гроші.", cta: "Читати гайд" },
      agency: { tag: "Для агентств", title: "Гайд для агентів", text: "Як відкрити агентство, додавати стримерів, щотижневі комісії, бонуси та анкета для реєстрації.", cta: "Стати агентом" },
      beautyBonus: { tag: "Щомісячний конкурс", title: "Beauty Bonus", text: "$100–500 щомісяця для стримерів з яскравими та якісними ефірами. Заявки — з 1-го по 5-те число.", cta: "Подати заявку" },
    },
    factsTitle: "Salsa в цифрах",
    facts: [["1 $ = 650", "монет — внутрішня валюта"], ["Щопонеділка", "виплати агентствам"], ["$15", "перше виведення для нових стримерів"]],
  },
  footer: { support: "Підтримка", rights: "Salsa" },
  bbNav: { apply: "Подати заявку", rules: "Правила", results: "Результати" },
};

const SITE = { en, ru, uk };
export const getSite = (locale) => SITE[locale] || en;
