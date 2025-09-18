'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const testimonials = [
    {
      image: 'https://t4.ftcdn.net/jpg/09/75/07/11/360_F_975071103_e99E3iSot86QtdT8vRJUyTOYao83XxRB.jpg',
      rating: 5,
      text: "The portrait she created for my parents was breathtaking. Every detail felt alive, and it's now the most cherished piece in our home.",
      name: 'Sara',
      title: 'Teacher, Lahore'
    },
    {
      image: 'https://t4.ftcdn.net/jpg/04/44/74/99/360_F_444749923_B0XJTJJRUVlRQHcDeSV1eOG6JjkKdj7Q.jpg',
      rating: 5,
      text: "Her sketch of my late grandfather captured his essence so beautifully that it brought tears to our eyes. Truly priceless work.",
      name: 'Ahmed',
      title: 'Entrepreneur, Karachi'
    },
    {
      image: 'https://www.shutterstock.com/image-photo/pakistani-female-corporate-girl-portrait-260nw-2612992577.jpg',
      rating: 4.5,
      text: "The watercolor piece I commissioned for my office added so much warmth and personality. Visitors always compliment it!",
      name: 'Maria',
      title: 'Interior Designer, Islamabad'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>)
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>)
    }

    return stars
  }

  return (
    <section className="section testimonials" id="testimonials">
      <h2 className="section-title">Client Testimonials</h2>
      <div className="testimonial-slider">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`testimonial-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <Image
              src={testimonial.image}
              alt="Client"
              width={80}
              height={80}
              className="client-img"
            />
            <div className="client-rating">
              {renderStars(testimonial.rating)}
            </div>
            <p className="client-text">{testimonial.text}</p>
            <div className="client-info">
              <h4>{testimonial.name}</h4>
              <p>{testimonial.title}</p>
            </div>
          </div>
        ))}

        <div className="slider-nav">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}