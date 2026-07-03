"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  UsersRound,
  FolderOpen,
  Plus,
  Search,
  ChevronRight,
  Sparkles,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import CreateDepartmentModal from "@/components/create-department-modal";
import DepartmentDetailsModal from "@/components/department-details-modal";
import RenameDepartmentModal from "@/components/rename-department-modal";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const router = useRouter();

  const loadDepartments = async () => {
    const res = await fetch("/api/department/list");
    const data = await res.json();
    setDepartments(data);
  };

  async function deleteDepartment(id: string) {
    const ok = confirm(
      "Are you sure you want to delete this department?\n\nThis will delete all members and documents."
    );
    if (!ok) return;
    try {
      const res = await fetch("/api/department/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId: id }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      alert("Department deleted successfully.");
      setMenuOpen(null);
      loadDepartments();
    } catch (err) {
      console.error(err);
      alert("Unable to delete department.");
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers = departments.reduce(
    (total, dept) => total + (dept.members?.length || 0),
    0
  );
  const totalDocuments = departments.reduce(
    (total, dept) => total + (dept.documents?.length || 0),
    0
  );

  const getDepartmentGradient = (color: string) => {
    const gradients: Record<string, string> = {
      purple: "from-purple-600/20 to-indigo-600/20",
      blue: "from-blue-600/20 to-cyan-600/20",
      green: "from-emerald-600/20 to-teal-600/20",
      orange: "from-orange-600/20 to-amber-600/20",
      pink: "from-pink-600/20 to-rose-600/20",
      red: "from-red-600/20 to-rose-600/20",
      indigo: "from-indigo-600/20 to-purple-600/20",
      cyan: "from-cyan-600/20 to-blue-600/20",
    };
    return gradients[color] || "from-gray-600/20 to-zinc-600/20";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#030303]">
      {/* Background decorative elements - hidden on mobile */}
      <div className="fixed inset-0 -z-10 overflow-hidden hidden lg:block">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl dark:opacity-100 opacity-50" />
        <div className="absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-cyan-600/20 blur-3xl dark:opacity-100 opacity-50" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/10 blur-3xl dark:opacity-100 opacity-50" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                Departments
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-zinc-400 md:text-base">
                Organize your team into departments. AI will use these
                groupings to automate emails, meetings, and more.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpen(true)}
              className="group flex w-full sm:w-auto justify-center items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
            >
              <Plus size={20} className="transition-transform group-hover:rotate-90 group-hover:scale-110" />
              <span>Add Department</span>
            </motion.button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mt-8 w-full sm:max-w-md"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-zinc-500" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 py-3.5 pl-12 pr-4 text-sm text-gray-900 dark:text-white outline-none backdrop-blur-sm transition focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20"
            />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {[
              {
                label: "Total Departments",
                value: departments.length,
                icon: Briefcase,
                color: "from-indigo-500 to-purple-500",
              },
              {
                label: "Total Members",
                value: totalMembers,
                icon: UsersRound,
                color: "from-cyan-500 to-blue-500",
              },
              {
                label: "Total Documents",
                value: totalDocuments,
                icon: FolderOpen,
                color: "from-emerald-500 to-teal-500",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 p-4 sm:p-6 backdrop-blur-sm transition hover:border-gray-300 dark:hover:border-white/10"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition group-hover:opacity-20`} />
                <div className="relative flex items-center gap-4">
                  <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl`}>
                    <stat.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Department Cards */}
          {filteredDepartments.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredDepartments.map((department, index) => (
                <motion.div
                  key={department.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 p-5 sm:p-6 backdrop-blur-sm transition hover:border-gray-300 dark:hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5"
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getDepartmentGradient(
                      department.color
                    )} opacity-0 transition-opacity group-hover:opacity-100`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-2xl">
                          <Briefcase size={28} className="text-indigo-500 dark:text-indigo-400 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setMenuOpen(menuOpen === department.id ? null : department.id)
                          }
                          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-white/10"
                        >
                          <MoreVertical size={18} className="text-gray-600 dark:text-white" />
                        </button>
                        {menuOpen === department.id && (
                          <div className="absolute right-0 top-12 z-50 w-40 sm:w-44 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#101827] shadow-xl">
                            <button
                              onClick={() => {
                                setSelectedDepartment(department);
                                setRenameOpen(true);
                                setMenuOpen(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                              <Pencil size={16} />
                              Rename
                            </button>
                            <button
                              onClick={() => deleteDepartment(department.id)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {department.name}
                    </h3>

                    <div className="mt-6 flex flex-1 flex-col justify-end space-y-3">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 p-3 backdrop-blur-sm transition group-hover:border-gray-300 dark:group-hover:border-white/10">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300">
                          <UsersRound size={16} className="text-cyan-500 dark:text-cyan-400" />
                          <span>Members</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {department.members?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 p-3 backdrop-blur-sm transition group-hover:border-gray-300 dark:group-hover:border-white/10">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300">
                          <FolderOpen size={16} className="text-emerald-500 dark:text-emerald-400" />
                          <span>Documents</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {department.documents?.length || 0}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedDepartment(department);
                        setDetailsOpen(true);
                      }}
                      className="mt-6 w-full rounded-xl border border-indigo-500/30 bg-indigo-500/10 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 transition hover:bg-indigo-500/20 hover:text-indigo-700 dark:hover:text-white"
                    >
                      View Department
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-10 sm:mt-20 flex flex-col items-center justify-center rounded-3xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 p-6 sm:p-12 backdrop-blur-sm"
            >
              <div className="rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 shadow-xl">
                <Sparkles size={48} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">No Departments Found</h3>
              <p className="mt-2 max-w-sm text-center text-sm text-gray-600 dark:text-zinc-400">
                Get started by creating your first department. It will help you
                organize your team and enable AI-powered automation.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen(true)}
                className="mt-6 flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25"
              >
                <Plus size={18} className="transition-transform group-hover:rotate-90" />
                Create Department
              </motion.button>
            </motion.div>
          )}
        </main>
      </div>

      <CreateDepartmentModal
        open={open}
        onClose={() => {
          setOpen(false);
          loadDepartments();
        }}
      />
      <DepartmentDetailsModal
        open={detailsOpen}
        department={selectedDepartment}
        onClose={() => setDetailsOpen(false)}
      />
      <RenameDepartmentModal
        open={renameOpen}
        department={selectedDepartment}
        onClose={() => setRenameOpen(false)}
        onSuccess={loadDepartments}
      />
    </div>
  );
}