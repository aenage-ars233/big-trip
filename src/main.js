import PointsApiService from './points-api-service.js';
import NewPointButtonView from './view/new-point-button-view.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointModel from './model/point-model.js';
import { render } from './framework/render.js';

const AUTHORIZATION = 'Basic hS3sfS45qcl1sa3j';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const filterModel = new FilterModel();
const headerContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

new TripInfoPresenter({
  container: headerContainer,
  pointModel,
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

filterPresenter.init();
boardPresenter.init();
pointModel.init()
  .catch(() => {
    newPointButtonComponent.element.disabled = true;
  })
  .finally(() => {
    render(newPointButtonComponent, headerContainer);
  });
