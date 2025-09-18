'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SimpleFileUpload from '@/components/SimpleFileUpload'
import { useUploadThing } from '@/lib/utils'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'

interface PortfolioItem {
  id: number
  category: string
  image: string
  title: string
  description: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('portfolio')
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [editingItems, setEditingItems] = useState<{[key: number]: Partial<PortfolioItem>}>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [accountError, setAccountError] = useState('')
  const [accountSuccess, setAccountSuccess] = useState('')
  const [currentUploadingItem, setCurrentUploadingItem] = useState<number | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const currentUploadingItemRef = useRef<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newItemData, setNewItemData] = useState<Partial<PortfolioItem>>({
    category: 'paintings',
    image: '',
    title: '',
    description: ''
  })
  const router = useRouter()

  // Centralized UploadThing hook
  const { startUpload, isUploading } = useUploadThing('portfolioImageUploader', {
    onClientUploadComplete: (res) => {
      const uploadingItemId = currentUploadingItemRef.current
      if (res && res[0] && uploadingItemId !== null) {
        const uploadedUrl = res[0].url
        console.log(`Centralized upload complete for item ${uploadingItemId}: ${uploadedUrl}`)

        if (uploadingItemId === -1) {
          // Handle new item upload
          handleNewItemChange('image', uploadedUrl)
        } else {
          // Handle existing item upload
          handleInputChange(uploadingItemId, 'image', uploadedUrl)
        }

        setCurrentUploadingItem(null)
        currentUploadingItemRef.current = null
        setUploadProgress(0)
      }
    },
    onUploadError: (error: Error) => {
      const uploadingItemId = currentUploadingItemRef.current
      console.log(`Centralized upload error for item ${uploadingItemId}:`, error.message)
      setCurrentUploadingItem(null)
      currentUploadingItemRef.current = null
      setUploadProgress(0)
    },
    onUploadProgress: (progress) => {
      const uploadingItemId = currentUploadingItemRef.current
      console.log(`Upload progress for item ${uploadingItemId}: ${progress}%`)
      setUploadProgress(progress)
    },
  })

  // Default portfolio items
  const defaultPortfolioItems = [
    {
      id: 1,
      category: 'paintings',
      image: 'https://as1.ftcdn.net/v2/jpg/02/73/22/74/1000_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg',
      title: 'Oil Painting',
      description: 'Rich textures and vibrant colors on canvas'
    },
    {
      id: 2,
      category: 'sketches',
      image: 'https://fullbloomclub.net/wp-content/uploads/2024/03/realisitc-drawing.jpg',
      title: 'Pencil Sketch',
      description: 'Hand-drawn details capturing raw emotion'
    },
    {
      id: 3,
      category: 'digital',
      image: 'https://wallpapercrafter.com/desktop1/500076-digital-digital-art-artwork-illustration-drawing.jpg',
      title: 'Digital Illustration',
      description: 'Modern art created with digital tools'
    },
    {
      id: 4,
      category: 'portraits',
      image: 'https://c.files.bbci.co.uk/11AF8/production/_133304427_c3400905-3742-4db3-b546-f919a4cdf24e.jpg',
      title: 'Custom Portrait',
      description: 'Personalized artwork made to order'
    },
    {
      id: 5,
      category: 'paintings',
      image: 'https://static.skillshare.com/uploads/video/thumbnails/0190cceb185ab931f9a0ae15c7566ca5/original',
      title: 'Watercolor Art',
      description: 'Soft blends and delicate brushwork'
    },
    {
      id: 6,
      category: 'sketches',
      image: 'https://blog.udemy.com/wp-content/uploads/2014/05/bigstock-Drawing-picture-of-drawing-cha-59510285.jpg',
      title: 'Charcoal Sketch',
      description: 'Bold contrasts and expressive strokes'
    }
  ]

  useEffect(() => {
    // Initialize default credentials if not set
    if (!localStorage.getItem('adminUsername')) {
      localStorage.setItem('adminUsername', 'admin')
    }
    if (!localStorage.getItem('adminPassword')) {
      localStorage.setItem('adminPassword', '12345')
    }

    // Check authentication status
    const checkAuth = async () => {
      const authStatus = localStorage.getItem('adminAuthenticated')
      const loginTime = localStorage.getItem('adminLoginTime')
      const currentTime = Date.now()

      // Check if logged in and session is valid (within 24 hours)
      if (authStatus === 'true' && loginTime && (currentTime - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
        setIsAuthenticated(true)
        // Load portfolio items from API
        try {
          const response = await fetch('/api/portfolio')
          if (response.ok) {
            const items = await response.json()
            setPortfolioItems(items)
          } else {
            console.error('Failed to fetch portfolio items')
            setPortfolioItems(defaultPortfolioItems)
          }
        } catch (error) {
          console.error('Error fetching portfolio items:', error)
          setPortfolioItems(defaultPortfolioItems)
        }
      } else {
        // Clear invalid session
        localStorage.removeItem('adminAuthenticated')
        localStorage.removeItem('adminLoginTime')
        router.push('/admin')
      }
      setIsLoading(false)
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkAuth()
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  const handleInputChange = (id: number, field: keyof PortfolioItem, value: string) => {
    console.log(`Updating item ${id}, field ${field}:`, value)
    setEditingItems(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleSaveItem = async (id: number) => {
    const editedData = editingItems[id]
    if (!editedData) return

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      })

      if (response.ok) {
        // Update local state
        const updatedItems = portfolioItems.map(item =>
          item.id === id ? { ...item, ...editedData } : item
        )
        setPortfolioItems(updatedItems)

        // Clear editing state for this item
        setEditingItems(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })

        setSuccessMessage('Portfolio item updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        console.error('Failed to update portfolio item')
        setSuccessMessage('Failed to update portfolio item')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      setSuccessMessage('Error updating portfolio item')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const getEditValue = (item: PortfolioItem, field: keyof PortfolioItem): string => {
    return (editingItems[item.id]?.[field] ?? item[field]) as string
  }

  const handleCentralizedUpload = async (itemId: number, files: File[]) => {
    console.log(`Starting centralized upload for item ${itemId}`)
    setCurrentUploadingItem(itemId)
    currentUploadingItemRef.current = itemId
    setUploadProgress(0)

    try {
      await startUpload(files)
    } catch (error) {
      console.error(`Upload failed for item ${itemId}:`, error)
      setCurrentUploadingItem(null)
      currentUploadingItemRef.current = null
      setUploadProgress(0)
    }
  }

  const handleNewItemUpload = async (files: File[]) => {
    console.log('Starting upload for new item')
    setCurrentUploadingItem(-1) // Use -1 to indicate new item upload
    currentUploadingItemRef.current = -1
    setUploadProgress(0)

    try {
      await startUpload(files)
    } catch (error) {
      console.error('Upload failed for new item:', error)
      setCurrentUploadingItem(null)
      currentUploadingItemRef.current = null
      setUploadProgress(0)
    }
  }

  const handleNewItemChange = (field: keyof PortfolioItem, value: string) => {
    setNewItemData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateNewId = (): number => {
    const existingIds = portfolioItems.map(item => item.id)
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0
    return maxId + 1
  }

  const handleAddNewItem = async () => {
    if (!newItemData.title || !newItemData.description || !newItemData.image) {
      alert('Please fill in all fields and upload an image before adding the item.')
      return
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: newItemData.category || 'paintings',
          image: newItemData.image || '',
          title: newItemData.title || '',
          description: newItemData.description || ''
        }),
      })

      if (response.ok) {
        const newItem = await response.json()

        // Add new item at the beginning of the array
        const updatedItems = [newItem, ...portfolioItems]
        setPortfolioItems(updatedItems)

        // Reset form and hide add new section
        setNewItemData({
          category: 'paintings',
          image: '',
          title: '',
          description: ''
        })
        setIsAddingNew(false)

        setSuccessMessage('New portfolio item added successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        console.error('Failed to add portfolio item')
        setSuccessMessage('Failed to add portfolio item')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      setSuccessMessage('Error adding portfolio item')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleCancelAddNew = () => {
    setNewItemData({
      category: 'paintings',
      image: '',
      title: '',
      description: ''
    })
    setIsAddingNew(false)
  }

  const handleDeleteItem = async (itemId: number, itemTitle: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${itemTitle}"?\n\nThis action cannot be undone.`
    )

    if (confirmDelete) {
      try {
        const response = await fetch(`/api/portfolio/${itemId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          const updatedItems = portfolioItems.filter(item => item.id !== itemId)
          setPortfolioItems(updatedItems)

          // Clear any editing state for the deleted item
          setEditingItems(prev => {
            const newState = { ...prev }
            delete newState[itemId]
            return newState
          })

          setSuccessMessage(`"${itemTitle}" has been deleted successfully!`)
          setTimeout(() => setSuccessMessage(''), 3000)
        } else {
          console.error('Failed to delete portfolio item')
          setSuccessMessage('Failed to delete portfolio item')
          setTimeout(() => setSuccessMessage(''), 3000)
        }
      } catch (error) {
        console.error('Error deleting portfolio item:', error)
        setSuccessMessage('Error deleting portfolio item')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    }
  }

  const handleAccountSettingsChange = (field: string, value: string) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }))
    setAccountError('')
  }

  const handleUpdateCredentials = () => {
    setAccountError('')
    setAccountSuccess('')

    // Get current credentials
    const currentUsername = localStorage.getItem('adminUsername') || 'admin'
    const currentPassword = localStorage.getItem('adminPassword') || '12345'

    // Validate current password
    if (accountSettings.currentPassword !== currentPassword) {
      setAccountError('Current password is incorrect')
      return
    }

    // Validate new password confirmation
    if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
      setAccountError('New passwords do not match')
      return
    }

    // Update username if provided
    if (accountSettings.newUsername.trim()) {
      if (accountSettings.newUsername.length < 3) {
        setAccountError('Username must be at least 3 characters long')
        return
      }
      localStorage.setItem('adminUsername', accountSettings.newUsername.trim())
    }

    // Update password if provided
    if (accountSettings.newPassword.trim()) {
      if (accountSettings.newPassword.length < 5) {
        setAccountError('Password must be at least 5 characters long')
        return
      }
      localStorage.setItem('adminPassword', accountSettings.newPassword)
    }

    // Clear form
    setAccountSettings({
      currentPassword: '',
      newUsername: '',
      newPassword: '',
      confirmPassword: ''
    })

    setAccountSuccess('Account credentials updated successfully!')
    setTimeout(() => setAccountSuccess(''), 3000)
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--primary)',
        color: 'var(--secondary2)',
        fontSize: '1.5rem',
        textAlign: 'center'
      }}>
        Loading...
      </div>
    )
  }

  // Only render dashboard if authenticated
  if (!isAuthenticated) {
    return null
  }

  const renderAccountSettings = () => (
    <>
      {/* Success Message */}
      {accountSuccess && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {accountSuccess}
        </div>
      )}

      {/* Error Message */}
      {accountError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {accountError}
        </div>
      )}

      {/* Account Settings Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        maxWidth: '600px'
      }}>
        <h3 style={{
          color: '#1a1a1a',
          fontSize: '1.3rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          letterSpacing: '-0.5px'
        }}>
          Update Account Credentials
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Current Password */}
          <div>
            <label style={{
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              Current Password *
            </label>
            <input
              type="password"
              value={accountSettings.currentPassword}
              onChange={(e) => handleAccountSettingsChange('currentPassword', e.target.value)}
              placeholder="Enter current password"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8f9fa',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '0.9rem',
                color: '#1f2937',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.background = '#f8f9fa'
              }}
            />
          </div>

          {/* New Username */}
          <div>
            <label style={{
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              New Username (optional)
            </label>
            <input
              type="text"
              value={accountSettings.newUsername}
              onChange={(e) => handleAccountSettingsChange('newUsername', e.target.value)}
              placeholder="Enter new username (leave empty to keep current)"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8f9fa',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '0.9rem',
                color: '#1f2937',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.background = '#f8f9fa'
              }}
            />
          </div>

          {/* New Password */}
          <div>
            <label style={{
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              display: 'block'
            }}>
              New Password (optional)
            </label>
            <input
              type="password"
              value={accountSettings.newPassword}
              onChange={(e) => handleAccountSettingsChange('newPassword', e.target.value)}
              placeholder="Enter new password (leave empty to keep current)"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8f9fa',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '0.9rem',
                color: '#1f2937',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981'
                e.target.style.background = '#ffffff'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.background = '#f8f9fa'
              }}
            />
          </div>

          {/* Confirm New Password */}
          {accountSettings.newPassword && (
            <div>
              <label style={{
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                value={accountSettings.confirmPassword}
                onChange={(e) => handleAccountSettingsChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.background = '#ffffff'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.background = '#f8f9fa'
                }}
              />
            </div>
          )}

          {/* Update Button */}
          <button
            onClick={handleUpdateCredentials}
            disabled={!accountSettings.currentPassword || (!!accountSettings.newPassword && !accountSettings.confirmPassword)}
            style={{
              padding: '14px 24px',
              background: (!accountSettings.currentPassword || (!!accountSettings.newPassword && !accountSettings.confirmPassword)) ? '#e5e7eb' : '#10b981',
              color: (!accountSettings.currentPassword || (!!accountSettings.newPassword && !accountSettings.confirmPassword)) ? '#9ca3af' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: (!accountSettings.currentPassword || (!!accountSettings.newPassword && !accountSettings.confirmPassword)) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: (!accountSettings.currentPassword || (!!accountSettings.newPassword && !accountSettings.confirmPassword)) ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.2)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              if (accountSettings.currentPassword && (!accountSettings.newPassword || !!accountSettings.confirmPassword)) {
                e.currentTarget.style.background = '#059669'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (accountSettings.currentPassword && (!accountSettings.newPassword || !!accountSettings.confirmPassword)) {
                e.currentTarget.style.background = '#10b981'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)'
              }
            }}
          >
            Update Credentials
          </button>
        </div>

        {/* Info */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#6b7280'
        }}>
          <strong>Note:</strong> You need to enter your current password to make any changes. You can update username, password, or both. Leave fields empty to keep current values.
        </div>
      </div>
    </>
  )

  const renderPortfolioManagement = () => (
    <>
      {/* Success Message */}
      {successMessage && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {successMessage}
        </div>
      )}

      {/* Add New Item Button */}
      {!isAddingNew && (
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setIsAddingNew(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              lineHeight: '1'
            }}>+</span>
            Add New Portfolio Item
          </button>
        </div>
      )}

      {/* Add New Item Form */}
      {isAddingNew && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
          border: '2px solid #10b981',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            color: '#1a1a1a',
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#10b981', fontSize: '1.2rem' }}>+</span>
            Add New Portfolio Item
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Image Upload */}
            <div>
              <label style={{
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Portfolio Image *
              </label>
              <SimpleFileUpload
                key="new-item-upload"
                currentImage={newItemData.image || ''}
                onFileSelect={handleNewItemUpload}
                itemId={-1}
                isUploading={isUploading && currentUploadingItem === -1}
                uploadProgress={currentUploadingItem === -1 ? uploadProgress : 0}
              />
            </div>

            {/* Title */}
            <div>
              <label style={{
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Title *
              </label>
              <input
                type="text"
                value={newItemData.title || ''}
                onChange={(e) => handleNewItemChange('title', e.target.value)}
                placeholder="Enter artwork title"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.background = '#ffffff'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.background = '#f8f9fa'
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Category *
              </label>
              <select
                value={newItemData.category || 'paintings'}
                onChange={(e) => handleNewItemChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#f8f9fa',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981'
                  e.target.style.background = '#ffffff'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.background = '#f8f9fa'
                }}
              >
                <option value="paintings">Calligraphy</option>
                <option value="sketches">Landscape</option>
                <option value="digital">Wedding art / Thread Art</option>
                <option value="portraits">Faceless Portraits</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={{
                color: '#374151',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Description * (Markdown supported)
              </label>
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#f8f9fa'
              }}>
                <MDEditor
                  value={newItemData.description || ''}
                  onChange={(val) => handleNewItemChange('description', val || '')}
                  preview="edit"
                  height={200}
                  data-color-mode="light"
                  visibleDragbar={false}
                  textareaProps={{
                    placeholder: 'Describe your artwork... You can use **bold**, *italic*, [links](url), and more markdown formatting!',
                    style: {
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '1rem'
            }}>
              <button
                onClick={handleCancelAddNew}
                style={{
                  padding: '12px 24px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb'
                  e.currentTarget.style.color = '#374151'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#6b7280'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewItem}
                disabled={!newItemData.title || !newItemData.description || !newItemData.image}
                style={{
                  padding: '12px 24px',
                  background: (!newItemData.title || !newItemData.description || !newItemData.image) ? '#e5e7eb' : '#10b981',
                  color: (!newItemData.title || !newItemData.description || !newItemData.image) ? '#9ca3af' : '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: (!newItemData.title || !newItemData.description || !newItemData.image) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: (!newItemData.title || !newItemData.description || !newItemData.image) ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (newItemData.title && newItemData.description && newItemData.image) {
                    e.currentTarget.style.background = '#059669'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (newItemData.title && newItemData.description && newItemData.image) {
                    e.currentTarget.style.background = '#10b981'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                Add Portfolio Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Items Grid */}
      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(420px, 1fr))'
      }}>
        {portfolioItems.map((item) => (
          <div key={item.id} style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}>

            {/* Enhanced Delete Button */}
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              zIndex: 10
            }}>
              <button
                onClick={() => handleDeleteItem(item.id, item.title)}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.95)'
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'
                  e.currentTarget.style.opacity = '0.8'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
                title={`Delete "${item.title}"`}
                aria-label={`Delete portfolio item: ${item.title}`}
              >
                <i className="fas fa-trash-alt" style={{
                  fontSize: '0.9rem',
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                }}></i>
              </button>

              {/* Elegant confirmation hint */}
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '0.5rem',
                background: 'rgba(239, 68, 68, 0.95)',
                color: '#ffffff',
                padding: '0.375rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                opacity: 0,
                transform: 'translateY(-4px)',
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                const button = e.currentTarget.previousElementSibling as HTMLElement
                if (button) {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              >
                Click to delete
              </div>
            </div>

            {/* Edit Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Image Upload */}
              <div>
                <label style={{
                  color: '#374151',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Portfolio Image
                </label>
                <SimpleFileUpload
                  key={`upload-${item.id}`}
                  currentImage={getEditValue(item, 'image')}
                  onFileSelect={(files) => handleCentralizedUpload(item.id, files)}
                  itemId={item.id}
                  isUploading={isUploading && currentUploadingItem === item.id}
                  uploadProgress={currentUploadingItem === item.id ? uploadProgress : 0}
                />
              </div>

              {/* Title */}
              <div>
                <label style={{
                  color: '#374151',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={getEditValue(item, 'title')}
                  onChange={(e) => handleInputChange(item.id, 'title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981'
                    e.target.style.background = '#ffffff'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.background = '#f8f9fa'
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{
                  color: '#374151',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Category
                </label>
                <select
                  value={getEditValue(item, 'category')}
                  onChange={(e) => handleInputChange(item.id, 'category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981'
                    e.target.style.background = '#ffffff'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.background = '#f8f9fa'
                  }}
                >
                  <option value="paintings">Paintings</option>
                  <option value="sketches">Sketches</option>
                  <option value="digital">Digital Art</option>
                  <option value="portraits">Portraits</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label style={{
                  color: '#374151',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Description (Markdown supported)
                </label>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f8f9fa'
                }}>
                  <MDEditor
                    value={getEditValue(item, 'description')}
                    onChange={(val) => handleInputChange(item.id, 'description', val || '')}
                    preview="edit"
                    height={180}
                    data-color-mode="light"
                    visibleDragbar={false}
                    textareaProps={{
                      placeholder: 'Describe your artwork... You can use **bold**, *italic*, [links](url), and more markdown formatting!',
                      style: {
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }
                    }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => handleSaveItem(item.id)}
                disabled={!editingItems[item.id]}
                style={{
                  padding: '14px 24px',
                  background: editingItems[item.id] ? '#10b981' : '#e5e7eb',
                  color: editingItems[item.id] ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: editingItems[item.id] ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: editingItems[item.id] ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (editingItems[item.id]) {
                    e.currentTarget.style.background = '#059669'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (editingItems[item.id]) {
                    e.currentTarget.style.background = '#10b981'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)'
                  }
                }}
              >
                {editingItems[item.id] ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'portfolio':
        return renderPortfolioManagement()
      case 'account':
        return renderAccountSettings()
      default:
        return renderPortfolioManagement()
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: isMobile ? '100%' : '280px',
        maxWidth: isMobile ? '280px' : '280px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
        transform: isMobile ? (isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
        zIndex: 999
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            color: '#1a1a1a',
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontWeight: '600',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Admin Panel
          </h1>
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div style={{
          flex: 1,
          padding: isMobile ? '1rem' : '1.5rem 1rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => {
                setActiveMenu('portfolio')
                if (isMobile) setIsMobileMenuOpen(false)
              }}
              style={{
                padding: '12px 16px',
                background: activeMenu === 'portfolio' ? '#f0fdf4' : 'transparent',
                color: activeMenu === 'portfolio' ? '#15803d' : '#6b7280',
                border: activeMenu === 'portfolio' ? '1px solid #bbf7d0' : '1px solid transparent',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== 'portfolio') {
                  e.currentTarget.style.background = '#f8f9fa'
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== 'portfolio') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              <i className="fas fa-folder" style={{ fontSize: '1rem' }}></i>
              Portfolio Management
            </button>

            <button
              onClick={() => {
                setActiveMenu('account')
                if (isMobile) setIsMobileMenuOpen(false)
              }}
              style={{
                padding: '12px 16px',
                background: activeMenu === 'account' ? '#f0fdf4' : 'transparent',
                color: activeMenu === 'account' ? '#15803d' : '#6b7280',
                border: activeMenu === 'account' ? '1px solid #bbf7d0' : '1px solid transparent',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== 'account') {
                  e.currentTarget.style.background = '#f8f9fa'
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== 'account') {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              <i className="fas fa-user-cog" style={{ fontSize: '1rem' }}></i>
              Account Settings
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div style={{
          padding: isMobile ? '1rem' : '1.5rem 1rem',
          borderTop: '1px solid #f0f0f0'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fecaca'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ fontSize: '1rem' }}></i>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: isMobile ? '0' : '280px',
        flex: 1,
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? '100%' : 'auto'
      }}>
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <div style={{
            marginBottom: '1rem',
            background: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              color: '#1a1a1a',
              fontSize: '1.3rem',
              fontWeight: '600',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {activeMenu === 'portfolio' ? 'Portfolio Management' : activeMenu === 'account' ? 'Account Settings' : 'Dashboard'}
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#059669'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#10b981'
              }}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div style={{
            marginBottom: '2rem',
            background: '#ffffff',
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid #f0f0f0'
          }}>
            <h2 style={{
              color: '#1a1a1a',
              fontSize: '1.8rem',
              fontWeight: '600',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              {activeMenu === 'portfolio' ? 'Portfolio Management' : activeMenu === 'account' ? 'Account Settings' : 'Dashboard'}
            </h2>
          </div>
        )}

        {/* Dynamic Content */}
        {renderMainContent()}
      </div>
    </div>
  )
}