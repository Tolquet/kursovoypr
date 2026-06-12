// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route'
import { prisma } from '@/src/lib/prisma'

interface CompanyData {
  companyName: string
  inn: string
  contactPerson: string
  position: string
  phone: string
  department: string
  legalAddress: string
}

interface UserWithCompany {
  id: number
  email: string
  name: string | null
  password: string
  userType: string
  createdAt: Date
  updatedAt: Date
  company: CompanyData | null
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
      where: { email: session.user.email },
      include: {
        company: true
      }
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

    const userData = user as unknown as UserWithCompany

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name
      },
      userType: userData.userType,
      educationLevel: userData.educationLevel,
      egeScore: userData.egeScore,
      gpa: userData.gpa,
      currentClass: userData.currentClass,
      company: userData.userType === 'company' && userData.company ? {
        companyName: userData.company.companyName,
        inn: userData.company.inn,
        contactPerson: userData.company.contactPerson,
        position: userData.company.position,
        phone: userData.company.phone,
        department: userData.company.department,
        legalAddress: userData.company.legalAddress
      } : null
    })
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error)
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
