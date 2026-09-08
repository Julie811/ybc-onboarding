/**
 * Приймає результати онбордингу YBC і дописує їх у вкладку "Результати"
 * вашої Google Таблиці. Створює вкладку і заголовки автоматично,
 * якщо їх ще немає — існуючі вкладки/дані не займає.
 *
 * ЯК ПІДКЛЮЧИТИ (детальніше — у README.md):
 * 1. Відкрийте вашу Google Таблицю.
 * 2. Розширення → Apps Script.
 * 3. Видаліть код-заглушку, вставте весь цей файл, збережіть (Ctrl+S).
 * 4. Розгорнути → Новий деплой → тип "Веб-додаток".
 *    - Виконати як: Я (ваш акаунт)
 *    - Хто має доступ: Будь-хто
 * 5. Натисніть "Розгорнути", підтвердіть дозволи.
 * 6. Скопіюйте URL веб-додатка.
 * 7. Вставте цей URL у index.html замість
 *    "ВСТАВТЕ_СЮДИ_URL_ВЕБДОДАТКУ_APPS_SCRIPT" (шукайте SHEET_WEBHOOK_URL).
 *
 * Якщо після цього код скрипта зміниться — потрібно зробити
 * "Керувати деплоями" → редагувати → нова версія, інакше зміни не діють.
 */

function doPost(e) {
  var sheetName = "Результати";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Дата/час", "Ім'я", "Посада", "Email", "Подія", "Деталі", "Бал/Рахунок"]);
    sheet.setFrozenRows(1);
  }

  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = {};
  }

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.position || "",
    data.email || "",
    data.event || "",
    data.details || "",
    data.score !== undefined ? data.score : ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("YBC onboarding webhook працює.");
}
