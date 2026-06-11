import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import {render} from '../framework/render.js';

export default class BoardPresenter {
  eventsListComponent = new EventsListView();
  newPointFormComponent = new NewPointFormView();

  constructor({ container, pointModel }) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {
    this.boardPoints = [...this.pointModel.points];

    render(new SortView(), this.container);
    render(this.eventsListComponent, this.container);
    render(new EditFormView({
      point: this.boardPoints[0],
      allDestinations: this.pointModel.destinations,
      destination: this.pointModel.getDestinationById(this.boardPoints[0].destination),
      offers: this.pointModel.offers,
      checkedOffers: this.boardPoints[0].offers.map((offerId) => this.pointModel.getOfferById(offerId))
    }), this.eventsListComponent.element);

    for (let i = 0; i < this.boardPoints.length; i++) {
      const currentPoint = this.boardPoints[i];
      const currentPointDestination = this.pointModel.getDestinationById(currentPoint.destination);
      const currentPointSelectedOffers = currentPoint.offers.map((offerId) => this.pointModel.getOfferById(offerId));

      render(new PointView({
        point: currentPoint,
        destination: currentPointDestination,
        offers: currentPointSelectedOffers
      }), this.eventsListComponent.element);
    }
  }
}
