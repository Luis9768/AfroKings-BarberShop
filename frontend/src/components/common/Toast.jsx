import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "../styles/Toast.css";

export function Toast({ message, type = "info", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-container toast-${type}`}>
      <div className="toast-icon">
        {type === "success" && <CheckCircle2 size={20} />}
        {type === "error" && <AlertCircle size={20} />}
        {type === "info" && <Info size={20} />}
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close-btn" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
