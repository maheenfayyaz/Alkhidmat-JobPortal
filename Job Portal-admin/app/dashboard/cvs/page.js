'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Download, Eye } from 'lucide-react'
import { useApplicationContext } from '../../context/ApplicationContext'
import Swal from 'sweetalert2'

export default function CVManagement() {
  const { candidates, loading, fetchCandidates } = useApplicationContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCVs, setFilteredCVs] = useState([])

  useEffect(() => {
    fetchCandidates()
  }, [])

  // Sync filteredCVs with candidates when candidates change
  useEffect(() => {
    setFilteredCVs(candidates)
  }, [candidates])

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    
    if (term === '') {
      setFilteredCVs(candidates)
    } else {
      const filtered = candidates.filter(candidate => {
        const name = candidate.fullName || candidate.fullname || ''
        const position = candidate.position || ''
        return name.toLowerCase().includes(term) || position.toLowerCase().includes(term)
      })
      setFilteredCVs(filtered)
    }
  }

  const handleDownload = async (candidateId, candidateName) => {
    if (!candidateId) {
      console.warn('Attempted to download CV with undefined candidateId')
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot download CV: candidate ID is missing'
      })
      return
    }
    if (!candidateName) {
      candidateName = 'Unknown Candidate'
    }
    try {
      const token = localStorage.getItem('adminToken');
      
      // First get applications for this candidate
      const applicationsResponse = await fetch(`http://localhost:8000/api/admin/candidates/${candidateId}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!applicationsResponse.ok) {
        throw new Error('Failed to fetch applications')
      }
      
      const applicationsData = await applicationsResponse.json()
      if (!applicationsData.applications || applicationsData.applications.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No applications found for this candidate'
        })
        return
      }
      
      const applicationId = applicationsData.applications[0]._id
      
      // Now download using the application ID
      const response = await fetch(`http://localhost:8000/api/admin/resumes/${applicationId}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download CV');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to download CV for ${candidateName}`
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate CVs</h1>
          <p className="mt-1 text-sm text-gray-600">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidate CVs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse and download CVs submitted by candidates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search CV by name or position"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* CVs Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Applied For</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCVs.length > 0 ? (
                filteredCVs.map((cv, index) => {
                  const candidateId = cv._id || cv.id
                  const candidateName = cv.fullName || cv.fullname || 'Unknown'
                  
                  return (
                    <tr key={candidateId || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {candidateName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cv.position || 'No Position Applied'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cv.submissionDate ? new Date(cv.submissionDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {candidateId ? (
                            <Link
                              href={`/dashboard/candidate/${candidateId}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          ) : (
                            <span className="text-gray-400 cursor-not-allowed">View</span>
                          )}
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDownload(candidateId, candidateName)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            disabled={!candidateId}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="text-center">
                      <Search className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No CVs found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search criteria or check if there are any applications.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredCVs.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredCVs.length}</span> CVs
              </div>
              <div className="flex space-x-2">
                <button
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('adminToken');
                      const response = await fetch('http://localhost:8000/api/admin/resumes/downloadAll', {
                        method: 'GET',
                        headers: {
                          Authorization: `Bearer ${token}`
                        },
                      });
                      if (!response.ok) {
                        throw new Error('Failed to download all CVs');
                      }
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'all_resumes.zip';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Download all error:', error);
                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to download all CVs'
                      })
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}