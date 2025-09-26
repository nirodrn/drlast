import { useState, useEffect, useCallback } from 'react';
import { ref, push, onValue, off, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { geminiChatService, ChatMessage } from '../lib/gemini';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history when user changes
  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      return;
    }

    const chatRef = ref(database, `chatHistory/${currentUser.uid}`);
    
    onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        const messageList = (Object.values(chatData) as ChatMessage[])
          .filter((msg: any) => msg && msg.text && msg.sender && msg.timestamp)
          .sort((a: any, b: any) => a.timestamp - b.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    }, (error) => {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    });

    return () => off(chatRef);
  }, [currentUser]);

  const saveChatMessage = useCallback(async (message: ChatMessage) => {
    if (!currentUser) return;

    try {
      const chatRef = ref(database, `chatHistory/${currentUser.uid}`);
      await push(chatRef, {
        ...message,
        timestamp: message.timestamp || Date.now()
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }, [currentUser]);

  const sendMessage = useCallback(async (text: string) => {
    if (!currentUser || !text.trim()) return;

    setLoading(true);
    setError(null);

    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: text.trim(),
      sender: 'user',
      timestamp: Date.now()
    };

    // Add user message to local state immediately
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to Firebase
    await saveChatMessage(userMessage);

    // Show typing indicator
    setIsTyping(true);

    try {
      console.log('Generating AI response for:', text);
      
      // Generate AI response
      const { response, sources } = await geminiChatService.generateResponse(
        text,
        messages
      );

      console.log('AI response generated:', response.substring(0, 100) + '...');

      // Create bot message
      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: response,
        sender: 'bot',
        timestamp: Date.now(),
        sources
      };

      // Add bot message to local state
      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message to Firebase
      await saveChatMessage(botMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Create error message with helpful fallback
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: "I apologize, but I am having trouble generating a response right now. Please try again later or contact Dr. Daniel Esthetixs directly at 416-449-0936 for immediate assistance.",
        sender: 'bot',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      await saveChatMessage(errorMessage);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }, [currentUser, messages, saveChatMessage]);

  const clearChat = useCallback(async () => {
    if (!currentUser) return;

    try {
      const chatRef = ref(database, `chatHistory/${currentUser.uid}`);
      await remove(chatRef);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
      setError('Failed to clear chat history');
    }
  }, [currentUser]);

  return {
    messages,
    loading,
    error,
    isTyping,
    sendMessage,
    clearChat,
    isLoggedIn: !!currentUser
  };
}