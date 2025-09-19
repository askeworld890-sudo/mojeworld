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
        Aks<span>E</span>Moj
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
        <a href="https://www.tiktok.com/@artbymoj_?_r=1&_d=e1kc4ailek91dh&sec_uid=ms4wljabaaaadvxlyekhnaq3vxw9fhhg1rvos7uam-l525-lnvgspv7sbxegrd4bqijjclgajakt&share_author_id=6569850397774987270&sharer_language=en&source=h5_m&u_code=d0i5b24a057159&timestamp=1758288234&user_id=6569850397774987270&sec_user_id=ms4wljabaaaadvxlyekhnaq3vxw9fhhg1rvos7uam-l525-lnvgspv7sbxegrd4bqijjclgajakt&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7546582288286533396&share_link_id=42d51284-1e5d-4d42-94bb-9ea09ee2d2e6&share_app_id=1233&ugbiz_name=account&ug_btm=b8727%2cb7360&social_share_type=5&enable_checksum=1" className="social-link"><i className="fab fa-tiktok"></i></a>
        <a href="https://instagram.com/artbymoj_"><i className="fab fa-instagram"></i></a>
        <a href="https://pin.it/5ytk07S9m"><i className="fab fa-pinterest-p"></i></a>
        <a href="https://x.com/MoezaAnam?t=zKzE9IuID76HA2BzNCHRpw&s=09"><i className="fab fa-twitter"></i></a>
        <a href="/admin" title="Admin"><i className="fas fa-user-shield"></i></a>
      </div>
      <p className="copyright">&copy; 2025 moj.E.world. All Rights Reserved.</p>
    </footer>
  )
}