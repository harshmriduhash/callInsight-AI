import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface TimelinePoint {
  timestamp: string;
  type:
    | "emotion"
    | "silence"
    | "interruption"
    | "closing"
    | "rapport"
    | "objection";
  label: string;
  description: string;
  importance: "high" | "medium" | "low";
  metadata?: any;
}

interface InteractiveTimelineProps {
  duration: number; // seconds
  points: TimelinePoint[];
  emotionTimeline?: Array<{
    time: string;
    salespersonEmotion: string;
    customerEmotion: string;
  }>;
  onPointClick?: (point: TimelinePoint) => void;
}

export default function InteractiveTimeline({
  duration,
  points,
  emotionTimeline = [],
  onPointClick,
}: InteractiveTimelineProps) {
  const [selectedPoint, setSelectedPoint] = useState<TimelinePoint | null>(
    null
  );
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  const chartData = useMemo(() => {
    return emotionTimeline.map((item, index) => {
      const timeInSeconds = parseTimeToSeconds(item.time);
      return {
        time: item.time,
        timeInSeconds,
        salespersonEmotion: getEmotionValue(item.salespersonEmotion),
        customerEmotion: getEmotionValue(item.customerEmotion),
      };
    });
  }, [emotionTimeline]);

  const sortedPoints = useMemo(() => {
    return [...points].sort((a, b) => {
      return parseTimeToSeconds(a.timestamp) - parseTimeToSeconds(b.timestamp);
    });
  }, [points]);

  function parseTimeToSeconds(time: string): number {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  function getEmotionValue(emotion: string): number {
    const emotionMap: { [key: string]: number } = {
      joy: 0.9,
      confidence: 0.8,
      excitement: 0.85,
      calm: 0.7,
      neutral: 0.5,
      anxiety: 0.3,
      frustration: 0.2,
      anger: 0.1,
    };
    return emotionMap[emotion.toLowerCase()] || 0.5;
  }

  function getPointIcon(type: string) {
    switch (type) {
      case "emotion":
        return <TrendingUp className="w-4 h-4" />;
      case "silence":
        return <Clock className="w-4 h-4" />;
      case "interruption":
        return <AlertCircle className="w-4 h-4" />;
      case "closing":
        return <CheckCircle className="w-4 h-4" />;
      case "rapport":
        return <TrendingUp className="w-4 h-4" />;
      case "objection":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  }

  function getPointColor(type: string, importance: string) {
    const colors: { [key: string]: { [key: string]: string } } = {
      emotion: {
        high: "bg-blue-500",
        medium: "bg-blue-400",
        low: "bg-blue-300",
      },
      silence: {
        high: "bg-gray-500",
        medium: "bg-gray-400",
        low: "bg-gray-300",
      },
      interruption: {
        high: "bg-red-500",
        medium: "bg-red-400",
        low: "bg-red-300",
      },
      closing: {
        high: "bg-green-500",
        medium: "bg-green-400",
        low: "bg-green-300",
      },
      rapport: {
        high: "bg-purple-500",
        medium: "bg-purple-400",
        low: "bg-purple-300",
      },
      objection: {
        high: "bg-orange-500",
        medium: "bg-orange-400",
        low: "bg-orange-300",
      },
    };
    return colors[type]?.[importance] || "bg-gray-500";
  }

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Timeline Interativa</h3>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="time"
                stroke="#999"
                tick={{ fill: "#999", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 1]}
                stroke="#999"
                tick={{ fill: "#999", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="salespersonEmotion"
                stroke="#3b82f6"
                name="Emoção Vendedor"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="customerEmotion"
                stroke="#10b981"
                name="Emoção Cliente"
                dot={false}
                strokeWidth={2}
              />
              {sortedPoints.map((point, index) => {
                const timeInSeconds = parseTimeToSeconds(point.timestamp);
                return (
                  <ReferenceLine
                    key={index}
                    x={point.timestamp}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: point.label, position: "top" }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Timeline Bar */}
      <div className="relative mb-6">
        <div className="h-12 bg-gray-800 rounded-lg relative overflow-hidden">
          {sortedPoints.map((point, index) => {
            const position =
              (parseTimeToSeconds(point.timestamp) / duration) * 100;
            return (
              <motion.div
                key={index}
                className={`absolute top-0 h-full w-1 ${getPointColor(
                  point.type,
                  point.importance
                )} cursor-pointer`}
                style={{ left: `${position}%` }}
                whileHover={{ scaleY: 1.2 }}
                onClick={() => {
                  setSelectedPoint(point);
                  if (onPointClick) onPointClick(point);
                }}
                title={point.label}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0:00</span>
          <span>
            {Math.floor(duration / 60)}:
            {(duration % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Points List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedPoints.map((point, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedPoint === point
                ? "bg-emerald-600/30 border-2 border-emerald-500"
                : "bg-gray-800/50 hover:bg-gray-700/50"
            }`}
            onClick={() => {
              setSelectedPoint(point);
              if (onPointClick) onPointClick(point);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded ${getPointColor(
                    point.type,
                    point.importance
                  )}`}
                >
                  {getPointIcon(point.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{point.timestamp}</span>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                      {point.type}
                    </span>
                    {point.importance === "high" && (
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                        Alta Importância
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium mt-1">{point.label}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Point Details */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">{selectedPoint.label}</h4>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-300">{selectedPoint.description}</p>
            {selectedPoint.metadata && (
              <div className="mt-2 text-xs text-gray-400">
                <pre>{JSON.stringify(selectedPoint.metadata, null, 2)}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
