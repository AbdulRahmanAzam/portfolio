"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

// A tiny always-present button. The chat window itself (Chatbot.jsx) is only
// downloaded when someone opens it, so it costs nothing on first load.
export function ChatLauncher() {
  const [ChatWindow, setChatWindow] = useState(null);
  const [open, setOpen] = useState(false);

  const openChat = () => {
    setOpen(true);
    if (!ChatWindow) {
      import("./Chatbot").then((m) => setChatWindow(() => m.Chatbot));
    }
  };

  // Desktop visitors get the assistant opened for them after 10 seconds.
  // On phones it would cover the page, so it waits for a tap.
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const timer = setTimeout(openChat, 10000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (open && ChatWindow) return <ChatWindow onClose={() => setOpen(false)} />;

  return (
    <button
      type="button"
      onClick={openChat}
      onPointerEnter={() => import("./Chatbot")}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
      aria-label="Open AI chat assistant"
    >
      {!open && <span className="absolute inset-0 rounded-full bg-primary motion-safe:animate-ping opacity-75" aria-hidden="true" />}
      <MessageCircle className="relative w-6 h-6" aria-hidden="true" />
    </button>
  );
}
