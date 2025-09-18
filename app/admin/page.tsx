'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get stored credentials or use defaults
    const storedUsername = localStorage.getItem('adminUsername') || 'admin'
    const storedPassword = localStorage.getItem('adminPassword') || '12345'

    if (credentials.username === storedUsername && credentials.password === storedPassword) {
      // Set authentication flag and login time in localStorage
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())
      router.push('/admin/dashboard')
    } else {
      setError('Invalid username or password')
    }

    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--primary)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(28, 28, 61, 0.9)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '3rem',
        border: '2px solid rgba(205, 193, 255, 0.3)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          color: 'var(--light)',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Admin Login
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid rgba(205, 193, 255, 0.4)',
                borderRadius: '10px',
                color: 'var(--secondary2)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid var(--primary)'
                e.target.style.boxShadow = '0 0 0 3px rgba(205, 193, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(205, 193, 255, 0.4)'
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid rgba(205, 193, 255, 0.4)',
                borderRadius: '10px',
                color: 'var(--secondary2)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onFocus={(e) => {
                e.target.style.border = '2px solid var(--primary)'
                e.target.style.boxShadow = '0 0 0 3px rgba(205, 193, 255, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.border = '2px solid rgba(205, 193, 255, 0.4)'
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#ff4757',
              background: 'rgba(255, 71, 87, 0.1)',
              border: '1px solid rgba(255, 71, 87, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 30px',
              background: isLoading ? 'rgba(28, 28, 61, 0.8)' : 'linear-gradient(135deg, var(--secondary2), var(--primary1))',
              color: 'var(--light)',
              border: '2px solid rgba(205, 193, 255, 0.3)',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: isLoading ? 'none' : '0 4px 15px rgba(95, 39, 205, 0.3)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px)'
                target.style.boxShadow = '0 6px 20px rgba(95, 39, 205, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0)'
                target.style.boxShadow = '0 4px 15px rgba(95, 39, 205, 0.3)'
              }
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}