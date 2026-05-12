// prisma/seed.ts - Скрипт для заполнения базы данных начальными данными
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const instituteData = [
  {
    name: 'Московский государственный университет',
    description: 'Ведущий исследовательский университет России с богатой историей и международным признанием',
    image: '/images/msu.jpg',
    types: 'university',
    location: 'Москва',
    rating: 4.8,
    tuition: 'от 350 000 ₽/год',
    categoryIns: ['исследовательский', 'государственный', 'топ-вуз', 'международный']
  },
  {
    name: 'Санкт-Петербургский политехнический университет',
    description: 'Технический университет с сильной инженерной школой и современными лабораториями',
    image: '/images/spbstu.jpg',
    types: 'university',
    location: 'Санкт-Петербург',
    rating: 4.6,
    tuition: 'от 280 000 ₽/год',
    categoryIns: ['технический', 'государственный', 'инженерный', 'научный']
  },
  {
    name: 'Финансовый университет при Правительстве РФ',
    description: 'Ведущий экономический вуз страны, специализирующийся на подготовке финансовых специалистов',
    image: '/images/fa.jpg',
    types: 'university',
    location: 'Москва',
    rating: 4.5,
    tuition: 'от 320 000 ₽/год',
    categoryIns: ['экономический', 'государственный', 'финансы', 'бизнес']
  },
  {
    name: 'Московский институт психологии',
    description: 'Специализированный институт гуманитарного направления с современными методами обучения',
    image: '/images/psychology.jpg',
    types: 'institute',
    location: 'Москва',
    rating: 4.3,
    tuition: 'от 180 000 ₽/год',
    categoryIns: ['гуманитарный', 'частный', 'психология', 'социальный']
  },
  {
    name: 'Российский экономический университет им. Г.В. Плеханова',
    description: 'Старейший экономический университет России с вековыми традициями образования',
    image: '/images/plekhanov.jpg',
    types: 'university',
    location: 'Москва',
    rating: 4.4,
    tuition: 'от 290 000 ₽/год',
    categoryIns: ['экономический', 'государственный', 'бизнес', 'торговля']
  },
  {
    name: 'Московский колледж информационных технологий',
    description: 'Современный колледж IT-специальностей с оборудованными компьютерными классами',
    image: '/images/college-it.jpg',
    types: 'college',
    location: 'Москва',
    rating: 4.2,
    tuition: 'от 120 000 ₽/год',
    categoryIns: ['технический', 'частный', 'it-специальности', 'практико-ориентированный']
  },
  {
    name: 'Академия русского балета им. А.Я. Вагановой',
    description: 'Легендарная балетная школа с мировой известностью и выдающимися выпускниками',
    image: '/images/vaganova.jpg',
    types: 'academy',
    location: 'Санкт-Петербург',
    rating: 4.9,
    tuition: 'от 200 000 ₽/год',
    categoryIns: ['творческий', 'государственный', 'искусство', 'балет']
  },
  {
    name: 'Лицей "Физтех" при МФТИ',
    description: 'Элитная школа для одаренных детей с углубленным изучением математики и физики',
    image: '/images/lyceum-phystech.jpg',
    types: 'school',
    location: 'Долгопрудный',
    rating: 4.7,
    tuition: 'от 450 000 ₽/год',
    categoryIns: ['математический', 'государственный', 'элитный', 'олимпиадный']
  },
  {
    name: 'Национальный исследовательский ядерный университет "МИФИ"',
    description: 'Ведущий технический университет в области ядерной физики и современных технологий',
    image: '/images/mephi.jpg',
    types: 'university',
    location: 'Москва',
    rating: 4.6,
    tuition: 'от 310 000 ₽/год',
    categoryIns: ['технический', 'государственный', 'исследовательский', 'ядерная-физика']
  },
  {
    name: 'Государственный университет управления',
    description: 'Университет менеджмента и управления с сильной школой государственного управления',
    image: '/images/guu.jpg',
    types: 'university',
    location: 'Москва',
    rating: 4.3,
    tuition: 'от 270 000 ₽/год',
    categoryIns: ['управленческий', 'государственный', 'менеджмент', 'администрирование']
  }
]

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Очищаем существующие данные (сначала компании, затем институты)
  await prisma.company.deleteMany()
  console.log('✅ Очистили данные компаний')

  await prisma.institute.deleteMany()
  console.log('✅ Очистили существующие данные')

  // Создаем институты
  for (const institute of instituteData) {
    await prisma.institute.create({
      data: institute
    })
  }

  console.log(`✅ Создано ${instituteData.length} учебных заведений`)
  console.log('🎉 Заполнение базы данных завершено!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })