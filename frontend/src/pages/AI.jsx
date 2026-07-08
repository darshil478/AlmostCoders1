import React, { useState, useEffect } from 'react';
import { Brain, Activity, ShieldAlert, FileText, Stethoscope, AlertCircle, Send, Sparkles, Bot } from 'lucide-react';
import { chatWithAI, getMedicineRecommendation } from '../api/ai';

const parseBoldText = (txt) => {
  const parts = txt.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-[#1976D2] font-bold">{part}</strong>;
    }
    return part;
  });
};

const FormattedText = ({ text }) => {
  if (!text) return null;
  const paragraphs = text.split('\n');
  return (
    <div className="space-y-1">
      {paragraphs.map((para, idx) => {
        if (para.trim().startsWith('* ')) {
          const content = para.replace(/^\*\s+/, '');
          return (
            <ul key={idx} className="list-disc pl-4 my-0.5">
              <li>{parseBoldText(content)}</li>
            </ul>
          );
        }
        return <p key={idx} className="leading-relaxed">{parseBoldText(para)}</p>;
      })}
    </div>
  );
};

const AI = () => {
  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your PHC AI assistant. I can recommend clinical protocols, analyze queue waiting patterns, and provide drug directives. Ask me anything about today\'s clinic operations!' }
  ]);
  const [input, setInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  // Recommendations state
  const [symptoms, setSymptoms] = useState("");
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [fetchingRecommendation, setFetchingRecommendation] = useState(false);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    
    try {
      setSendingChat(true);
      const res = await chatWithAI(currentInput);
      setMessages(prev => [...prev, { role: 'assistant', text: res.response || "No response generated." }]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Error: Failed to fetch AI response." }]);
    } finally {
      setSendingChat(false);
    }
  };

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    try {
      setFetchingRecommendation(true);
      const res = await getMedicineRecommendation(symptoms);
      setRecommendationResult(res);
    } catch (err) {
      console.error("AI Recommendation error:", err);
      alert("Failed to fetch clinical recommendation.");
    } finally {
      setFetchingRecommendation(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up text-[#111827]">
      {/* 1. Hero Section */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[#F8FBFF] to-[#EEF6FF] border border-blue-100 relative overflow-hidden shadow-sm rounded-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <h1 className="text-3xl font-bold text-[#111827] mb-2 flex items-center gap-2">
          <Brain className="text-[#1976D2]" /> Healthcare AI Command Center
        </h1>
        <p className="text-[#374151] font-semibold">Real-time clinical decision support and predictive analytics.</p>
      </div>

      {/* 2. Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Chat & Symptoms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Assistant Chat */}
          <div className="glass-panel p-6 flex flex-col h-[450px]">
            <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#1976D2]"/> AI Medical Assistant Chat
            </h2>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#F2F8FF]/30 border border-blue-100/80 rounded-xl mb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white' : 'bg-white border border-blue-100 text-[#111827] shadow-sm'}`}>
                    <div className={`font-bold text-[10px] uppercase mb-1 ${msg.role === 'user' ? 'text-white/80' : 'text-[#374151]'}`}>
                      {msg.role === 'user' ? 'You' : 'AI Copilot'}
                    </div>
                    <FormattedText text={msg.text} />
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex justify-start">
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[#374151] text-xs animate-pulse">
                    AI Copilot is formulating diagnostic response...
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about inventory, patient vitals, or scheduling..."
                className="flex-1 bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent transition-all"
                required
              />
              <button 
                type="submit"
                disabled={sendingChat}
                className="px-4 py-3 btn-primary shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Medicine Recommendation Triage */}
        <div className="space-y-8">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1976D2]"/> AI Prescription Triage
            </h2>
            <p className="text-xs text-[#374151] mb-4">Input patient symptoms below to generate supportive drug suggestions and clinical follow-ups.</p>
            
            <form onSubmit={handleGetRecommendation} className="space-y-3">
              <textarea 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. fever, high blood pressure, persistent dry cough"
                rows={3}
                className="w-full bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent rounded-xl px-4 py-3 text-sm text-[#111827] placeholder-gray-400 transition-all resize-none"
                required
              />
              <button 
                type="submit"
                disabled={fetchingRecommendation}
                className="w-full py-2.5 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-xl hover:from-[#1565C0] hover:to-[#0D47A1] transition-all font-semibold text-xs cursor-pointer disabled:opacity-50 shadow-sm border border-blue-700/20"
              >
                {fetchingRecommendation ? "Running Clinical Protocols..." : "Generate Recommendation"}
              </button>
            </form>

            {recommendationResult && (
              <div className="mt-6 p-4 bg-white border border-blue-100 rounded-xl space-y-3 text-xs shadow-sm">
                <div>
                  <span className="text-[#374151] block uppercase font-bold text-[10px]">Suggested Diagnosis</span>
                  <span className="text-[#111827] font-semibold text-sm">{recommendationResult.diagnosis}</span>
                </div>
                <div>
                  <span className="text-[#374151] block uppercase font-bold text-[10px]">Clinical Care Protocol</span>
                  <span className="text-[#374151] leading-relaxed">{recommendationResult.protocol}</span>
                </div>
                <div>
                  <span className="text-[#374151] block uppercase font-bold text-[10px] mb-1">Medication Directives</span>
                  <ul className="space-y-1">
                    {recommendationResult.medicines && recommendationResult.medicines.map((m, idx) => (
                      <li key={idx} className="text-[#111827] font-semibold flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#1976D2]" />
                        {m.medicine} - <span className="text-[#374151] font-medium">{m.dosage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-blue-100 flex justify-between items-center">
                  <span className="text-[#374151] uppercase font-bold text-[10px]">Follow-Up Triage</span>
                  <span className="text-[#1976D2] font-bold">{recommendationResult.followup_days} Days</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Predictive Diagnostics Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { type: "Readmission Risk Forecast", score: "88%", level: "High", reason: "History of diabetes, hypertension exacerbation indicators", recommendation: "Direct BP monitoring every 24h via mobile unit." },
          { type: "ICU Triage Prognosis", score: "12%", level: "Low", reason: "Stable average vital readings, normal oxygen saturation trends", recommendation: "General outpatient consultation; seasonal follow-ups." }
        ].map((p, i) => (
          <div key={i} className="glass-panel p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[#111827] text-base">{p.type}</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                p.level === 'High' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>{p.level}</span>
            </div>
            <div className="text-[34px] font-bold text-[#111827] mb-2">{p.score}</div>
            <p className="text-[#374151] mb-4 text-sm">Reasoning: {p.reason}</p>
            <div className="bg-[#F2F8FF]/60 p-4 rounded-xl border border-blue-100/60 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#1976D2] shrink-0" />
              <p className="text-xs text-[#374151] font-medium">Directive: {p.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AI;