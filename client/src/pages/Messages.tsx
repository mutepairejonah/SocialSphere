import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, Video } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp?: { toDate: () => Date } | null;
  read: boolean;
}

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

export default function Messages() {
  const { currentUser, sendMessage, getMessages, startCall, getFollowing } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calling, setCalling] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load following users
    const following = getFollowing();
    setFollowingUsers(following as User[]);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages();
    }
  }, [selectedUserId]);

  const loadMessages = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    try {
      const msgs = await getMessages(selectedUserId);
      setMessages(msgs as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUserId) return;

    const messageText = messageInput.trim();
    setMessageInput("");
    setLoading(true);

    try {
      await sendMessage(selectedUserId, messageText);
      loadMessages();
      toast({
        title: "Message Sent",
        description: `Message sent to ${selectedUser?.username}`
      });
    } catch (error: any) {
      setMessageInput(messageText);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to send message"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async (callType: 'audio' | 'video') => {
    if (!selectedUserId) return;
    
    setCalling(true);
    try {
      const callId = await startCall(selectedUserId, callType);
      toast({
        title: "Call Started",
        description: `${callType === 'video' ? 'Video' : 'Audio'} call initiated`
      });
      // In a real app, this would open a call interface
      setTimeout(() => setCalling(false), 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
      setCalling(false);
    }
  };

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  if (!selectedUserId) {
    return (
      <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center">
          <h1 className="font-bold text-xl">{currentUser.username}</h1>
        </header>

        <main className="p-4">
          <h2 className="font-bold text-lg mb-4">Messages</h2>
          {followingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
              <p className="font-semibold mb-2">No conversations yet</p>
              <p className="text-sm">Follow someone to start messaging</p>
            </div>
          ) : (
            <div className="space-y-3">
              {followingUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  data-testid={`conversation-${user.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                    {user.avatar && (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.username}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    );
  }

  const selectedUser = followingUsers.find(u => u.id === selectedUserId);

  return (
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSelectedUserId(null)}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <p className="font-bold text-sm">{selectedUser?.username}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleCall('audio')}
            disabled={calling}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleCall('video')}
            disabled={calling}
          >
            <Video className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col-reverse">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.senderId === currentUser.id
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-blue-100' : 'text-muted-foreground'}`}>
                  {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <Input
            id="message-input"
            name="message"
            placeholder="Message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="bg-muted/50 border-0 focus-visible:ring-0 h-10"
            data-testid="input-message"
            disabled={loading}
            autoComplete="off"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || loading}
            data-testid="button-send"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
