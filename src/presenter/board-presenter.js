import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  eventsListComponent = new EventsListView();
  newPointFormComponent = new NewPointFormView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.eventsListComponent, this.container);
    render(this.newPointFormComponent, this.eventsListComponent.getElement());

    for (let i = 1; i <= 3; i++) {
      render(new PointView(), this.eventsListComponent.getElement());
    }
  }
}
