import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  TrendingUp,
  Gift,
  Cake,
  Music,
  Palette,
} from "lucide-react";
import { usePlanner } from "../context/PlannerContext";

const categories = ["Еда", "Декор", "Развлечения", "Подарки", "Другое"];
const taskCategories = ["Еда", "Декор", "Развлечения", "Гости", "Другое"];

export function Planner() {
  const { 
    guests, tasks, expenses, 
    addGuest, addTask, addExpense,
    updateGuestStatus, toggleTask,
    deleteGuest, deleteTask, deleteExpense 
  } = usePlanner();

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

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const confirmedGuests = guests.filter(g => g.status === "confirmed").length;
  const pendingGuests = guests.filter(g => g.status === "pending").length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const handleAddGuest = () => {
    if (newGuestName.trim()) {
      addGuest({ 
        name: newGuestName.trim(), 
        email: newGuestEmail.trim() || undefined,
        status: "pending" 
      });
      setNewGuestName("");
      setNewGuestEmail("");
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ 
        title: newTaskTitle.trim(), 
        completed: false, 
        category: newTaskCategory 
      });
      setNewTaskTitle("");
    }
  };

  const handleAddExpense = () => {
    if (newExpenseTitle.trim() && newExpenseAmount) {
      addExpense({ 
        title: newExpenseTitle.trim(), 
        amount: parseFloat(newExpenseAmount), 
        category: newExpenseCategory 
      });
      setNewExpenseTitle("");
      setNewExpenseAmount("");
    }
  };

  const startEditGuest = (guest: { id: string; name: string; email?: string }) => {
    setEditingGuest(guest.id);
    setEditGuestName(guest.name);
    setEditGuestEmail(guest.email || "");
  };

  const saveEditGuest = (id: string) => {
    if (editGuestName.trim()) {
      // В реальном приложении нужно обновлять гостя
      // Пока просто удаляем и добавляем заново
      deleteGuest(id);
      addGuest({ 
        name: editGuestName.trim(), 
        email: editGuestEmail.trim() || undefined,
        status: "pending" 
      });
    }
    setEditingGuest(null);
    setEditGuestName("");
    setEditGuestEmail("");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Еда": return <Cake className="w-3 h-3" />;
      case "Декор": return <Palette className="w-3 h-3" />;
      case "Развлечения": return <Music className="w-3 h-3" />;
      case "Подарки": return <Gift className="w-3 h-3" />;
      default: return <ClipboardList className="w-3 h-3" />;
    }
  };

  const expensesByCategory = categories.map(cat => ({
    name: cat,
    amount: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.amount > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="h-1.5 rounded-full" style={{ width: tasks.length ? `${(completedTasks / tasks.length) * 100}%` : '0%', background: "#22c55e" }} />
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
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: "#8b5cf6" }} />
            Список гостей {guests.length > 0 && `(${guests.length})`}
          </h2>

          <div className="flex gap-2 mb-4 flex-wrap">
            <input
              type="text"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGuest()}
              placeholder="Имя гостя"
              className="flex-1 min-w-[150px] px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]"
            />
            <input
              type="email"
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
              placeholder="Email (опционально)"
              className="flex-1 min-w-[150px] px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#8b5cf6]"
            />
            <button
              onClick={handleAddGuest}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {guests.map((guest) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {editingGuest === guest.id ? (
                    <div className="flex-1 flex gap-2 flex-wrap">
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
                        <span className="text-white">{guest.name}</span>
                        {guest.email && (
                          <span className="text-white/40 text-xs ml-2">{guest.email}</span>
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
                        <button onClick={() => startEditGuest(guest)} className="p-1 text-white/40 hover:text-white">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteGuest(guest.id)} className="p-1 text-white/40 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {guests.length === 0 && (
              <p className="text-white/40 text-center py-4">👥 Список гостей пуст</p>
            )}
          </div>
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: "#22c55e" }} />
            Задачи {tasks.length > 0 && `(${completedTasks}/${tasks.length})`}
          </h2>

          <div className="flex gap-2 mb-4 flex-wrap">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Новая задача"
              className="flex-1 min-w-[150px] px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#22c55e]"
            />
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
            >
              {taskCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={handleAddTask}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
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
                      className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6" }}
                    >
                      {getCategoryIcon(task.category)}
                      {task.category}
                    </span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="p-1 text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <p className="text-white/40 text-center py-4">📋 Нет задач</p>
            )}
          </div>
        </motion.div>

        {/* Expenses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 lg:col-span-2"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" style={{ color: "#f857a6" }} />
            Расходы {expenses.length > 0 && `(${totalExpenses.toLocaleString()} ₽)`}
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
              onClick={handleAddExpense}
              className="px-4 py-2 rounded-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)" }}
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <AnimatePresence>
                {expenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white">{expense.title}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: "rgba(248,87,166,0.2)", color: "#f857a6" }}
                      >
                        {getCategoryIcon(expense.category)}
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{expense.amount.toLocaleString()} ₽</span>
                      <button onClick={() => deleteExpense(expense.id)} className="p-1 text-white/40 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {expenses.length === 0 && (
                <p className="text-white/40 text-center py-4">💰 Нет расходов</p>
              )}
            </div>

            {/* Budget Chart */}
            {expensesByCategory.length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Распределение бюджета
                </h3>
                <div className="space-y-2">
                  {expensesByCategory.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">{cat.name}</span>
                        <span className="text-white">{cat.amount.toLocaleString()} ₽</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(cat.amount / totalExpenses) * 100}%`,
                            background: "linear-gradient(90deg, #f857a6, #8b5cf6)"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-white/10 flex justify-between">
                    <span className="text-white font-semibold">Итого</span>
                    <span className="text-white font-semibold">{totalExpenses.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}