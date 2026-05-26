// src/app/api/institutes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route'
import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

interface UserWithUserType {
  id: number
  email: string
  name: string | null
  password: string
  userType: string
  createdAt: Date
  updatedAt: Date
}

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
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Неавторизованный доступ' 
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      image, 
      banner,
      website,
      types, 
      location, 
      city,
      rating, 
      tuition, 
      minTuition,
      maxTuition,
      categoryIns 
    } = body

    // Валидация обязательных полей
    if (!name || !description || !types || !location) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'description', 'types', 'location']
        },
        { status: 400 }
      )
    }

    // Валидация website если предоставлен
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Неверный формат URL. Используйте https:// или http://'
        },
        { status: 400 }
      )
    }

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пользователь не найден' 
        },
        { status: 404 }
      )
    }

    const userData = user as unknown as UserWithUserType

    // Проверяем, что пользователь - компания
    if (userData.userType !== 'company') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Создание учебных заведений доступно только для компаний' 
        },
        { status: 403 }
      )
    }

    const institute = await prisma.institute.create({
      data: {
        name,
        description,
        image,
        banner,
        website,
        types,
        location,
        city,
        rating: rating || 0,
        tuition: tuition || '',
        minTuition: minTuition || null,
        maxTuition: maxTuition || null,
        categoryIns: categoryIns || [],
        ownerId: userData.id
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