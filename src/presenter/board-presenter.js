import {sortPointsByDate, sortPointsByPrice, sortPointsByTime} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {SortType, UserAction, UpdateType} from '../const.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #pointModel;
  #filterModel;
  #allDestinations = [];
  #allOffers = [];

  #container;
  #eventsListComponent = new EventsListView();
  #newPointFormComponent = new NewPointFormView();
  #sortComponent = null;
  #noPointsComponent = new NoPointsView();

  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({ container, pointModel, filterModel }) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#allDestinations = this.#pointModel.destinations;
    this.#allOffers = this.#pointModel.offers;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
    }

    return filteredPoints.sort(sortPointsByDate);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint(point, destination, offers, selectedOffers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destination, this.#allDestinations, this.#allOffers, offers, selectedOffers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
    }
  };

  #handleModelEvent = (updateType, data) => {
    const updatedDestination = data ? this.#pointModel.getDestinationById(data.destination) : null;
    const updatedOffers = data ? this.#pointModel.getOffersByType(data.type) : null;
    const updatedSelectedOffers = data && data.offers ? data.offers.map((offerId) => this.#pointModel.getOfferById(offerId)) : null;

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, updatedDestination, this.#allDestinations, this.#allOffers, updatedOffers, updatedSelectedOffers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return null;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#container);
  }

  #renderPointsList() {
    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.points.length; i++) {
      const currentPoint = this.points[i];
      const currentPointDestination = this.#pointModel.getDestinationById(currentPoint.destination);
      const allOffersByType = this.#pointModel.getOffersByType(currentPoint.type);
      const currentPointSelectedOffers = currentPoint.offers.map((offerId) => this.#pointModel.getOfferById(offerId));

      this.#renderPoint(currentPoint, currentPointDestination, allOffersByType, currentPointSelectedOffers);
    }
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#container);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
