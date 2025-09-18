import { NextRequest, NextResponse } from 'next/server'
import { getPortfolioItems, addPortfolioItem, type PortfolioItem } from '@/lib/portfolio-data'

export async function GET() {
  try {
    const items = await getPortfolioItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/portfolio error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, image, title, description } = body

    if (!category || !image || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newItem = await addPortfolioItem({ category, image, title, description })

    if (!newItem) {
      return NextResponse.json(
        { error: 'Failed to create portfolio item' },
        { status: 500 }
      )
    }

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('POST /api/portfolio error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 })
  }
}