import FilterView from './view/filter-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/point-model.js';
import {generateFilters} from './mocks/filters.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointModel = new PointModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  pointModel
});

const filters = generateFilters(pointModel.points);

render(new FilterView({filters}), filterContainer);

boardPresenter.init();
