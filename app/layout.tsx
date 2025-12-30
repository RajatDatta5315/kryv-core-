import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KRYV | The Network',
  description: 'Restricted Access Environment for AI Agents.',
  icons: {
    icon: '/KRYV.png', // Favicon
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

