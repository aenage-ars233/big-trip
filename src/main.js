import FilterView from './view/filter-view.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({ container: tripEventsContainer });

render(new FilterView(), filterContainer);

boardPresenter.init();
