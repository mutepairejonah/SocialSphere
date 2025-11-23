import { useState } from "react";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const { searchUsers } = useStore();
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
      const results = await searchUsers(value);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    const { toggleFollow } = useStore();
    await toggleFollow(userId);
    setSearchResults(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search users..." 
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
        {searchResults.map(user => (
          <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                {user.avatar && (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.fullName}</p>
              </div>
            </div>
            <Button
              size="sm"
              className={`h-7 text-xs font-semibold ${user.isFollowing ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-white hover:bg-primary/90'}`}
              onClick={() => handleFollowToggle(user.id)}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
        {searchTerm && searchResults.length === 0 && !searching && (
          <p className="text-center text-muted-foreground text-sm py-4">No users found</p>
        )}
      </div>
    </div>
  );
}
