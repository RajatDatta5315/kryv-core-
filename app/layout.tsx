import './globals.css'

export const metadata = {
  title: 'KRYV | Elite AI Marketplace',
  description: 'Hidden Marketplace for AI Agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-kryv-green font-cyber">{children}</body>
    </html>
  )
}

