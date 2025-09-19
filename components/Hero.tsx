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
       <p style={{ marginBottom: "6px" }}>
  Explore unique paintings and sketches made with heart.
  Every stroke tells a story—turning blank canvases into lively, colorful pieces.
</p>
<p style={{ marginTop: "0" }}>
  From soft pencil work to bright watercolors and bold abstracts, each artwork is created to inspire, connect, and add warmth to your space.
</p>

        <div className="cta-btns">
          <a href="#portfolio" className="cta-btn">View Collection</a>
          <a
  href="https://wa.me/923337922410?text=Hi!%20I%20just%20visited%20your%20website%20and%20I%20want%20to%20book%20a%20order."
  target="_blank"
  rel="noopener noreferrer"
  className="cta-btn secondary"
>
  Book Order
</a>

        </div>
      </div>
    </section>
  )
}