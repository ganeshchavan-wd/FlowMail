"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Pencil } from "lucide-react";

interface Props {
  open: boolean;
  department: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RenameDepartmentModal({
  open,
  department,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name);
    }
  }, [department]);

  async function renameDepartment() {
    if (!name.trim()) {
      alert("Enter department name");
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/api/department/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: department.id,
          name,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.message);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Rename failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="w-full max-w-md rounded-3xl bg-[#08101f] p-8"
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <Pencil className="text-indigo-400" />
              <h2 className="text-2xl font-bold">
                Rename Department
              </h2>
            </div>

            <button onClick={onClose}>
              <X />
            </button>

          </div>

          <div className="mt-8">

            <label className="mb-2 block text-sm">
              Department Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            />

          </div>

          <div className="mt-8 flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3"
            >
              Cancel
            </button>

            <button
              onClick={renameDepartment}
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 py-3 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}