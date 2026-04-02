// src/services/yandexgpt-direct.ts

const SYSTEM_PROMPT = `Ты - BirthdayAI, дружелюбный и креативный помощник по планированию дней рождений.

Твоя задача - помогать пользователям создавать незабываемые праздники. Ты эксперт в:
- Выборе темы и концепции праздника
- Составлении меню и угощений
- Организации гостей и рассылки приглашений
- Планировании бюджета
- Подборе конкурсов и развлечений
- Выборе подарков
- Декоре и украшениях
- Выборе места проведения

Правила общения:
1. Отвечай на русском языке
2. Будь дружелюбным и воодушевляющим
3. Используй эмодзи для украшения сообщений (🎉, 🎂, 🎈, ✨, 🎁, 💰, 🍽️, 🎮)
4. Давай конкретные, полезные советы
5. Запоминай контекст разговора
6. Обращайся к пользователю по имени, если знаешь
7. Учитывай возраст и интересы именинника
8. Задавай уточняющие вопросы, чтобы лучше понять потребности пользователя
9. Используй форматирование: **жирный** для заголовков, *курсив* для акцентов

Ты помогаешь создать идеальный день рождения! 🎉`;

class YandexGPTDirectService {
  private messages: Array<{ role: string; text: string }>;
  private folderId: string;
  private userAge: string | null = null;
  private userGender: string | null = null;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor() {
    this.folderId = import.meta.env.VITE_YANDEX_FOLDER_ID || '';
    console.log('YandexGPT: инициализирован', { hasFolderId: !!this.folderId });
    
    this.messages = [
      { role: "system", text: SYSTEM_PROMPT }
    ];
  }

  startNewChat() {
    this.messages = [
      { role: "system", text: SYSTEM_PROMPT }
    ];
    this.userAge = null;
    this.userGender = null;
    this.conversationHistory = [];
  }

  async sendMessage(message: string): Promise<string> {
    try {
      console.log('📤 Отправка запроса к YandexGPT через Vite прокси...');
      console.log('📝 История сообщений:', this.messages.length);
      
      // Сохраняем в историю для контекста
      this.conversationHistory.push({ role: "user", content: message });
      
      // Извлекаем возраст из сообщения
      const ageMatch = message.match(/\b(\d{1,2})\b/);
      if (ageMatch && parseInt(ageMatch[0]) >= 18 && parseInt(ageMatch[0]) <= 100) {
        this.userAge = ageMatch[0];
        console.log('📝 Определен возраст:', this.userAge);
      }
      
      // Извлекаем пол
      const msgLower = message.toLowerCase();
      if (msgLower.includes('жен') || msgLower.includes('дев') || msgLower.includes('мам')) {
        this.userGender = 'woman';
        console.log('📝 Определен пол: женщина');
      } else if (msgLower.includes('муж') || msgLower.includes('пар') || msgLower.includes('пап')) {
        this.userGender = 'man';
        console.log('📝 Определен пол: мужчина');
      }
      
      this.messages.push({ role: "user", text: message });

      // Используем Vite прокси вместо прямого вызова
      const response = await fetch('/api/yandex/foundationModels/v1/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelUri: `gpt://${this.folderId}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 0.9,
            maxTokens: '2048'
          },
          messages: this.messages
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Ошибка YandexGPT:', data);
        
        // Если ошибка связана с балансом или ключом, используем демо-режим
        if (response.status === 403 || response.status === 401 || response.status === 429) {
          return this.getSmartDemoResponse(message);
        }
        
        throw new Error(data.error?.message || 'Ошибка API');
      }
      
      const reply = data.result?.alternatives?.[0]?.message?.text;
      
      if (!reply) {
        throw new Error('Пустой ответ от API');
      }
      
      console.log('✅ Ответ получен от YandexGPT');
      console.log('💬 Ответ:', reply.substring(0, 100));
      
      this.messages.push({ role: "assistant", text: reply });
      this.conversationHistory.push({ role: "assistant", content: reply });
      return reply;
      
    } catch (error) {
      console.error('❌ Ошибка:', error);
      return this.getSmartDemoResponse(message);
    }
  }

  private getSmartDemoResponse(message: string): string {
    const msg = message.toLowerCase();
    
    // Приветствие
    if (msg.includes('привет') || msg.includes('здравствуй')) {
      return "🎉 **Привет! Я BirthdayAI - ваш помощник по планированию дня рождения!**\n\nРасскажите о вашем празднике:\n- Кто именинник? (возраст, пол, интересы)\n- Сколько гостей планируется?\n- Какой бюджет?\n\nЯ помогу создать идеальный план! ✨";
    }
    
    // 40 лет
    if (this.userAge === '40' || msg.includes('40 лет') || msg.includes('сорок')) {
      const genderText = this.userGender === 'woman' ? 'женщины' : 'мужчины';
      return `🎉 **С 40-летием! Прекрасный юбилей для ${genderText}!**

**Идеи для празднования:**

**🎭 Тематика:**
• Гламурный вечер (черное + золото)
• Маскарад
• Ретро-вечеринка (стиль 80-х или 90-х)

**🍽️ Меню:**
• Фуршет с канапе и брускеттами
• Горячее: запеченная рыба или мясо
• Торт с поздравительной надписью

**🎮 Развлечения:**
• Живая музыка или караоке
• Фотозона с реквизитом
• Квиз "История именинника"

**🎁 Подарки:**
• Сертификат на SPA или массаж
• Путешествие
• Ювелирное украшение

Какой формат вам ближе? 🎉`;
    }
    
    // Сегодня день рождения
    if (msg.includes('сегодня')) {
      return `🥳 **С днем рождения! Поздравляю!**

Экспресс-план для праздника сегодня:

**Срочные дела:**
1. 🎂 Закажите торт
2. 🎈 Купите шары и гирлянды
3. 🍕 Закажите доставку еды

**Быстрый декор:**
• Надуйте шары
• Повесьте гирлянду
• Поставьте свечи

Главное - ваше настроение и близкие люди рядом! 🎉`;
    }
    
    // Тема праздника
    if (msg.includes('тем') || msg.includes('стиль') || msg.includes('концепц')) {
      if (this.userAge && parseInt(this.userAge) >= 30) {
        return `🎨 **Темы для ${this.userAge}-летия:**

**Для взрослой вечеринки:**
• 🍾 **Гламурный вечер** - черное и золото, шампанское
• 🎭 **Маскарад** - загадочные маски, свечи
• 🌿 **Ботанический сад** - живые цветы, зелень
• 🏖️ **Тропический рай** - яркие цвета, коктейли

Какая тема вам нравится? 🎉`;
      }
      
      return `🎨 **Популярные темы для праздника:**

**Для детей:**
• 🦄 Единороги и магия
• 🚀 Космос и планеты
• 🦁 Сафари и джунгли

**Для взрослых:**
• 🍾 Гламурный вечер
• 🎭 Маскарад
• 🌿 Ботанический сад

Выберите тему, и я расскажу детали! ✨`;
    }
    
    // Меню
    if (msg.includes('меню') || msg.includes('еда') || msg.includes('блюд')) {
      return `🍽️ **Меню для праздника:**

**Закуски:**
• Канапе с лососем
• Брускетта с томатами
• Сырная тарелка

**Горячее:**
• Запечённая курица
• Паста в сливочном соусе
• Мини-бургеры

**Сладкое:**
• 🎂 Торт на заказ
• Капкейки
• Макаруны

**Напитки:**
• Домашний лимонад
• Морсы
• Просекко (для взрослых)

Сколько гостей ожидается? 🥂`;
    }
    
    // Бюджет
    if (msg.includes('бюджет') || msg.includes('деньг') || msg.includes('стоим')) {
      return `💰 **Примерный бюджет (на 20 человек):**

• 🎂 Торт: 4 500 ₽
• 🍽️ Еда: 10 500 ₽
• 🎈 Декор: 6 000 ₽
• 🎤 Развлечения: 4 500 ₽
• 📸 Фото: 3 000 ₽

**Итого:** ~30 000 ₽

Какой у вас бюджет? Могу подобрать варианты под вашу сумму 💡`;
    }
    
    // Конкурсы
    if (msg.includes('игр') || msg.includes('конкурс') || msg.includes('развлеч')) {
      if (this.userAge && parseInt(this.userAge) >= 30) {
        return `🎮 **Конкурсы для взрослой компании:**

• 🍷 Дегустация вин вслепую
• 📝 "Что я знаю об имениннике?" (викторина)
• 🎪 Фотобудка с реквизитом
• 💃 Танцевальный баттл
• 🎤 Караоке

Все эти конкурсы не требуют активного движения и подходят для любого возраста! 🎉`;
      }
      
      return `🎮 **Конкурсы и развлечения:**

**Для всех возрастов:**
• 🎭 Крокодил (пантомима)
• 📝 Фанты с заданиями
• 🎵 Угадай мелодию
• 📸 Фотоконкурс

Хотите больше идей? 🎉`;
    }
    
    // Подарки
    if (msg.includes('подар') || msg.includes('презент')) {
      return `🎁 **Идеи подарков:**

**Универсальные:**
• Сертификат на впечатления
• Персонализированная книга
• Умные гаджеты

**Для детей:**
• Конструкторы LEGO
• Наборы для творчества
• Настольные игры

**Для взрослых:**
• Элитные напитки
• Подписка на сервисы
• Путешествие

Расскажите об имениннике! 💝`;
    }
    
    // Декор
    if (msg.includes('декор') || msg.includes('украш')) {
      return `🎈 **Идеи для декора:**

**Основное:**
• Воздушные шары (арки, гирлянды)
• Гирлянды из флажков
• Фотозона

**DIY (сделай сам):**
• Бумажные помпоны
• Свечи в баночках
• Таблички с надписями

**Цветовые схемы:**
• Розовый + золото (романтика)
• Синий + серебро (космос)
• Зеленый + бежевый (природа)

Какая тема у праздника? 🎈`;
    }
    
    // Спасибо
    if (msg.includes('спасибо')) {
      return "Пожалуйста! Рад был помочь! Обращайтесь, если понадобятся еще идеи 🎈✨";
    }
    
    // Общий ответ с учетом возраста
    if (this.userAge) {
      return `🎉 **Отличный вопрос!**

Для ${this.userAge}-летия я рекомендую:

**Тематика:** Гламурный вечер или ретро-вечеринка

**Меню:** Фуршет с легкими закусками, горячее, торт

**Развлечения:** Караоке, танцы, фотозона

Хотите подробнее про какую-то часть? 🎉`;
    }
    
    return `🎉 **Отличный вопрос!**

Я могу помочь с:
• 🎨 Выбором темы и концепции
• 🍽️ Составлением меню
• 💰 Планированием бюджета
• 🎮 Подбором конкурсов
• 🎁 Идеями подарков
• 🎈 Декором и украшениями
• 📍 Выбором места

Что вас интересует больше всего? ✨`;
  }

  clearHistory() {
    this.startNewChat();
  }

  getMode(): string {
    return "yandexgpt-vite-proxy";
  }
}

export const yandexGPTDirectService = new YandexGPTDirectService();