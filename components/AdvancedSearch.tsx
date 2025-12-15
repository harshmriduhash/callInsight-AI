import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

interface Recording {
  id: string;
  name: string;
  date: string;
  duration: number;
  transcription?: string;
  aiData?: {
    sentiment: number;
    engagement: number;
    keywords: string[];
  };
}

interface AdvancedSearchProps {
  recordings: Recording[];
  onSelect: (ids: string[]) => void;
}

export default function AdvancedSearch({
  recordings,
  onSelect,
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minSentiment: 0,
    maxSentiment: 1,
    minEngagement: 0,
    maxEngagement: 1,
    minDuration: 0,
    maxDuration: Infinity,
    dateFrom: "",
    dateTo: "",
    keywords: [] as string[],
  });

  const filteredRecordings = useMemo(() => {
    return recordings.filter((rec) => {
      // Text search in transcription and keywords
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const inTranscription = rec.transcription
          ?.toLowerCase()
          .includes(query);
        const inKeywords = rec.aiData?.keywords.some((k) =>
          k.toLowerCase().includes(query)
        );
        const inName = rec.name.toLowerCase().includes(query);

        if (!inTranscription && !inKeywords && !inName) {
          return false;
        }
      }

      // Sentiment filter
      const sentiment = rec.aiData?.sentiment || 0;
      if (
        sentiment < filters.minSentiment ||
        sentiment > filters.maxSentiment
      ) {
        return false;
      }

      // Engagement filter
      const engagement = rec.aiData?.engagement || 0;
      if (
        engagement < filters.minEngagement ||
        engagement > filters.maxEngagement
      ) {
        return false;
      }

      // Duration filter
      if (
        rec.duration < filters.minDuration ||
        rec.duration > filters.maxDuration
      ) {
        return false;
      }

      // Date filter
      if (filters.dateFrom && new Date(rec.date) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && new Date(rec.date) > new Date(filters.dateTo)) {
        return false;
      }

      // Keywords filter
      if (filters.keywords.length > 0) {
        const recKeywords = rec.aiData?.keywords || [];
        const hasAllKeywords = filters.keywords.every((k) =>
          recKeywords.some((rk) => rk.toLowerCase().includes(k.toLowerCase()))
        );
        if (!hasAllKeywords) return false;
      }

      return true;
    });
  }, [recordings, searchQuery, filters]);

  const allKeywords = useMemo(() => {
    const keywordSet = new Set<string>();
    recordings.forEach((rec) => {
      rec.aiData?.keywords?.forEach((k) => keywordSet.add(k));
    });
    return Array.from(keywordSet).sort();
  }, [recordings]);

  const toggleKeyword = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter((k) => k !== keyword)
        : [...prev.keywords, keyword],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar transcrições, palavras-chave ou nomes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-black/30 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="font-bold">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Sentiment Range */}
          <div>
            <label className="block text-sm mb-2">
              Sentimento: {(filters.minSentiment * 100).toFixed(0)}% -{" "}
              {(filters.maxSentiment * 100).toFixed(0)}%
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.minSentiment}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minSentiment: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.maxSentiment}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxSentiment: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Engagement Range */}
          <div>
            <label className="block text-sm mb-2">
              Engajamento: {(filters.minEngagement * 100).toFixed(0)}% -{" "}
              {(filters.maxEngagement * 100).toFixed(0)}%
            </label>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.minEngagement}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minEngagement: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.maxEngagement}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxEngagement: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm mb-2">Duração (minutos)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Mín"
                value={filters.minDuration || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minDuration: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded"
              />
              <input
                type="number"
                placeholder="Máx"
                value={
                  filters.maxDuration === Infinity ? "" : filters.maxDuration
                }
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxDuration: parseInt(e.target.value) || Infinity,
                  }))
                }
                className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm mb-2">Data De</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Data Até</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="w-full px-2 py-1 bg-black/30 border border-gray-600 rounded"
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="mt-4">
          <label className="block text-sm mb-2">Palavras-chave</label>
          <div className="flex flex-wrap gap-2">
            {allKeywords.slice(0, 20).map((keyword) => (
              <button
                key={keyword}
                onClick={() => toggleKeyword(keyword)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filters.keywords.includes(keyword)
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Results: {filteredRecordings.length}</h3>
          <button
            onClick={() => onSelect(filteredRecordings.map((r) => r.id))}
            className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Select All
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredRecordings.map((rec) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-black/20 rounded-lg hover:bg-black/30 cursor-pointer"
              onClick={() => onSelect([rec.id])}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold">{rec.name}</h4>
                  <p className="text-sm text-gray-400">
                    {new Date(rec.date).toLocaleDateString()} •{" "}
                    {Math.floor(rec.duration / 60)} min
                  </p>
                </div>
                <div className="text-right text-sm">
                  <div>
                    Sentimento:{" "}
                    {((rec.aiData?.sentiment || 0) * 100).toFixed(0)}%
                  </div>
                  <div>
                    Engajamento:{" "}
                    {((rec.aiData?.engagement || 0) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
