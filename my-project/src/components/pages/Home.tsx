
export function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-8">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to NoteNexus</h1>
        <p className="text-lg text-gray-300">Your hub for sharing and discovering study notes, tips, events and more.</p>
      </div>

      {/* Example content sections */}
      <section className="mt-8 bg-white/5 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/3">Study Notes</div>
          <div className="p-4 rounded-lg bg-white/3">Study Tips</div>
          <div className="p-4 rounded-lg bg-white/3">Events & Announcements</div>
        </div>
      </section>
    </div>
  );
}