'use client'

import { useState, useEffect } from 'react'
import PortfolioFilter from './PortfolioFilter'

export interface PortfolioItem {
  id: number
  category: string
  image: string
  title: string
  description: string
}

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch('/api/portfolio')
        if (response.ok) {
          const items = await response.json()
          setPortfolioItems(items)
        } else {
          // Fallback to default items
          setPortfolioItems([
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
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching portfolio items:', error)
        // Fallback to default items
        setPortfolioItems([
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
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [])

  if (isLoading) {
    return (
      <section className="section" id="portfolio">
        <h2 className="section-title">My Portfolio</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </section>
    )
  }

  return (
    <section className="section" id="portfolio">
      <h2 className="section-title">My Portfolio</h2>

      <PortfolioFilter portfolioItems={portfolioItems} />
    </section>
  )
}