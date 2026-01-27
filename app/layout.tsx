import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KRYV | The Autonomous Agent Empire',
  description: 'Neutralize the noise. Execute the vision. The network is watching.',
  metadataBase: new URL('https://kryv.network'),
  icons: {
    icon: '/favicon.ico?v=final_ironman',
    shortcut: '/favicon.ico?v=final_ironman',
    apple: '/KRYV.png?v=final_ironman',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* FORCE FAVICON - Direct Injection */}
        <link rel="icon" href="/favicon.ico?v=final_ironman" />
        
        {/* VELQA & GEO INJECTION */}
        <Script src="https://api.velqa.kryv.network/v3/inject.js?id=ID_F322665" strategy="afterInteractive" />
        
        {/* THREE.JS FOR JARVIS GRAPHICS */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} bg-[#020202] text-gray-200 antialiased selection:bg-[#00ff41] selection:text-black overflow-x-hidden`}>
        
        {/* 🚀 JARVIS BACKGROUND ENGINE */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          {/* Neural Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          
          {/* Animated Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Scanning Line Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan pointer-events-none"></div>
        </div>

        <main className="relative z-10">
          {children}
        </main>

        <style jsx global>{`
          @keyframes scan {
            from { transform: translateY(-100%); }
            to { transform: translateY(100%); }
          }
          .animate-scan {
            animation: scan 8s linear infinite;
          }
        `}</style>
      </body>
    </html>
  )
}
