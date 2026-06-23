const BLANK_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

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
 * Типы сортировки точек маршрута
 * @type {Object}
 */
const SortType = {
  DEFAULT: 'day',
  PRICE: 'price',
  TIME: 'time',
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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {BLANK_POINT, POINT_TYPES, FilterType, SortType, NoPointsText, UserAction, UpdateType};
