import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  eventsListComponent = new EventsListView();
  newPointFormComponent = new NewPointFormView();

  constructor({ container, pointModel }) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {
    this.boardPoints = [...this.pointModel.getPoints()];

    render(this.sortComponent, this.container);
    render(this.eventsListComponent, this.container);
    render(new EditFormView({
      point: this.boardPoints[0],
      allDestinations: this.pointModel.getDestinations(),
      destination: this.pointModel.getDestinationById(this.boardPoints[0].destination),
      offers: this.pointModel.getOffersByType(this.boardPoints[0].type),
      checkedOffers: this.boardPoints[0].offers.map((offerId) => this.pointModel.getOfferById(offerId))
    }), this.eventsListComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      const currentPoint = this.boardPoints[i];
      const currentPointDestination = this.pointModel.getDestinationById(currentPoint.destination);
      const currentPointSelectedOffers = currentPoint.offers.map((offerId) => this.pointModel.getOfferById(offerId));

      render(new PointView({
        point: currentPoint,
        destination: currentPointDestination,
        offers: currentPointSelectedOffers
      }), this.eventsListComponent.getElement());
    }
  }
}
