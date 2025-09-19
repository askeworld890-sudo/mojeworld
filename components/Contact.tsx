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
                <p><a href="tel:+923337922410">+92 3337922410</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <div className="contact-text">
                <h4>Email</h4>
                {/* display a correct mailto */}
                <p><a href="mailto:aksemoj@gmail.com">aksemoj@gmail.com</a></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-clock"></i></div>
              <div className="contact-text">
                <h4>Hours</h4>
                <p>Monday - Saturday: 9am - 6pm</p>
              </div>
            </div>
          </div>

          <h3>Follow Us</h3>
          <div className="social-links">
  <a href="https://www.tiktok.com/@artbymoj_?_r=1&_d=e1kc4ailek91dh&sec_uid=ms4wljabaaaadvxlyekhnaq3vxw9fhhg1rvos7uam-l525-lnvgspv7sbxegrd4bqijjclgajakt&share_author_id=6569850397774987270&sharer_language=en&source=h5_m&u_code=d0i5b24a057159&timestamp=1758288234&user_id=6569850397774987270&sec_user_id=ms4wljabaaaadvxlyekhnaq3vxw9fhhg1rvos7uam-l525-lnvgspv7sbxegrd4bqijjclgajakt&item_author_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&share_iid=7546582288286533396&share_link_id=42d51284-1e5d-4d42-94bb-9ea09ee2d2e6&share_app_id=1233&ugbiz_name=account&ug_btm=b8727%2cb7360&social_share_type=5&enable_checksum=1" className="social-link"><i className="fab fa-tiktok"></i></a>
  <a href="https://instagram.com/artbymoj_" className="social-link"><i className="fab fa-instagram"></i></a>
  <a href="https://pin.it/5ytk07S9m" className="social-link"><i className="fab fa-pinterest-p"></i></a>
  <a href="https://x.com/MoezaAnam?t=zKzE9IuID76HA2BzNCHRpw&s=09" className="social-link"><i className="fab fa-twitter"></i></a>
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
