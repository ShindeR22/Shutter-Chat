import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ShutterChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:3000/messages", {
          text: inputValue,
          Sender: "Shinde"
        });
        setMessages([...messages, response.data]);
        setInputValue("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-blue-300 p-4">
      <div className="flex flex-col w-full xl:w-2/4 bg-blue-100 shadow-lg rounded-lg overflow-hidden">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-lg font-bold">Shutter Chat</h1>
        </header>
        <div className="flex-grow flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] pb-4 border-b border-gray-300">
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.Sender === "Shinde" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-lg ${
                    message.Sender === "Shinde"
                      ? "bg-green-400 text-slate-800"
                      : "bg-red-400 text-slate-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </main>
          <div className="p-4 bg-blue-100 border-t-4 border-gray-900">
            <div className="max-w-3xl mx-auto flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message"
                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
