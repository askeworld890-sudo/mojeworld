'use client'

import { useEffect } from 'react'

export default function Services() {
  const services = [
    {
      variant: "1",
      icon: "fas fa-feather-alt",
      title: "Calligraphy",
      description: "Experience the divine harmony of scripture and artistry with our bespoke Arabic calligraphy. Each piece is meticulously crafted to bring timeless elegance and spiritual grace into your space."
    },
    {
      variant: "2",
      icon: "fas fa-user-secret",
      title: "Faceless Portraits",
      description: "Capture the essence of a cherished memory with a modern, minimalist faceless portrait. We focus on form and emotion to create a profoundly personal and stylish piece of art."
    },
    {
      variant: "3",
      icon: "fas fa-mountain",
      title: "Landscape",
      description: "Journey to breathtaking serene sceneries through our collection of landscape paintings. Own a piece of the world's beauty, captured on canvas with passion and intricate detail."
    },
    {
      variant: "4",
      icon: "fas fa-infinity",
      title: "Thread art",
      description: "Discover art that engages the senses with unique texture and depth. Our custom thread art weaves traditional craft into sophisticated masterpieces for your walls."
    },
    {
      variant: "5",
      icon: "fas fa-gift",
      title: "Event Gifts",
      description: "Give a gift that transcends the ordinary and lasts a lifetime for any special occasion. Commission a bespoke work of art to celebrate weddings, anniversaries, and milestones in a truly memorable way"
    },
    {
      variant: "6",
      icon: "fas fa-paint-brush",
      title: "Painting",
      description: "Explore a curated collection of original paintings or commission a custom piece to bring your vision to life. We specialize in fine art that elevates interiors and tells a unique story."
    }
  ]

  useEffect(() => {
    const cards = document.querySelectorAll('.service-card')

    const handleMouseMove = (e: Event, card: Element) => {
      const mouseEvent = e as MouseEvent
      const r = card.getBoundingClientRect()
      const x = ((mouseEvent.clientX - r.left) / r.width) * 100
      const y = ((mouseEvent.clientY - r.top) / r.height) * 100
      ;(card as HTMLElement).style.setProperty('--x', x + '%')
      ;(card as HTMLElement).style.setProperty('--y', y + '%')
    }

    const handleMouseLeave = (card: Element) => {
      ;(card as HTMLElement).style.removeProperty('--x')
      ;(card as HTMLElement).style.removeProperty('--y')
    }

    const eventHandlers = new Map()

    cards.forEach(card => {
      const mouseMoveHandler = (e: Event) => handleMouseMove(e, card)
      const mouseLeaveHandler = () => handleMouseLeave(card)

      eventHandlers.set(card, { mouseMoveHandler, mouseLeaveHandler })

      card.addEventListener('mousemove', mouseMoveHandler)
      card.addEventListener('mouseleave', mouseLeaveHandler)
    })

    return () => {
      cards.forEach(card => {
        const handlers = eventHandlers.get(card)
        if (handlers) {
          card.removeEventListener('mousemove', handlers.mouseMoveHandler)
          card.removeEventListener('mouseleave', handlers.mouseLeaveHandler)
        }
      })
    }
  }, [])

  return (
    <section className="section services" id="services">
      <h2 className="section-title" style={{ color: 'var(--light2)' }}>My Services</h2>
      <div className="services-container">
        {services.map((service, index) => (
          <div key={index} className="service-card" data-variant={service.variant}>
            <div className="service-icon">
              <i className={service.icon}></i>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}