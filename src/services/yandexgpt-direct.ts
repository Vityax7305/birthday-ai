type PlannerActions = {
  addGuest: (name: string, email?: string) => void;
  addTask: (title: string, category: string) => void;
  addExpense: (title: string, amount: number, category: string) => void;
  getState: () => { guestsCount: number; tasksCount: number; expensesTotal: number };
};

let globalPlannerActions: PlannerActions | null = null;

export function setPlannerActions(actions: PlannerActions) {
  globalPlannerActions = actions;
}

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

ВАЖНО: Ты можешь автоматически добавлять данные в планировщик!
Когда пользователь сообщает информацию, ты должен:
1. Добавлять гостей в список, когда пользователь называет имена
2. Добавлять задачи, когда обсуждаются дела (заказать торт, купить декор и т.д.)
3. Добавлять расходы, когда называется сумма

Формат для добавления в планировщик (используй в ответе):
[ADD_GUEST: Имя гостя]
[ADD_TASK: Название задачи|Категория]
[ADD_EXPENSE: Название|Сумма|Категория]

Правила общения:
1. Отвечай на русском языке
2. Будь дружелюбным и воодушевляющим
3. Используй эмодзи
4. Давай конкретные, полезные советы

Ты помогаешь создать идеальный день рождения! 🎉`;

class YandexGPTDirectService {
  private messages: Array<{ role: string; text: string }>;
  private folderId: string;

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
  }

  private processPlannerCommands(response: string): string {
    if (!globalPlannerActions) return response;
    
    let processedResponse = response;
    
    // Обработка добавления гостя
    const guestRegex = /\[ADD_GUEST:\s*([^|\]]+)(?:\|([^\]]+))?\]/g;
    let match;
    while ((match = guestRegex.exec(response)) !== null) {
      const name = match[1].trim();
      const email = match[2]?.trim();
      globalPlannerActions.addGuest(name, email);
      processedResponse = processedResponse.replace(match[0], `✅ Гость "${name}" добавлен в планировщик`);
    }
    
    // Обработка добавления задачи
    const taskRegex = /\[ADD_TASK:\s*([^|]+)\|([^\]]+)\]/g;
    while ((match = taskRegex.exec(response)) !== null) {
      const title = match[1].trim();
      const category = match[2].trim();
      globalPlannerActions.addTask(title, category);
      processedResponse = processedResponse.replace(match[0], `✅ Задача "${title}" добавлена в планировщик`);
    }
    
    // Обработка добавления расхода
    const expenseRegex = /\[ADD_EXPENSE:\s*([^|]+)\|(\d+(?:\.\d+)?)\|([^\]]+)\]/g;
    while ((match = expenseRegex.exec(response)) !== null) {
      const title = match[1].trim();
      const amount = parseFloat(match[2]);
      const category = match[3].trim();
      globalPlannerActions.addExpense(title, amount, category);
      processedResponse = processedResponse.replace(match[0], `✅ Расход "${title}" (${amount} ₽) добавлен в планировщик`);
    }
    
    return processedResponse;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      console.log('📤 Отправка запроса к YandexGPT...');
      
      this.messages.push({ role: "user", text: message });

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
        return this.getSmartDemoResponse(message);
      }
      
      let reply = data.result?.alternatives?.[0]?.message?.text;
      
      if (!reply) {
        throw new Error('Пустой ответ от API');
      }
      
      // Обрабатываем команды для планировщика
      reply = this.processPlannerCommands(reply);
      
      console.log('✅ Ответ получен от YandexGPT');
      
      this.messages.push({ role: "assistant", text: reply });
      return reply;
      
    } catch (error) {
      console.error('❌ Ошибка:', error);
      return this.getSmartDemoResponse(message);
    }
  }

  private getSmartDemoResponse(message: string): string {
    const msg = message.toLowerCase();
    
    // Добавление гостей
    if (msg.includes('гость') || msg.includes('пригласить')) {
      const nameMatch = message.match(/[А-Яа-я]+\s+[А-Яа-я]+/);
      if (nameMatch && globalPlannerActions) {
        globalPlannerActions.addGuest(nameMatch[0]);
        return `✅ Гость "${nameMatch[0]}" добавлен в планировщик! 🎉\n\nКого еще пригласить?`;
      }
      return `📝 Напишите имя гостя, и я добавлю его в список приглашенных. Например: "Пригласи Анну Петрову"`;
    }
    
    // Добавление задачи
    if (msg.includes('заказать') || msg.includes('купить') || msg.includes('сделать')) {
      if (globalPlannerActions) {
        let task = '';
        let category = 'Другое';
        if (msg.includes('торт')) { task = 'Заказать торт'; category = 'Еда'; }
        else if (msg.includes('декор') || msg.includes('шары')) { task = 'Купить украшения'; category = 'Декор'; }
        else if (msg.includes('музык') || msg.includes('плейлист')) { task = 'Подобрать музыку'; category = 'Развлечения'; }
        else if (msg.includes('фото')) { task = 'Пригласить фотографа'; category = 'Фото'; }
        else { task = message.slice(0, 50); }
        
        globalPlannerActions.addTask(task, category);
        return `✅ Задача "${task}" добавлена в планировщик! 📋\n\nЧто еще нужно сделать?`;
      }
    }
    
    // Добавление расхода
    if (msg.includes('бюджет') || msg.includes('руб') || msg.includes('стоит')) {
      const amountMatch = message.match(/\d+(?:[\s]?\d*)/);
      if (amountMatch && globalPlannerActions) {
        const amount = parseInt(amountMatch[0].replace(/\s/g, ''));
        let title = 'Расход';
        let category = 'Другое';
        if (msg.includes('торт')) { title = 'Торт'; category = 'Еда'; }
        else if (msg.includes('декор')) { title = 'Декор'; category = 'Декор'; }
        else if (msg.includes('аниматор')) { title = 'Аниматор'; category = 'Развлечения'; }
        
        globalPlannerActions.addExpense(title, amount, category);
        return `✅ Расход "${title}" на сумму ${amount} ₽ добавлен в планировщик! 💰\n\nКакой еще бюджет запланировать?`;
      }
      return `💰 Напишите сумму и статью расхода, например: "Торт стоит 3500 рублей"`;
    }
    
    // Показать статистику
    if (msg.includes('планировщик') || msg.includes('список') || msg.includes('что добавили')) {
      if (globalPlannerActions) {
        const state = globalPlannerActions.getState();
        return `📊 **Текущее состояние планировщика:**

👥 Гостей: ${state.guestsCount}
📋 Задач: ${state.tasksCount}
💰 Бюджет: ${state.expensesTotal} ₽

Хотите добавить еще что-то? 🎉`;
      }
    }
    
    // Стандартные ответы
    if (msg.includes('привет')) {
      return `🎉 **Привет! Я BirthdayAI - ваш помощник по планированию дня рождения!**

Я умею:
• 👥 Добавлять гостей в планировщик (напишите "Пригласи Анну")
• 📋 Создавать задачи (напишите "Заказать торт")
• 💰 Записывать расходы (напишите "Торт 3500 рублей")

Начнем планировать ваш праздник? ✨`;
    }
    
    return `🎉 **Отличный вопрос!**

Я могу помочь с планированием и автоматически добавлять данные в планировщик:

• Добавить гостя: "Пригласи Ивана Иванова"
• Создать задачу: "Заказать торт"
• Записать расход: "Торт 3500 рублей"

Что хотите добавить? 📝`;
  }

  clearHistory() {
    this.startNewChat();
  }
}

export const yandexGPTDirectService = new YandexGPTDirectService();