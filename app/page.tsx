import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          FlowMail AI
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          FlowMail AI is an AI-powered Gmail assistant that helps you organize,
          summarize, categorize, search, and reply to emails using artificial
          intelligence.
        </p>

        <div className="mt-10">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Login with Google
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">
          What is FlowMail AI?
        </h2>

        <p className="text-gray-700 leading-8">
          FlowMail AI is a productivity application that securely connects to
          your Gmail account after your permission. It helps users manage their
          inbox with AI-powered summaries, smart categorization, intelligent
          search, meeting detection, and reply assistance.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Secure Google Sign-In</h3>
            <p>Authenticate safely using Google OAuth.</p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">AI Email Summary</h3>
            <p>Quick summaries of long emails.</p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Smart Categories</h3>
            <p>Automatically organize important emails.</p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">AI Reply</h3>
            <p>Generate professional email replies instantly.</p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Meeting Detection</h3>
            <p>Identify meeting invitations from your inbox.</p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold">Smart Search</h3>
            <p>Find emails quickly using AI.</p>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">
          Privacy
        </h2>

        <p className="text-gray-700 leading-8">
          FlowMail AI only accesses Gmail after you explicitly grant permission
          through Google OAuth. Your email data is used only to provide the
          requested features. We do not sell or share your personal email data.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-500">
        © 2026 FlowMail AI. All rights reserved.
      </footer>
    </main>
  );
}
