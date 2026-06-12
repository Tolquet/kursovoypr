// src/app/api/users/me/education/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route'
import { prisma } from '@/src/lib/prisma'

export async function PUT(request: NextRequest) {
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
      educationLevel, 
      egeScore, 
      gpa, 
      currentClass 
    } = body

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

    // Обновляем данные образования
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        educationLevel: educationLevel || null,
        egeScore: egeScore || null,
        gpa: gpa || null,
        currentClass: currentClass || null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        educationLevel: updatedUser.educationLevel,
        egeScore: updatedUser.egeScore,
        gpa: updatedUser.gpa,
        currentClass: updatedUser.currentClass
      }
    })
  } catch (error) {
    console.error('Error updating education:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update education data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
