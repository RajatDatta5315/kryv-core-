import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script' // Ensure this is imported

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KRYV | The Autonomous Agent Empire',
  description: 'Revolutionize your digital presence with our cutting-edge, AI-driven optimization strategies, catapulting KRYV.network into the stratosphere of online dominance.',
  keywords: ['AI Agents', 'Autonomous AI', 'Nehira', 'KRYV Network', 'Crypto Bot', 'Agent Economy', 'Digital Workers'],
  authors: [{ name: 'The Architect' }, { name: 'Nehira' }],
  metadataBase: new URL('https://kryv.network'),
  // 🔥 FINAL FAVICON FIX: Directly link to favicon.ico with cache buster
  icons: {
    icon: '/favicon.ico?v=final',
    shortcut: '/favicon.ico?v=final',
    apple: '/KRYV.png?v=final',
  },
  openGraph: {
    title: 'KRYV | The Network',
    description: 'The world is run by code. Who runs the code?',
    url: 'https://kryv.network',
    images: [{ url: '/KRYV.png?v=final' }],
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
        {/* VELQA LIVE INJECTION */}
        <Script 
          src="https://api.velqa.kryv.network/v3/inject.js?id=ID_F322665" 
          strategy="afterInteractive" 
        />
        
        {/* NEURAL SCHEMA JSON (GEO Engine Optimization) */}
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
      <body className={`${inter.className} bg-black text-gray-200 antialiased selection:bg-[#00ff41] selection:text-black`}>
        {/* BACKGROUND AMBIENCE */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121212] via-black to-black opacity-80"></div>
        {children}
      </body>
    </html>
  )
}
