"use client";

interface AIActionsProps {
  onSelect: (prompt: string) => void;
}

export default function AIActions({ onSelect }: AIActionsProps) {
  const actions = [
    "Summarize unread emails",
    "Draft a professional email",
    "Schedule a meeting tomorrow",
    "Write a follow-up email",
    "Prioritize my inbox",
    "Generate meeting agenda",
  ];

  return (
    <div className="grid md:grid-cols-3 gap-3 mb-4">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl p-3 
                     text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 
                     hover:border-indigo-500 transition duration-200"
        >
          {action}
        </button>
      ))}
    </div>
  );
}