"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface AIAgentProps {
  proposalId: string;
}

const AIAgent: React.FC<AIAgentProps> = ({ proposalId }) => {
  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [dataRetrieved, setDataRetrieved] = useState({
    hasContext: true,
    hasVoted: false,
    providingDetails: false,
    textResponse: "",
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startConversation = async () => {
    try {
      const response = await fetch("/api/votes/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: true,
          lng: "en",
          sessionId: "",
          userMessage: "",
          proposalId: proposalId,
        }),
      });
      const messageReceived = await response.json();
      setSessionId(messageReceived["sessionId"]);

      const cleanedMessage = messageReceived["message"];

      try {
        const sanitizedMessage = cleanedMessage
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\n/g, "\\n");

        const javascriptMessage = JSON.parse(sanitizedMessage);
        const textResponse = javascriptMessage.textResponse;
        setMessages([{ role: "assistant", content: textResponse }]);
        setDataRetrieved(javascriptMessage);
      } catch (parseError) {
        console.error(
          "Error al parsear el JSON. Mensaje original:",
          cleanedMessage
        );
      }
    } catch (err) {
      console.error("Error en startConversation:", err);
    }
  };

  const continueConversation = async (userMessage: string) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: userMessage },
      ]);
      const response = await fetch("/api/votes/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: false,
          lng: "en",
          sessionId: sessionId,
          userMessage: userMessage,
          proposalId: proposalId,
        }),
      });

      const messageReceived = await response.json();
      const cleanedMessage = messageReceived["message"];

      try {
        const sanitizedMessage = cleanedMessage
          .replace(/[\x00-\x1F\x7F]/g, "")
          .replace(/\n/g, "\\n");

        const javascriptMessage = JSON.parse(sanitizedMessage);
        const textResponse = javascriptMessage.textResponse;
        setDataRetrieved(javascriptMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: textResponse },
        ]);
      } catch (parseError) {
        console.error(
          "Error al parsear el JSON. Mensaje original:",
          cleanedMessage
        );
      }

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "") {
      console.log("Mensaje: " + input.trim());
      continueConversation(input.trim());
      setInput("");
    }
  };

  // Efecto para hacer scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      await startConversation();
    };
    fetchData();
  }, []);

  return (
    <Card className="bg-gray-900 border-[#f7cf1d] h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#f7cf1d]">AI Voting Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4 space-y-4">
        <div className="text-gray-400 text-center">
          Ask me anything about the candidates or the voting process!
        </div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${
              message.role === "user"
                ? "bg-[#f7cf1d] text-black self-end"
                : "bg-gray-700 text-white self-start"
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="flex-grow bg-gray-800 border-gray-700 text-white"
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIAgent;
