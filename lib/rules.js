// Beauty Bonus rules, shown on /rules. Edit the wording here.
// Russian is the original text; English and Ukrainian are translations.
// " " is a non-breaking space so numbers like 60 000 never split across lines.

const ru = {
  title: "Правила Beauty Bonus",
  intro: "Всё, что нужно знать об участии в Salsa Beauty Bonus.",
  prize: "$100–500",
  prizeTitle: "Дополнительный бонус каждый месяц",
  prizeText: "Участницы Beauty Bonus получают ежемесячный дополнительный бонус от $100 до $500 — сверх своего заработка. Точная сумма зависит от заработка и качества эфиров.",
  cycleTitle: "Ежемесячный цикл",
  cycle: [
    { day: "1–5", title: "Подача заявок", text: "Подача новых кандидаток — с 1-го по 5-е число каждого месяца." },
    { day: "13", title: "Старт периода", text: "Период конкурса — с 13-го числа текущего месяца по 13-е число следующего месяца, на постоянной ежемесячной основе." },
    { day: "14–15", title: "Проверка", text: "Проверка выполнения условий — 14–15-го числа каждого месяца." },
    { day: "15–25", title: "Выплата", text: "Выплата бонуса — с 15-го по 25-е число включительно." },
  ],
  startTitle: "Когда начнётся мой бонус?",
  start: [
    { when: "Заявка подана с 1-го по 5-е число", then: "старт 13-го числа этого же месяца" },
    { when: "Заявка подана с 6-го числа и позже", then: "старт 13-го числа следующего месяца" },
  ],
  reqTitle: "Условия участия",
  reqs: [
    { big: "20", label: "дней в публичном эфире" },
    { big: "3 ч", label: "минимум в день" },
    { big: "65 000", label: "монет — заработок за период, не менее" },
  ],
  tiersTitle: "Обновлённые условия по заработку",
  tiers: [
    { kind: "bad", range: "До 65 000 монет", text: "Не засчитывается, бонус не начисляется." },
    { kind: "warn", range: "До 195 000 монет", text: "Результат засчитывается, но в следующем месяце стримеру необходимо заработать от 195 000 монет, иначе стример будет дисквалифицирован." },
    { kind: "ok", range: "От 195 000 до 2 275 000 монет", text: "Начисляется бонус от $100 до $500." },
    { kind: "top", range: "От 2 275 000 монет", text: "Есть возможность получить более $500 бонуса (сумма зависит от качества эфиров)." },
  ],
  remindersTitle: "Важные напоминания",
  reminders: [
    "Если стример не планирует выходить в эфир до объявления результатов (например, с 13-го числа нового периода), это допустимо. В месяце 28–31 день, а для выполнения условий требуется 20 дней, поэтому стримеры могут гибко планировать свой график 💅🏻✨",
    "Подавать можно только те ID, которые ранее не участвовали в Beauty Bonus.",
  ],
  qualityTitle: "Качество эфиров и модерация",
  quality: [
    "Модерация эфиров усиливается, особенно в отношении стримеров, участвующих в программе Beauty Bonus.",
    "Пожалуйста, помните о важности качественных эфиров: аккуратный внешний вид, красивая картинка и соблюдение правил платформы.",
    "При рассмотрении участия в программе в следующем месяце также учитывается общее качество проводимых эфиров 💖",
  ],
  finesTitle: "Штрафы",
  finesIntro: "Качество контента и соблюдение правил платформы — обязательные условия участия. Участницы Beauty Bonus представляют приложение SALSA, поэтому их контент напрямую влияет на имидж платформы и восприятие приложения аудиторией.",
  finesAmountLabel: "Размер штрафа",
  finesAmount: "от $25 до $75",
  finesWhen: "Штраф может применяться в следующих случаях:",
  fines: [
    "Повторные нарушения правил платформы.",
    "Попытки скама или мошеннических действий.",
    "Отсутствие улучшений качества стримов в следующем месяце, несмотря на замечания и рекомендации, ранее предоставленные платформой.",
  ],
  finesNote: "Размер штрафа определяется исходя из серьёзности нарушения. Агенты будут дополнительно проинформированы лично о соответствующих замечаниях и необходимых мерах. Просим агентов уделять особое внимание качеству контента участниц Beauty Bonus, своевременно доносить до них замечания платформы и контролировать устранение выявленных проблем 🌸💗",
  ctaTitle: "Готова участвовать?",
  cta: "Подать заявку",
};

const uk = {
  title: "Правила Beauty Bonus",
  intro: "Усе, що потрібно знати про участь у Salsa Beauty Bonus.",
  prize: "$100–500",
  prizeTitle: "Додатковий бонус щомісяця",
  prizeText: "Учасниці Beauty Bonus отримують щомісячний додатковий бонус від $100 до $500 — понад свій заробіток. Точна сума залежить від заробітку та якості ефірів.",
  cycleTitle: "Щомісячний цикл",
  cycle: [
    { day: "1–5", title: "Подача заявок", text: "Подача нових кандидаток — з 1-го по 5-те число кожного місяця." },
    { day: "13", title: "Старт періоду", text: "Період конкурсу — з 13-го числа поточного місяця по 13-те число наступного місяця, на постійній щомісячній основі." },
    { day: "14–15", title: "Перевірка", text: "Перевірка виконання умов — 14–15-го числа кожного місяця." },
    { day: "15–25", title: "Виплата", text: "Виплата бонусу — з 15-го по 25-те число включно." },
  ],
  startTitle: "Коли почнеться мій бонус?",
  start: [
    { when: "Заявку подано з 1-го по 5-те число", then: "старт 13-го числа цього ж місяця" },
    { when: "Заявку подано з 6-го числа і пізніше", then: "старт 13-го числа наступного місяця" },
  ],
  reqTitle: "Умови участі",
  reqs: [
    { big: "20", label: "днів у публічному ефірі" },
    { big: "3 год", label: "мінімум на день" },
    { big: "65 000", label: "монет — заробіток за період, не менше" },
  ],
  tiersTitle: "Оновлені умови щодо заробітку",
  tiers: [
    { kind: "bad", range: "До 65 000 монет", text: "Не зараховується, бонус не нараховується." },
    { kind: "warn", range: "До 195 000 монет", text: "Результат зараховується, але наступного місяця стримеру необхідно заробити від 195 000 монет, інакше стримера буде дискваліфіковано." },
    { kind: "ok", range: "Від 195 000 до 2 275 000 монет", text: "Нараховується бонус від $100 до $500." },
    { kind: "top", range: "Від 2 275 000 монет", text: "Є можливість отримати понад $500 бонусу (сума залежить від якості ефірів)." },
  ],
  remindersTitle: "Важливі нагадування",
  reminders: [
    "Якщо стример не планує виходити в ефір до оголошення результатів (наприклад, з 13-го числа нового періоду), це допустимо. У місяці 28–31 день, а для виконання умов потрібно 20 днів, тому стримери можуть гнучко планувати свій графік 💅🏻✨",
    "Подавати можна лише ті ID, які раніше не брали участі в Beauty Bonus.",
  ],
  qualityTitle: "Якість ефірів і модерація",
  quality: [
    "Модерація ефірів посилюється, особливо щодо стримерів, які беруть участь у програмі Beauty Bonus.",
    "Будь ласка, пам’ятайте про важливість якісних ефірів: охайний зовнішній вигляд, гарна картинка та дотримання правил платформи.",
    "Під час розгляду участі в програмі наступного місяця також враховується загальна якість ефірів 💖",
  ],
  finesTitle: "Штрафи",
  finesIntro: "Якість контенту та дотримання правил платформи — обов’язкові умови участі. Учасниці Beauty Bonus представляють застосунок SALSA, тому їхній контент безпосередньо впливає на імідж платформи та сприйняття застосунку аудиторією.",
  finesAmountLabel: "Розмір штрафу",
  finesAmount: "від $25 до $75",
  finesWhen: "Штраф може застосовуватися в таких випадках:",
  fines: [
    "Повторні порушення правил платформи.",
    "Спроби скаму або шахрайських дій.",
    "Відсутність покращення якості стримів наступного місяця, попри зауваження та рекомендації, раніше надані платформою.",
  ],
  finesNote: "Розмір штрафу визначається залежно від серйозності порушення. Агентів буде додатково поінформовано особисто про відповідні зауваження та необхідні заходи. Просимо агентів приділяти особливу увагу якості контенту учасниць Beauty Bonus, вчасно доносити до них зауваження платформи та контролювати усунення виявлених проблем 🌸💗",
  ctaTitle: "Готова до участі?",
  cta: "Подати заявку",
};

const en = {
  title: "Beauty Bonus rules",
  intro: "Everything you need to know about taking part in the Salsa Beauty Bonus.",
  prize: "$100–500",
  prizeTitle: "An extra bonus every month",
  prizeText: "Beauty Bonus participants get an extra monthly bonus of $100 to $500 on top of their earnings. The exact amount depends on earnings and stream quality.",
  cycleTitle: "Monthly cycle",
  cycle: [
    { day: "1–5", title: "Applications", text: "New candidates can be submitted from the 1st to the 5th of every month." },
    { day: "13", title: "Period starts", text: "Each period runs from the 13th of the current month to the 13th of the next month, every month." },
    { day: "14–15", title: "Review", text: "Results are checked on the 14th–15th of every month." },
    { day: "15–25", title: "Payout", text: "The bonus is paid from the 15th to the 25th inclusive." },
  ],
  startTitle: "When does my bonus start?",
  start: [
    { when: "Applied on the 1st–5th", then: "start on the 13th of the same month" },
    { when: "Applied on the 6th or later", then: "start on the 13th of the next month" },
  ],
  reqTitle: "Requirements",
  reqs: [
    { big: "20", label: "days of public streams" },
    { big: "3 h", label: "minimum per day" },
    { big: "65,000", label: "coins earned in the period, at least" },
  ],
  tiersTitle: "Updated earnings tiers",
  tiers: [
    { kind: "bad", range: "Under 65,000 coins", text: "Doesn't count — no bonus is paid." },
    { kind: "warn", range: "Under 195,000 coins", text: "The result counts, but the following month the streamer must earn at least 195,000 coins, otherwise they will be disqualified." },
    { kind: "ok", range: "195,000 – 2,275,000 coins", text: "A bonus of $100 to $500 is paid." },
    { kind: "top", range: "2,275,000 coins and above", text: "Chance to earn a bonus of more than $500 (the amount depends on stream quality)." },
  ],
  remindersTitle: "Important reminders",
  reminders: [
    "It's fine if a streamer doesn't plan to go live until the results are announced (for example, from the 13th, when the new period starts). A month has 28–31 days and only 20 are required, so streamers can plan their schedule flexibly 💅🏻✨",
    "You can only submit IDs that have never taken part in Beauty Bonus before.",
  ],
  qualityTitle: "Stream quality & moderation",
  quality: [
    "Stream moderation is getting stricter, especially for streamers taking part in Beauty Bonus.",
    "Please keep streams high quality: a neat appearance, a beautiful picture and following the platform rules.",
    "The overall quality of streams is also taken into account when reviewing participation for the next month 💖",
  ],
  finesTitle: "Fines",
  finesIntro: "Content quality and following the platform rules are required to take part. Beauty Bonus participants represent the SALSA app, so their content directly affects the platform's image and how audiences see the app.",
  finesAmountLabel: "Fine amount",
  finesAmount: "$25 to $75",
  finesWhen: "A fine may be applied in the following cases:",
  fines: [
    "Repeated violations of the platform rules.",
    "Attempted scams or fraud.",
    "No improvement in stream quality the following month, despite feedback and recommendations the platform gave earlier.",
  ],
  finesNote: "The amount depends on how serious the violation is. Agents will be informed personally about any feedback and the measures required. We ask agents to pay close attention to the content quality of their Beauty Bonus participants, pass on the platform's feedback promptly and make sure issues are fixed 🌸💗",
  ctaTitle: "Ready to take part?",
  cta: "Apply now",
};

export const RULES = { en, ru, uk };
export const getRules = (locale) => RULES[locale] || en;
