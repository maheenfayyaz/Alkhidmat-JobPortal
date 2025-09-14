import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'AL Khidmat - Recruitment Management',
  description: 'Admin dashboard for recruitment management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
