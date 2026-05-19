import {
  Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, Table, TableCell,
  TableRow, WidthType, BorderStyle, convertInchesToTwip, Header, Footer, PageNumber,
  UnderlineType
} from "docx";
import * as fs from "fs";
import * as path from "path";

const ORG_NAME = "ООО «Глобал Эду» / Самостоятельная разработка";
const PROJECT_NAME = "Global Edu Finder";
const VKR_TITLE = "Разработка веб-приложения для поиска и сравнения учебных заведений «Global Edu Finder»";

const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1.25),
        },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `Отчет по преддипломной практике — ${PROJECT_NAME}`, size: 18, italics: true }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ children: ["Страница ", PageNumber.CURRENT, " из ", PageNumber.TOTAL_PAGES], size: 18 }),
            ],
          }),
        ],
      }),
    },
    children: [
      // Титульная часть
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: "ОТЧЕТ", bold: true, size: 28 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "о прохождении производственной преддипломной практики", size: 24 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: `Тема ВКР: «${VKR_TITLE}»`, size: 22, bold: true }),
        ],
      }),

      // 1. Организационная структура места практики
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: "1 Организационная структура места практики", bold: true, size: 28 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Производственная преддипломная практика проходила в рамках самостоятельной разработки выпускной квалификационной работы «${PROJECT_NAME}». Проект представляет собой современное веб-приложение для поиска учебных заведений по всему миру.`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "В ходе практики было проведено ознакомление с архитектурой fullstack-приложений, изучена инфраструктура разработки на базе фреймворка Next.js, а также освоены методы проектирования реляционных баз данных в СУБД PostgreSQL.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Основные задачи, решаемые в рамках практики: проектирование информационной системы, разработка клиентской и серверной части веб-приложения, интеграция системы аутентификации, реализация модуля отзывов и рейтингов, создание системы фильтрации и поиска учебных заведений.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Перечень программных средств, использованных в ходе практики: Visual Studio Code (основная IDE), Node.js (среда выполнения), pgAdmin / DBeaver (управление PostgreSQL), Postman / Insomnia (тестирование API), Figma (прототипирование интерфейса), Git (система контроля версий).",
            size: 24,
          }),
        ],
      }),

      // 2. Аналитическая часть
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: "2 Аналитическая часть", bold: true, size: 28 }),
        ],
      }),

      // 2.1 Цели, задачи ВКР. Актуальность
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "2.1 Цели, задачи ВКР. Актуальность разработки", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Целью выпускной квалификационной работы является разработка веб-приложения «Global Edu Finder», предназначенного для помощи абитуриентам, студентам и их родителям в поиске и сравнении образовательных учреждений по всему миру.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Задачи разработки:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      ...[
        "проведение анализа предметной области и существующих аналогов;",
        "разработка технического задания и проектирование архитектуры приложения;",
        "проектирование базы данных для хранения информации об учебных заведениях, пользователях, отзывах и компаниях;",
        "разработка серверной части (REST API) на базе Next.js API Routes;",
        "разработка клиентской части с адаптивным интерфейсом и системой фильтрации;",
        "реализация системы аутентификации и авторизации с разделением ролей (студент, абитуриент, школьник, компания);",
        "реализация модуля отзывов и рейтингов учебных заведений;",
        "тестирование и отладка программного продукта.",
      ].map((t) =>
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 720 },
          children: [new TextRun({ text: `• ${t}`, size: 24 })],
        })
      ),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Актуальность разработки обусловлена отсутствием на российском рынке универсального сервиса, объединяющего детализированную информацию о зарубежных и российских учебных заведениях с возможностью фильтрации по стоимости обучения, рейтингу, специальностям и типу учреждения. Существующие решения (StudyQA, UCAS, Postupi.online) либо ориентированы исключительно на зарубежные вузы, либо не предоставляют удобных инструментов сравнения и профориентационного тестирования.",
            size: 24,
          }),
        ],
      }),

      // 2.2 Описание предметной области
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "2.2 Описание предметной области", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Предметной областью является информационная поддержка процесса выбора образовательного учреждения. Объектом исследования и разработки выступает процесс поиска и сравнения учебных заведений абитуриентами и студентами.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "В системе выделяются следующие сущности: пользователи (студент, абитуриент, школьник, компания), учебные заведения (университеты, институты, колледжи, школы, академии), отзывы и оценки, профили компаний-владельцев. Каждое учебное заведение характеризуется названием, описанием, типом, местоположением, стоимостью обучения, рейтингом и набором категорий (технический, гуманитарный, IT-специальности и др.).",
            size: 24,
          }),
        ],
      }),

      // 2.3 Сравнительный анализ аналогов
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "2.3 Сравнительный анализ аналогов", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "В ходе аналитической части были рассмотрены следующие аналоги:",
            size: 24,
          }),
        ],
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Аналог", bold: true, size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Достоинства", bold: true, size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Недостатки", bold: true, size: 22 })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "StudyQA", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Большая база зарубежных вузов, фильтрация по странам и специальностям.", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ориентация только на зарубежное образование, отсутствие системы отзывов от студентов.", size: 22 })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Postupi.online", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Информация о российских вузах, калькулятор баллов ЕГЭ.", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Нет сравнения с зарубежными учебными заведениями, ограниченная фильтрация.", size: 22 })] })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "UCAS (UK)", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Официальная система подачи заявлений в британские вузы, актуальные данные.", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Только Великобритания, нет поддержки русского языка, сложная процедура регистрации.", size: 22 })] })] }),
            ],
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: "Разрабатываемый продукт «Global Edu Finder» призван объединить достоинства существующих решений и устранить их недостатки за счет универсальности охвата (Россия + зарубежье), встроенной системы отзывов с рейтингами, поддержки профилей компаний-владельцев и профориентационных тестов.",
            size: 24,
          }),
        ],
      }),

      // 2.4 Обзор инструментальных средств
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "2.4 Обзор инструментальных средств создания продукта", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Языки программирования:", bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "TypeScript — строго типизированный язык, расширяющий возможности JavaScript. Обеспечивает выявление ошибок на этапе компиляции, улучшает автодополнение в IDE и повышает поддерживаемость кода в крупных проектах.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Фреймворки и библиотеки:", bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "React 19 — библиотека для построения пользовательских интерфейсов с использованием компонентного подхода. Next.js 16 — фреймворк на базе React, предоставляющий серверный рендеринг (SSR), статическую генерацию страниц (SSG), маршрутизацию на основе файловой системы и API Routes для создания бэкенда в рамках одного приложения.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "СУБД:", bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "PostgreSQL — мощная объектно-реляционная СУБД с открытым исходным кодом. Поддерживает сложные запросы, транзакции, индексы, расширяемость. Prisma ORM используется в качестве абстракции для работы с базой данных, обеспечивая типобезопасность и удобство миграций.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Среда разработки (IDE):", bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Visual Studio Code — легковесный, но функциональный редактор кода с поддержкой TypeScript, интеграцией Git, расширениями для Prisma, ESLint, Tailwind CSS.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Дополнительные инструменты:", bold: true, size: 24 }),
        ],
      }),
      ...[
        "Tailwind CSS 4 — утилитарный CSS-фреймворк для быстрой стилизации интерфейса;",
        "NextAuth.js — библиотека аутентификации для Next.js с поддержкой JWT-сессий;",
        "SWR — библиотека для управления состоянием и кэширования данных с сервера;",
        "bcryptjs — хеширование паролей;",
        "jsPDF, docx, xlsx — генерация документов в форматах PDF, Word и Excel.",
      ].map((t) =>
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 720 },
          children: [new TextRun({ text: `• ${t}`, size: 24 })],
        })
      ),

      // 2.5 Обоснование выбора средств
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "2.5 Обоснование выбора средств реализации дипломного проекта", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Выбор технологического стека обусловлен современными требованиями к веб-разработке и спецификой предметной области. Next.js выбран как универсальная платформа, объединяющая frontend и backend в едином приложении, что упрощает развертывание и снижает накладные расходы на интеграцию. TypeScript обеспечивает типобезопасность и уменьшает количество runtime-ошибок. PostgreSQL выбрана за надежность, производительность и бесплатность. Prisma ORM ускоряет разработку за счет автоматической генерации типов и удобного DSL для описания схемы данных. Tailwind CSS позволяет быстро создавать адаптивные интерфейсы без написания собственных CSS-файлов.",
            size: 24,
          }),
        ],
      }),

      // 3. Описание процесса проектирования
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: "3 Описание процесса проектирования", bold: true, size: 28 }),
        ],
      }),

      // 3.1 Обзор инструментальных средств создания продукта (расширенный)
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "3.1 Обзор инструментальных средств создания продукта", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "ЯП: ", bold: true, size: 24 }),
          new TextRun({ text: "TypeScript 5 — типизированный надстройка над JavaScript, обеспечивающая строгую типизацию, интерфейсы, дженерики и современную поддержку ECMAScript.", size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Фреймворки: ", bold: true, size: 24 }),
          new TextRun({ text: "Next.js 16 (React 19) — полнофункциональный фреймворк с App Router, серверными компонентами, API Routes, SSR/SSG. Tailwind CSS 4 — утилитарный CSS-фреймворк.", size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "СУБД: ", bold: true, size: 24 }),
          new TextRun({ text: "PostgreSQL 15+ с Prisma ORM 6.19.2. Prisma обеспечивает декларативное описание схемы, миграции, типобезопасный клиент и валидацию данных.", size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "IDE: ", bold: true, size: 24 }),
          new TextRun({ text: "Visual Studio Code с расширениями ESLint, Prettier, Tailwind CSS IntelliSense, Prisma.", size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Анализ альтернативных концепций:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "В качестве альтернативы Next.js рассматривался фреймворк Nuxt.js (Vue) и чистый React с отдельным бэкендом (Express.js). Nuxt.js отвергнут из-за меньшей распространенности в корпоративной среде и меньшего количества библиотек. Express.js + React потребовал бы настройки CORS, отдельного деплоя и большего количества boilerplate-кода. Next.js предоставляет готовую интеграцию клиент-сервер из коробки.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "В качестве альтернативы PostgreSQL рассматривались MySQL и MongoDB. MySQL уступает PostgreSQL в поддержке сложных типов данных и полнотекстового поиска. MongoDB (NoSQL) была отвергнута из-за реляционной природы предметной области (связи пользователей, компаний, институтов и отзывов), где реляционная модель оказывается более эффективной.",
            size: 24,
          }),
        ],
      }),

      // 3.2 Описание логики функционирования
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({ text: "3.2 Описание логики функционирования программного продукта", bold: true, size: 26 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Требования к функционированию:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      ...[
        "Приложение должно работать в современных браузерах (Chrome, Firefox, Safari, Edge);",
        "Время отклика интерфейса не более 1 секунды при фильтрации;",
        "Поддержка адаптивного дизайна для устройств с шириной экрана от 320 px;",
        "Безопасное хранение паролей (bcrypt, 12 раундов);",
        "JWT-сессии с защитой маршрутов;",
        "Валидация всех входных данных на сервере.",
      ].map((t) =>
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 720 },
          children: [new TextRun({ text: `• ${t}`, size: 24 })],
        })
      ),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Основные характеристики программы:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      ...[
        "Поиск и фильтрация учебных заведений по типу, категории, локации, стоимости;",
        "Система аутентификации с разделением ролей (студент, абитуриент, школьник, компания);",
        "Личный кабинет пользователя с профориентационными тестами;",
        "Профиль компании с возможностью публикации и управления учебными заведениями;",
        "Система отзывов и рейтингов (1–5 звезд) с автоматическим пересчетом среднего рейтинга;",
        "Генерация отчетов в форматах PDF, Word, Excel.",
      ].map((t) =>
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 720 },
          children: [new TextRun({ text: `• ${t}`, size: 24 })],
        })
      ),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Входная информация:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Данные об учебных заведениях (название, описание, тип, локация, стоимость, категории), данные пользователей (email, пароль, тип пользователя, профиль компании), отзывы (рейтинг, комментарий).",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Выходная информация:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Отфильтрованный список учебных заведений с карточками, содержащими рейтинг, стоимость, категории; личный кабинет с результатами тестов; сформированные документы (отчеты).",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Диаграммы (описание):",
            bold: true,
            size: 24,
          }),
        ],
      }),
      ...[
        "Диаграмма вариантов использования (Use Case): описывает взаимодействие акторов (Гость, Студент, Компания, Администратор) с системой. Гость может просматривать и фильтровать заведения. Авторизованный пользователь может оставлять отзывы, проходить тесты, управлять профилем. Компания может создавать и редактировать учебные заведения.",
        "Диаграмма деятельности (Activity): отражает процесс фильтрации учебных заведений — ввод поискового запроса, выбор типа и категории, отправка запроса к API, получение и отображение результатов.",
        "Диаграмма последовательности (Sequence): демонстрирует взаимодействие компонентов при добавлении отзыва — пользователь → интерфейс → API Route → Prisma Client → PostgreSQL → обновление рейтинга → ответ пользователю.",
        "Диаграмма компонентов (Component): показывает разделение системы на модули: UI-компоненты (Header, FilterPanel, CardInstitutes), хуки (useInstitutes, useUniversalFilter), API Routes (auth, institutes, reviews), Prisma Client, база данных.",
      ].map((t) =>
        new Paragraph({
          spacing: { after: 200 },
          indent: { left: 720 },
          children: [new TextRun({ text: t, size: 24 })],
        })
      ),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Алгоритм работы программы:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Пользователь открывает приложение. При переходе на страницу поиска (/finder) загружаются доступные фильтры через API (/api/institutes/filters). Пользователь вводит поисковый запрос и выбирает фильтры (тип, категория). Хук useUniversalFilter формирует URL-параметры и отправляет запрос к /api/institutes. Серверная часть (Prisma Client) выполняет запрос к PostgreSQL с условиями WHERE. Результаты возвращаются в JSON и отображаются в виде карточек (CardInstitutes). При клике на карточку открывается детальная страница с отзывами.",
            size: 24,
          }),
        ],
      }),

      // Задание руководителя (при наличии)
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: "Задание руководителя практики от организации", bold: true, size: 28 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Задание выдано в рамках учебного процесса. Основные пункты задания: провести анализ предметной области и аналогов; спроектировать базу данных; разработать серверную и клиентскую части веб-приложения; реализовать систему аутентификации и авторизации; обеспечить функционал поиска, фильтрации и отзывов; подготовить документацию.",
            size: 24,
          }),
        ],
      }),

      // Заключение
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: "ЗАКЛЮЧЕНИЕ", bold: true, size: 28 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `В результате прохождения производственной преддипломной практики в ходе разработки проекта «${PROJECT_NAME}» ознакомлен со структурой и основными функциями подразделений веб-разработки. Закреплены теоретические знания, полученные в процессе обучения. Получены навыки профессиональной деятельности по специальности: проектирование и разработка информационных систем, разработка дизайна веб-приложений, проектирование, разработка и оптимизация веб-приложений.`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Закреплены и развиты приобретенные профессиональные навыки самостоятельной практической деятельности. Подобран и систематизирован материал для выполнения выпускной квалификационной работы «${VKR_TITLE}».`,
            size: 24,
          }),
        ],
      }),

      // Список источников
      new Paragraph({
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({ text: "СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ", bold: true, size: 28 }),
        ],
      }),
      ...[
        "ГОСТ Р 59793–2021 «Комплекс стандартов на автоматизированные системы. Автоматизированные системы. Стадии создания».",
        "ГОСТ 34.602-2020 Информационные технологии. Комплекс стандартов на автоматизированные системы. Техническое задание на создание автоматизированной системы.",
        "Грекул, В. И. Проектирование информационных систем : учебник и практикум для среднего профессионального образования / В. И. Грекул, Н. Л. Коровкина, Г. А. Левочкина. — 2-е изд. — Москва : Издательство Юрайт, 2026. — 418 с.",
        "Советов, Б. Я. Базы данных : учебник для среднего профессионального образования / Б. Я. Советов, В. В. Цехановский, В. Д. Чертовской. — 4-е изд., перераб. и доп. — Москва : Издательство Юрайт, 2025. — 403 с.",
        "Сысолетин, Е. Г. Разработка интернет-приложений : учебник для среднего профессионального образования / Е. Г. Сысолетин, С. Д. Ростунцев. — Москва : Издательство Юрайт, 2026. — 80 с.",
        "Тузовский, А. Ф. Проектирование и разработка web-приложений : учебник для среднего профессионального образования / А. Ф. Тузовский. — Москва : Издательство Юрайт, 2025. — 219 с.",
        "Проектирование информационных систем : учебник и практикум для среднего профессионального образования / Д. В. Чистов, П. П. Мельников, А. В. Золотарюк, Н. Б. Ничепорук. — 2-е изд., перераб. и доп. — Москва : Издательство Юрайт, 2025. — 273 с.",
        "Next.js Documentation [Электронный ресурс]. — Режим доступа: https://nextjs.org/docs, свободный.",
        "Prisma Documentation [Электронный ресурс]. — Режим доступа: https://www.prisma.io/docs, свободный.",
        "Tailwind CSS Documentation [Электронный ресурс]. — Режим доступа: https://tailwindcss.com/docs, свободный.",
      ].map((src, i) =>
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: `${i + 1}. ${src}`, size: 24 }),
          ],
        })
      ),
    ],
  }],
});

const outputPath = path.resolve(__dirname, "../public/Отчет_преддипломная_практика.docx");

Packer.toBuffer(doc).then((buffer) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Отчет успешно сгенерирован: ${outputPath}`);
});
