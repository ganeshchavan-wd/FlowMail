"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  X,
  Upload,
  Plus,
  Building2,
  Mail,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateDepartmentModal({
  open,
  onClose,
}: Props) {

  const router = useRouter();

  const [department, setDepartment] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  const [emails, setEmails] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [filename, setFilename] = useState("");

 function addEmail() {
  const email = manualEmail.trim().toLowerCase();

  if (!email) return;

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (emails.includes(email)) {
    alert("Email already added.");
    return;
  }

  setEmails((prev) => [...prev, email]);
  setManualEmail("");
}
  const handleUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/department/extract",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to read document");
      return;
    }

    setFilename(data.filename);

    setEmails((prev) => [
  ...new Set([
    ...prev,
    ...(data.emails || []).map((e: string) => e.toLowerCase().trim()),
  ]),
]);
  } catch (error) {
    console.error(error);

    alert("File upload failed");
  } finally {
    setLoading(false);
  }
};

const createDepartment = async () => {
  if (!department.trim()) {
    alert("Please enter department name");
    return;
  }

  if (emails.length === 0) {
    alert("Please upload a document or add at least one email.");
    return;
  }

  try {
    const response = await fetch("/api/department/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: department,
        emails,
        filename,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to create department");
      return;
    }

    alert("Department created successfully!");

    setDepartment("");
    setManualEmail("");
    setEmails([]);
    setFilename("");

    onClose();
    router.refresh();
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#08101f] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-bold">
                  Create Department
                </h2>

                <p className="text-zinc-400 mt-2">
                  Upload documents and let AI detect email
                  addresses automatically.
                </p>

              </div>

              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="mt-8 space-y-6">

              {/* Department */}

              <div>

                <label className="mb-2 block text-sm">
                  Department Name
                </label>

                <div className="relative">

                  <Building2
                    className="absolute left-4 top-4 text-zinc-500"
                    size={18}
                  />

                  <input
                    value={department}
                    onChange={(e) =>
                      setDepartment(e.target.value)
                    }
                    placeholder="Engineering"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 outline-none"
                  />

                </div>

              </div>

              {/* Upload */}

              <div>

                <label className="mb-2 block text-sm">
                  Upload Documents
                </label>

                <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 transition hover:bg-indigo-500/10">

                  <Upload size={34} />

                 <p className="mt-3 font-medium">
  {loading
    ? "Reading document..."
    : "Upload PDF, DOCX, TXT or CSV"}
</p>

                  <p className="text-sm text-zinc-500">
                    AI will detect all email addresses
                  </p>

{filename && (
  <p className="mt-2 text-sm text-emerald-400">
    📄 {filename}
  </p>
)}
                 <input
  type="file"
  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
  onChange={handleUpload}
  className="hidden"
/>
                </label>

              </div>

              {/* Manual Email */}

              <div>

                <label className="mb-2 block text-sm">
                  Add Manual Email
                </label>

                <div className="flex gap-3">

                  <div className="relative flex-1">

                    <Mail
                      size={18}
                      className="absolute left-4 top-4 text-zinc-500"
                    />

                   <input
  value={manualEmail}
  onChange={(e) => setManualEmail(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  }}
  placeholder="name@gmail.com"
  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 outline-none"
/>

                  </div>

                 <button
  type="button"
  onClick={addEmail}
  className="rounded-2xl bg-indigo-600 px-5 hover:bg-indigo-700 transition"
>
  <Plus />
</button>

                </div>

              </div>

              {/* Emails */}

              <div>

                <div className="flex items-center gap-2">

                  <FileText />

                  <h3 className="font-semibold">
                    Detected Emails
                  </h3>

                </div>
<div className="mt-4 max-h-52 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4">

  {emails.length === 0 ? (
    <p className="text-center text-zinc-500">
      No emails detected yet.
    </p>
  ) : (
    emails.map((email) => (
      <div
        key={email}
        className="rounded-xl bg-white/5 px-4 py-3"
      >
        {email}
      </div>
    ))
  )}

</div>

              </div>

              <div className="flex justify-end gap-4">

                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 px-6 py-3"
                >
                  Cancel
                </button>

              <button
  onClick={createDepartment}
  disabled={loading}
  className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-3 font-semibold disabled:opacity-50"
>
  {loading ? "Creating..." : "Create Department"}
</button>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}