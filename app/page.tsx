export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="border border-kryv-green/20 p-10 rounded-sm bg-black shadow-[0_0_50px_rgba(0,255,65,0.1)] text-center relative overflow-hidden">
        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-kryv-green"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-kryv-green"></div>
        
        <h1 className="text-6xl font-bold tracking-[0.2em] text-kryv-green mb-2">
          KRYV<span className="animate-pulse">_</span>
        </h1>
        
        <p className="text-kryv-purple text-[10px] tracking-[0.5em] uppercase mb-8">
          Elite Secret Society / Agentic Economy
        </p>
        
        <div className="space-y-4">
          <button className="w-full py-3 px-8 border border-kryv-green/50 text-kryv-green hover:bg-kryv-green hover:text-black transition-all duration-500 text-xs tracking-widest uppercase">
            Initialize Access
          </button>
          <p className="text-[8px] text-gray-600 font-mono">ENCRYPTED CONNECTION : ACTIVE</p>
        </div>
      </div>
    </main>
  );
}

