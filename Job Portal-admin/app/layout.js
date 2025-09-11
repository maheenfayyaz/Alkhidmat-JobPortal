import './globals.css'
import { ApplicationProvider } from './context/ApplicationContext'

export const metadata = {
  title: 'AL Khidmat - Recruitment Management',
  description: 'Admin dashboard for recruitment management',
}

export default function RootLayout({ children, params }) {
  // We cannot use usePathname in a server component, so use params to detect route
  const isAuthPage = params?.slug === 'signup' || params?.slug === 'login'

  return (
    <html lang="en">
      <body>
        {isAuthPage ? (
          <>
            {children}
          </>
        ) : (
          <ApplicationProvider>
            {children}
          </ApplicationProvider>
        )}
      </body>
    </html>
  )
}
