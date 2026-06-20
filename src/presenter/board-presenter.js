import {updateItem} from '../utils/common.js';
import {sortPointsByDate, sortPointsByPrice, sortPointsByTime} from '../utils/point.js';
import {SortType} from '../const.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #pointModel;
  #boardPoints = [];
  #sourcedBoardPoints = [];
  #allDestinations = [];
  #allOffers = [];

  #container;
  #eventsListComponent = new EventsListView();
  #newPointFormComponent = new NewPointFormView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({ container, pointModel }) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#allDestinations = this.#pointModel.destinations;
    this.#allOffers = this.#pointModel.offers;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#sourcedBoardPoints = [...this.#pointModel.points];

    this.#renderBoard();
  }

  #renderPoint(point, destination, offers, selectedOffers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destination, this.#allDestinations, this.#allOffers, offers, selectedOffers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint, updatedDestination, updatedOffers, updatedSelectedOffers) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, updatedDestination, this.#allDestinations, this.#allOffers, updatedOffers, updatedSelectedOffers);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortPointsByTime);
        break;
      default:
        this.#boardPoints.sort(sortPointsByDate);
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return null;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });

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
      const currentPointDestination = this.#pointModel.getDestinationById(currentPoint.destination);
      const allOffersByType = this.#pointModel.getOffersByType(currentPoint.type);
      const currentPointSelectedOffers = currentPoint.offers.map((offerId) => this.#pointModel.getOfferById(offerId));

      this.#renderPoint(currentPoint, currentPointDestination, allOffersByType, currentPointSelectedOffers);
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
    this.#sortPoints('day');
    this.#renderPointsList();
  }
}
