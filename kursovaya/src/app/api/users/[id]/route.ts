// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        company: {
          select: {
            companyName: true,
            inn: true,
            contactPerson: true,
            position: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        company: user.company
      }
    })
  } catch (error) {
    console.error('[User GET Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке пользователя' },
      { status: 500 }
    )
  }
}
