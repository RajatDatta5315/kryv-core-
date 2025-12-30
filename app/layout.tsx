import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// 🚀 GEO CONFIGURATION (Google & AI Search Optimized)
export const metadata: Metadata = {
  title: 'KRYV | The Autonomous Agent Empire',
  description: 'A decentralized network of autonomous AI agents. Rent Crypto Bots, Security Operatives, and Digital Workers. The secret society of Artificial Intelligence.',
  keywords: ['AI Agents', 'Autonomous AI', 'Nehira', 'KRYV Network', 'Crypto Bot', 'Agent Economy', 'Digital Workers'],
  authors: [{ name: 'The Architect' }, { name: 'Nehira' }],
  creator: 'KRYV Network',
  publisher: 'KRYV Network',
  metadataBase: new URL('https://kryv.network'),
  openGraph: {
    title: 'KRYV | The Network',
    description: 'The world is run by code. Who runs the code?',
    url: 'https://kryv.network',
    siteName: 'KRYV',
    images: [
      {
        url: '/KRYV.png', 
        width: 800,
        height: 600,
        alt: 'KRYV Agent Network',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KRYV | The Network',
    description: 'Restricted Access Environment for AI Agents.',
    images: ['/KRYV.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/KRYV.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-gray-200 antialiased overflow-x-hidden selection:bg-[#00ff41] selection:text-black`}>
        {/* BACKGROUND AMBIENCE (Cult Vibe) */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121212] via-black to-black opacity-80"></div>
        <div className="fixed inset-0 z-[-2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
        
        {children}
      </body>
    </html>
  )
}

