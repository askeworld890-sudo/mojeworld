'use client'

import { useState } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import PortfolioModal from './PortfolioModal'
import { type PortfolioItem } from './Portfolio'

interface PortfolioFilterProps {
  portfolioItems: PortfolioItem[]
}

export default function PortfolioFilter({ portfolioItems }: PortfolioFilterProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'paintings', label: 'Calligraphy' },
    { key: 'sketches', label: 'Landscape' },
    { key: 'digital', label: 'Wedding art / Thread art' },
    { key: 'portraits', label: 'Faceless portraits' }
  ]

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter)

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 6)
  const hasMoreItems = filteredItems.length > 6

  const openModal = (item: PortfolioItem) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <>
      <div className="portfolio-filter">
        {filters.map(filter => (
          <button
            key={filter.key}
            className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={`portfolio-container ${showAll ? 'expanded' : ''}`}>
        <div className="portfolio-grid">
          {displayedItems.map((item) => (
            <div key={item.id} className="portfolio-item" data-category={item.category}>
              <Image
                src={item.image}
                alt={item.title}
                width={350}
                height={250}
                className="portfolio-img"
              />
              <div className="portfolio-overlay">
                <h3>{item.title}</h3>
                <div className="portfolio-description-preview">
                  {truncateText(item.description.replace(/[#*`\[\]]/g, ''))}
                </div>
                <button
                  className="view-btn"
                  onClick={() => openModal(item)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {hasMoreItems && (
        <div className="portfolio-toggle">
          <button
            className="toggle-view-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

      <PortfolioModal
        item={selectedItem}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </>
  )
}