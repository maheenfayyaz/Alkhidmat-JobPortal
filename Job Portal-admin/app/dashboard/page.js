'use client'

import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApplicationContext } from '../context/ApplicationContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const chartData = [
  { week: 'Week 1', value: 20 },
  { week: 'Week 2', value: 45 },
  { week: 'Week 3', value: 35 },
  { week: 'Week 4', value: 60 },
]

export default function Dashboard() {
  const { candidates, loading, error, fetchCandidates, searchCandidates, dashboardStats, totalApplications } = useApplicationContext()
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchCandidates()
  }, [])

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-800`
      case 'reviewed':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'shortlisted':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      case 'hired':
        return `${baseClasses} bg-purple-100 text-purple-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  // Filter candidates based on search term
  let filteredCandidates = candidates
  if (searchTerm.trim()) {
    filteredCandidates = candidates.filter(candidate => {
      const name = candidate.fullName || candidate.fullname || ''
      return name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }

  console.log('Dashboard candidates:', candidates)
  console.log('Dashboard filteredCandidates:', filteredCandidates)

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Loading candidates...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && (!candidates || candidates.length === 0)) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-700">No candidates found. Please add candidates or check your data source.</p>
        <button 
          onClick={fetchCandidates}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Retry Loading
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div>Number of candidates: {candidates.length}</div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-red-800 font-medium">Error loading data:</span>
              <span className="text-red-700 ml-2">{error}</span>
            </div>
            <button
              onClick={fetchCandidates}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-gray-900">{totalApplications ? totalApplications.toLocaleString() : candidates.length}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-1">Total Candidates</div>
        <div className="text-3xl font-bold text-gray-900">{candidates.length}</div>
      </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search candidates by name"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-auto max-h-[600px]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.slice(0, 10).map((candidate) => {
                const candidateId = candidate._id || candidate.id
                return (
                  <tr key={candidateId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {candidate.fullName || candidate.fullname || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.position || 'No Position'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {candidate.submissionDate ? new Date(candidate.submissionDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(candidate.status)}>
                        {candidate.status || 'No Status'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {candidateId ? (
                          <Link
                            href={`/dashboard/candidate/${candidateId}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Preview CV
                          </Link>
                        ) : (
                          <span className="text-gray-400 cursor-not-allowed">Preview CV</span>
                        )}
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={async () => {
                            try {
                              const applications = await fetch(`http://localhost:8000/api/admin/candidates/${candidateId}/applications`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                                }
                              })
                              if (!applications.ok) {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: 'Failed to fetch applications for this candidate'
                                })
                                return
                              }
                              const data = await applications.json()
                              if (!data.applications || data.applications.length === 0) {
                                Swal.fire({
                                  icon: 'info',
                                  title: 'No Applications',
                                  text: 'No applications found for this candidate'
                                })
                                return
                              }
                              const applicationId = data.applications[0]._id
                              if (!applicationId) {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: 'No application ID found for this candidate'
                                })
                                return
                              }
                              const response = await fetch(`http://localhost:8000/api/admin/resumes/${applicationId}/download`, {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                                }
                              })
                              if (!response.ok) {
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Error',
                                  text: 'Failed to download CV'
                                })
                                return
                              }
                              const blob = await response.blob()
                              const url = window.URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${candidate.fullName || candidate.fullname}_resume.pdf`
                              document.body.appendChild(a)
                              a.click()
                              a.remove()
                              window.URL.revokeObjectURL(url)
                            } catch (error) {
                              console.error('Download CV error:', error)
                              Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Error downloading CV'
                              })
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Download CV
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, filteredCandidates.length)}</span> of{' '}
                <span className="font-medium">{filteredCandidates.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Application Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Application Trends</h3>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Applications Over Time</div>
          <div className="text-2xl font-bold text-green-600">+15%</div>
          <div className="text-sm text-gray-500">Last 30 Days +15%</div>
        </div>

        {/* Simple chart representation */}
        <div className="mt-6">
          <div className="flex items-end justify-between h-32 space-x-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(item.value / 60) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{item.week}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
