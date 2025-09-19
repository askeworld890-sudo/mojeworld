'use client'

export default function About() {
  return (
    <section className="section" id="about">
      <h2 className="section-title">About Aksemoj</h2>
      <div className="about-content">
        <div className="about-text">
          <h3 style={{ color: 'var(--dark2)' }}>Redefining Art & Creativity Since 2010</h3>
          <p style={{ color: 'var(--dark2)', fontWeight: 'bold' }}>
            Hello, I'm Moj. My journey as an artist began not in a studio, but within the vibrant culture and traditions of my family. 
            As a student and an internee navigating the demands of modern life, art has always been my sanctuary and my voice. 
            'Aks-e-Moj'—the reflection of a wave—is my brand, but it's also my philosophy: to capture the fleeting moments of beauty, 
            emotion, and identity in a world that is constantly in motion. Each piece, whether it's a flowing line of calligraphy or a 
            faceless portrait full of silent emotion, is a part of my story, and I'm thrilled to share it with you.
          </p>
          <p style={{ color: 'var(--dark2)', fontWeight: 'bold' }}>
            Every artwork is carefully crafted with passion, blending traditional techniques with modern creativity.
            From pencil sketches to vibrant paintings, I believe in art that inspires, connects, and lasts for generations.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <div className="stat-number" style={{ color: 'var(--dark2)' }}>15+</div>
              <div className="stat-text" style={{ color: 'var(--dark2)', fontWeight: 'bold' }}>Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" style={{ color: 'var(--dark2)' }}>500+</div>
              <div className="stat-text" style={{ color: 'var(--dark2)', fontWeight: 'bold' }}>Happy Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" style={{ color: 'var(--dark2)' }}>50+</div>
              <div className="stat-text" style={{ color: 'var(--dark2)', fontWeight: 'bold' }}>Design Awards</div>
            </div>
          </div>
        </div>
        <div className="about-image">
          <div className="furniture-3d"></div>
        </div>
      </div>
    </section>
  )
}