import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Bell,
} from "lucide-react";

export type NotificationType =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  showAlert: (message: string, duringRecording?: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };
    setNotifications((prev) => [...prev, newNotification]);

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showAlert = (message: string, duringRecording: boolean = false) => {
    addNotification({
      type: duringRecording ? "alert" : "info",
      title: duringRecording ? "Recording Alert" : "Info",
      message,
      duration: duringRecording ? 3000 : 5000,
    });
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, showAlert }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification;
  onRemove: (id: string) => void;
}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
    alert: Bell,
  };

  const colors = {
    success: "bg-green-500/20 border-green-500/30 text-green-300",
    error: "bg-red-500/20 border-red-500/30 text-red-300",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-300",
    warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300",
    alert: "bg-orange-500/20 border-orange-500/30 text-orange-300",
  };

  const Icon = icons[notification.type];
  const colorClass = colors[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`glass border-2 ${colorClass} rounded-lg p-4 shadow-lg`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-1">{notification.title}</h4>
          <p className="text-sm opacity-90">{notification.message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs underline hover:no-underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Real-time alerts during recording
export function useRecordingAlerts(
  isRecording: boolean,
  audioLevel: number,
  sentimentScore: number,
  engagementScore: number
) {
  const { showAlert } = useNotifications();
  const lastAlertTime = useRef<{
    audio?: number;
    sentiment?: number;
    engagement?: number;
  }>({});

  useEffect(() => {
    if (!isRecording) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const ALERT_COOLDOWN = 30000; // 30 segundos entre alertas do mesmo tipo

      // Low audio level alert - threshold muito mais baixo e com cooldown
      // Só alerta se realmente estiver muito baixo (próximo de zero) por tempo prolongado
      // O alerta é apenas informativo e NÃO bloqueia transcrição/análise
      if (audioLevel < 2 && audioLevel > 0) {
        const lastAudioAlert = lastAlertTime.current.audio || 0;
        if (now - lastAudioAlert > ALERT_COOLDOWN) {
          showAlert(
            "Nível de áudio detectado como baixo. Verifique se o microfone está funcionando corretamente. A gravação continua normalmente.",
            true
          );
          lastAlertTime.current.audio = now;
        }
      }

      // Low sentiment alert
      if (sentimentScore < 0.3 && sentimentScore > 0) {
        const lastSentimentAlert = lastAlertTime.current.sentiment || 0;
        if (now - lastSentimentAlert > ALERT_COOLDOWN) {
          showAlert(
            "Sentimento está baixo. Tente manter um tom mais positivo.",
            true
          );
          lastAlertTime.current.sentiment = now;
        }
      }

      // Low engagement alert
      if (engagementScore < 0.3 && engagementScore > 0) {
        const lastEngagementAlert = lastAlertTime.current.engagement || 0;
        if (now - lastEngagementAlert > ALERT_COOLDOWN) {
          showAlert(
            "Engajamento está baixo. Tente fazer mais perguntas ou variar sua voz.",
            true
          );
          lastAlertTime.current.engagement = now;
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [isRecording, audioLevel, sentimentScore, engagementScore, showAlert]);
}
