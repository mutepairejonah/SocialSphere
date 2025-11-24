import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, Search as SearchIcon, Loader2, Hash } from "lucide-react";
import { searchHashtags } from "@/lib/instagram";
import { toast } from "sonner";

export default function Search() {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const hashtags = await searchHashtags(query);
      setResults(hashtags);
      if (hashtags.length === 0) {
        toast.info("No hashtags found");
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Search</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hashtags..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-search"
            />
          </div>
        </form>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        <div className="space-y-2">
          {results.map((hashtag) => (
            <button
              key={hashtag.id}
              onClick={() => setLocation(`/hashtag/${hashtag.id}?name=${hashtag.name}`)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border border-gray-200"
              data-testid={`hashtag-${hashtag.name}`}
            >
              <Hash className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">#{hashtag.name}</p>
              </div>
            </button>
          ))}
        </div>

        {query && !loading && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hashtags found for "{query}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
