import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    
    if (!value || value.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/search/posts?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search posts..." 
            className="pl-9 bg-muted/80 border-0 h-9 rounded-full focus-visible:ring-0 focus-visible:bg-muted" 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Results */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {searchResults.map(post => (
          <div key={post.id} className="p-2 hover:bg-muted/50 rounded-lg transition-colors border border-border">
            <p className="font-semibold text-sm truncate">{post.caption || "Untitled Post"}</p>
            <p className="text-xs text-muted-foreground truncate">by {post.username || "User"}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post" className="w-full h-20 object-cover rounded mt-2" />
            )}
          </div>
        ))}
        {searchTerm && searchResults.length === 0 && !searching && (
          <p className="text-center text-muted-foreground text-sm py-4">No posts found</p>
        )}
      </div>
    </div>
  );
}
