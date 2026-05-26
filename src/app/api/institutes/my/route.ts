// src/app/api/institutes/my/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route'
import { prisma } from '@/src/lib/prisma'

interface UserWithUserType {
  id: number
  email: string
  name: string | null
  password: string
  userType: string
  createdAt: Date
  updatedAt: Date
}

export async function GET() {
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
          error: 'Доступно только для компаний' 
        },
        { status: 403 }
      )
    }

    // Получаем все учебные заведения пользователя
    const institutes = await prisma.institute.findMany({
      where: {
        ownerId: userData.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      institutes: institutes.map(institute => ({
        id: institute.id,
        name: institute.name,
        description: institute.description,
        image: institute.image,
        types: institute.types,
        location: institute.location,
        rating: institute.rating,
        tuition: institute.tuition,
        categoryIns: institute.categoryIns,
        createdAt: institute.createdAt.toISOString(),
        updatedAt: institute.updatedAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Ошибка при получении учебных заведений:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении данных',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
