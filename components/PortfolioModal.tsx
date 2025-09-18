'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { type PortfolioItem } from './Portfolio'

interface PortfolioModalProps {
  item: PortfolioItem | null
  isOpen: boolean
  onClose: () => void
}

export default function PortfolioModal({ item, isOpen, onClose }: PortfolioModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !item) return null

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'paintings': 'Paintings',
      'sketches': 'Sketches',
      'digital': 'Digital Art',
      'portraits': 'Portraits'
    }
    return categoryMap[category] || category
  }

  return (
    <div className="portfolio-modal-overlay" onClick={onClose}>
      <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="portfolio-modal-close" onClick={onClose} aria-label="Close modal">
          <i className="fas fa-times"></i>
        </button>

        {/* Modal Content */}
        <div className="portfolio-modal-body">
          {/* Image Section */}
          <div className="portfolio-modal-image">
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={400}
              className="modal-img"
              priority
            />
          </div>

          {/* Details Section */}
          <div className="portfolio-modal-details">
            <div className="modal-category">
              {getCategoryDisplayName(item.category)}
            </div>

            <h2 className="modal-title">{item.title}</h2>

            <div className="modal-description">
              <ReactMarkdown>{item.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}