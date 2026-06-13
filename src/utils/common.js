/**
 * Возвращает случайный элемент из массива
 * @param {Array} items - Массив элементов
 * @returns {*} - Случайный элемент из массива
 */
function getRandomArrayElement(items = []) {
  return items[Math.floor(Math.random() * items.length)];
}

export {getRandomArrayElement};
