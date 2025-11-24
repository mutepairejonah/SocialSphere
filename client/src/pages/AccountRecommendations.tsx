import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { AlertCircle, Mail, Phone, User } from "lucide-react";

interface Recommendation {
  id: number;
  accountName: string;
  instagramUsername: string;
  matchType: 'email' | 'phone';
  matchValue: string;
}

interface AccountRecommendationsProps {
  newEmail?: string;
  newPhone?: string;
  newUsername?: string;
}

export function AccountRecommendations({ newEmail, newPhone, newUsername }: AccountRecommendationsProps) {
  const { currentUser } = useStore();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const findRecommendations = async () => {
      if (!newEmail && !newPhone) return;
      
      setLoading(true);
      try {
        const matchingAccounts = (currentUser?.instagramAccounts || [])
          .map((acc, idx) => {
            const matches: Recommendation[] = [];
            
            if (newEmail && acc.instagramEmail === newEmail && acc.instagramEmail) {
              matches.push({
                id: idx,
                accountName: acc.accountName || `Account ${idx + 1}`,
                instagramUsername: acc.instagramUsername || '',
                matchType: 'email',
                matchValue: newEmail
              });
            }
            
            if (newPhone && acc.instagramPhone === newPhone && acc.instagramPhone) {
              matches.push({
                id: idx,
                accountName: acc.accountName || `Account ${idx + 1}`,
                instagramUsername: acc.instagramUsername || '',
                matchType: 'phone',
                matchValue: newPhone
              });
            }
            
            return matches;
          })
          .flat();
        
        setRecommendations(matchingAccounts);
      } finally {
        setLoading(false);
      }
    };

    findRecommendations();
  }, [newEmail, newPhone, currentUser?.instagramAccounts]);

  if (loading || recommendations.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">📱 Related Accounts Found!</h3>
          <p className="text-sm text-blue-800 mb-3">
            We found {recommendations.length} existing account(s) created with the same contact information:
          </p>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <div key={`${rec.id}-${rec.matchType}`} className="bg-white rounded p-2 text-sm">
                <div className="flex items-center gap-2">
                  {rec.matchType === 'email' ? (
                    <Mail className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Phone className="w-4 h-4 text-green-600" />
                  )}
                  <span className="font-medium">{rec.accountName}</span>
                  <span className="text-gray-500">(@{rec.instagramUsername})</span>
                </div>
                <div className="text-xs text-gray-600 ml-6">
                  Matched by {rec.matchType}: {rec.matchValue}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-700 mt-2">
            💡 Tip: You can manage all your accounts from your profile!
          </p>
        </div>
      </div>
    </div>
  );
}
