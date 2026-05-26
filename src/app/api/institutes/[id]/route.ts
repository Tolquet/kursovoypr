// src/app/api/institutes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route'
import { prisma } from '@/src/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

// Получение конкретного института
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    const institute = await prisma.institute.findUnique({
      where: { id: parseInt(id) }
    })

    if (!institute) {
      return NextResponse.json(
        { success: false, error: 'Учебное заведение не найдено' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      institute
    })
  } catch (error) {
    console.error('[Institute GET Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке' },
      { status: 500 }
    )
  }
}

// Обновление института (только владелец)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }

    const { id } = await params
    const instituteId = parseInt(id)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Проверяем, что пользователь - владелец
    const institute = await prisma.institute.findUnique({
      where: { id: instituteId }
    })

    if (!institute) {
      return NextResponse.json(
        { success: false, error: 'Учебное заведение не найдено' },
        { status: 404 }
      )
    }

    if (institute.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Только владелец может редактировать' },
        { status: 403 }
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
      tuition,
      minTuition,
      maxTuition,
      categoryIns
    } = body

    const updatedInstitute = await prisma.institute.update({
      where: { id: instituteId },
      data: {
        name: name || institute.name,
        description: description || institute.description,
        image: image !== undefined ? image : institute.image,
        banner: banner !== undefined ? banner : institute.banner,
        website: website !== undefined ? website : institute.website,
        types: types || institute.types,
        location: location || institute.location,
        city: city || institute.city,
        tuition: tuition || institute.tuition,
        minTuition: minTuition !== undefined ? minTuition : institute.minTuition,
        maxTuition: maxTuition !== undefined ? maxTuition : institute.maxTuition,
        categoryIns: categoryIns || institute.categoryIns
      }
    })

    return NextResponse.json({
      success: true,
      institute: updatedInstitute
    })
  } catch (error) {
    console.error('[Institute PUT Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при обновлении' },
      { status: 500 }
    )
  }
}

// Удаление института (только владелец)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }

    const { id } = await params
    const instituteId = parseInt(id)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    const institute = await prisma.institute.findUnique({
      where: { id: instituteId }
    })

    if (!institute) {
      return NextResponse.json(
        { success: false, error: 'Учебное заведение не найдено' },
        { status: 404 }
      )
    }

    if (institute.ownerId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Только владелец может удалять' },
        { status: 403 }
      )
    }

    await prisma.institute.delete({
      where: { id: instituteId }
    })

    return NextResponse.json({
      success: true,
      message: 'Учебное заведение удалено'
    })
  } catch (error) {
    console.error('[Institute DELETE Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при удалении' },
      { status: 500 }
    )
  }
}
