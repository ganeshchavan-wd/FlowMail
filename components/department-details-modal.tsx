"use client";

import { useEffect, useState } from "react";
import { X, Mail, Users, FileText, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  department: any;
  onClose: () => void;
}

export default function DepartmentDetailsModal({
  open,
  department,
  onClose,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (!open || !department) return;
    loadDepartment();
  }, [open]);

  async function loadDepartment() {
    const res = await fetch(`/api/department/details?id=${department.id}`);
    const json = await res.json();
    setData(json.department);
  }

  async function deleteEmail(memberId: string) {
    if (!confirm("Delete this email?")) return;
    try {
      const res = await fetch("/api/department/delete-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      const json = await res.json();
      if (json.success) {
        loadDepartment();
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete email.");
    }
  }

  async function addEmail() {
    const email = newEmail.trim().toLowerCase();
    if (!email) {
      alert("Please enter an email.");
      return;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address.");
      return;
    }
    try {
      const res = await fetch("/api/department/add-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departmentId: data.id,
          email,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setNewEmail("");
        loadDepartment();
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add email.");
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="w-full max-w-4xl rounded-3xl bg-white dark:bg-[#08101f] p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {data?.name}
            </h1>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-3 gap-5">
            <div className="rounded-2xl bg-gray-100 dark:bg-white/5 p-5 border border-gray-200 dark:border-white/5">
              <Users className="text-indigo-500 dark:text-white" size={24} />
              <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                {data?.members?.length || 0}
              </h2>
              <p className="text-gray-600 dark:text-white/70">Members</p>
            </div>

            <div className="rounded-2xl bg-gray-100 dark:bg-white/5 p-5 border border-gray-200 dark:border-white/5">
              <Mail className="text-indigo-500 dark:text-white" size={24} />
              <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                {data?.members?.length || 0}
              </h2>
              <p className="text-gray-600 dark:text-white/70">Emails</p>
            </div>

            <div className="rounded-2xl bg-gray-100 dark:bg-white/5 p-5 border border-gray-200 dark:border-white/5">
              <FileText className="text-indigo-500 dark:text-white" size={24} />
              <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
                {data?.documents?.length || 0}
              </h2>
              <p className="text-gray-600 dark:text-white/70">Documents</p>
            </div>
          </div>

          {/* Add Email Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Email
            </h2>
            <div className="mb-8 flex gap-3">
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addEmail();
                }}
                placeholder="Enter email..."
                className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                onClick={addEmail}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/40 flex items-center"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Email List */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Department Emails
            </h2>
            <div className="space-y-3">
              {data?.members?.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl bg-gray-100 dark:bg-white/5 p-4 border border-gray-200 dark:border-white/5"
                >
                  <span className="text-gray-800 dark:text-white">
                    {member.email}
                  </span>
                  <button
                    onClick={() => deleteEmail(member.id)}
                    className="rounded-lg bg-red-500/10 p-2 text-red-500 transition hover:bg-red-500/20 hover:scale-110 active:scale-95"
                    aria-label="Delete email"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {data?.members?.length === 0 && (
                <p className="text-center text-gray-500 dark:text-zinc-400 py-4">
                  No emails added yet.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}