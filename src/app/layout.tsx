import "react-contexify/dist/ReactContexify.css";
import './globals.css'

export const metadata = {
  title: 'Run Ts',
  description: 'Create, edit and run your typescript snippets in a secure sandbox!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{ children }</body>
    </html>
  )
}
