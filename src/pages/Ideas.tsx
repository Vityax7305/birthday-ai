import { useNavigate } from "react-router-dom";  // Важно: именно react-router-dom
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightbulb,
  Palette,
  UtensilsCrossed,
  Music,
  Gift,
  Camera,
  Heart,
  Star,
  ChevronRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";

// ... остальной код остается без изменений

const CATEGORIES = [
  { id: "all", label: "Все идеи", icon: Star },
  { id: "themes", label: "Темы", icon: Palette },
  { id: "food", label: "Меню", icon: UtensilsCrossed },
  { id: "entertainment", label: "Развлечения", icon: Music },
  { id: "gifts", label: "Подарки", icon: Gift },
  { id: "photo", label: "Фото", icon: Camera },
];

interface IdeaCard {
  id: string;
  category: string;
  emoji: string;
  title: string;
  desc: string;
  tags: string[];
  color: string;
  gradient: string;
}

const IDEAS: IdeaCard[] = [
  // Themes
  {
    id: "1", category: "themes", emoji: "🦄", title: "Единороги и Магия",
    desc: "Пастельные тона, блёстки, радужные акценты. Идеально для девочек 5-10 лет.",
    tags: ["Детский", "5-10 лет", "DIY"],
    color: "#f857a6", gradient: "linear-gradient(135deg, rgba(248,87,166,0.15), rgba(167,139,250,0.15))",
  },
  {
    id: "2", category: "themes", emoji: "🚀", title: "Космос и Планеты",
    desc: "Тёмно-синий фон, звёзды, планеты из шаров. Универсальная тема для детей и взрослых.",
    tags: ["Универсальный", "Современный"],
    color: "#6366f1", gradient: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.15))",
  },
  {
    id: "3", category: "themes", emoji: "🍾", title: "Гламурный Вечер",
    desc: "Чёрное и золото, элегантные украшения, шампанское. Для взрослых вечеринок.",
    tags: ["Взрослый", "Элегантный"],
    color: "#f59e0b", gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.15))",
  },
  {
    id: "4", category: "themes", emoji: "🌿", title: "Ботанический Сад",
    desc: "Живые цветы, зелень, свечи, лён. Модный и уютный стиль для любого возраста.",
    tags: ["Универсальный", "Природный"],
    color: "#22c55e", gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.15))",
  },
  {
    id: "5", category: "themes", emoji: "🏖️", title: "Тропический Рай",
    desc: "Яркие цвета, пальмы, коктейли, фламинго. Летняя атмосфера в любое время года.",
    tags: ["Летний", "Яркий"],
    color: "#f97316", gradient: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,179,8,0.15))",
  },
  {
    id: "6", category: "themes", emoji: "🎭", title: "Маскарад",
    desc: "Венецианские маски, тёмные тона, свечи. Загадочная и романтическая атмосфера.",
    tags: ["Взрослый", "Романтический"],
    color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(219,39,119,0.15))",
  },
  // Food
  {
    id: "7", category: "food", emoji: "🎂", title: "Торт-сюрприз",
    desc: "Торт с начинкой из разноцветных конфет — когда разрезаешь, высыпается конфетти!",
    tags: ["WOW-эффект", "Детский"],
    color: "#f857a6", gradient: "linear-gradient(135deg, rgba(248,87,166,0.15), rgba(255,88,88,0.15))",
  },
  {
    id: "8", category: "food", emoji: "🍢", title: "Candy Bar",
    desc: "Стол со сладостями в стиле праздника: макаруны, капкейки, леденцы, шоколад.",
    tags: ["Декор", "Сладкое"],
    color: "#ec4899", gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))",
  },
  {
    id: "9", category: "food", emoji: "🍕", title: "Pizza Party",
    desc: "Несколько видов пиццы на выбор + салат-бар. Бюджетно, вкусно, все довольны!",
    tags: ["Бюджетный", "Молодёжный"],
    color: "#f97316", gradient: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,179,8,0.15))",
  },
  {
    id: "10", category: "food", emoji: "🍹", title: "Коктейльный Бар",
    desc: "Самостоятельно смешивайте коктейли с мохито, лимонадами и соками без алкоголя.",
    tags: ["Интерактивный", "Напитки"],
    color: "#06b6d4", gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))",
  },
  // Entertainment
  {
    id: "11", category: "entertainment", emoji: "🕵️", title: "Квест-игра",
    desc: "Загадки по всему дому или улице с призами. Подходит для детей и взрослых.",
    tags: ["Активный", "Универсальный"],
    color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15))",
  },
  {
    id: "12", category: "entertainment", emoji: "📸", title: "Фотобудка",
    desc: "Тематический фон + реквизит (усы, шляпы, таблички). Гости сами делают фото!",
    tags: ["Фото", "Весёлый"],
    color: "#f59e0b", gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.15))",
  },
  {
    id: "13", category: "entertainment", emoji: "🎤", title: "Живая Музыка",
    desc: "Акустический гитарист или небольшая кавер-группа создадут незабываемую атмосферу.",
    tags: ["Премиум", "Атмосфера"],
    color: "#ec4899", gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))",
  },
  {
    id: "14", category: "entertainment", emoji: "🎨", title: "Мастер-класс",
    desc: "Рисование, лепка из глины, создание украшений — участие для всех гостей!",
    tags: ["Творческий", "Детский"],
    color: "#22c55e", gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.15))",
  },
  // Gifts
  {
    id: "15", category: "gifts", emoji: "✈️", title: "Впечатления вместо вещей",
    desc: "Сертификат на путешествие, концерт, SPA или мастер-класс — незабываемые воспоминания.",
    tags: ["Незабываемый", "Взрослый"],
    color: "#6366f1", gradient: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
  },
  {
    id: "16", category: "gifts", emoji: "📚", title: "Персонализированная Книга",
    desc: "Книга, где именинник является главным героем — с его именем и историей!",
    tags: ["Уникальный", "Детский"],
    color: "#f857a6", gradient: "linear-gradient(135deg, rgba(248,87,166,0.15), rgba(255,88,88,0.15))",
  },
  {
    id: "17", category: "gifts", emoji: "🌱", title: "Растение с Горшком",
    desc: "Редкое комнатное растение в красивом горшке — стильный и долгосрочный подарок.",
    tags: ["Эко", "Стильный"],
    color: "#22c55e", gradient: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.15))",
  },
  // Photo
  {
    id: "18", category: "photo", emoji: "🎬", title: "Видеоколлаж от Друзей",
    desc: "Попросите гостей записать короткие видео с пожеланиями — смонтируйте в ролик!",
    tags: ["Трогательный", "DIY"],
    color: "#f97316", gradient: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(239,68,68,0.15))",
  },
  {
    id: "19", category: "photo", emoji: "📷", title: "Плёночные Фотоаппараты",
    desc: "Одноразовые плёночные камеры на столах — пусть гости снимают всё сами!",
    tags: ["Ретро", "Интерактивный"],
    color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(219,39,119,0.15))",
  },
  {
    id: "20", category: "photo", emoji: "🖼️", title: "Фотостена из Снимков",
    desc: "Натяните верёвку и прикрепите фото именинника за разные годы — красиво и трогательно!",
    tags: ["Декор", "Ностальгия"],
    color: "#ec4899", gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(248,87,166,0.15))",
  },
];

export function Ideas() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filtered = activeCategory === "all" ? IDEAS : IDEAS.filter((i) => i.category === activeCategory);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4"
          style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)" }}
        >
          <Lightbulb className="w-4 h-4" style={{ color: "#f59e0b" }} />
          <span style={{ color: "#f59e0b" }}>{IDEAS.length} идей для вашего праздника</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Вдохновляющие Идеи</h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Выбирайте понравившиеся идеи и обсудите их с нашим ИИ-агентом для детальной проработки
        </p>
      </motion.div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all font-medium"
              style={
                isActive
                  ? { background: "linear-gradient(135deg, #f857a6, #8b5cf6)", color: "white" }
                  : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              {isActive && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.3)" }}
                >
                  {filtered.length}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Ideas grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <AnimatePresence>
          {filtered.map((idea, i) => (
            <motion.div
              key={idea.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl p-5 flex flex-col gap-3 cursor-pointer relative"
              style={{ background: idea.gradient, border: `1px solid ${idea.color}30` }}
            >
              {/* Like button */}
              <button
                onClick={() => toggleLike(idea.id)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: liked.has(idea.id) ? "rgba(248,87,166,0.3)" : "rgba(255,255,255,0.1)",
                }}
              >
                <Heart
                  className="w-4 h-4"
                  style={{ color: liked.has(idea.id) ? "#f857a6" : "rgba(255,255,255,0.4)" }}
                  fill={liked.has(idea.id) ? "#f857a6" : "none"}
                />
              </button>

              <div className="text-4xl">{idea.emoji}</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{idea.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{idea.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: `${idea.color}25`, color: idea.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Liked ideas section */}
      {liked.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-8"
          style={{ background: "rgba(248,87,166,0.1)", border: "1px solid rgba(248,87,166,0.3)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5" style={{ color: "#f857a6" }} fill="#f857a6" />
            <h3 className="text-white font-semibold">Понравившиеся идеи ({liked.size})</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {IDEAS.filter((i) => liked.has(i.id)).map((idea) => (
              <span
                key={idea.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-white"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {idea.emoji} {idea.title}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate("/chat")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)" }}
          >
            <MessageCircle className="w-4 h-4" />
            Обсудить эти идеи с ИИ агентом
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center rounded-3xl p-10"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <Sparkles className="w-10 h-10 mx-auto mb-4" style={{ color: "#f857a6" }} />
        <h2 className="text-2xl font-bold text-white mb-2">Не нашли нужную идею?</h2>
        <p className="text-white/50 mb-6">Спросите нашего ИИ-агента — он предложит персональные варианты именно для вас</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/chat")}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-medium"
          style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)", boxShadow: "0 8px 24px rgba(248,87,166,0.3)" }}
        >
          <MessageCircle className="w-5 h-5" />
          Открыть ИИ Агента
        </motion.button>
      </motion.div>
    </div>
  );
}