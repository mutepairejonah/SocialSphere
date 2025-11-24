import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUserProfile } from "@/lib/instagram";

export default function ConnectInstagram() {
  const { currentUser, addInstagramAccount } = useStore();
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleTokenChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value;
    setToken(newToken);

    if (newToken.trim() && newToken.length > 50) {
      try {
        const profile = await getUserProfile('me', newToken);
        setPreviewData(profile);
      } catch (error) {
        setPreviewData(null);
      }
    } else {
      setPreviewData(null);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error("Please enter your Instagram access token");
      return;
    }

    setLoading(true);
    try {
      await addInstagramAccount(token, accountName || undefined);
      toast.success("Instagram account connected!");
      setLocation("/profile");
    } catch (error) {
      console.error("Failed to connect Instagram:", error);
      toast.error("Failed to connect Instagram account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation("/profile")}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Connect Instagram</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6 max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">How to get your Instagram access token:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Go to <a href="https://developers.instagram.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Instagram for Developers</a></li>
              <li>Create an app or use existing one</li>
              <li>Go to Roles → Testers and add your account</li>
              <li>Generate an access token with instagram_basic, instagram_graph_user_media permissions</li>
              <li>Copy and paste the token below</li>
            </ol>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-2">
                Account Name (Optional)
              </label>
              <input
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., My Main Account, Business Account..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                data-testid="input-account-name"
              />
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Access Token
              </label>
              <textarea
                id="token"
                value={token}
                onChange={handleTokenChange}
                placeholder="Paste your Instagram access token here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                disabled={loading}
                data-testid="input-token"
              />
            </div>

            {previewData && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">✓ Account Preview:</p>
                <div className="text-sm space-y-1 text-gray-600">
                  {previewData.username && <p>👤 Username: <strong>@{previewData.username}</strong></p>}
                  {previewData.name && <p>📝 Name: <strong>{previewData.name}</strong></p>}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              data-testid="button-connect"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Connecting..." : "Connect Instagram"}
            </button>
          </form>

          {currentUser?.instagramAccounts && currentUser.instagramAccounts.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
              <p className="font-semibold">✓ {currentUser.instagramAccounts.length} account(s) connected</p>
              <p className="text-xs mt-1">You can manage all your accounts from your profile.</p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 space-y-2">
            <p className="font-semibold text-gray-700">Why do we need this?</p>
            <p>Each user needs to connect their own Instagram account to see their personal Instagram profile, posts, followers, and engagement metrics.</p>
            <p>Your token is securely stored and only used to fetch YOUR Instagram data.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
