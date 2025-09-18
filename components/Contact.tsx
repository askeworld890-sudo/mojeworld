'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<null | 'ok' | 'err'>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || `Request failed: ${res.status}`)
      }

      setStatus('ok')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setStatus('err')
      setErrorMsg(err?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section contact" id="contact">
      <h2 className="section-title">Contact Us</h2>
      <div className="contact-container">
        <div className="contact-info">
          <h3>Get In Touch</h3>
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="contact-text">
                <h4>Location</h4>
                <p>Gujrat</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
              <div className="contact-text">
                <h4>Phone</h4>
                <p><a href="tel:+923167922418">+92 3167922418</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-text">
                <h4>Email</h4>
                {/* display a correct mailto */}
                <p><a href="mailto:moezaanam00@gmail.com">moezaanam00@gmail.com</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-clock"></i></div>
              <div className="contact-text">
                <h4>Hours</h4>
                <p>Monday - Friday: 9am - 6pm<br/>Saturday: 10am - 4pm</p>
              </div>
            </div>
          </div>

          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com/artbymoj_" className="social-link"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-link"><i className="fab fa-pinterest-p"></i></a>
            <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your Name" required
              />
            </div>

            <div className="form-group">
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Your Email" required
              />
            </div>

            <div className="form-group">
              <input
                type="text" name="subject" value={formData.subject} onChange={handleChange}
                placeholder="Subject (optional)"
              />
            </div>

            <div className="form-group">
              <textarea
                name="message" value={formData.message} onChange={handleChange}
                placeholder="Your Message" rows={5} required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending…' : 'Send Message'}
            </button>

            {status === 'ok' && (
              <p className="success" style={{ marginTop: 10, color: 'green' }}>
                Thanks! Your message has been sent.
              </p>
            )}
            {status === 'err' && (
              <p className="error" style={{ marginTop: 10, color: '#ff6b6b' }}>
                Failed to send. {errorMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
