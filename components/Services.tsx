'use client'

import { useEffect } from 'react'

export default function Services() {
  const services = [
    {
      variant: "1",
      icon: "fas fa-feather-alt",
      title: "Calligraphy",
      description: "Personalized artworks created just for you — portraits, landscapes, or abstract pieces to match your vision."
    },
    {
      variant: "2",
      icon: "fas fa-user-secret",
      title: "Faceless Portraits",
      description: "Detailed pencil and charcoal sketches, perfect for gifts, memories, or adding character to your space."
    },
    {
      variant: "3",
      icon: "fas fa-mountain",
      title: "Landscape",
      description: "Modern digital artworks and illustrations for social media, branding, or personal collections."
    },
    {
      variant: "4",
      icon: "fas fa-infinity",
      title: "Thread art",
      description: "Interactive sessions where I teach painting and sketching techniques to beginners and enthusiasts."
    },
    {
      variant: "5",
      icon: "fas fa-gift",
      title: "Event Gifts",
      description: "Unique, handmade art pieces crafted as meaningful gifts for special occasions."
    },
    {
      variant: "6",
      icon: "fas fa-paint-brush",
      title: "Painting",
      description: "Collaborations and commissioned projects for exhibitions, catalogues, and interior decoration."
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