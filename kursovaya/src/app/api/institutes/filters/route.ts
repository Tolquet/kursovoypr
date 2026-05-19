// src/app/api/institutes/filters/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  try {
    // Получаем все институты для анализа
    const institutes = await prisma.institute.findMany({
      select: {
        types: true,
        location: true,
        categoryIns: true
      }
    })

    // Извлекаем уникальные значения
    const types = [...new Set(institutes.map((i) => i.types))]
    const locations = [...new Set(institutes.map((i) => i.location))]
    
    // Получаем все категории из массивов
    const allCategories = institutes.flatMap((i) => i.categoryIns)
    const categories = [...new Set(allCategories)]

    // Статистика по типам
    const typeStats = types.map((type) => ({
      type,
      count: institutes.filter((i) => i.types === type).length
    }))

    // Статистика по категориям
    const categoryStats = categories.map((category) => ({
      category,
      count: institutes.filter((i) => i.categoryIns.includes(category)).length
    }))

    // Статистика по локациям
    const locationStats = locations.map((location) => ({
      location,
      count: institutes.filter((i) => i.location === location).length
    }))

    return NextResponse.json({
      success: true,
      data: {
        types: {
          values: types,
          stats: typeStats
        },
        locations: {
          values: locations,
          stats: locationStats
        },
        categories: {
          values: categories,
          stats: categoryStats
        },
        totalCount: institutes.length
      }
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filters',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}