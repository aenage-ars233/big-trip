import {sortPointsByDate, sortPointsByPrice, sortPointsByTime} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {SortType, FilterType, UserAction, UpdateType, BLANK_POINT} from '../const.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import LoadingView from '../view/loading-view.js';
import {render, remove} from '../framework/render.js';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #pointModel;
  #filterModel;
  #allDestinations = [];
  #allOffers = [];

  #container;
  #eventsListComponent = new EventsListView();
  #sortComponent = null;
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();

  #newPointPresenter = null;
  #newPointDestroyHandler;
  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor({ container, pointModel, filterModel, onNewPointDestroy }) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#allDestinations = this.#pointModel.destinations;
    this.#allOffers = this.#pointModel.offers;
    this.#newPointDestroyHandler = onNewPointDestroy;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

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

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
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
      case UpdateType.INIT:
        this.#allDestinations = this.#pointModel.destinations;
        this.#allOffers = this.#pointModel.offers;
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#newPointPresenter = new NewPointPresenter({
          pointsListContainer: this.#eventsListComponent.element,
          point: BLANK_POINT,
          allDestinations: this.#allDestinations,
          destination: this.#pointModel.getDestinationById(BLANK_POINT.destination),
          allOffers: this.#allOffers,
          offers: this.#pointModel.getOffersByType(BLANK_POINT.type),
          onDataChange: this.#handleViewAction,
          onDestroy: this.#newPointDestroyHandler,
        });
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
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

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

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
    this.#noPointsComponent = new NoPointsView(this.#filterType);

    render(this.#noPointsComponent, this.#container);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return null;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }
}
