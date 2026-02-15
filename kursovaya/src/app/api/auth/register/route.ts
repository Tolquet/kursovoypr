// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    // Валидация обязательных полей
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email и пароль обязательны' 
        },
        { status: 400 }
      )
    }

    // Проверка валидности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Неверный формат email' 
        },
        { status: 400 }
      )
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пароль должен содержать минимум 6 символов' 
        },
        { status: 400 }
      )
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пользователь с таким email уже существует' 
        },
        { status: 400 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Регистрация успешна',
      data: user
    }, { status: 201 })
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при регистрации',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}