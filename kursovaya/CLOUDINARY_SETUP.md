# Настройка загрузки изображений

## ⚡ Быстрое решение (прямо сейчас)

**Cloudinary уже отключен!** Теперь при создании учебного заведения будут использоваться placeholder изображения. Это работает сразу, без настройки.

Чтобы проверить:
1. Откройте `/institutes/create`
2. Нажмите "Загрузить" 
3. Вместо реального изображения появится placeholder с текстом

---

## ☁️ Настройка Cloudinary (для production)

Если хотите использовать реальные изображения, следуйте инструкции ниже.

### Шаг 1: Регистрация в Cloudinary

1. Зайдите на [cloudinary.com](https://cloudinary.com/)
2. Создайте аккаунт (бесплатный тариф доступен)
3. **Важно:** Подтвердите email и активируйте аккаунт
4. После входа вы увидите **Cloud Name** на дашборде
    dffpkcdq7
### Шаг 2: Активация Cloud Name

Если видите ошибку "cloud_name is disabled":
- Проверьте, подтвердили ли email
- Зайдите в [Settings → Account](https://cloudinary.com/console/account/settings)
- Убедитесь, что аккаунт активен
- Скопируйте Cloud Name

### Шаг 3: Настройка Upload Preset

1. В панели Cloudinary: **Settings** (шестерёнка) → **Upload**
2. Прокрутите до **Upload presets**
3. Нажмите **Add upload preset**
4. Настройте:
   - **Upload preset name**: `globaledu`
   - **Signing mode**: `Unsigned` (ОБЯЗАТЕЛЬНО!)
   - **Asset folder**: `globaledu` (опционально)
   - **Generated public ID**: `Auto-generate an unguessable public ID value`
5. **Прокрутите вниз и нажмите "Save"**

**Важно:** 
- **Signing mode должен быть "Unsigned"** - иначе загрузка не будет работать
- Не забудьте нажать **Save** внизу страницы!

### Шаг 4: Добавление переменных окружения

Откройте `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ВАШ_РЕАЛЬНЫЙ_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=globaledu
```

**Важно:** Замените `your-cloud-name` на реальный Cloud Name из Cloudinary!

### Шаг 5: Перезапуск сервера

```bash
# Остановите сервер (Ctrl+C)
npm run dev
```

---

## 🔍 Проверка работы

### Если Cloudinary НЕ настроен (placeholder):
- ✅ Кнопки работают
- ✅ Появляются placeholder изображения
- ❌ Реальные изображения не загружаются

### Если Cloudinary настроен:
- ✅ Кнопки работают
- ✅ Реальные изображения загружаются
- ✅ Отображаются в превью

---

## 🛠️ Возможные ошибки

| Ошибка | Решение |
|--------|---------|
| `cloud_name is disabled` | Активируйте аккаунт Cloudinary, подтвердите email |
| `Cloudinary cloud name не настроен` | Добавьте `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` в `.env.local` |
| `Ошибка загрузки файла: 400` | Проверьте Upload Preset (должен быть Unsigned) |
| `Размер файла не должен превышать 5MB` | Уменьшите размер изображения или увеличьте лимит в коде |

---

## 🎨 Placeholder изображения

Если Cloudinary не нужен, используются такие заглушки:

- **Главное изображение**: `https://via.placeholder.com/800x400/667eea/ffffff?text=Institute+Image`
- **Баннер**: `https://via.placeholder.com/1200x300/764ba2/ffffff?text=Banner`

Можно заменить на свои статические изображения из папки `/public`.

---

*Для production обязательно настройте Cloudinary или используйте альтернативный сервис хранения изображений.*
