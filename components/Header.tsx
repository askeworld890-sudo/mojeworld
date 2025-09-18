'use client'

import { useEffect, useState } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.getAttribute('href')
    if (targetId) {
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth'
        })
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <a href="/" className="logo">
  <img src="/images/image12.webp" alt="moj._.world logo" className="logo-img" />
  moj._.world
</a>

      <div className="menu-toggle" onClick={handleMobileMenuToggle}>
        <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>
      <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <li><a href="#home" onClick={handleNavClick}>Home</a></li>
        <li><a href="#portfolio" onClick={handleNavClick}>Portfolio</a></li>
        <li><a href="#about" onClick={handleNavClick}>About</a></li>
        <li><a href="#services" onClick={handleNavClick}>Services</a></li>
        <li><a href="#testimonials" onClick={handleNavClick}>Testimonials</a></li>
        <li><a href="#contact" onClick={handleNavClick}>Contact</a></li>
      </ul>
    </header>
  )
}