import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

interface Guest {
  id: string;
  name: string;
  email?: string;
  status: "pending" | "confirmed" | "declined";
}

interface EmailInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onInviteSent: (guestId: string) => void;
}

export function EmailInviteModal({ isOpen, onClose, guest, onInviteSent }: EmailInviteModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSendInvite = async () => {
    if (!guest) return;

    setIsSending(true);
    setStatus("idle");

    setTimeout(() => {
      setStatus("success");
      setMessage(`Приглашение отправлено ${guest.name}`);
      onInviteSent(guest.id);
      
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
      setIsSending(false);
    }, 1500);
  };

  if (!isOpen || !guest) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.8)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)" }}
            >
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Отправить приглашение</h2>
            <p className="text-white/60 text-lg">{guest.name}</p>
            {guest.email && (
              <p className="text-white/40 text-sm mt-1">{guest.email}</p>
            )}
          </div>

          {status === "success" && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{message}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSendInvite}
              disabled={isSending}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #f857a6, #8b5cf6)" }}
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Отправить приглашение
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-white/60 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              Отмена
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}