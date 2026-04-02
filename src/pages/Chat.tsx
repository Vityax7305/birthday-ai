import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  Copy,
  Check,
  MessageCircle,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Wifi,
  Calendar,
  Users,
  DollarSign,
  CheckSquare,
} from "lucide-react";
import { usePlanner } from "../context/PlannerContext";
import { setPlannerActions, yandexGPTDirectService } from "../services/yandexgpt-direct";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  "Придумай тему для детского дня рождения",
  "Как организовать вечеринку для 30 человек?",
  "Составь меню для праздника",
  "Идеи для конкурсов и игр",
  "Помоги с планированием бюджета",
  "Что подарить на день рождения?",
  "Идеи для декора своими руками",
  "Как выбрать место для праздника?",
  "Добавь гостя Анну Петрову",
  "Запланируй задачу: заказать торт",
];

export function Chat() {
  const { guests, tasks, expenses, addGuest, addTask, addExpense } = usePlanner();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `🎉 **Привет! Я BirthdayAI - ваш умный помощник по планированию дня рождения!** 

🤖 Я использую **YandexGPT** для генерации персонализированных советов.

**Что я умею:**
• 🎨 Придумывать уникальные темы и концепции
• 🍽️ Составлять меню с учетом предпочтений
• 👥 Добавлять гостей в планировщик
• 💰 Планировать бюджет и записывать расходы
• 📋 Создавать задачи по подготовке
• 🎮 Подбирать конкурсы для любого возраста
• 🎁 Давать идеи подарков
• 🎈 Советовать декор и украшения

**Попробуйте команды:**
• 👥 "Добавь гостя Анну Петрову"
• 📋 "Запланируй задачу: заказать торт"
• 💰 "Торт стоит 3500 рублей"
• 📊 "Покажи статистику планировщика"

**Или просто расскажите о вашем празднике:**
- Кто именинник? (возраст, пол, интересы)
- Сколько гостей планируется?
- Какой бюджет?

Я создам для вас идеальный план и добавлю всё в планировщик! ✨`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPlannerStats, setShowPlannerStats] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Подключаем действия планировщика к сервису ИИ
  useEffect(() => {
    setPlannerActions({
      addGuest: (name: string, email?: string) => {
        addGuest({ name, email, status: "pending" });
        console.log(`✅ Гость добавлен: ${name}`);
      },
      addTask: (title: string, category: string) => {
        addTask({ title, completed: false, category });
        console.log(`✅ Задача добавлена: ${title} (${category})`);
      },
      addExpense: (title: string, amount: number, category: string) => {
        addExpense({ title, amount, category });
        console.log(`✅ Расход добавлен: ${title} - ${amount}₽ (${category})`);
      },
      getState: () => ({
        guestsCount: guests.length,
        tasksCount: tasks.length,
        expensesTotal: expenses.reduce((sum, e) => sum + e.amount, 0)
      })
    });
    
    yandexGPTDirectService.startNewChat();
  }, [addGuest, addTask, addExpense, guests.length, tasks.length, expenses]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const reply = await yandexGPTDirectService.sendMessage(content);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Ошибка:", err);
      setError("Ошибка подключения к YandexGPT");
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ Извините, произошла ошибка. Пожалуйста, попробуйте позже. 🎉",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    yandexGPTDirectService.clearHistory();
    setMessages([
      {
        id: "welcome-new",
        role: "assistant",
        content: "🎉 Чат очищен! Начнём заново. Расскажите о вашем празднике, и я помогу создать идеальный план! ✨",
        timestamp: new Date(),
      },
    ]);
    setError(null);
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
      .replace(/• (.*?)(<br\/>|$)/g, '<span class="flex gap-2 my-0.5"><span>•</span><span>$1</span></span>')
      .replace(/✅/g, '<span class="text-green-400">✅</span>');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const completedTasks = tasks.filter(t => t.completed).length;

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
            <div className="text-white font-semibold flex items-center gap-2">
              BirthdayAI Агент
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                YandexGPT
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs">Готов к работе</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlannerStats(!showPlannerStats)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            Статистика
          </button>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Очистить
          </button>
        </div>
      </div>

      {/* Planner Stats Panel */}
      {showPlannerStats && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 p-4 rounded-xl"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Планировщик праздника
            </h3>
            <button
              onClick={() => setShowPlannerStats(false)}
              className="text-white/40 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{guests.length}</div>
              <div className="text-xs text-white/50">Гостей</div>
            </div>
            <div className="text-center">
              <CheckSquare className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{completedTasks}/{tasks.length}</div>
              <div className="text-xs text-white/50">Задач</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-5 h-5 text-pink-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{totalExpenses.toLocaleString()} ₽</div>
              <div className="text-xs text-white/50">Бюджет</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 text-center">
            <a href="/planner" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Перейти в полный планировщик →
            </a>
          </div>
        </motion.div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-2 p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400 text-sm">{error}</span>
        </div>
      )}

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

                <div className={`group max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: "linear-gradient(135deg, #f857a6, #8b5cf6)", color: "white", borderRadius: "18px 18px 4px 18px" }
                        : msg.isError
                        ? { background: "rgba(239,68,68,0.2)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "18px 18px 18px 4px" }
                        : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px 18px 18px 4px" }
                    }
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all px-1">
                    <span className="text-white/30 text-xs">
                      {msg.timestamp.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "assistant" && !msg.isError && (
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
                <span className="text-white/50 text-xs ml-2">YandexGPT думает...</span>
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
                placeholder="Спросите что-нибудь о дне рождения или добавьте данные в планировщик..."
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
          <p className="text-white/25 text-xs text-center mt-2">
            💡 Подсказка: "Добавь гостя Анну", "Запланируй заказать торт", "Торт 3500 рублей"
          </p>
        </div>
      </div>
    </div>
  );
}