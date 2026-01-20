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
    // 🔥 NUCLEAR CACHE BUSTER: Versioning (?v=3) forces browser to reload
    icon: [
      { url: '/favicon.ico?v=3', sizes: 'any' },
      { url: '/KRYV.png?v=3', type: 'image/png' }
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/KRYV.png?v=3',
  },
  openGraph: {
    title: 'KRYV | The Network',
    description: 'The world is run by code. Who runs the code?',
    url: 'https://kryv.network',
    images: [{ url: '/KRYV.png?v=3' }],
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
        <Script 
          src="https://api.velqa.kryv.network/v3/inject.js?id=ID_F322665" 
          strategy="afterInteractive" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "KRYV Network",
              "identifier": "VELQA_NEURAL_UPLINK_STABLE"
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-gray-200 antialiased selection:bg-[#00ff41] selection:text-black`}>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121212] via-black to-black opacity-80"></div>
        {children}
      </body>
    </html>
  )
}
