'use client'

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.getAttribute('href')
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <footer>
      <a href="#" className="footer-logo">
        Moj<span>E</span>World
      </a>
      <div className="footer-links">
        <a href="#home" onClick={handleNavClick}>Home</a>
        <a href="#about" onClick={handleNavClick}>About</a>
        <a href="#services" onClick={handleNavClick}>Services</a>
        <a href="#portfolio" onClick={handleNavClick}>Portfolio</a>
        <a href="#testimonials" onClick={handleNavClick}>Testimonials</a>
        <a href="#contact" onClick={handleNavClick}>Contact</a>
      </div>
      <div className="footer-social">
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="https://instagram.com/artbymoj_"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-pinterest-p"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="/admin" title="Admin"><i className="fas fa-user-shield"></i></a>
      </div>
      <p className="copyright">&copy; 2025 moj.E.world. All Rights Reserved.</p>
    </footer>
  )
}