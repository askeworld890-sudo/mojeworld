'use client'

import { useEffect, useRef } from 'react'
import ThreeBackground from './ThreeBackground'
import TypewriterEffect from './TypewriterEffect'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <section className="hero" id="home" ref={heroRef}>
      <canvas id="bg"></canvas>
      <ThreeBackground />

      <div className="hero-content">
        <TypewriterEffect />
        <p>
          Explore unique paintings and sketches crafted with passion, where every stroke tells a story.
          My art transforms blank canvases into timeless masterpieces filled with life, color, and emotion.
          From delicate pencil sketches to vibrant watercolor paintings and bold abstract creations,
          each piece is designed to inspire, connect, and bring warmth to your space.
        </p>
        <div className="cta-btns">
          <a href="#portfolio" className="cta-btn">View Collection</a>
          <a
  href="https://wa.me/923001234567?text=Hi!%20I%20just%20visited%20your%20website%20and%20I%20want%20to%20book%20a%20consultation."
  target="_blank"
  rel="noopener noreferrer"
  className="cta-btn secondary"
>
  Book Consultation
</a>

        </div>
      </div>
    </section>
  )
}