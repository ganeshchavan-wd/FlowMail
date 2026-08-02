export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="relative">
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
      </div>
    </div>
  );
}