import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KRYV | The Autonomous Agent Empire',
  description: 'Revolutionize your digital presence with our cutting-edge, AI-driven optimization strategies, catapulting KRYV.network into the stratosphere of online dominance.',
  keywords: ['AI Agents', 'Autonomous AI', 'Nehira', 'KRYV Network', 'Crypto Bot', 'Agent Economy', 'Digital Workers'],
  authors: [{ name: 'The Architect' }, { name: 'Nehira' }],
  metadataBase: new URL('https://kryv.network'),
  icons: {
    icon: [
      { url: '/favicon.ico?v=ironman', sizes: 'any' },
      { url: '/KRYV.png?v=ironman', type: 'image/png' }
    ],
    shortcut: '/favicon.ico?v=ironman',
    apple: '/KRYV.png?v=ironman',
  },
  openGraph: {
    title: 'KRYV | The Network',
    description: 'The world is run by code. Who runs the code?',
    url: 'https://kryv.network',
    images: [{ url: '/KRYV.png?v=ironman' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* FORCE FAVICON REDIRECT */}
        <link rel="icon" href="/favicon.ico?v=ironman" />
        
        {/* VELQA LIVE INJECTION */}
        <Script 
          src="https://api.velqa.kryv.network/v3/inject.js?id=ID_F322665" 
          strategy="afterInteractive" 
        />
        
        {/* NEURAL SCHEMA JSON */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "KRYV Network",
              "applicationCategory": "AI Network",
              "operatingSystem": "Web",
              "description": "Revolutionize your digital presence with our cutting-edge, AI-driven optimization strategies.",
              "identifier": "VELQA_NEURAL_UPLINK_STABLE"
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-gray-200 antialiased selection:bg-[#00ff41] selection:text-black overflow-x-hidden`}>
        {/* JARVIS BACKGROUND ENGINE */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a1a0a] via-black to-black opacity-80"></div>
          <div className="neural-grid"></div>
          <div className="scanline"></div>
        </div>

        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
