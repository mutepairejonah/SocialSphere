import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Search, Loader2, MoreVertical, Phone, Video, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { initializeSocket, emitMessage, onMessageReceived, onMessagesLoaded, offAllEvents } from "@/lib/socket";

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
  isOnline?: boolean;
}

interface Conversation {
  userId: string;
  username: string;
  fullName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  unread: number;
}

export default function Messages() {
  const { currentUser, getMessages, logout } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const selectedConversation = conversations.find(c => c.userId === selectedUserId);

  useEffect(() => {
    if (!currentUser) return;
    initializeSocket(currentUser.id);

    // Simulate online status - in production use heartbeat
    const interval = setInterval(() => {
      setOnlineUsers(prev => new Set(Array.from(prev)));
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser) return;
      try {
        // Load all users for messaging
        const res = await fetch(`/api/search/users?q=`);
        const data = await res.json();
        
        const convoList: Conversation[] = data
          .filter((user: any) => user.id !== currentUser.id) // Exclude current user
          .map((user: any) => ({
            userId: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            lastMessage: "No messages yet",
            lastMessageTime: "",
            isOnline: Math.random() > 0.5,
            unread: 0
          }));

        setConversations(convoList.sort((a, b) => b.lastMessageTime.localeCompare(a.lastMessageTime)));
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };

    loadConversations();
  }, [currentUser]);

  useEffect(() => {
    if (selectedUserId && currentUser) {
      loadMessages();
      
      const handleNewMessage = (message: any) => {
        setMessages(prev => [...prev, message]);
        // Update conversation list
        setConversations(prev => prev.map(c => 
          c.userId === selectedUserId 
            ? { ...c, lastMessage: message.message, lastMessageTime: new Date().toISOString() }
            : c
        ).sort((a, b) => b.lastMessageTime.localeCompare(a.lastMessageTime)));
      };
      
      onMessageReceived(handleNewMessage);
      onMessagesLoaded((loadedMessages: any[]) => setMessages(loadedMessages));
      
      return () => offAllEvents();
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
      emitMessage(currentUser.id, selectedUserId, messageText);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        conversationId,
        senderId: currentUser.id,
        recipientId: selectedUserId,
        message: messageText,
        timestamp: new Date().toLocaleTimeString(),
        read: false
      }]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to send message"
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  // Filtered conversations
  const filteredConversations = conversations.filter(c =>
    c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20 max-w-4xl mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          data-testid="button-logout"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedUserId ? 'hidden md:flex' : ''}`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-gray-100 border-0 h-10 rounded-full focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-conversations"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div
                  key={conversation.userId}
                  onClick={() => setSelectedUserId(conversation.userId)}
                  className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === conversation.userId ? 'bg-blue-50' : ''
                  }`}
                  data-testid={`conversation-${conversation.userId}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">{conversation.username}</p>
                      <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">{conversation.lastMessageTime}</p>
                      {conversation.unread > 0 && (
                        <span className="inline-block bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>{selectedConversation.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedConversation.username}</p>
                  <p className="text-xs text-gray-500">{selectedConversation.isOnline ? 'Active now' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${msg.id}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === currentUser.id
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {typeof msg.timestamp === 'string' ? msg.timestamp : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gray-500">
                      {selectedConversation.username} is typing<span className="animate-pulse">...</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  className="flex-1 border-gray-300 rounded-full h-10"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  data-testid="input-message"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  data-testid="button-send-message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-lg font-semibold">Select a conversation to start</p>
              <p className="text-sm">Choose from your followers to message them</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
