"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";

export default function MeetingsPage() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [start, setStart] = useState("");
const [end, setEnd] = useState("");
const [attendees, setAttendees] = useState("");

const createMeeting = async () => {
const res = await apiFetch("/api/calendar/create", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
title,
description,
start,
end,
attendees: attendees
.split(",")
.map((email) => email.trim()),
}),
});


const data = await res.json();

if (data.success) {
  alert("Meeting Created Successfully 🎉");
} else {
  alert(data.error);
}

};

return ( <div className="min-h-screen bg-black text-white p-8"> <h1 className="text-4xl font-bold mb-8">
Schedule Meeting 📅 </h1>

<div className="max-w-2xl space-y-4">
    <input
      placeholder="Meeting Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full p-3 bg-zinc-900 rounded-lg"
    />

    <textarea
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full p-3 bg-zinc-900 rounded-lg"
    />

    <input
      type="datetime-local"
      value={start}
      onChange={(e) => setStart(e.target.value)}
      className="w-full p-3 bg-zinc-900 rounded-lg"
    />

    <input
      type="datetime-local"
      value={end}
      onChange={(e) => setEnd(e.target.value)}
      className="w-full p-3 bg-zinc-900 rounded-lg"
    />

    <input
      placeholder="employee1@gmail.com, employee2@gmail.com"
      value={attendees}
      onChange={(e) => setAttendees(e.target.value)}
      className="w-full p-3 bg-zinc-900 rounded-lg"
    />

    <button
      onClick={createMeeting}
      className="bg-indigo-600 px-6 py-3 rounded-lg"
    >
      Create Meeting
    </button>
  </div>
</div>

);
}
