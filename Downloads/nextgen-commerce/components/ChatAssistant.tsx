import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import { RobotIcon } from './icons/RobotIcon';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi! I'm your AI shopping assistant. How can I help you find the perfect product today?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponseText = await getChatResponse(userInput);
      const botMessage: Message = { text: botResponseText, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-accent hover:bg-accent-hover text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Open AI Shopping Assistant"
        >
          <RobotIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Modal */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
          <div className="bg-secondary rounded-lg border border-slate-700 shadow-2xl">
            <header className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center space-x-2">
                <RobotIcon className="w-5 h-5 text-accent"/>
                <span className="text-sm">AI Shopping Assistant</span>
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="h-64 p-4 overflow-y-auto bg-primary/50">
              <div className="flex flex-col space-y-3 text-sm">
                {messages.map((msg, index) => (
                  <div key={index}>
                    {msg.sender === 'bot'
                      ? <p><span className="font-semibold text-gray-400">Assistant:</span> {msg.text}</p>
                      : <p><span className="font-semibold text-accent">You:</span> {msg.text}</p>
                    }
                  </div>
                ))}
                {isLoading && (
                  <div>
                    <span className="font-semibold text-gray-400">Assistant:</span>
                    <div className="inline-flex items-center space-x-1 ml-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full pl-3 pr-16 py-2 bg-primary text-gray-300 placeholder-gray-500 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover disabled:bg-slate-500 transition-colors text-sm">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
