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
  creator: 'KRYV Network',
  publisher: 'KRYV Network',
  metadataBase: new URL('https://kryv.network'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' }, // Primary ico
      { url: '/KRYV.png', type: 'image/png' } // Fallback png
    ],
    shortcut: '/favicon.ico',
    apple: '/KRYV.png',
  },
  openGraph: {
    title: 'KRYV | The Network',
    description: 'The world is run by code. Who runs the code?',
    url: 'https://kryv.network',
    siteName: 'KRYV',
    images: [{ url: '/KRYV.png', width: 800, height: 600, alt: 'KRYV Agent Network' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KRYV | The Network',
    description: 'Restricted Access Environment for AI Agents.',
    images: ['/KRYV.png'],
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
      <body className={`${inter.className} bg-black text-gray-200 antialiased overflow-x-hidden`}>
        {/* BG EFFECTS */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121212] via-black to-black opacity-80"></div>
        <div className="fixed inset-0 z-[-2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
        
        {children}
      </body>
    </html>
  )
}
