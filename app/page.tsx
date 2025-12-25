import NehiraTerminal from "@/components/NehiraTerminal";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Matrix Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2 font-cyber">
          NEHIRA<span className="text-red-500">_</span>
        </h1>
        
        <p className="text-gray-500 text-xs tracking-[0.6em] uppercase mb-8">
          The Architect is Online
        </p>

        {/* The Chat Box */}
        <NehiraTerminal />
      </div>
    </main>
  );
}

