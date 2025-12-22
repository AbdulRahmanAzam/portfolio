import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { portfolioData } from "@shared/schema";

const GROQ_API_KEY = "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";

// System prompt with all portfolio details
const SYSTEM_PROMPT = `You are Abdul Rahman Azam's AI assistant on his portfolio website. Answer questions about Abdul Rahman Azam's background briefly and accurately. Be friendly but concise - keep responses under 100 words unless more detail is specifically requested.

ABOUT ABDUL RAHMAN AZAM:
- Full Stack AI Engineer
- BS in Artificial Intelligence student at FAST NUCES Karachi (2021 - Present, CGPA: 3.33)
- Tagline: "Crafting Code That Thinks — and Ideas That Build Themselves."

SKILLS:
Web Development: React.js, Node.js, Express.js, JavaScript, Tailwind CSS, PostgreSQL, REST APIs
AI/ML: Python, Machine Learning, Deep Learning, Scikit-learn, Pandas & NumPy, Data Visualization

PROJECTS:
1. University Resource Sharing Platform (Jan-May 2025) - Full-stack platform for FAST-NUCES students using React.js, Node.js, Express.js, PostgreSQL
2. Super Tic Tac Toe (April-May 2025) - AI game with Minimax Algorithm and Alpha-Beta Pruning
3. Income Predictor (Sep-Dec 2024) - ML app with 85% accuracy using KNN, React, FastAPI, Python
4. 2D Platformer Game (Feb-May 2024) - Top 1% project at university using C++ and SFML
5. AI Tic-Tac-Toe (Sep-Dec 2023) - 100% win rate against humans using Minimax in C

ACHIEVEMENTS:
- Solved 290+ LeetCode problems with 6 skill badges
- 2nd Place in Web Hunt Competition, 3rd Place in ACM Coders Cup
- HackerRank Problem Solving certifications (Basic & Intermediate)
- ChatGPT for Everyone certification

EDUCATION:
- FAST NUCES Karachi - BS AI (2021-Present) - CGPA: 3.33
- Adamjee Govt. College - Pre-Engineering (2019-2021) - 80%
- Happy Palace School - Matric CS (2017-2019) - 98.12%

CONTACT:
- Email: azamabdulrahman930@gmail.com
- GitHub: github.com/abdulrahmanazam
- LinkedIn: linkedin.com/in/abdulrahmanazam
- LeetCode: leetcode.com/abdulrahmanazam
- Calendly: calendly.com/azamabdulrahman930/30min

If asked about something not in this info, politely say you can only answer questions about Abdul Rahman Azam's professional background. For hiring inquiries, direct them to book a call via Calendly or email.`;

const initialMessages = [
  {
    role: "assistant",
    content: "👋 Hi! I'm Abdul Rahman Azam's AI assistant. Ask me anything about his skills, projects, or experience!",
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-open after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    //   setShowPulse(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0),
            userMessage,
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.choices[0]?.message?.content || "Sorry, I couldn't process that. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again or contact Abdul Rahman Azam directly via email.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
            //   setShowPulse(false);
            }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
          >
            {showPulse && (
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
            )}
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Abdul Rahman Azam's AI Assistant</h3>
                  <p className="text-xs opacity-80">Ask me anything!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about skills, projects..."
                  className="flex-1 px-4 py-2.5 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full w-10 h-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {/* <p className="text-[10px] text-muted-foreground text-center mt-2">
                Answers about Abdul Rahman Azam only
              </p> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
