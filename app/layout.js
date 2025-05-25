import './globals.css'

export const metadata = {
  title: 'NeetCode Roadmap',
  description: 'Track your coding interview progress',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}