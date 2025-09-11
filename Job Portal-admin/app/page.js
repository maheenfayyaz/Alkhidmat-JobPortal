'use client'

import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApplicationContext } from './context/ApplicationContext'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { candidates, loading, error, fetchCandidates, dashboardStats } = useApplicationContext()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('Dashboard mounted, candidates:', candidates)
  }, [candidates])

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

  console.log('Dashboard render - candidates:', candidates)
  console.log('Dashboard render - filteredCandidates:', filteredCandidates)
  console.log('Dashboard render - loading:', loading)
  console.log('Dashboard render - error:', error)

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Loading candidates...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Number of candidates: {candidates.length}
          {loading && ' (Loading...)'}
        </div>
        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-2">
          Debug: candidates array length = {candidates.length}, loading = {loading.toString()}
        </div>
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
          <div className="text-sm font-medium text-gray-500 mb-1">Total Candidates</div>
          <div className="text-3xl font-bold text-gray-900">{candidates.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-gray-900">{dashboardStats?.totalApplications || 0}</div>
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

      {/* Manual Refresh Button */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => {
            console.log('Manual refresh clicked')
            fetchCandidates()
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Candidates ({filteredCandidates.length})
          </h3>
        </div>
        
        {filteredCandidates.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-4"></div>
                  Loading candidates...
                </>
              ) : error ? (
                <>
                  <div className="text-red-500 mb-4">Error: {error}</div>
                  <button
                    onClick={fetchCandidates}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <div className="text-gray-500 mb-4">No candidates found</div>
                  <button
                    onClick={fetchCandidates}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Refresh
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                        {candidate.email || 'No email'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.position || 'No Position'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(candidate.status)}>
                          {candidate.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {candidateId ? (
                            <Link
                              href={`/dashboard/candidate/${candidateId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </Link>
                          ) : (
                            <span className="text-gray-400 cursor-not-allowed">View Details</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}