import NehiraTerminal from "@/components/NehiraTerminal";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 relative">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-kryv-green to-kryv-green/40 mb-2">
          KRYV<span className="text-kryv-purple">_</span>
        </h1>
        
        <p className="text-gray-500 text-xs tracking-[0.5em] uppercase mb-8">
          System Status: <span className="text-kryv-green">Connected</span>
        </p>

        {/* Yaha Humne Nehira Terminal Add Kiya Hai */}
        <NehiraTerminal />
      </div>
    </main>
  );
}

