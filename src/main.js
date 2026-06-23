import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/point-model.js';
import { render } from './framework/render.js';

const filterModel = new FilterModel();
const headerContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointModel = new PointModel();
const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

const boardPresenter = new BoardPresenter({
  container: tripEventsContainer,
  pointModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormCancel,
});
const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointModel,
});

function handleNewPointFormCancel() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, headerContainer);

filterPresenter.init();
boardPresenter.init();
