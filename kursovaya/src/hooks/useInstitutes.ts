// src/hooks/useInstitutes.ts
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Institutes } from '@/src/widgets/CardInstitutes/types/cardIst'

// Функция для получения данных с API
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Ошибка при получении данных')
  }
  return response.json()
}

interface UseInstitutesParams {
  search?: string
  type?: string
  category?: string
  location?: string
}

export function useInstitutes(filters?: UseInstitutesParams) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Построение URL с параметрами
  const buildUrl = () => {
    const baseUrl = '/api/institutes'
    const params = new URLSearchParams()
    
    if (filters?.search) params.set('search', filters.search)
    if (filters?.type) params.set('type', filters.type)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.location) params.set('location', filters.location)
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  // Используем SWR для кэширования и автообновления
  const { data, error: swrError, isLoading: swrLoading, mutate } = useSWR(
    buildUrl(),
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
    }
  )

  // Обновляем локальные состояния на основе SWR
  useEffect(() => {
    setIsLoading(swrLoading)
    if (swrError) {
      setError(swrError.message)
    } else {
      setError(null)
    }
  }, [swrLoading, swrError])

  // Функция для принудительного обновления данных
  const refresh = () => {
    mutate()
  }

  // Функция для создания нового института
  const createInstitute = async (instituteData: Omit<Institutes, 'id'>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/institutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(instituteData),
      })

      if (!response.ok) {
        throw new Error('Ошибка при создании института')
      }

      const result = await response.json()
      
      // Обновляем кэш после создания
      mutate()
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    institutes: data?.data || [],
    totalCount: data?.count || 0,
    isLoading,
    error,
    refresh,
    createInstitute,
    hasData: data?.success === true,
  }
}

// Хук для получения фильтров
export function useInstituteFilters() {
  const { data, error, isLoading } = useSWR(
    '/api/institutes/filters',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 минут
    }
  )

  return {
    filters: data?.data || null,
    isLoading,
    error,
    hasData: data?.success === true,
  }
}