// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

interface CompanyInput {
  contactPerson: string
  companyName: string
  inn: string
  legalAddress: string
  position: string
  phone: string
  department: string
}

interface UserWithUserTypeAndCompany {
  id: number
  email: string
  name: string | null
  password: string
  userType: string
  createdAt: Date
  updatedAt: Date
  company: {
    id: number
    userId: number
    companyName: string
    inn: string
    contactPerson: string
    position: string
    phone: string
    department: string
    legalAddress: string
    createdAt: Date
    updatedAt: Date
  } | null
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Register] Starting registration...');
    const body = await request.json()
    console.log('[Register] Body received:', { 
      email: body.email, 
      userType: body.userType,
      hasCompanyData: !!body.companyData 
    });
    
    const { email, name, password, userType, companyData } = body

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

    // Валидация типа пользователя
    const validUserTypes = ['student', 'applicant', 'school', 'company']
    if (!userType || !validUserTypes.includes(userType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Неверный тип пользователя' 
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

    // Валидация данных компании для типа company
    if (userType === 'company') {
      if (!companyData) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Данные компании обязательны для юрлиц' 
          },
          { status: 400 }
        )
      }

      const { contactPerson, companyName, inn, legalAddress, position, phone, department } = companyData

      if (!contactPerson || !companyName || !inn || !legalAddress || !position || !phone || !department) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Все поля компании обязательны для заполнения' 
          },
          { status: 400 }
        )
      }

      // Валидация ИНН (10 или 12 цифр)
      const innDigits = inn.replace(/\D/g, '')
      if (innDigits.length !== 10 && innDigits.length !== 12) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'ИНН должен содержать 10 или 12 цифр' 
          },
          { status: 400 }
        )
      }
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

    // Создание пользователя с данными компании (если применимо)
    const userData = {
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      userType
    }

    let user;

    try {
      user = await prisma.$transaction(async (tx) => {
        if (userType === 'company' && companyData) {
          // Сначала создаем пользователя с company
          const newUser = await tx.user.create({
            data: {
              ...userData,
              company: {
                create: {
                  contactPerson: companyData.contactPerson,
                  companyName: companyData.companyName,
                  inn: companyData.inn,
                  legalAddress: companyData.legalAddress,
                  position: companyData.position,
                  phone: companyData.phone,
                  department: companyData.department
                }
              }
            },
            include: {
              company: true
            }
          });
          return newUser;
        } else {
          // Для обычных пользователей
          return tx.user.create({
            data: userData
          });
        }
      });
    } catch (createError) {
      console.error('[Register] Transaction error:', createError);
      throw createError;
    }

    return NextResponse.json({
      success: true,
      message: 'Регистрация успешна',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: (user as UserWithUserTypeAndCompany).userType,
        createdAt: user.createdAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('[Register] Error:', error);
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