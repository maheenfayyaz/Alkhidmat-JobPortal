'use client'

import { useState, useEffect } from 'react'

export default function CVPreview({ applicationId }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPdf() {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`http://localhost:8000/api/admin/resumes/${applicationId}/view`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch CV')
        }
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } catch (err) {
        setError(err.message)
      }
    }
    fetchPdf()

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [applicationId])

  if (error) {
    return <div className="text-red-600">Error loading CV: {error}</div>
  }

  if (!pdfUrl) {
    return <div>Loading CV preview...</div>
  }

  return (
    <object
      data={pdfUrl}
      type="application/pdf"
      width="100%"
      height="400px"
      className="mt-4 border border-gray-300 rounded"
    >
      <p>Your browser does not support PDFs. <a href={pdfUrl}>Download the PDF</a>.</p>
    </object>
  )
}
