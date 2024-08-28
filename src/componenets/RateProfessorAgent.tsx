"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function RateProfessorAgent() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ])

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    });

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let result = ''

    const processText = async function({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<string> {
      if (done) {
        return result
      }
      const text = decoder.decode(value || new Uint8Array(), {stream: true})
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]
        let otherMessages = messages.slice(0, messages.length - 1)
        return [
          ...otherMessages,
          {...lastMessage, content: lastMessage.content + text},
        ]
      })
      result += text
      const nextChunk = await reader?.read()
      return processText(nextChunk)
    }

    if (reader) {
      const initialChunk = await reader.read()
      await processText(initialChunk)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#3498DB] to-[#8E44AD] text-transparent bg-clip-text">
        Rate My Professor Support Agent
      </h2>
      <div className="h-96 overflow-auto mb-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "assistant" ? "text-left" : "text-right"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.role === "assistant"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-gradient-to-r from-[#3498DB] to-[#8E44AD] text-white rounded-r-lg hover:opacity-90 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}