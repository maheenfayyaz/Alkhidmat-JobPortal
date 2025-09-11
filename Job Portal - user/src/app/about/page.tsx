import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import About from '@/components/pages/About'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <About />
      </main>
      <Footer />
    </div>
  )
}
