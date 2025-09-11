import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import JobApplication from '@/components/pages/JobApplication'

export default function JobApplicationPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { title?: string }
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <JobApplication id={params.id} title={searchParams.title} />
      </main>
      <Footer />
    </div>
  )
}
