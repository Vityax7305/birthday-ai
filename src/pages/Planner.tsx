import { useState } from "react";
import { motion } from "motion/react";
import {
  ClipboardList,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Mail,
  Send,
} from "lucide-react";
import { EmailInviteModal } from "../components/EmailInviteModal";

interface Guest {
  id: string;
  name: string;
  status: "pending" | "confirmed" | "declined";
  email?: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export function Planner() {
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", name: "Анна Петрова", status: "pending", email: "anna@example.com" },
    { id: "2", name: "Иван Иванов", status: "pending", email: "ivan@example.com" },
    { id: "3", name: "Мария Смирнова", status: "pending" },
    { id: "4", name: "Дмитрий Козлов", status: "confirmed", email: "dmitry@example.com" },
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Заказать торт", completed: false, category: "Еда" },
    { id: "2", title: "Купить украшения", completed: true, category: "Декор" },
    { id: "3", title: "Подобрать музыку", completed: false, category: "Развлечения" },
    { id: "4", title: "Разослать приглашения", completed: true, category: "Гости" },
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", title: "Торт", amount: 3500, category: "Еда" },
    { id: "2", title: "Украшения", amount: 5000, category: "Декор" },
    { id: "3", title: "Аниматор", amount: 8000, category: "Развлечения" },
    { id: "4", title: "Продукты", amount: 12000, category: "Еда" },
  ]);

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Другое");
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("Другое");

  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [editGuestName, setEditGuestName] = useState("");
  const [editGuestEmail, setEditGuestEmail] = useState("");

  // Состояние для модального окна email
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const confirmedGuests = guests.filter(g => g.status === "confirmed").length;
  const pendingGuests = guests.filter(g => g.status === "pending").length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const addGuest = () => {
    if (newGuestName.trim()) {
      setGuests([...guests, { 
        id: Date.now().toString(), 
        name: newGuestName, 
        status: "pending",
        email: newGuestEmail.trim() || undefined
      }]);
      setNewGuestName("");
      setNewGuestEmail("");
    }
  };

  const updateGuestStatus = (id: string, status: Guest["status"]) => {
    setGuests(guests.map(g => g.id === id ? { ...g, status } : g));
  };

  const deleteGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const startEditGuest = (guest: Guest) => {
    setEditingGuest(guest.id);
    setEditGuestName(guest.name);
    setEditGuestEmail(guest.email || "");
  };

  const saveEditGuest = (id: string) => {
    if (editGuestName.trim()) {
      setGuests(guests.map(g => g.id === id ? { 
        ...g, 
        name: editGuestName,
        email: editGuestEmail.trim() || undefined
      } : g));
    }
    setEditingGuest(null);
    setEditGuestName("");
    setEditGuestEmail("");
  };

  const openEmailModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setEmailModalOpen(true);
  };

  const handleInviteSent = (guestId: string, email: string) => {
    setGuests(guests.map(g => 
      g.id === guestId ? { ...g, email } : g
    ));
    // Опционально: показать уведомление
    alert(`Приглашение отправлено на ${email}`);
  };

  const sendBulkInvites = () => {
    const guestsWithoutEmail = guests.filter(g => !g.email && g.status === "pending");
    if (guestsWithoutEmail.length === 0) {
      alert("У всех гостей уже есть email адреса!");
      return;
    }
    alert(`У ${guestsWithoutEmail.length} гостей нет email адреса. Добавьте email перед отправкой.`);
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle, completed: false, category: newTaskCategory }]);
      setNewTaskTitle("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addExpense = () => {
    if (newExpenseTitle.trim() && newExpenseAmount) {
      setExpenses([...expenses, { id: Date.now().toString(), title: newExpenseTitle, amount: parseFloat(newExpenseAmount), category: newExpenseCategory }]);
      setNewExpenseTitle("");
      setNewExpenseAmount("");
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const categories = ["Еда", "Декор", "Развлечения", "Подарки", "Другое"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <EmailInviteModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        guest={selectedGuest}
        onInviteSent={handleInviteSent}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4"
          style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)" }}
        >
          <ClipboardList className="w-4 h-4" style={{ color: "#8b5cf6" }} />
          <span style={{ color: "#8b5cf6" }}>Планировщик праздника</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Организация праздника</h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Управляйте гостями, задачами и бюджетом в одном месте
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <Users className="w-6 h-6" style={{ color: "#8b5cf6" }} />
            <span className="text-2xl font-bold text-white">{guests.length}</span>
          </div>
          <p className="text-white/60 text-sm mt-2">Всего гостей</p>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-green-400">✓ {confirmedGuests}</span>
            <span className="text-yellow-400">⏳ {pendingGuests}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-6 h-6" style={{ color: "#22c55e" }} />
            <span className="text-2xl font-bold text-white">{completedTasks}/{tasks.length}</span>
          </div>
          <p className="text-white/60 text-sm mt-2">Выполнено задач</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div className="h-1.5 rounded-full" style={{ width: `${(completedTasks / tasks.length) * 100}%`, background: "#22c55e" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{ background: "rgba(248,87,166,0.15)", border: "1px solid rgba(248,87,166,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <DollarSign className="w-6 h-6" style={{ color: "#f857a6" }} />
            <span className="text-2xl font-bold text-white">{totalExpenses.toLocaleString()} ₽</span>
          </div>
          <p className="text-white/60 text-sm mt-2">Общий бюджет</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5"
          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          <div className="flex items-center justify-between">
            <Calendar className="w-6 h-6" style={{ color: "#f59e0b" }} />
            <span className="text-2xl font-bold text-white">{tasks.length}</span>
          </div>
          <p className="text-white/60 text-sm mt-2">Активных задач</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Guests Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: "#8b5cf6" }} />
              Список гостей
            </h2>
            {guests.filter(g => g.email).length > 0 && (
              <button
                onClick={sendBulkInvites}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6" }}
              >
                <Send className="w-3 h-3" />
                Отправить всем
              </button>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGuest()}
              placeholder="Имя гостя"
              className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]"
            />
            <input
              type="email"
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
              placeholder="Email (опционально)"
              className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]"
            />
            <button
              onClick={addGuest}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {editingGuest === guest.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editGuestName}
                      onChange={(e) => setEditGuestName(e.target.value)}
                      className="flex-1 px-3 py-1 rounded-lg bg-white/20 text-white outline-none"
                      autoFocus
                    />
                    <input
                      type="email"
                      value={editGuestEmail}
                      onChange={(e) => setEditGuestEmail(e.target.value)}
                      placeholder="Email"
                      className="flex-1 px-3 py-1 rounded-lg bg-white/20 text-white outline-none"
                    />
                    <button onClick={() => saveEditGuest(guest.id)} className="p-1 text-green-400">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingGuest(null)} className="p-1 text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="text-white">{guest.name}</div>
                      {guest.email && (
                        <div className="text-white/40 text-xs">{guest.email}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={guest.status}
                        onChange={(e) => updateGuestStatus(guest.id, e.target.value as Guest["status"])}
                        className="px-2 py-1 rounded-lg text-sm bg-white/10 border border-white/20 text-white"
                      >
                        <option value="pending">Ожидает</option>
                        <option value="confirmed">Подтверждён</option>
                        <option value="declined">Отказался</option>
                      </select>
                      <button
                        onClick={() => openEmailModal(guest)}
                        className="p-1 text-white/40 hover:text-[#8b5cf6] transition-all"
                        title="Отправить приглашение по email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button onClick={() => startEditGuest(guest)} className="p-1 text-white/40 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteGuest(guest.id)} className="p-1 text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {guests.length === 0 && (
              <p className="text-white/40 text-center py-4">Список гостей пуст</p>
            )}
          </div>
        </motion.div>

        {/* Tasks Section - остаётся без изменений */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: "#22c55e" }} />
            Задачи
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Новая задача"
              className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#22c55e]"
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={addTask}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" fill="#22c55e" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30" />
                    )}
                  </button>
                  <span className={task.completed ? "text-white/40 line-through" : "text-white"}>
                    {task.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6" }}
                  >
                    {task.category}
                  </span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="p-1 text-white/40 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-white/40 text-center py-4">Нет задач</p>
            )}
          </div>
        </motion.div>

        {/* Expenses Section - остаётся без изменений */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 lg:col-span-2"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" style={{ color: "#f857a6" }} />
            Расходы
          </h2>

          <div className="flex gap-2 mb-4 flex-wrap">
            <input
              type="text"
              value={newExpenseTitle}
              onChange={(e) => setNewExpenseTitle(e.target.value)}
              placeholder="Статья расхода"
              className="flex-1 min-w-[150px] px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#f857a6]"
            />
            <input
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder="Сумма"
              className="w-32 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#f857a6]"
            />
            <select
              value={newExpenseCategory}
              onChange={(e) => setNewExpenseCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={addExpense}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)" }}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-white">{expense.title}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(248,87,166,0.2)", color: "#f857a6" }}
                  >
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{expense.amount.toLocaleString()} ₽</span>
                  <button onClick={() => deleteExpense(expense.id)} className="p-1 text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-white/40 text-center py-4">Нет расходов</p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-white/60">Итого:</span>
            <span className="text-2xl font-bold text-white">{totalExpenses.toLocaleString()} ₽</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}