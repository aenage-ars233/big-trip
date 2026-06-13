import {FilterType} from '../const.js';
import {isPointFuture, isPointPresent, isPointPast} from './point.js';

/**
 * Фильтрует точки маршрута в зависимости от выбранного фильтра
 * @param {Array} points - Массив точек маршрута
 * @param {string} filterType - Тип фильтра
 * @returns {Array} - Отфильтрованный массив точек маршрута
 */
const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo)),
};

export {filter};
