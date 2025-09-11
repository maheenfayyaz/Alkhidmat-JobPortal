'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useApplicationContext } from '../../context/ApplicationContext'

export default function SearchCandidates() {
  const { searchCandidates } = useApplicationContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const searchResult = searchCandidates(searchTerm)
      setResults(searchResult)
      setHasSearched(true)
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    
    if (!status) {
      return `${baseClasses} bg-gray-100 text-gray-800`
    }
    
    switch (status.toLowerCase()) {
      case 'submitted':
        return `${baseClasses} bg-gray-100 text-gray-800`
      case 'in review':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'interview scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Candidates by Name</h1>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter candidate name"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto btn-primary"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
          </div>

          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Application Status</th>
                    <th className="table-header">Position Applied For</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((candidate) => {
                    const name = candidate.fullName || candidate.fullname || candidate.name || 'N/A'
                    return (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="table-cell font-medium">{name}</td>
                        <td className="table-cell">
                          <span className={getStatusBadge(candidate.status)}>
                            {candidate.status}
                          </span>
                        </td>
                        <td className="table-cell text-gray-500">{candidate.position}</td>
                        <td className="table-cell">
                          <Link
                            href={`/dashboard/candidate/${candidate.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try searching with a different candidate name.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
