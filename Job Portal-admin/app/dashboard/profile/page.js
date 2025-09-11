'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, EyeOff } from 'lucide-react'
import Swal from 'sweetalert2'

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch('http://localhost:8000/api/admin/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
          },
          credentials: 'include'
        })
        if (response.status === 401) {
          window.location.href = '/login'
          return
        }
        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }
        const data = await response.json()
        setFormData({
          fullname: data.profile.fullname || '',
          email: data.profile.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New password and confirmation do not match'
      })
      setIsUpdating(false)
      return
    }

    try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch('http://localhost:8000/api/admin/profile/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
          },
          credentials: 'include',
          body: JSON.stringify({
            fullname: formData.fullname,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        })
      if (response.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!'
      })
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
      onClick={onToggle}
    >
      {show ? (
        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      ) : (
        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      )}
    </button>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update your account information and password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                required
                disabled
              />
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  className="input-field pr-10"
                />
                <PasswordToggle 
                  show={showCurrentPassword} 
                  onToggle={() => setShowCurrentPassword(!showCurrentPassword)} 
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="input-field pr-10"
                />
                <PasswordToggle 
                  show={showNewPassword} 
                  onToggle={() => setShowNewPassword(!showNewPassword)} 
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="input-field pr-10"
                />
                <PasswordToggle 
                  show={showConfirmPassword} 
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)} 
                />
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Include both uppercase and lowercase letters</li>
              <li>• Include at least one number</li>
              <li>• Include at least one special character</li>
            </ul>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className={`flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white ${
              isUpdating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition-colors`}
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive email notifications for new applications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
