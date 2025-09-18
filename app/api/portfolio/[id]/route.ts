import { NextRequest, NextResponse } from 'next/server'
import { updatePortfolioItem, deletePortfolioItem } from '@/lib/portfolio-data'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid portfolio item ID' }, { status: 400 })
    }

    const body = await request.json()
    const { category, image, title, description } = body

    const updates: Record<string, string> = {}
    if (category) updates.category = category
    if (image) updates.image = image
    if (title) updates.title = title
    if (description) updates.description = description

    const success = await updatePortfolioItem(id, updates)

    if (!success) {
      return NextResponse.json(
        { error: 'Portfolio item not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/portfolio/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params
    const id = parseInt(idString)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid portfolio item ID' }, { status: 400 })
    }

    const success = await deletePortfolioItem(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Portfolio item not found or deletion failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/portfolio/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 })
  }
}