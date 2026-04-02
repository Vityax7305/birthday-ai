import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Guest {
  id: string;
  name: string;
  email?: string;
  status: "pending" | "confirmed" | "declined";
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

interface PlannerContextType {
  guests: Guest[];
  tasks: Task[];
  expenses: Expense[];
  addGuest: (guest: Omit<Guest, 'id'>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateGuestStatus: (id: string, status: Guest['status']) => void;
  toggleTask: (id: string) => void;
  deleteGuest: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteExpense: (id: string) => void;
  clearAll: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    setGuests(prev => [...prev, { ...guest, id: Date.now().toString() }]);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  };

  const updateGuestStatus = (id: string, status: Guest['status']) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteGuest = (id: string) => {
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = () => {
    setGuests([]);
    setTasks([]);
    setExpenses([]);
  };

  return (
    <PlannerContext.Provider value={{
      guests, tasks, expenses,
      addGuest, addTask, addExpense,
      updateGuestStatus, toggleTask,
      deleteGuest, deleteTask, deleteExpense,
      clearAll
    }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within PlannerProvider');
  }
  return context;
}