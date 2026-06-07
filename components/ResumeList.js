'use client'

import { useState, useEffect } from 'react'
import { getUserResumes, deleteResume } from '@/lib/resumeService'

export default function ResumeList({ onSelectResume, onRefresh }) {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResumes()
  }, [onRefresh])

  async function loadResumes() {
    try {
      const data = await getUserResumes()
      setResumes(data)
    } catch (error) {
      console.error('Error loading resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id)
        await loadResumes()
      } catch (error) {
        console.error('Error deleting resume:', error)
        alert('Error deleting resume: ' + error.message)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your resumes...</div>
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No resumes yet. Create your first resume!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Resumes</h2>
      <div className="grid gap-4">
        {resumes.map((resume) => (
          <div key={resume.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{resume.title}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>ATS Score: {resume.ats_score || 0}%</span>
                  <span>Updated: {new Date(resume.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectResume(resume)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}