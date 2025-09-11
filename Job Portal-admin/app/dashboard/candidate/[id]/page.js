'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Save } from 'lucide-react'
import { useApplicationContext } from "../../../context/ApplicationContext"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function CandidateDetails({ params }) {
  const router = useRouter()
  const { getCandidateById, updateCandidateStatus, getCandidateNote, updateCandidateNote, fetchCandidateDetails, getCandidateDetails } = useApplicationContext()
  // const candidate = getCandidateById(params.id)
  // Remove direct assignment to candidate from context to enable reactive updates
  const [candidate, setCandidate] = useState(null)

  const [applicationStatus, setApplicationStatus] = useState('')
  const [interviewDateTime, setInterviewDateTime] = useState('')
  const [notes, setNotes] = useState('')
  const [applications, setApplications] = useState([])

  useEffect(() => {
    console.log('CandidateDetails params.id:', params.id)
    if (!params.id || params.id === 'undefined') {
      router.push('/dashboard')
      return
    }
    fetchCandidateDetails(params.id)
  }, [params.id, fetchCandidateDetails, router])

  useEffect(() => {
    async function loadCandidate() {
      try {
        await fetchCandidateDetails(params.id)
        const candidateData = getCandidateDetails(params.id)
        setCandidate(candidateData)
      } catch (error) {
        console.error('Error loading candidate details:', error)
      }
    }
    loadCandidate()
  }, [fetchCandidateDetails, getCandidateDetails, params.id])


  useEffect(() => {
    if (applications.length > 0) {
      // Normalize status to match dropdown options based on first application
      const statusMap = {
        applied: 'Under Review',
        'under review': 'Under Review',
        'interview scheduled': 'Interview Scheduled',
        rejected: 'Rejected',
        hired: 'Hired',
        pending: 'Pending'
      }
      const normalizedStatus = statusMap[(applications[0].status || '').toLowerCase()] || 'Pending'
      setApplicationStatus(normalizedStatus)
    }
  }, [applications])

  useEffect(() => {
    if (candidate) {
      // Only set notes if not already set or different
      setNotes(prev => prev === '' ? getCandidateNote(params.id) : prev)
    }
  }, [candidate, params.id, getCandidateNote])

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/candidates/${params.id}/applications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
        if (!response.ok) {
          console.error('Failed to fetch applications')
          return
        }
        const data = await response.json()
        setApplications(data.applications || [])
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    }
    fetchApplications()
  }, [params.id])

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Candidate not found</h2>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const handleStatusChange = (newStatus) => {
    setApplicationStatus(newStatus)
    // Map frontend status to backend allowed status values
  const statusMap = {
      'Under Review': 'reviewed',
      'Interview Scheduled': 'shortlisted',
      'Rejected': 'rejected',
      'Hired': 'hired',
      'Pending': 'pending'
    }
    const backendStatus = statusMap[newStatus] || 'pending'

    // Update status, notes, and interview date of the first application
    if (applications.length > 0) {
      const applicationId = applications[0]._id
      const updateData = {
        status: backendStatus,
        notes: notes,
        interviewDate: interviewDateTime || null
      }
      fetch(`http://localhost:8000/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updateData)
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to update application')
        }
        // Optionally refetch applications or update state here
      }).catch(error => {
        console.error(error)
      })
    }
  }

  const handleSaveNote = () => {
    // Update notes, status, and interview date together
    if (applications.length > 0) {
      const applicationId = applications[0]._id
      const statusMap = {
        'Under Review': 'reviewed',
        'Interview Scheduled': 'shortlisted',
        'Rejected': 'rejected',
        'Hired': 'hired'
      }
      const backendStatus = statusMap[applicationStatus] || 'pending'
      const updateData = {
        status: backendStatus,
        notes: notes,
        interviewDate: interviewDateTime || null
      }
      fetch(`http://localhost:8000/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updateData)
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to update application')
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Note saved successfully!'
        })
      }).catch(error => {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to save note'
        })
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No applications found for this candidate'
      })
    }
  }

  const handleInterviewDateChange = (newDate) => {
    setInterviewDateTime(newDate)
    // Update interview date, status, and notes together
    if (applications.length > 0) {
      const applicationId = applications[0]._id
      const statusMap = {
        'Under Review': 'reviewed',
        'Interview Scheduled': 'shortlisted',
        'Rejected': 'rejected',
        'Hired': 'hired'
      }
      const backendStatus = statusMap[applicationStatus] || 'pending'
      const updateData = {
        status: backendStatus,
        notes: notes,
        interviewDate: newDate || null
      }
      fetch(`http://localhost:8000/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updateData)
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to update application')
        }
      }).catch(error => {
        console.error(error)
      })
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    
    if (!status) {
      return `${baseClasses} bg-gray-100 text-gray-800`
    }
    
    switch (status.toLowerCase()) {
      case 'applied':
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-800`
      case 'interviewing':
        return `${baseClasses} bg-blue-100 text-blue-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info & Application History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidate Details</h2>
            
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="font-medium">{candidate?.fullName || candidate?.fullname || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{candidate?.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p className="font-medium">{candidate?.phone || '-'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Address</label>
            <p className="font-medium">{candidate?.address || '-'}</p>
          </div>
        </div>
      </div>

            {/* Application History */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Application History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Position</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-gray-500">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app._id} className="border-b border-gray-100">
                          <td className="py-3 text-sm text-gray-600">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 text-sm text-gray-600">{app.position || app.job?.title || '-'}</td>
                          <td className="py-3">
                            <span className={getStatusBadge(app.status)}>
                              {app.status || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CV Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CV Preview</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 bg-gray-100 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-sm text-gray-500 mb-2">CV Preview</div>
                    <div className="font-semibold">{candidate?.fullname || '-'}</div>
                    <div className="text-sm text-gray-600">{applications.length > 0 ? (applications[0].position || applications[0].job?.title) : '-'}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-200 h-16 rounded"></div>
                    <div className="bg-gray-200 h-16 rounded"></div>
                    <div className="bg-gray-200 h-16 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Management</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  value={applicationStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="input-field"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Scheduling
                </label>
                <input
                  type="text"
                  value={interviewDateTime}
                  onChange={(e) => handleInterviewDateChange(e.target.value)}
                  placeholder="Schedule Interview (Date/Time)"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes & Interactions
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Add notes about the candidate..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleSaveNote}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save note</span>
              </button>
              <button
                onClick={async () => {
                  if (applications.length === 0) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'No applications found for this candidate'
                    })
                    return
                  }
                  const applicationId = applications[0]._id
                  if (!applicationId) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'No application ID found for this candidate'
                    })
                    return
                  }
                  try {
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
                    a.download = `${params.id}_resume.pdf`
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
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
