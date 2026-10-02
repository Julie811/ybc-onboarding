/**
 * Приймає результати онбордингу YBC і дописує їх у вкладку "Результати"
 * таблиці "YBC Onboarding". Вкладку і заголовки створює автоматично.
 *
 * ЯК ПІДКЛЮЧИТИ (2 хвилини):
 * 1. Увійдіть в Google під акаунтом, який має РЕДАГУВАТИ таблицю
 *    (власник таблиці: ybc.team.hr@gmail.com).
 * 2. Відкрийте https://script.google.com і натисніть "Новий проєкт".
 * 3. Видаліть заглушку, вставте весь цей файл, збережіть (Ctrl+S).
 * 4. Розгорнути -> Новий деплой -> тип "Веб-додаток":
 *    - Виконати як: Я
 *    - Хто має доступ: Будь-хто
 * 5. Натисніть "Розгорнути", підтвердіть дозволи Google.
 * 6. Скопіюйте URL веб-додатка (закінчується на /exec) і надішліть його
 *    в чат. Він вставляється в index.html у змінну SHEET_WEBHOOK_URL.
 *
 * Якщо код скрипта змінюється, треба: Керувати деплоями -> редагувати ->
 * Нова версія. Інакше зміни не діють.
 */

var SPREADSHEET_ID = "1sQ4SH4PRsh0HmFU2-atE6ewLFvLDDLzvXn9YJ7TT4Ec";
var SHEET_NAME = "Результати";
var HEADERS = ["Дата/час", "Ім'я", "Посада", "Email", "Подія", "Деталі", "Бал/Рахунок"];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    // Колонка "Бал/Рахунок" містить значення на кшталт "5/7": без текстового
    // формату Google Таблиці перетворять їх на дату.
    sheet.getRange("G:G").setNumberFormat("@");
    sheet.getRange("A:A").setNumberFormat("dd.mm.yyyy hh:mm:ss");
  }
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = {};
    }

    getSheet_().appendRow([
      new Date(),
      data.name || "",
      data.position || "",
      data.email || "",
      data.event || "",
      data.details || "",
      data.score !== undefined ? String(data.score) : ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("YBC onboarding webhook працює.");
}

// Запустіть цю функцію один раз вручну (кнопка "Виконати"), щоб перевірити,
// що рядок з'являється в таблиці.
function testWrite() {
  getSheet_().appendRow([new Date(), "Тест", "Тест", "test@example.com", "test", "Перевірка запису", "0"]);
}
