'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingJobId, setUpdatingJobId] = useState(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const token = localStorage.getItem('adminToken') || ''
        const response = await fetch('http://localhost:8000/api/admin/jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        const data = await response.json()
        setJobs(data.jobs)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        })
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const updateJobStatus = async (jobId, newStatus) => {
    setUpdatingJobId(jobId)
    try {
      const token = localStorage.getItem('adminToken') || ''
      const response = await fetch(`http://localhost:8000/api/admin/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) {
        throw new Error('Failed to update job status')
      }
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Job status updated successfully'
      })
      // Update local state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      )
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      })
    } finally {
      setUpdatingJobId(null)
    }
  }

  if (loading) {
    return <div>Loading jobs...</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Manage Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">Title</th>
              <th className="border border-gray-300 p-2 text-left">Location</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id}>
                <td className="border border-gray-300 p-2">{job.title}</td>
                <td className="border border-gray-300 p-2">{job.location || '-'}</td>
                <td className="border border-gray-300 p-2 capitalize">{job.status || 'active'}</td>
                <td className="border border-gray-300 p-2">
                  <select
                    value={job.status || 'active'}
                    onChange={e => updateJobStatus(job._id, e.target.value)}
                    disabled={updatingJobId === job._id}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
