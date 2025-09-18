import fs from 'fs'
import path from 'path'

export interface PortfolioItem {
  id: number
  category: string
  image: string
  title: string
  description: string
}

// Default portfolio items
const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    category: 'paintings',
    image: 'https://as1.ftcdn.net/v2/jpg/02/73/22/74/1000_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg',
    title: 'Oil Painting',
    description: 'Rich textures and vibrant colors on canvas'
  },
  {
    id: 2,
    category: 'sketches',
    image: 'https://fullbloomclub.net/wp-content/uploads/2024/03/realisitc-drawing.jpg',
    title: 'Pencil Sketch',
    description: 'Hand-drawn details capturing raw emotion'
  },
  {
    id: 3,
    category: 'digital',
    image: 'https://wallpapercrafter.com/desktop1/500076-digital-digital-art-artwork-illustration-drawing.jpg',
    title: 'Digital Illustration',
    description: 'Modern art created with digital tools'
  },
  {
    id: 4,
    category: 'portraits',
    image: 'https://c.files.bbci.co.uk/11AF8/production/_133304427_c3400905-3742-4db3-b546-f919a4cdf24e.jpg',
    title: 'Custom Portrait',
    description: 'Personalized artwork made to order'
  },
  {
    id: 5,
    category: 'paintings',
    image: 'https://static.skillshare.com/uploads/video/thumbnails/0190cceb185ab931f9a0ae15c7566ca5/original',
    title: 'Watercolor Art',
    description: 'Soft blends and delicate brushwork'
  },
  {
    id: 6,
    category: 'sketches',
    image: 'https://blog.udemy.com/wp-content/uploads/2024/05/bigstock-Drawing-picture-of-drawing-cha-59510285.jpg',
    title: 'Charcoal Sketch',
    description: 'Bold contrasts and expressive strokes'
  }
]

// Check if we're in Vercel environment and Postgres is available
const hasPostgresConfig = process.env.POSTGRES_URL

// Local file fallback for development
const portfolioFilePath = path.join(process.cwd(), 'data', 'portfolio.json')

// Local file operations (fallback for development)
function readLocalFile(): PortfolioItem[] {
  try {
    if (fs.existsSync(portfolioFilePath)) {
      const fileContents = fs.readFileSync(portfolioFilePath, 'utf8')
      return JSON.parse(fileContents)
    }
  } catch (error) {
    console.error('Error reading local portfolio file:', error)
  }
  return defaultPortfolioItems
}

function writeLocalFile(items: PortfolioItem[]): boolean {
  try {
    // Ensure directory exists
    const dir = path.dirname(portfolioFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const data = JSON.stringify(items, null, 2)
    fs.writeFileSync(portfolioFilePath, data, 'utf8')
    return true
  } catch (error) {
    console.error('Error writing local portfolio file:', error)
    return false
  }
}

// Initialize database table
async function initializeDatabase() {
  try {
    const { sql } = await import('@vercel/postgres')

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if we have any data
    const { rows } = await sql`SELECT COUNT(*) as count FROM portfolio_items`
    const count = parseInt(rows[0].count)

    // If no data, insert defaults
    if (count === 0) {
      for (const item of defaultPortfolioItems) {
        await sql`
          INSERT INTO portfolio_items (id, category, image, title, description)
          VALUES (${item.id}, ${item.category}, ${item.image}, ${item.title}, ${item.description})
        `
      }
    }

    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  // Use Postgres in production on Vercel, local file in development
  if (hasPostgresConfig) {
    try {
      const { sql } = await import('@vercel/postgres')

      // Initialize database if needed
      await initializeDatabase()

      const { rows } = await sql`
        SELECT id, category, image, title, description
        FROM portfolio_items
        ORDER BY created_at DESC
      `

      return rows.map(row => ({
        id: row.id,
        category: row.category,
        image: row.image,
        title: row.title,
        description: row.description
      }))
    } catch (error) {
      console.error('Error reading portfolio data from Postgres:', error)
      return defaultPortfolioItems
    }
  } else {
    // Fallback to local file for development
    return readLocalFile()
  }
}

export async function savePortfolioItems(items: PortfolioItem[]): Promise<boolean> {
  // This function is not used with Postgres as we handle individual operations
  if (hasPostgresConfig) {
    return true // Individual operations handle saving
  } else {
    // Fallback to local file for development
    return writeLocalFile(items)
  }
}

export async function addPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> {
  if (hasPostgresConfig) {
    try {
      const { sql } = await import('@vercel/postgres')

      await initializeDatabase()

      const { rows } = await sql`
        INSERT INTO portfolio_items (category, image, title, description)
        VALUES (${item.category}, ${item.image}, ${item.title}, ${item.description})
        RETURNING id, category, image, title, description
      `

      return rows[0] ? {
        id: rows[0].id,
        category: rows[0].category,
        image: rows[0].image,
        title: rows[0].title,
        description: rows[0].description
      } : null
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      return null
    }
  } else {
    // Fallback to local file for development
    try {
      const items = readLocalFile()
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
      const newItem: PortfolioItem = { ...item, id: newId }

      items.unshift(newItem) // Add to beginning
      const success = writeLocalFile(items)
      return success ? newItem : null
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      return null
    }
  }
}

export async function updatePortfolioItem(id: number, updates: Partial<PortfolioItem>): Promise<boolean> {
  if (hasPostgresConfig) {
    try {
      const { sql } = await import('@vercel/postgres')

      await initializeDatabase()

      const { rowCount } = await sql`
        UPDATE portfolio_items
        SET
          category = COALESCE(${updates.category || null}, category),
          image = COALESCE(${updates.image || null}, image),
          title = COALESCE(${updates.title || null}, title),
          description = COALESCE(${updates.description || null}, description)
        WHERE id = ${id}
      `

      return (rowCount || 0) > 0
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      return false
    }
  } else {
    // Fallback to local file for development
    try {
      const items = readLocalFile()
      const index = items.findIndex(item => item.id === id)

      if (index === -1) return false

      items[index] = { ...items[index], ...updates }
      return writeLocalFile(items)
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      return false
    }
  }
}

export async function deletePortfolioItem(id: number): Promise<boolean> {
  if (hasPostgresConfig) {
    try {
      const { sql } = await import('@vercel/postgres')

      await initializeDatabase()

      const { rowCount } = await sql`
        DELETE FROM portfolio_items WHERE id = ${id}
      `

      return (rowCount || 0) > 0
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      return false
    }
  } else {
    // Fallback to local file for development
    try {
      const items = readLocalFile()
      const filteredItems = items.filter(item => item.id !== id)

      if (filteredItems.length === items.length) return false // Item not found

      return writeLocalFile(filteredItems)
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      return false
    }
  }
}