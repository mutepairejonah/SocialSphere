import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, Video, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-2xl">Messages</h1>
          <Button size="icon" variant="ghost" className="h-10 w-10">
            <Phone className="w-5 h-5" />
          </Button>
        </header>

        <main className="p-4">
          {followingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground text-center">
              <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-semibold text-lg mb-2">No conversations yet</p>
              <p className="text-sm">Follow someone to start messaging</p>
            </div>
          ) : (
            <div className="space-y-1">
              {followingUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  data-testid={`conversation-${user.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-muted/60 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-border">
                      <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">now</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.fullName}</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedUserId(null)} className="h-10 w-10">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={selectedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserId}`} alt={selectedUser?.username} />
              <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-sm">{selectedUser?.username}</p>
              <p className="text-xs text-green-500 font-medium">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleCall('audio')}
            disabled={calling}
            className="h-10 w-10 hover:bg-muted rounded-full"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleCall('video')}
            disabled={calling}
            className="h-10 w-10 hover:bg-muted rounded-full"
          >
            <Video className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2 flex flex-col-reverse">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center py-20">
            <Avatar className="h-20 w-20 mb-4 opacity-20">
              <AvatarImage src={selectedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserId}`} />
              <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="font-bold text-sm">No messages yet</p>
            <p className="text-xs">Start a conversation with {selectedUser?.username}</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'} ${idx > 0 && messages[idx - 1]?.senderId === msg.senderId ? 'mt-0' : 'mt-2'}`}
            >
              <div className={`flex gap-2 max-w-xs ${msg.senderId === currentUser.id ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.senderId !== currentUser.id && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={selectedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserId}`} />
                    <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl break-words ${
                    msg.senderId === currentUser.id
                      ? 'bg-blue-500 text-white rounded-br-none shadow-sm'
                      : 'bg-muted rounded-bl-none text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-blue-100' : 'text-muted-foreground'}`}>
                    {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <div className="border-t border-border p-3 bg-background/95 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <Input
            id="message-input"
            name="message"
            placeholder="Aa"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="bg-muted/60 border-0 focus-visible:ring-0 h-10 rounded-full px-4"
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
            className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
