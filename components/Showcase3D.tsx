'use client'

export default function Showcase3D() {
  return (
    <section className="section" style={{ background: 'var(--darker2)' }}>
      <h2 className="section-title" style={{ color: 'var(--light)' }}>3D Showcase</h2>

      <div className="showcase-container">
        <div className="furniture-showcase" id="showcase1">
          <div className="furniture-side front"></div>
          <div className="furniture-side back"></div>
          <div className="furniture-side left"></div>
          <div className="furniture-side right"></div>
          <div className="furniture-side top"></div>
          <div className="furniture-side bottom"></div>
        </div>

        <div className="furniture-showcase" id="showcase2">
          <div className="furniture-side front"></div>
          <div className="furniture-side back"></div>
          <div className="furniture-side left"></div>
          <div className="furniture-side right"></div>
          <div className="furniture-side top"></div>
          <div className="furniture-side bottom"></div>
        </div>

        <div className="furniture-showcase" id="showcase3">
          <div className="furniture-side front"></div>
          <div className="furniture-side back"></div>
          <div className="furniture-side left"></div>
          <div className="furniture-side right"></div>
          <div className="furniture-side top"></div>
          <div className="furniture-side bottom"></div>
        </div>
      </div>
    </section>
  )
}
