import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import JobDetails from '@/components/pages/JobDetails'

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <JobDetails id={params.id} />
      </main>
      <Footer />
    </div>
  )
}
