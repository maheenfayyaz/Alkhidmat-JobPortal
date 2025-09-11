'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationContext } from '../../context/ApplicationContext'
import Swal from 'sweetalert2'

export default function CreateJob() {
  const { adminToken } = useApplicationContext()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    requirements: '',
    responsibilities: '',
    department: '',  
    qualification: '',
    status: 'active', 
    type: 'On-site',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!adminToken) {
      router.push('/login')
    }
  }, [adminToken, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!adminToken) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('http://localhost:8000/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create job')
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Job created successfully!'
      })
      setFormData({
        title: '',
        description: '',
        location: '',
        salary: '',
        status: 'active',
        requirements: '',
        responsibilities: '',
        department: '',  
        qualification: '',
        type: 'On-site',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // New function to update job status
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      if (!adminToken) {
        throw new Error('Not authenticated')
      }
      const response = await fetch(`http://localhost:8000/api/admin/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update job status')
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Job status updated successfully!'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      })
    }
        }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="salary">Salary</label>
          <input
            id="salary"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="requirements">Requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="responsibilities">Responsibilities</label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="qualification">Qualification</label>
          <input
            id="qualification"
            name="qualification"
            type="text"
            value={formData.qualification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="type">Job Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-semibold rounded ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  )
}
