// src/app/api/institutes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    // Построение условий фильтрации
    const where: Prisma.InstituteWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type) {
      where.types = type
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (category) {
      where.categoryIns = { has: category }
    }

    const institutes = await prisma.institute.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: institutes,
      count: institutes.length
    })
  } catch (error) {
    console.error('Error fetching institutes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch institutes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image, types, location, rating, tuition, categoryIns } = body

    // Валидация обязательных полей
    if (!name || !description || !types || !location || !tuition) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'description', 'types', 'location', 'tuition']
        },
        { status: 400 }
      )
    }

    const institute = await prisma.institute.create({
      data: {
        name,
        description,
        image,
        types,
        location,
        rating: rating || 0,
        tuition,
        categoryIns: categoryIns || []
      }
    })

    return NextResponse.json({
      success: true,
      data: institute
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating institute:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create institute',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}