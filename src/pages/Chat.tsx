import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Trash2,
  Copy,
  Check,
  MessageCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "Придумай тему для детского дня рождения",
  "Как организовать вечеринку для 30 человек?",
  "Составь меню для праздника",
  "Идеи для конкурсов и игр",
  "Помоги с планированием бюджета",
  "Что подарить на день рождения?",
];

// Smart AI response generator
function generateAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("тем") || msg.includes("стиль") || msg.includes("концепц")) {
    return `🎨 **Идеи тем для дня рождения:**

**Для детей:**
• 🦄 **Единороги и магия** — пастельные цвета, блестки, радуга
• 🚀 **Космос и планеты** — темно-синий фон, звезды, планеты
• 🦁 **Сафари и джунгли** — тропические растения, животные
• 🏰 **Принцессы и рыцари** — золото, бархат, короны

**Для взрослых:**
• 🍾 **Гламурный вечер** — черное и золото, шампанское
• 🌿 **Ботанический сад** — живые цветы, зелень, свечи
• 🎭 **Маскарад** — загадочные маски, темные тона
• 🏖️ **Тропический рай** — яркие цвета, пальмы, коктейли

Хотите подробнее рассмотреть какую-то тему? 🎉`;
  }

  if (msg.includes("меню") || msg.includes("еда") || msg.includes("блюд") || msg.includes("угощен")) {
    return `🍽️ **Планирование меню для праздника:**

**Закуски и снеки:**
• Канапе с лососем и сливочным сыром
• Брускетта с томатами и базиликом
• Сырная тарелка с виноградом и орехами
• Мини-сэндвичи с ветчиной и зеленью

**Горячие блюда:**
• Запечённая курица с розмарином
• Паста в сливочном соусе
• Мини-бургеры на шпажках
• Пицца (4-6 видов)

**Сладкий стол:**
• 🎂 Торт на заказ (главный акцент!)
• Капкейки в теме праздника
• Макаруны и шоколадные конфеты
• Candy bar с разными сладостями

**Напитки:**
• Лимонад домашнего приготовления
• Морсы и соки
• Просекко для взрослых
• Коктейли-мокито без алкоголя

Сколько гостей ожидается? Помогу рассчитать количество! 🥂`;
  }

  if (msg.includes("гост") || msg.includes("сколько") || msg.includes("список")) {
    return `👥 **Организация гостей на день рождения:**

**Составление списка:**
1. Разделите гостей на категории (семья, друзья, коллеги)
2. Определите максимальную вместимость места проведения
3. Учтите диетические ограничения гостей

**Рассылка приглашений:**
• За 3-4 недели для большой вечеринки
• За 1-2 недели для небольшого собрания
• Используйте WhatsApp, Telegram или красивые бумажные открытки

**Удобные инструменты:**
• Создайте группу в мессенджере
• Используйте Google Forms для RSVP
• Наш планировщик поможет отслеживать ответы

**Правила размещения:**
• На каждого гостя ~1,5-2 кв.м площади
• При рассадке учитывайте пожелания именинника
• Выделите зону для детей отдельно

Перейдите в **Планировщик**, чтобы добавить всех гостей! 📋`;
  }

  if (msg.includes("бюджет") || msg.includes("деньг") || msg.includes("стоим") || msg.includes("расход")) {
    return `💰 **Планирование бюджета праздника:**

**Примерное распределение (на 20 человек):**

| Статья | Доля | Пример (30 000 ₽) |
|--------|------|-------------------|
| 🎂 Торт | 15% | 4 500 ₽ |
| 🍽️ Еда и напитки | 35% | 10 500 ₽ |
| 🎈 Декор | 20% | 6 000 ₽ |
| 🎤 Развлечения | 15% | 4 500 ₽ |
| 📸 Фото/видео | 10% | 3 000 ₽ |
| 🎁 Подарочная упаковка | 5% | 1 500 ₽ |

**Советы по экономии:**
• Делайте часть декора самостоятельно (DIY)
• Заказывайте торт у домашних кондитеров
• Создайте плейлист вместо найма диджея
• Выбирайте сезонные цветы и фрукты

Назовите ваш бюджет — дам более точные рекомендации! 💡`;
  }

  if (msg.includes("игр") || msg.includes("конкурс") || msg.includes("развлеч") || msg.includes("активност")) {
    return `🎮 **Конкурсы и развлечения:**

**Для детей (3-12 лет):**
• 🎯 Пин зе хвост ослику (или тематический вариант)
• 🎵 Музыкальные стулья
• 🔍 Охота за сокровищами с загадками
• 🎨 Мастер-класс по рисованию или лепке
• 🎪 Шоу мыльных пузырей

**Для подростков:**
• 📱 Квиз с вопросами об имениннике
• 🎭 Пантомима и шарады
• 🎮 Турнир по настольным играм
• 🕵️ Квест-игра

**Для взрослых:**
• 🍷 Дегустация вин вслепую
• 🎪 Фотобудка с реквизитом
• 🎵 Живая музыка или кавер-группа
• 💃 Танцевальный баттл
• 📝 «Что я знаю об имениннике?»

**Топ-3 совета:**
1. Планируйте 2-3 активности, не перегружайте программу
2. Учитывайте возраст и интересы гостей
3. Оставьте время для свободного общения

Какой возраст именинника? Подберу идеальные активности! 🎉`;
  }

  if (msg.includes("подар") || msg.includes("презент") || msg.includes("что купить")) {
    return `🎁 **Идеи подарков на день рождения:**

**Универсальные подарки:**
• Сертификат на впечатления (мастер-класс, SPA, ресторан)
• Персонализированная книга или фотоальбом
• Набор для хобби (кулинария, рисование, садоводство)
• Умные гаджеты и аксессуары

**По возрасту — детям:**
• 👶 0-3 года: мягкие игрушки, развивающие коврики
• 🧒 4-7 лет: конструкторы LEGO, наборы для творчества
• 👦 8-12 лет: настольные игры, книги, спортивные товары
• 👤 13+: техника, косметика, стильные аксессуары

**Взрослым:**
• 🍾 Элитные вина и деликатесы
• 📚 Редкие книги или подписки
• 🌿 Растения и кашпо для дома
• ✈️ Путешествие или необычный опыт

**Коллективный подарок:**
Соберите взносы от гостей через специальные приложения — так можно подарить что-то действительно значимое!

Расскажите больше об имениннике — дам персональные советы! 💝`;
  }

  if (msg.includes("место") || msg.includes("площадк") || msg.includes("где") || msg.includes("помещен") || msg.includes("локац")) {
    return `📍 **Выбор места для праздника:**

**Дома:**
✅ Уютно и бюджетно
✅ Полная свобода в декоре
❌ Ограниченная площадь
❌ Нужно убирать до и после

**Кафе/ресторан:**
✅ Берут на себя еду и сервис
✅ Нет хлопот с уборкой
✅ Профессиональная атмосфера
❌ Дороже, менее персонально

**Загородные базы/пансионаты:**
✅ Много пространства и природа
✅ Можно провести несколько дней
✅ Идеально для большой компании
❌ Нужен транспорт для гостей

**Необычные варианты:**
• 🎳 Боулинг или лазертаг
• 🎨 Арт-студия
• 🍕 Кулинарная студия
• 🎬 Кинотеатр на весь зал
• 🌳 Пикник в парке (лето)

**Что учесть при выборе:**
1. Количество гостей (1 чел = 2 кв.м)
2. Наличие парковки
3. Возможность принести своё
4. Уровень шума и соседи

Сколько у вас гостей? Помогу с выбором! 🏠`;
  }

  if (msg.includes("привет") || msg.includes("здравствуй") || msg.includes("добрый") || msg.includes("hello") || msg.includes("hi")) {
    return `🎉 **Привет! Я ваш ИИ-ассистент по планированию дня рождения!**

Я помогу вам создать незабываемый праздник! Вот что я умею:

🎨 **Придумать тему** — от детской до гламурной вечеринки
🍽️ **Составить меню** — закуски, горячее, торт и напитки
👥 **Организовать гостей** — списки, приглашения, рассадка
💰 **Спланировать бюджет** — распределение расходов
🎮 **Подобрать конкурсы** — игры для любого возраста
🎁 **Выбрать подарки** — персональные рекомендации
📍 **Найти место** — варианты для любого формата

С чего начнём? Расскажите об имениннике: возраст, интересы, примерное количество гостей — и я создам идеальный план! ✨`;
  }

  if (msg.includes("декор") || msg.includes("украш") || msg.includes("оформлен")) {
    return `🎈 **Идеи для декора и украшений:**

**Основные элементы:**
• 🎈 Воздушные шары — гирлянды, арки, столбики
• 🌸 Живые цветы или искусственные цветочные стены
• ✨ Гирлянды и fairy lights
• 📸 Фотозона с тематическим фоном

**DIY декор (сделай сам):**
• Бумажные помпоны и гирлянды из флажков
• Свечи в баночках с песком и ракушками
• Фоторамки с детскими снимками именинника
• Надписи и таблички из дерева или картона

**Цветовые схемы:**
• 🌸 Романтическая: розовый + золото + белый
• 🌿 Природная: зеленый + бежевый + коричневый
• ✨ Гламурная: черный + золото + серебро
• 🎨 Яркая: фуксия + бирюза + желтый

**Важные детали:**
• Тематические тарелки и стаканчики
• Именные таблички на местах
• Гостевая книга с пожеланиями
• Candy bar с сладостями в теме

**Бюджет на декор:**
• Бюджетно: 3-5 тыс. ₽ (шарики + гирлянды)
• Средне: 8-15 тыс. ₽ (флористика + фотозона)
• Премиум: 20+ тыс. ₽ (аренда + флорист)

Какая тема у вашего праздника? 🌟`;
  }

  if (msg.includes("детск") || msg.includes("ребен") || msg.includes("малыш") || msg.includes("лет") && (msg.includes("1") || msg.includes("2") || msg.includes("3") || msg.includes("4") || msg.includes("5") || msg.includes("6") || msg.includes("7"))) {
    return `👶 **Планирование детского дня рождения:**

**Программа для малышей (1-5 лет):**
• Небольшое количество гостей (5-10 детей)
• Аниматор в тематическом костюме
• Мягкая игровая зона
• Шоу мыльных пузырей
• Детское меню без аллергенов

**Программа для детей (6-12 лет):**
• Квест или охота за сокровищами
• Мастер-класс (рисование, лепка, кулинария)
• Подвижные игры и эстафеты
• Викторина с призами
• Дискотека в конце!

**Безопасность — приоритет:**
• Уберите острые предметы и хрупкие вещи
• Организуйте уголок для родителей
• Держите под рукой аптечку
• Учитывайте аллергии детей

**Торт для детей:**
• Яркий, с любимыми персонажами
• Не слишком сладкий крем
• Кексы-дублеры для удобства

**Подарочки гостям:**
• Небольшие наборы с конфетами
• Раскраски и карандаши
• Мыльные пузыри
• Маленькие игрушки

Сколько лет исполняется? Составлю детальный план! 🎂`;
  }

  // Default intelligent response
  const topics = [
    "тему и концепцию праздника",
    "составление меню и угощений",
    "организацию гостей",
    "планирование бюджета",
    "конкурсы и развлечения",
    "выбор подарка",
    "декор и украшения",
    "выбор места проведения",
  ];
  const randomTopics = topics.sort(() => 0.5 - Math.random()).slice(0, 3);

  return `✨ **Отличный вопрос!** Я готов помочь с организацией вашего праздника.

Чтобы дать наиболее точные рекомендации, расскажите мне:

1. **Кто именинник?** (возраст, пол, интересы)
2. **Сколько гостей** планируется?
3. **Какой бюджет** вы рассматриваете?
4. **Когда** состоится праздник?

Я специализируюсь на помощи с:
${randomTopics.map(t => `• ${t}`).join('\n')}

Задайте мне любой вопрос или воспользуйтесь быстрыми подсказками ниже! 🎉`;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `🎉 **Привет! Я ваш ИИ-ассистент по планированию дня рождения!**

Я помогу вам создать незабываемый праздник! Вот что я умею:

🎨 **Придумать тему** — от детской до гламурной вечеринки
🍽️ **Составить меню** — закуски, горячее, торт и напитки
👥 **Организовать гостей** — списки, приглашения, рассадка
💰 **Спланировать бюджет** — распределение расходов
🎮 **Подобрать конкурсы** — игры для любого возраста
🎁 **Выбрать подарки** — персональные рекомендации
📍 **Найти место** — варианты для любого формата

С чего начнём? Расскажите об имениннике: возраст, интересы, примерное количество гостей — и я создам идеальный план! ✨`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    const delay = 800 + Math.random() * 1200;
    await new Promise((r) => setTimeout(r, delay));

    const response = generateAIResponse(content);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        role: "assistant",
        content: "🎉 Чат очищен! Начнём заново. Расскажите о празднике, который хотите организовать!",
        timestamp: new Date(),
      },
    ]);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>")
      .replace(/• (.*?)(<br\/>|$)/g, '<span class="flex gap-2 my-0.5"><span>•</span><span>$1</span></span>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Chat header */}
      <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)" }}
          >
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">Birthday AI Агент</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs">Онлайн</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Очистить
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    background:
                      msg.role === "assistant"
                        ? "linear-gradient(135deg, #f857a6, #8b5cf6)"
                        : "rgba(255,255,255,0.15)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`group max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: "linear-gradient(135deg, #f857a6, #8b5cf6)", color: "white", borderRadius: "18px 18px 4px 18px" }
                        : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px 18px 18px 4px" }
                    }
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all px-1">
                    <span className="text-white/30 text-xs">
                      {msg.timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)" }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#f857a6" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <motion.button
                  key={prompt}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                  style={{ background: "rgba(248,87,166,0.15)", border: "1px solid rgba(248,87,166,0.3)", color: "#f9a8d4" }}
                >
                  <ChevronRight className="w-3 h-3" />
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-4 border-t border-white/10" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl p-3"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div className="flex-1 flex items-center">
              <MessageCircle className="w-4 h-4 text-white/30 mr-3 flex-shrink-0" />
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Спросите что-нибудь о дне рождения..."
                rows={1}
                className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none text-sm"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
              style={{ background: input.trim() ? "linear-gradient(135deg, #f857a6, #8b5cf6)" : "rgba(255,255,255,0.1)" }}
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
          <p className="text-white/25 text-xs text-center mt-2">Enter — отправить, Shift+Enter — новая строка</p>
        </div>
      </div>
    </div>
  );
}