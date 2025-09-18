'use client'

import { useState, useCallback } from 'react'

interface SimpleFileUploadProps {
  onFileSelect: (files: File[]) => void
  currentImage?: string
  disabled?: boolean
  itemId: number
  isUploading?: boolean
  uploadProgress?: number
}

export default function SimpleFileUpload({
  onFileSelect,
  currentImage,
  disabled = false,
  itemId,
  isUploading = false,
  uploadProgress = 0
}: SimpleFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = useCallback((selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles)

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validFiles = fileArray.filter(file => {
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Please use JPG, PNG, GIF, or WebP.`)
        return false
      }

      // Check file size (4MB limit)
      if (file.size > 4 * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum size is 4MB.`)
        return false
      }

      return true
    })

    if (validFiles.length > 0) {
      setError('')
      console.log(`SimpleFileUpload: Selecting files for item ${itemId}`)
      onFileSelect(validFiles)
    }
  }, [onFileSelect, itemId])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled || isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles, disabled, isUploading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isUploading) return

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Current Image Preview */}
      {currentImage && (
        <div style={{
          width: '100%',
          height: '120px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: '#f8f9fa',
          border: '1px solid #f0f0f0'
        }}>
          <img
            src={currentImage}
            alt="Current portfolio image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x200/f8f9fa/9ca3af?text=Image+Error'
            }}
          />
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2px dashed #10b981' : '2px dashed #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          background: dragActive ? '#f0fdf4' : disabled || isUploading ? '#f9fafb' : '#fafafa',
          cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: disabled || isUploading ? 0.6 : 1
        }}
        onClick={() => {
          if (!disabled && !isUploading) {
            document.getElementById(`file-input-${itemId}`)?.click()
          }
        }}
      >
        <input
          id={`file-input-${itemId}`}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ color: '#10b981', fontWeight: '500' }}>
              Uploading... {uploadProgress}%
            </div>
            {uploadProgress > 0 && (
              <div style={{
                width: '100%',
                maxWidth: '200px',
                height: '4px',
                background: '#e5e7eb',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: '#10b981',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-cloud-upload-alt" style={{
              fontSize: '2rem',
              color: dragActive ? '#10b981' : '#9ca3af'
            }}></i>
            <div style={{
              color: dragActive ? '#10b981' : '#6b7280',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}>
              {dragActive ? 'Drop image here' : 'Click to upload or drag & drop'}
            </div>
            <div style={{
              color: '#9ca3af',
              fontSize: '0.8rem'
            }}>
              JPG, PNG, GIF or WebP (max 4MB)
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}