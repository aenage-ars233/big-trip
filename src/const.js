/**
 * Количество точек маршрута, генерируемое при загрузке страницы
 * @type {number}
 */
const POINT_COUNT = 6;
/**
 * Типы точек маршрута
 * @type {Array<string>}
 */
const POINT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

/**
 * Типы фильтров для отображения точек маршрута
 * @type {Object}
 */
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

/**
 * Тексты для отображения при отсутствии точек маршрута в зависимости от выбранного фильтра
 * @type {Object}
 */
const NoPointsText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export {POINT_COUNT, POINT_TYPES, FilterType, NoPointsText};
