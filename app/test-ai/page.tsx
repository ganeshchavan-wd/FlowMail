"use client";

import { useState } from "react";

export default function TestAIPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const testAI = async () => {
    const res = await fetch("/api/ai/schedule-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await res.json();

    console.log(data);

    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Test AI Scheduler
      </h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-3 w-full h-40 text-black"
        placeholder="Schedule a project review tomorrow at 4 PM with ganesh598243@gmail.com"
      />

      <button
        onClick={testAI}
        className="bg-blue-600 text-white px-5 py-3 mt-4 rounded"
      >
        Run AI
      </button>

      <pre className="mt-6 bg-gray-100 p-4 text-black overflow-auto">
        {result}
      </pre>
    </div>
  );
}