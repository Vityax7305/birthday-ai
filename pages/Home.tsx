import { useNavigate } from "react-router-dom";  // Важно: именно react-router-dom
import { motion } from "motion/react";
import {
  Sparkles,
  MessageCircle,
  ClipboardList,
  Lightbulb,
  ArrowRight,
  Star,
  Zap,
  Heart,
} from "lucide-react";

// ... остальной код остается без изменений

const HERO_IMAGE = "https://images.unsplash.com/photo-1761253298457-d98f628e1b1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwY2VsZWJyYXRpb24lMjBjb2xvcmZ1bCUyMGJhbGxvb25zfGVufDF8fHx8MTc3NDk2MDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080";
const CAKE_IMAGE = "https://images.unsplash.com/photo-1594273255015-6d432e36e488?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjYW5kbGVzJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc0OTc3NDU5fDA&ixlib=rb-4.1.0&q=80&w=1080";
const DECO_IMAGE = "https://images.unsplash.com/photo-1767050335810-081e886bb838?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGRlY29yYXRpb24lMjB0YWJsZSUyMHNldHVwJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzUwMjQzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080";
const FRIENDS_IMAGE = "https://images.unsplash.com/photo-1763951778440-13af353b122a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwY2VsZWJyYXRpbmclMjBiaXJ0aGRheSUyMHBhcnR5JTIwaGFwcHl8ZW58MXx8fHwxNzc1MDI0MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  {
    icon: MessageCircle,
    title: "ИИ Агент",
    desc: "Умный помощник, который поможет спланировать идеальный праздник — от темы до деталей",
    to: "/chat",
    color: "#f857a6",
    gradient: "linear-gradient(135deg, #f857a6, #ff5858)",
  },
  {
    icon: ClipboardList,
    title: "Планировщик",
    desc: "Управляйте гостями, задачами и бюджетом в одном месте",
    to: "/planner",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
  },
  {
    icon: Lightbulb,
    title: "Идеи",
    desc: "Вдохновляющие идеи для тем, декора, развлечений и угощений",
    to: "/ideas",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
];

const stats = [
  { value: "500+", label: "Идей для праздника" },
  { value: "24/7", label: "Поддержка ИИ" },
  { value: "100%", label: "Бесплатно" },
  { value: "∞", label: "Возможностей" },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="text-white">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Birthday Party"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,12,41,0.9) 0%, rgba(48,43,99,0.8) 50%, rgba(15,12,41,0.7) 100%)" }} />
        </div>

        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: Math.random() * 12 + 4,
              height: Math.random() * 12 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "#f857a6" : "#8b5cf6",
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{ background: "rgba(248,87,166,0.2)", border: "1px solid rgba(248,87,166,0.4)" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#f857a6" }} />
              <span style={{ color: "#f857a6" }}>Powered by AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Идеальный{" "}
              <span
                className="block"
                style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                День Рождения
              </span>
              с помощью ИИ
            </h1>

            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Наш ИИ-агент поможет спланировать незабываемый праздник — от выбора темы и декора до составления меню и списка гостей.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/chat")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold transition-all shadow-lg"
                style={{ background: "linear-gradient(135deg, #f857a6, #ff5858)", boxShadow: "0 8px 32px rgba(248,87,166,0.4)" }}
              >
                <MessageCircle className="w-5 h-5" />
                Начать с ИИ Агентом
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/planner")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
              >
                <ClipboardList className="w-5 h-5" />
                Открыть планировщик
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-y border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold" style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Всё что нужно для праздника</h2>
          <p className="text-white/50 text-lg">Три инструмента для создания незабываемого события</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(feature.to)}
                className="cursor-pointer rounded-3xl p-8 group transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: feature.gradient }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6">{feature.desc}</p>
                <div
                  className="flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
                  style={{ color: feature.color }}
                >
                  Открыть <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-8 overflow-hidden">
        <div className="flex gap-4 px-4">
          {[CAKE_IMAGE, DECO_IMAGE, FRIENDS_IMAGE, CAKE_IMAGE, DECO_IMAGE].map((src, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <img src={src} alt="Party" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Как это работает</h2>
          <p className="text-white/50 text-lg">Всего три шага до идеального праздника</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: MessageCircle, title: "Поговорите с ИИ", desc: "Расскажите агенту о вашем событии: возраст именинника, количество гостей, бюджет и предпочтения", color: "#f857a6" },
            { step: "02", icon: Zap, title: "Получите план", desc: "ИИ создаст персонализированный план праздника с идеями для декора, меню и развлечений", color: "#8b5cf6" },
            { step: "03", icon: Heart, title: "Наслаждайтесь!", desc: "Используйте планировщик для управления всеми деталями и устройте незабываемый праздник", color: "#f59e0b" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-7xl font-bold opacity-10 absolute -top-4 left-1/2 -translate-x-1/2" style={{ color: item.color }}>
                  {item.step}
                </div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
                  style={{ background: `${item.color}22`, border: `2px solid ${item.color}44` }}
                >
                  <Icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(248,87,166,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(248,87,166,0.3)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full" style={{ background: "#f857a6", filter: "blur(80px)" }} />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full" style={{ background: "#8b5cf6", filter: "blur(80px)" }} />
          </div>
          <div className="relative">
            <Star className="w-12 h-12 mx-auto mb-4" style={{ color: "#f857a6" }} />
            <h2 className="text-4xl font-bold mb-4">Готовы создать праздник мечты?</h2>
            <p className="text-white/60 text-lg mb-8">Начните прямо сейчас — это бесплатно!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/chat")}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-semibold text-lg"
              style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)", boxShadow: "0 8px 32px rgba(248,87,166,0.4)" }}
            >
              <Sparkles className="w-5 h-5" />
              Начать планирование
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}