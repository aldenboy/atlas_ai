import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
  paper?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  onDownloadPaper?: (filePath: string) => void;
}

export const ChatMessages = ({ messages, onDownloadPaper }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col max-w-[80%] space-y-2",
            message.isUser ? "ml-auto items-end" : "mr-auto items-start"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 shadow-md",
              message.isUser
                ? "bg-purple-500 text-white"
                : "bg-gray-800 text-gray-100"
            )}
          >
            <ReactMarkdown 
              className="prose prose-invert max-w-none"
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-purple-300 hover:text-purple-200" target="_blank" rel="noopener noreferrer" />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-2xl font-bold mb-4 text-purple-200" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-xl font-semibold mb-3 text-purple-200" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-lg font-medium mb-2 text-purple-200" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside mb-4" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="mb-1" />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
          {message.paper && onDownloadPaper && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadPaper(message.paper!)}
              className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Research Paper
            </Button>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};