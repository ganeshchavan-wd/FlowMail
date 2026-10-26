
"use client";

import { apiFetch } from "@/lib/api";
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

interface ExtractResponse {
  success?: boolean;
  message?: string;
  filename?: string;
  totalEmails?: number;
  emails?: string[];
  preview?: string;
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
  const [creating, setCreating] = useState(false);
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

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const input = e.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    const allowedExtensions = [
      "pdf",
      "docx",
      "doc",
      "txt",
      "csv",
      "xlsx",
    ];

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(extension)) {
      alert("Please select a PDF, DOCX, TXT, CSV, or XLSX file.");
      input.value = "";
      return;
    }

    // Keep uploads small enough for the configured API limit.
    if (file.size > 4 * 1024 * 1024) {
      alert("Please select a file smaller than 4 MB.");
      input.value = "";
      return;
    }

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

      // Read the body as text first so an HTML error page
      // doesn't cause an unexplained JSON parsing error.
      const rawResponse = await response.text();

      let data: ExtractResponse;

      try {
        data = JSON.parse(rawResponse) as ExtractResponse;
      } catch {
        console.error(
          "Extraction API returned non-JSON:",
          response.status,
          rawResponse.slice(0, 1000)
        );

        throw new Error(
          `The upload server returned HTTP ${response.status} with an invalid response. Check the terminal or Vercel runtime logs.`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Document extraction failed (HTTP ${response.status}).`
        );
      }

      const detectedEmails = (data.emails || []).map(
        (email) => email.trim().toLowerCase()
      );

      setEmails((previous) => [
        ...new Set([...previous, ...detectedEmails]),
      ]);

      setFilename(data.filename || file.name);

      if (detectedEmails.length === 0) {
        alert(
          "Document processed successfully, but no email addresses were detected."
        );
      } else {
        alert(
          `Document processed successfully. ${detectedEmails.length} email address(es) detected.`
        );
      }
    } catch (error) {
      console.error("Department document upload failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "File upload failed. Please try again."
      );
    } finally {
      setLoading(false);
      input.value = "";
    }
  }

  async function createDepartment() {
    if (!department.trim()) {
      alert("Please enter a department name.");
      return;
    }

    if (emails.length === 0) {
      alert("Please upload a document or add at least one email.");
      return;
    }

    try {
      setCreating(true);

      const response = await apiFetch(
        "/api/department/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: department.trim(),
            emails,
            filename,
          }),
        }
      );

      const rawResponse = await response.text();

      let data: {
        success?: boolean;
        message?: string;
      };

      try {
        data = JSON.parse(rawResponse);
      } catch {
        console.error(
          "Department create API returned non-JSON:",
          response.status,
          rawResponse.slice(0, 1000)
        );

        throw new Error(
          `Department creation returned an invalid response (HTTP ${response.status}).`
        );
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            `Failed to create department (HTTP ${response.status}).`
        );
      }

      alert("Department created successfully!");

      setDepartment("");
      setManualEmail("");
      setEmails([]);
      setFilename("");

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Department creation failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the department."
      );
    } finally {
      setCreating(false);
    }
  }

  function closeModal() {
    if (loading || creating) return;
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-department-title"
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-[#08101f] p-5 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  id="create-department-title"
                  className="text-2xl font-bold sm:text-3xl"
                >
                  Create Department
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Upload documents and let AI detect email
                  addresses automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading || creating}
                aria-label="Close dialog"
                className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-50"
              >
                <X />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {/* Department name */}
              <div>
                <label
                  htmlFor="department-name"
                  className="mb-2 block text-sm"
                >
                  Department Name
                </label>

                <div className="relative">
                  <Building2
                    className="absolute left-4 top-4 text-zinc-500"
                    size={18}
                  />

                  <input
                    id="department-name"
                    value={department}
                    onChange={(e) =>
                      setDepartment(e.target.value)
                    }
                    placeholder="Engineering"
                    maxLength={100}
                    disabled={creating}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Document upload */}
              <div>
                <label className="mb-2 block text-sm">
                  Upload Documents
                </label>

                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 p-5 text-center transition hover:bg-indigo-500/10">
                  <Upload size={34} />

                  <p className="mt-3 font-medium">
                    {loading
                      ? "Reading document..."
                      : "Upload PDF, DOCX, TXT, CSV or XLSX"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Maximum file size: 4 MB
                  </p>

                  {filename && (
                    <p className="mt-2 break-all text-sm text-emerald-400">
                      <FileText
                        size={16}
                        className="mr-1 inline"
                      />
                      {filename}
                    </p>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.csv,.xlsx"
                    onChange={handleUpload}
                    disabled={loading || creating}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* Manually add an email */}
              <div>
                <label
                  htmlFor="manual-email"
                  className="mb-2 block text-sm"
                >
                  Add Manual Email
                </label>

                <div className="flex gap-3">
                  <div className="relative min-w-0 flex-1">
                    <Mail
                      size={18}
                      className="absolute left-4 top-4 text-zinc-500"
                    />

                    <input
                      id="manual-email"
                      type="email"
                      value={manualEmail}
                      onChange={(e) =>
                        setManualEmail(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail();
                        }
                      }}
                      placeholder="name@gmail.com"
                      disabled={creating}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addEmail}
                    disabled={creating}
                    aria-label="Add email"
                    className="rounded-2xl bg-indigo-600 px-5 transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              {/* Detected email addresses */}
              <div>
                <div className="flex items-center gap-2">
                  <FileText />

                  <h3 className="font-semibold">
                    Detected Emails ({emails.length})
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
                        className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3"
                      >
                        <span className="break-all">
                          {email}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setEmails((previous) =>
                              previous.filter(
                                (item) => item !== email
                              )
                            )
                          }
                          disabled={creating}
                          aria-label={`Remove ${email}`}
                          className="shrink-0 text-zinc-400 hover:text-red-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal actions */}
              <div className="flex flex-wrap justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading || creating}
                  className="rounded-xl border border-white/10 px-6 py-3 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createDepartment}
                  disabled={loading || creating}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
                >
                  {creating
                    ? "Creating..."
                    : "Create Department"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
