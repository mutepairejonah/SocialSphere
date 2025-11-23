import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, Video, MessageCircle, MoreVertical, Image as ImageIcon, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { initializeSocket, sendMessage, onMessageReceived, onMessagesLoaded, offAllEvents } from "@/lib/socket";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp?: string | { toDate: () => Date } | null;
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
  const [calling, setCalling] = useState<{ active: boolean; type?: 'audio' | 'video' }>({ active: false });
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const selectedUser = followingUsers.find(u => u.id === selectedUserId);

  useEffect(() => {
    // Load following users
    const following = getFollowing();
    setFollowingUsers(following as User[]);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    initializeSocket(currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    if (selectedUserId && currentUser) {
      loadMessages();
      
      // Listen for real-time messages
      const handleNewMessage = (message: any) => {
        setMessages(prev => [...prev, message]);
      };
      
      const handleMessagesLoaded = (loadedMessages: any[]) => {
        setMessages(loadedMessages);
      };
      
      onMessageReceived(handleNewMessage);
      onMessagesLoaded(handleMessagesLoaded);
      
      return () => {
        offAllEvents();
      };
    }
  }, [selectedUserId, currentUser]);

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

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUserId || !currentUser) return;

    const messageText = messageInput.trim();
    setMessageInput("");

    try {
      const conversationId = [currentUser.id, selectedUserId].sort().join("_");
      sendMessage(currentUser.id, selectedUserId, messageText);
      // Add message optimistically
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        conversationId,
        senderId: currentUser.id,
        recipientId: selectedUserId,
        message: messageText,
        timestamp: new Date().toLocaleTimeString(),
        read: false
      }]);
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
    }
  };

  const handleCall = async (callType: 'audio' | 'video') => {
    if (!selectedUserId) return;
    
    setCalling({ active: true, type: callType });
    try {
      const callId = await startCall(selectedUserId, callType);
      toast({
        title: "Call Started",
        description: `${callType === 'video' ? 'Video' : 'Audio'} call initiated with ${selectedUser?.username}`
      });
      // Simulate call UI (in production, integrate WebRTC)
      setTimeout(() => setCalling({ active: false }), 5000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
      setCalling({ active: false });
    }
  };

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  // Call screen
  if (calling.active) {
    return (
      <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center fixed inset-0 z-50">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-blue-500 animate-pulse">
            <img src={selectedUser?.avatar} alt={selectedUser?.username} className="w-full h-full object-cover" />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold">{selectedUser?.username}</h2>
            <p className="text-gray-300 text-sm mt-2">{calling.type === 'video' ? '📹 Video Call' : '☎️ Audio Call'}</p>
            <p className="text-gray-400 text-xs mt-4 animate-pulse">Calling...</p>
          </div>
        </div>
        <div className="absolute bottom-8 flex gap-4">
          <button onClick={() => setCalling({ active: false })} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-colors" data-testid="button-end-call">
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </button>
        </div>
      </div>
    );
  }

  if (!selectedUserId) {
    return (
      <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl">Messages</h1>
            <p className="text-xs text-muted-foreground">Real-time chat & video calls</p>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-muted rounded-full" data-testid="button-audio-calls">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-muted rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
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

  return (
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedUserId(null)} className="h-10 w-10 hover:bg-muted" data-testid="button-back-messages">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={selectedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserId}`} alt={selectedUser?.username} />
                <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            <div>
              <p className="font-bold text-sm">{selectedUser?.username}</p>
              <p className="text-xs text-green-500 font-medium">Active 2m ago</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleCall('audio')}
            disabled={calling.active}
            className="h-10 w-10 hover:bg-muted rounded-full"
            title="Audio call"
            data-testid="button-voice-call"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleCall('video')}
            disabled={calling.active}
            className="h-10 w-10 hover:bg-muted rounded-full"
            title="Video call"
            data-testid="button-video-call"
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-muted rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2 flex flex-col">
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
          messages.map((msg, idx) => {
            const isConsecutive = idx > 0 && messages[idx - 1]?.senderId === msg.senderId;
            const nextIsDifferent = idx < messages.length - 1 && messages[idx + 1]?.senderId !== msg.senderId;
            const messageTime = msg.timestamp?.toDate?.() ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now';
            
            return (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-0.5' : 'mt-3'} group`}
              >
                <div className={`flex gap-2 max-w-xs ${msg.senderId === currentUser.id ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.senderId !== currentUser.id && (
                    <div className={isConsecutive ? 'w-8' : ''}>
                      {!isConsecutive && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={selectedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUserId}`} />
                          <AvatarFallback>{selectedUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-4 py-2.5 rounded-2xl break-words max-w-xs ${
                        msg.senderId === currentUser.id
                          ? 'bg-blue-500 text-white rounded-br-none shadow-sm hover:bg-blue-600'
                          : 'bg-muted rounded-bl-none text-foreground hover:bg-muted/80'
                      } transition-colors cursor-default`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    {nextIsDifferent && (
                      <p className={`text-xs ${msg.senderId === currentUser.id ? 'text-right mr-2' : 'text-left ml-2'} text-muted-foreground`}>
                        {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      <div className="border-t border-border p-3 bg-background/95 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-muted rounded-full text-blue-500">
            <ImageIcon className="w-5 h-5" />
          </Button>
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
            className="bg-muted/60 border-0 focus-visible:ring-0 h-10 rounded-full px-4 flex-1"
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
            {messageInput.trim() ? <Send className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
