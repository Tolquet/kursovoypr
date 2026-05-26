'use client';

import { useState } from 'react';
import styles from './styles/contact.module.scss';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openFaqItem, setOpenFaqItem] = useState<number | null>(null);

  const faqData = [
    {
      question: 'Как добавить учебное заведение?',
      answer: 'Для добавления учебного заведения вам необходимо зарегистрироваться как компания. После авторизации перейдите в профиль и нажмите кнопку "Добавить учебное заведение". Заполните форму, указав название, описание, тип заведения, локацию, стоимость обучения и категории. Вы также можете загрузить изображения и баннер. После сохранения заведение появится в общей базе.'
    },
    {
      question: 'Как оставить отзыв?',
      answer: 'Чтобы оставить отзыв об учебном заведении, найдите его в каталоге и откройте детальную информацию. В нижней части страницы находится раздел "Отзывы и оценки". Выберите оценку от 1 до 5 звёзд, optionally напишите комментарий и нажмите "Отправить отзыв". Каждый пользователь может оставить только один отзыв на каждое заведение.'
    },
    {
      question: 'Как пройти профориентационный тест?',
      answer: 'Зарегистрируйтесь на платформе и перейдите в раздел "Профиль" → "Тесты". Вам доступны 6 профориентационных тестов: Тип личности (MBTI), Тест Холланда, Оценка навыков, Ценностные ориентации, Логическое мышление и Творческий потенциал. Выберите интересующий тест, нажмите "Начать тест" и ответьте на все вопросы. Результаты сохранятся в разделе "Результаты".'
    },
    {
      question: 'Техническая поддержка',
      answer: 'Если вы столкнулись с техническими проблемами, вы можете связаться с нашей службой поддержки через форму обратной связи на этой странице. Укажите в теме "Техническая поддержка" и подробно опишите проблему. Мы отвечаем в течение 24 часов. Также вы можете написать нам на email: info@globaledu.ru или позвонить по телефону +7 (800) 123-45-67 (Пн-Пт: 9:00 - 18:00).'
    },
    {
      question: 'Как зарегистрироваться?',
      answer: 'Нажмите кнопку "Регистрация" в верхнем меню. Выберите ваш тип пользователя: Студент, Абитуриент, Школьник или Компания. Заполните обязательные поля: email и пароль. Для компаний дополнительно необходимо указать название организации, ИНН, контактное лицо, должность, телефон и юридический адрес. После заполнения нажмите "Зарегистрироваться" и перейдите на страницу входа.'
    },
    {
      question: 'Как искать учебные заведения?',
      answer: 'Перейдите на страницу "Поиск" (Finder). Используйте фильтры для уточнения поиска: выберите тип заведения (университет, колледж, школа и т.д.), категории обучения (гуманитарный, технический, IT-специальности и др.), город и диапазон стоимости обучения. Также можно ввести поисковый запрос по названию или описанию. Все результаты автоматически обновляются при изменении фильтров.'
    }
  ];

  const toggleFaqItem = (index: number) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Здесь будет отправка формы на сервер
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={styles.contact_page}>
      {/* Hero Section */}
      <section className={styles.contact_hero}>
        <div className={styles.hero_background}>
          <div className={styles.hero_gradient}></div>
        </div>
        <div className={styles.hero_content}>
          <h1 className={styles.hero_title}>Свяжитесь с нами</h1>
          <p className={styles.hero_subtitle}>
            Мы всегда рады ответить на ваши вопросы и помочь в выборе учебного заведения
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.contact_main}>
        <div className={styles.container}>
          <div className={styles.contact_grid}>
            {/* Contact Form */}
            <div className={styles.contact_form_section}>
              <div className={styles.form_card}>
                <div className={styles.form_header}>
                  <h2 className={styles.form_title}>Напишите нам</h2>
                  <p className={styles.form_subtitle}>
                    Заполните форму ниже и мы свяжемся с вами в ближайшее время
                  </p>
                </div>

                {submitSuccess && (
                  <div className={styles.success_message}>
                    <span className={styles.success_icon}>✓</span>
                    <span>Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.form_group}>
                    <label htmlFor="name" className={styles.form_label}>
                      Ваше имя
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Иван Иванов"
                      required
                      className={styles.form_input}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="email" className={styles.form_label}>
                      Email
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className={styles.form_input}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="subject" className={styles.form_label}>
                      Тема
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Вопрос о поступлении"
                      required
                      className={styles.form_input}
                    />
                  </div>

                  <div className={styles.form_group}>
                    <label htmlFor="message" className={styles.form_label}>
                      Сообщение
                      <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Опишите ваш вопрос подробно..."
                      rows={6}
                      required
                      className={styles.form_textarea}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submit_button}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={styles.spinner}></span>
                        Отправка...
                      </>
                    ) : (
                      <>
                        <span>Отправить сообщение</span>
                        <span className={styles.button_arrow}>→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className={styles.contact_info_section}>
              <div className={styles.info_card}>
                <h2 className={styles.info_title}>Контактная информация</h2>
                <p className={styles.info_subtitle}>
                  Выберите удобный способ связи
                </p>

                <div className={styles.info_items}>
                  <div className={styles.info_item}>
                    <div className={styles.info_icon}>
                      <span className={styles.icon_bg}>📧</span>
                    </div>
                    <div className={styles.info_content}>
                      <h3 className={styles.info_label}>Email</h3>
                      <a href="mailto:info@globaledu.ru" className={styles.info_value}>
                        info@globaledu.ru
                      </a>
                      <p className={styles.info_desc}>
                        Ответим в течение 24 часов
                      </p>
                    </div>
                  </div>

                  <div className={styles.info_item}>
                    <div className={styles.info_icon}>
                      <span className={styles.icon_bg}>📱</span>
                    </div>
                    <div className={styles.info_content}>
                      <h3 className={styles.info_label}>Телефон</h3>
                      <a href="tel:+78001234567" className={styles.info_value}>
                        +7 (800) 123-45-67
                      </a>
                      <p className={styles.info_desc}>
                        Пн-Пт: 9:00 - 18:00
                      </p>
                    </div>
                  </div>

                  <div className={styles.info_item}>
                    <div className={styles.info_icon}>
                      <span className={styles.icon_bg}>📍</span>
                    </div>
                    <div className={styles.info_content}>
                      <h3 className={styles.info_label}>Адрес</h3>
                      <p className={styles.info_value}>
                        г. Москва, ул. Примерная, д. 1
                      </p>
                      <p className={styles.info_desc}>
                        Офис 305
                      </p>
                    </div>
                  </div>

                  <div className={styles.info_item}>
                    <div className={styles.info_icon}>
                      <span className={styles.icon_bg}>💬</span>
                    </div>
                    <div className={styles.info_content}>
                      <h3 className={styles.info_label}>Социальные сети</h3>
                      <div className={styles.social_links}>
                        <a href="#" className={styles.social_link}>
                          Telegram
                        </a>
                        <a href="#" className={styles.social_link}>
                          VKontakte
                        </a>
                        <a href="#" className={styles.social_link}>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className={styles.faq_card}>
                <h3 className={styles.faq_title}>Частые вопросы</h3>
                <div className={styles.faq_list}>
                  {faqData.map((faq, index) => (
                    <div key={index} className={styles.faq_item_wrapper}>
                      <button
                        className={styles.faq_item}
                        onClick={() => toggleFaqItem(index)}
                        aria-expanded={openFaqItem === index}
                      >
                        <span className={styles.faq_question}>{faq.question}</span>
                        <span className={`${styles.faq_arrow} ${openFaqItem === index ? styles.open : ''}`}>
                          ↓
                        </span>
                      </button>
                      <div 
                        className={`${styles.faq_answer} ${openFaqItem === index ? styles.open : ''}`}
                      >
                        <div className={styles.faq_answer_content}>
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.map_section}>
        <div className={styles.map_container}>
          <div className={styles.map_card}>
            <div className={styles.map_placeholder}>
              <div className={styles.map_icon}>🗺️</div>
              <h3>Наш офис</h3>
              <p>г. Ульяновск ул. Хрустальная 7</p>
              <a href="https://yandex.ru/maps" target="_blank" rel="noopener noreferrer" className={styles.map_link}>
                Открыть в картах
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
