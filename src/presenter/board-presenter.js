import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NewPointFormView from '../view/new-point-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import NoPointsView from '../view/no-points-view.js';
import {render, replace} from '../framework/render.js';

export default class BoardPresenter {
  #pointModel;
  #boardPoints = [];
  #container;
  #eventsListComponent = new EventsListView();
  #newPointFormComponent = new NewPointFormView();
  #sortComponent = new SortView();
  #noPointsComponent = new NoPointsView();

  constructor({ container, pointModel }) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#boardPoints = [...this.#pointModel.points];
    this.#renderBoard();
  }

  #renderPoint(point, destination, allDestinations, offers, selectedOffers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({ point, destination, selectedOffers, onEditClick: () => {
      replacePointToEditForm();
    }});

    const editFormComponent = new EditFormView({ point, allDestinations, destination, offers, selectedOffers, onFormSubmit: () => {
      replaceEditFormToPoint();
    }, onCloseClick: () => {
      replaceEditFormToPoint();
    }});

    function replacePointToEditForm() {
      replace(editFormComponent, pointComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, editFormComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#eventsListComponent.element);
  }

  #renderSort() {
    render(this.#sortComponent, this.#container);
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
