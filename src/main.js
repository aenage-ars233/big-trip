import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/point-model.js';

const filterModel = new FilterModel();
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointModel = new PointModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  pointModel,
  filterModel
});
const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointModel,
});

filterPresenter.init();
boardPresenter.init();
