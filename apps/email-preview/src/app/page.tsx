"use client";
import { EMAIL_COMPONENTS } from "@/lib";
import React, { useState } from "react";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  // PAGE LISTE
  if (!selectedEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start p-10 bg-gradient-to-br from-indigo-50 to-white">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">
          📧 Liste des Templates
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {EMAIL_COMPONENTS.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className="cursor-pointer p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-all border hover:border-indigo-400 text-left"
            >
              <h2 className="text-xl font-semibold text-indigo-600">{email.name}</h2>
              <p className="text-sm text-gray-500 mt-2">Clique pour prévisualiser</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // PAGE PREVIEW
  const email = EMAIL_COMPONENTS.find((e) => e.id === selectedEmail);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <button
          onClick={() => setSelectedEmail(null)}
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ⬅️ Retour
        </button>
        <h1 className="text-xl font-semibold text-indigo-700">
          Preview: {email?.name}
        </h1>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
          {email && React.createElement(email.component, email.props)}
        </div>
      </div>
    </div>
  );
}
