// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route'
import { prisma } from '@/src/lib/prisma'

// Получение всех отзывов для учебного заведения
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const instituteId = searchParams.get('instituteId')
    
    if (!instituteId) {
      return NextResponse.json(
        { success: false, error: 'Необходимо указать instituteId' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { instituteId: parseInt(instituteId) },
      include: {
        user: {
          select: { id: true, name: true, email: true, userType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        userId: review.userId,
        user: {
          name: review.user.name || review.user.email?.split('@')[0] || 'Аноним',
          userType: review.user.userType
        }
      }))
    })
  } catch (error) {
    console.error('[Reviews GET Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при загрузке отзывов' },
      { status: 500 }
    )
  }
}

// Создание нового отзыва
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { instituteId, rating, comment } = body

    if (!instituteId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Укажите ID заведения и оценку' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Оценка должна быть от 1 до 5' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        reviews: { where: { instituteId: parseInt(instituteId) } }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (user.reviews.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Вы уже оставляли отзыв' },
        { status: 409 }
      )
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        instituteId: parseInt(instituteId),
        rating: parseInt(rating),
        comment: comment || null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, userType: true }
        }
      }
    })

    // Обновляем средний рейтинг
    const allReviews = await prisma.review.findMany({
      where: { instituteId: parseInt(instituteId) }
    })
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await prisma.institute.update({
      where: { id: parseInt(instituteId) },
      data: { rating: parseFloat(avgRating.toFixed(1)) }
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        userId: review.userId,
        user: {
          name: user.name || user.email.split('@')[0],
          userType: user.userType
        }
      }
    }, { status: 201 })
  } catch (error) {
    console.error('[Reviews POST Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при создании отзыва' },
      { status: 500 }
    )
  }
}

// Удаление отзыва (только владелец)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Необходимо авторизоваться' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const reviewId = searchParams.get('reviewId')

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: 'Укажите ID отзыва' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) }
    })

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Отзыв не найден' },
        { status: 404 }
      )
    }

    // Проверяем, что пользователь - владелец отзыва
    if (review.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Вы можете удалить только свой отзыв' },
        { status: 403 }
      )
    }

    const instituteId = review.instituteId

    // Удаляем отзыв
    await prisma.review.delete({
      where: { id: parseInt(reviewId) }
    })

    // Обновляем средний рейтинг
    const remainingReviews = await prisma.review.findMany({
      where: { instituteId }
    })
    
    const newRating = remainingReviews.length > 0
      ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
      : 0

    await prisma.institute.update({
      where: { id: instituteId },
      data: { rating: parseFloat(newRating.toFixed(1)) }
    })

    return NextResponse.json({
      success: true,
      message: 'Отзыв удален'
    })
  } catch (error) {
    console.error('[Reviews DELETE Error]:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при удалении отзыва' },
      { status: 500 }
    )
  }
}
