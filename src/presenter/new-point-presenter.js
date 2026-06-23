import {render, remove, RenderPosition} from '../framework/render.js';
import NewPointFormView from '../view/new-point-form-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #point;
  #allDestinations;
  #destination;
  #allOffers;
  #offers;

  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #newPointFormComponent = null;

  constructor({pointsListContainer, point, allDestinations, destination, allOffers, offers, onDataChange, onDestroy}) {
    this.#point = point;
    this.#allDestinations = allDestinations;
    this.#destination = destination;
    this.#allOffers = allOffers;
    this.#offers = offers;

    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newPointFormComponent !== null) {
      return null;
    }

    this.#newPointFormComponent = new NewPointFormView({
      point: this.#point,
      allDestinations: this.#allDestinations,
      destination: this.#destination,
      allOffers: this.#allOffers,
      offers: this.#offers,
      selectedOffers: [],
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
    });

    render(this.#newPointFormComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointFormComponent === null) {
      return null;
    }

    this.#handleDestroy();

    remove(this.#newPointFormComponent);
    this.#newPointFormComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
