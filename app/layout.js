import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LeetCode Roadmap',
  description: 'Track your progress through the NeetCode 150 problems',
  keywords: ['leetcode', 'coding', 'interview', 'preparation', 'neetcode'],
  authors: [{ name: 'Your Name' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="fixed bottom-0 w-full py-4 text-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          Made with ❤️ by Harsh Arora
        </footer>
      </body>
    </html>
  )
}