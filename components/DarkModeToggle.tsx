import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "../hooks/useDarkMode";

export default function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-300" />
      )}
    </motion.button>
  );
}
