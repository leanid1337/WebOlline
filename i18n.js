/* Переводы сайта: русский, украинский, английский.
   Тексты в разметке помечены атрибутом data-i18n="ключ".
   Значения могут содержать разметку (<br>, <em>, <span>) — она подставляется как есть. */
(() => {
  const DICT = {
    ru: {
      "meta.title": "Дизайн интерьера и визуализации — Olline.design | Olga Lavreka",
      "meta.description": "Архитектор Olga Lavreka: дизайн интерьера квартир и домов, 3D-визуализации, планировки и рабочие чертежи. Более 20 лет практики, работа с частными клиентами и студиями.",

      "nav.about": "Обо мне",
      "nav.portfolio": "Портфолио",
      "nav.services": "Услуги",
      "nav.contact": "Связаться",
      "nav.lang": "Язык сайта",

      "hero.eyebrow": "Olga Lavreka &nbsp;/&nbsp; архитектор",
      "hero.title": "Пространство,<br><em>продуманное</em><br>до линии<span class=\"sr-only\">. Дизайн интерьера, архитектура и 3D-визуализации — Olga Lavreka</span>",
      "hero.lead": "Архитектура и дизайн интерьеров. Планировки, визуализации, чертежи.",
      "hero.cta": "Обсудить проект",
      "hero.more": "Портфолио <span aria-hidden=\"true\">&rarr;</span>",

      "about.num": "02 &nbsp;/&nbsp; Обо мне",
      "about.title": "Более двадцати лет в архитектуре и&nbsp;дизайне интерьеров.",
      "about.text": "Создаю функциональные, спокойные и точные пространства. От первой планировки до полного комплекта рабочей документации.",
      "about.years": "лет практики",
      "about.b2c": "частные клиенты",
      "about.b2b": "дизайнеры и студии",
      "about.portrait": "Olga Lavreka, архитектор",

      "work.num": "03 &nbsp;/&nbsp; Направления",
      "work.title": "Что я делаю",
      "work.scale": "три направления работы",
      "tile.plan.title": "Планировки <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.plan.text": "Эргономика и сценарии жизни, собранные в ясный план.",
      "tile.viz.title": "Визуализации <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.viz.text": "Фотореалистичные 3D-сцены: свет, материалы, атмосфера.",
      "tile.draw.title": "Рабочие чертежи <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.draw.text": "Полный комплект документации для точной реализации.",

      "portfolio.num": "04 &nbsp;/&nbsp; Портфолио",
      "portfolio.title": "Избранные работы",
      "portfolio.scale": "фото, видео, чертежи",
      "dir.residential": "Жилые интерьеры",
      "dir.commercial": "Коммерческий дизайн",
      "dir.architecture": "Архитектура",
      "filter.all": "Все",
      "filter.viz": "Визуализации",
      "filter.video": "Видео",
      "filter.plan": "Планировки",
      "filter.draw": "Чертежи",
      "empty.title": "Скоро здесь появятся работы",
      "empty.text": "Раздел наполняется. Посмотрите другие направления или напишите мне, чтобы обсудить проект.",
      "gallery.more": "Показать ещё",

      "services.num": "05 &nbsp;/&nbsp; Форматы работы",
      "services.title": "Услуги",
      "services.scale": "B2C и B2B",
      "services.art": "От идеи до чертежа",
      "b2c.title": "Для частных клиентов",
      "b2c.text": "Интерьеры квартир и домов: планировка, концепция, визуализации и рабочие чертежи.",
      "b2b.title": "Для дизайнеров и студий",
      "b2b.text": "Графика, 3D-эскизы, визуализации и документация по вашему ТЗ. Сроки и конфиденциальность.",

      "process.num": "06 &nbsp;/&nbsp; Этапы",
      "process.title": "Как я работаю",
      "process.scale": "от задачи до чертежей",
      "step1.title": "Задача и обмеры",
      "step1.text": "Обсуждаем сценарии жизни, сроки и бюджет, фиксируем техническое задание и исходные размеры помещения.",
      "step2.title": "Планировка",
      "step2.text": "Несколько вариантов планировочных решений: зонирование, хранение, эргономика. Выбираем и дорабатываем один.",
      "step2.link": "Смотреть планировки <span aria-hidden=\"true\">&rarr;</span>",
      "step3.title": "Визуализация",
      "step3.text": "3D-сцены со светом, материалами и мебелью. Вы видите будущий интерьер до начала ремонта и вносите правки.",
      "step3.link": "Смотреть визуализации <span aria-hidden=\"true\">&rarr;</span>",
      "step4.title": "Рабочие чертежи",
      "step4.text": "Полный комплект документации: планы полов, потолков, розеток и освещения, развёртки, ведомости материалов.",
      "step4.link": "Смотреть чертежи <span aria-hidden=\"true\">&rarr;</span>",

      "contact.num": "07 &nbsp;/&nbsp; Контакты",
      "contact.title": "Расскажите<br>о своём <em>пространстве</em>",
      "contact.mail": "Почта",
      "stamp.project": "Проект",
      "stamp.author": "Автор",
      "stamp.scope": "Раздел",
      "stamp.scopeValue": "Архитектура · Интерьер · 3D",
      "stamp.stage": "Стадия",
      "stamp.stageValue": "Р · 2026",
      "footer.sheet": "Лист 01 / 01",
      "footer.tags": "Архитектура &middot; Интерьер &middot; 3D",

      "g.viz": "Визуализация",
      "g.video": "Видео",
      "g.plan": "Планировка",
      "g.draw": "Рабочий чертёж",
      "g.open": "Открыть",
      "g.soon": "скоро",
      "g.works": ["работа", "работы", "работ"],
    },

    uk: {
      "meta.title": "Дизайн інтер'єру та візуалізації — Olline.design | Olga Lavreka",
      "meta.description": "Архітектор Olga Lavreka: дизайн інтер'єру квартир і будинків, 3D-візуалізації, планування та робочі креслення. Понад 20 років практики, робота з приватними клієнтами та студіями.",

      "nav.about": "Про мене",
      "nav.portfolio": "Портфоліо",
      "nav.services": "Послуги",
      "nav.contact": "Зв'язатися",
      "nav.lang": "Мова сайту",

      "hero.eyebrow": "Olga Lavreka &nbsp;/&nbsp; архітектор",
      "hero.title": "Простір,<br><em>продуманий</em><br>до лінії<span class=\"sr-only\">. Дизайн інтер'єру, архітектура та 3D-візуалізації — Olga Lavreka</span>",
      "hero.lead": "Архітектура та дизайн інтер'єрів. Планування, візуалізації, креслення.",
      "hero.cta": "Обговорити проєкт",
      "hero.more": "Портфоліо <span aria-hidden=\"true\">&rarr;</span>",

      "about.num": "02 &nbsp;/&nbsp; Про мене",
      "about.title": "Понад двадцять років в архітектурі та&nbsp;дизайні інтер'єрів.",
      "about.text": "Створюю функціональні, спокійні та точні простори. Від першого планування до повного комплекту робочої документації.",
      "about.years": "років практики",
      "about.b2c": "приватні клієнти",
      "about.b2b": "дизайнери та студії",
      "about.portrait": "Olga Lavreka, архітектор",

      "work.num": "03 &nbsp;/&nbsp; Напрями",
      "work.title": "Що я роблю",
      "work.scale": "три напрями роботи",
      "tile.plan.title": "Планування <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.plan.text": "Ергономіка та сценарії життя, зібрані в ясний план.",
      "tile.viz.title": "Візуалізації <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.viz.text": "Фотореалістичні 3D-сцени: світло, матеріали, атмосфера.",
      "tile.draw.title": "Робочі креслення <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.draw.text": "Повний комплект документації для точної реалізації.",

      "portfolio.num": "04 &nbsp;/&nbsp; Портфоліо",
      "portfolio.title": "Вибрані роботи",
      "portfolio.scale": "фото, відео, креслення",
      "dir.residential": "Житлові інтер'єри",
      "dir.commercial": "Комерційний дизайн",
      "dir.architecture": "Архітектура",
      "filter.all": "Усі",
      "filter.viz": "Візуалізації",
      "filter.video": "Відео",
      "filter.plan": "Планування",
      "filter.draw": "Креслення",
      "empty.title": "Незабаром тут з'являться роботи",
      "empty.text": "Розділ наповнюється. Подивіться інші напрями або напишіть мені, щоб обговорити проєкт.",
      "gallery.more": "Показати ще",

      "services.num": "05 &nbsp;/&nbsp; Формати роботи",
      "services.title": "Послуги",
      "services.scale": "B2C і B2B",
      "services.art": "Від ідеї до креслення",
      "b2c.title": "Для приватних клієнтів",
      "b2c.text": "Інтер'єри квартир і будинків: планування, концепція, візуалізації та робочі креслення.",
      "b2b.title": "Для дизайнерів і студій",
      "b2b.text": "Графіка, 3D-ескізи, візуалізації та документація за вашим ТЗ. Терміни та конфіденційність.",

      "process.num": "06 &nbsp;/&nbsp; Етапи",
      "process.title": "Як я працюю",
      "process.scale": "від завдання до креслень",
      "step1.title": "Завдання та обміри",
      "step1.text": "Обговорюємо сценарії життя, терміни та бюджет, фіксуємо технічне завдання й початкові розміри приміщення.",
      "step2.title": "Планування",
      "step2.text": "Кілька варіантів планувальних рішень: зонування, зберігання, ергономіка. Обираємо та допрацьовуємо один.",
      "step2.link": "Дивитися планування <span aria-hidden=\"true\">&rarr;</span>",
      "step3.title": "Візуалізація",
      "step3.text": "3D-сцени зі світлом, матеріалами та меблями. Ви бачите майбутній інтер'єр до початку ремонту й вносите правки.",
      "step3.link": "Дивитися візуалізації <span aria-hidden=\"true\">&rarr;</span>",
      "step4.title": "Робочі креслення",
      "step4.text": "Повний комплект документації: плани підлог, стель, розеток і освітлення, розгортки, відомості матеріалів.",
      "step4.link": "Дивитися креслення <span aria-hidden=\"true\">&rarr;</span>",

      "contact.num": "07 &nbsp;/&nbsp; Контакти",
      "contact.title": "Розкажіть<br>про свій <em>простір</em>",
      "contact.mail": "Пошта",
      "stamp.project": "Проєкт",
      "stamp.author": "Автор",
      "stamp.scope": "Розділ",
      "stamp.scopeValue": "Архітектура · Інтер'єр · 3D",
      "stamp.stage": "Стадія",
      "stamp.stageValue": "Р · 2026",
      "footer.sheet": "Аркуш 01 / 01",
      "footer.tags": "Архітектура &middot; Інтер'єр &middot; 3D",

      "g.viz": "Візуалізація",
      "g.video": "Відео",
      "g.plan": "Планування",
      "g.draw": "Робоче креслення",
      "g.open": "Відкрити",
      "g.soon": "незабаром",
      "g.works": ["робота", "роботи", "робіт"],
    },

    en: {
      "meta.title": "Interior design and 3D visualisation — Olline.design | Olga Lavreka",
      "meta.description": "Architect Olga Lavreka: interior design for flats and houses, 3D visualisation, layouts and working drawings. Over 20 years of practice, working with private clients and studios.",

      "nav.about": "About",
      "nav.portfolio": "Portfolio",
      "nav.services": "Services",
      "nav.contact": "Contact",
      "nav.lang": "Site language",

      "hero.eyebrow": "Olga Lavreka &nbsp;/&nbsp; architect",
      "hero.title": "Space,<br><em>considered</em><br>to the last line<span class=\"sr-only\">. Interior design, architecture and 3D visualisation — Olga Lavreka</span>",
      "hero.lead": "Architecture and interior design. Layouts, visualisations, working drawings.",
      "hero.cta": "Discuss a project",
      "hero.more": "Portfolio <span aria-hidden=\"true\">&rarr;</span>",

      "about.num": "02 &nbsp;/&nbsp; About",
      "about.title": "Over twenty years in architecture and&nbsp;interior design.",
      "about.text": "I design functional, calm and precise spaces — from the very first layout to a complete set of working drawings.",
      "about.years": "years of practice",
      "about.b2c": "private clients",
      "about.b2b": "designers and studios",
      "about.portrait": "Olga Lavreka, architect",

      "work.num": "03 &nbsp;/&nbsp; What I do",
      "work.title": "What I do",
      "work.scale": "three kinds of work",
      "tile.plan.title": "Layouts <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.plan.text": "Ergonomics and daily routines brought into one clear plan.",
      "tile.viz.title": "Visualisations <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.viz.text": "Photoreal 3D scenes: light, materials, atmosphere.",
      "tile.draw.title": "Working drawings <span class=\"tile__go\" aria-hidden=\"true\">&rarr;</span>",
      "tile.draw.text": "A complete set of documentation for precise execution.",

      "portfolio.num": "04 &nbsp;/&nbsp; Portfolio",
      "portfolio.title": "Selected works",
      "portfolio.scale": "photos, video, drawings",
      "dir.residential": "Residential interiors",
      "dir.commercial": "Commercial design",
      "dir.architecture": "Architecture",
      "filter.all": "All",
      "filter.viz": "Visualisations",
      "filter.video": "Video",
      "filter.plan": "Layouts",
      "filter.draw": "Drawings",
      "empty.title": "Works will appear here soon",
      "empty.text": "This section is being filled. Have a look at the other directions or write to me about your project.",
      "gallery.more": "Show more",

      "services.num": "05 &nbsp;/&nbsp; Ways to work",
      "services.title": "Services",
      "services.scale": "B2C and B2B",
      "services.art": "From idea to drawing",
      "b2c.title": "For private clients",
      "b2c.text": "Interiors for flats and houses: layout, concept, visualisations and working drawings.",
      "b2b.title": "For designers and studios",
      "b2b.text": "Graphics, 3D sketches, visualisations and documentation to your brief. Deadlines and confidentiality.",

      "process.num": "06 &nbsp;/&nbsp; Process",
      "process.title": "How I work",
      "process.scale": "from brief to drawings",
      "step1.title": "Brief and measurements",
      "step1.text": "We discuss how you live, the timing and the budget, then fix the brief and the existing dimensions.",
      "step2.title": "Layout",
      "step2.text": "Several layout options: zoning, storage, ergonomics. We choose one and refine it together.",
      "step2.link": "See layouts <span aria-hidden=\"true\">&rarr;</span>",
      "step3.title": "Visualisation",
      "step3.text": "3D scenes with light, materials and furniture. You see the future interior before the works start and ask for changes.",
      "step3.link": "See visualisations <span aria-hidden=\"true\">&rarr;</span>",
      "step4.title": "Working drawings",
      "step4.text": "A full set of documentation: floor and ceiling plans, sockets and lighting, elevations, material schedules.",
      "step4.link": "See drawings <span aria-hidden=\"true\">&rarr;</span>",

      "contact.num": "07 &nbsp;/&nbsp; Contact",
      "contact.title": "Tell me about<br>your <em>space</em>",
      "contact.mail": "Email",
      "stamp.project": "Project",
      "stamp.author": "Author",
      "stamp.scope": "Scope",
      "stamp.scopeValue": "Architecture · Interior · 3D",
      "stamp.stage": "Stage",
      "stamp.stageValue": "Detail · 2026",
      "footer.sheet": "Sheet 01 / 01",
      "footer.tags": "Architecture &middot; Interior &middot; 3D",

      "g.viz": "Visualisation",
      "g.video": "Video",
      "g.plan": "Layout",
      "g.draw": "Working drawing",
      "g.open": "Open",
      "g.soon": "soon",
      "g.works": ["work", "works", "works"],
    },
  };

  const STORAGE_KEY = "olline-lang";
  const SUPPORTED = ["ru", "uk", "en"];

  const detect = () => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* приватный режим */ }
    if (SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.languages || [navigator.language || "en"]).map((l) => l.toLowerCase());
    for (const l of nav) {
      if (l.startsWith("uk")) return "uk";
      if (l.startsWith("ru") || l.startsWith("be") || l.startsWith("kk")) return "ru";
      if (l.startsWith("en")) return "en";
    }
    return "en";
  };

  let lang = detect();

  const t = (key) => {
    const value = (DICT[lang] && DICT[lang][key]) ?? DICT.ru[key];
    return value === undefined ? key : value;
  };

  // «12 работ» — форма слова зависит от числа и языка
  const plural = (n) => {
    const forms = t("g.works");
    if (lang === "en") return n === 1 ? forms[0] : forms[1];
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
    return forms[2];
  };

  const apply = (root = document) => {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // формат: data-i18n-attr="aria-label:nav.lang"
      el.dataset.i18nAttr.split(",").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key).replace(/<[^>]+>/g, ""));
      });
    });
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));
    document.querySelectorAll(".lang__btn").forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  };

  const set = (next) => {
    if (!SUPPORTED.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* приватный режим */ }
    apply();
    document.dispatchEvent(new CustomEvent("olline:lang", { detail: { lang } }));
  };

  window.OLLINE_I18N = { get lang() { return lang; }, t, plural, apply, set, supported: SUPPORTED };

  const init = () => {
    apply();
    document.querySelectorAll(".lang__btn").forEach((b) =>
      b.addEventListener("click", () => set(b.dataset.lang)));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
