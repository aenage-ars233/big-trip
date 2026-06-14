import {updateItem} from '../utils/common.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #pointModel;
  #boardPoints = [];

  #container;
  #eventsListComponent = new EventsListView();
  #newPointFormComponent = new NewPointFormView();
  #sortComponent = new SortView();
  #noPointsComponent = new NoPointsView();

  #pointPresenters = new Map();

  constructor({ container, pointModel }) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#renderBoard();
  }

  #renderPoint(point, destination, allDestinations, offers, selectedOffers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destination, allDestinations, offers, selectedOffers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint, updatedDestination, allDestinations, updatedOffers, updatedSelectedOffers) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, updatedDestination, allDestinations, updatedOffers, updatedSelectedOffers);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSort() {
    render(this.#sortComponent, this.#container);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointsList() {
    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      const currentPoint = this.#boardPoints[i];
      const allDestinations = this.#pointModel.destinations;
      const currentPointDestination = this.#pointModel.getDestinationById(currentPoint.destination);
      const allOffersByType = this.#pointModel.getOffersByType(currentPoint.type);
      const currentPointSelectedOffers = currentPoint.offers.map((offerId) => this.#pointModel.getOfferById(offerId));

      this.#renderPoint(currentPoint, currentPointDestination, allDestinations, allOffersByType, currentPointSelectedOffers);
    }
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#container);
  }

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
