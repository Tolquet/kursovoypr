// src/app/api/users/[id]/institutes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    const institutes = await prisma.institute.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      institutes
    })
  } catch (error) {
    console.error('[User Institutes GET Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке учебных заведений' },
      { status: 500 }
    )
  }
}
