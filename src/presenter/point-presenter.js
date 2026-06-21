import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editFormComponent = null;

  #point = null;
  #destination = null;
  #allDestinations = null;
  #allOffers = null;
  #offers = null;
  #selectedOffers = null;
  #mode = Mode.DEFAULT;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ pointListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, destination, allDestinations, allOffers, offers, selectedOffers) {
    this.#point = point;
    this.#destination = destination;
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#offers = offers;
    this.#selectedOffers = selectedOffers;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      selectedOffers: this.#selectedOffers,
      onEditClick: this.#replacePointToEditForm,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      allDestinations: this.#allDestinations,
      destination: this.#destination,
      allOffers: this.#allOffers,
      offers: this.#offers,
      selectedOffers: this.#selectedOffers,
      onFormSubmit: this.#handleEditFormSubmit,
      onCloseClick: this.#replaceEditFormToPoint,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point, this.#destination, this.#offers, this.#selectedOffers);
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToEditForm = () => {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormToPoint = () => {
    this.#editFormComponent.reset(this.#point, this.#destination, this.#offers, this.#selectedOffers);
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #handleEditFormSubmit = (updatedPoint) => {
    this.#replaceEditFormToPoint();
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      updatedPoint
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
