import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDate} from '../utils/point.js';
import {POINT_TYPES} from '../const.js';

function createOffersTemplate(offers, checkedOffers) {
  return offers.length > 0 ? (
    `<section class="event__section  event__section--offers">
       <h3 class="event__section-title  event__section-title--offers">Offers</h3>

       <div class="event__available-offers">
        ${offers.map(({ id, title, price }) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${title}" ${checkedOffers.some((offer) => offer.id === id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
    )).join('')}
    </div>
    </section>`
  ) : '';
}

function createEditFormTemplate(state, allDestinations) {
  const { point, pointDestination, pointOffers, pointSelectedOffers } = state;
  const formattedDateFrom = humanizePointDate(point.dateFrom, 'DD/MM/YY HH:mm');
  const formattedDateTo = humanizePointDate(point.dateTo, 'DD/MM/YY HH:mm');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

              ${POINT_TYPES.map((pointType) => `
                <div class="event__type-item">
                    <input id="event-type-${pointType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType.toLowerCase()}" ${pointType.toLowerCase() === point.type ? 'checked' : ''}>
                    <label class="event__type-label  event__type-label--${pointType.toLowerCase()}" for="event-type-${pointType.toLowerCase()}-1">${pointType}</label>
                  </div>
              `).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${allDestinations.map(({ name }) => `<option value="${name}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedDateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedDateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersTemplate(pointOffers, pointSelectedOffers)}

          ${pointDestination ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${pointDestination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pointDestination.pictures.map(({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
              </div>
            </div>
          </section>` : ''}
        </section>
      </form>
    </li>`
  );
}

export default class EditFormView extends AbstractStatefulView {
  #point;
  #allDestinations;
  #allOffers;
  #destination;
  #offers;
  #checkedOffers;
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({ point, allDestinations, destination, allOffers, offers, selectedOffers, onFormSubmit, onCloseClick }) {
    super();
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this._setState(EditFormView.parsePointToState(point, destination, offers, selectedOffers));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#allDestinations);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  }

  #typeChangeHandler = (evt) => {
    if (!evt.target.tagname === 'INPUT') {
      return null;
    }

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      },
      pointOffers: this.#allOffers.find((item) => item.type === evt.target.value).offers,
    });
  };

  #destinationChangeHandler = (evt) => {
    this.updateElement({
      pointDestination: this.#allDestinations.find((item) => item.name === evt.target.value),
      point: {
        ...this._state.point,
        destination: this.#allDestinations.find((item) => item.name === evt.target.value).id,
      }
    });
  };

  #priceInputHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value,
      }
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  static parsePointToState(point, destination, offers, selectedOffers) {
    return {
      point: structuredClone(point),
      pointDestination: structuredClone(destination),
      pointOffers: structuredClone(offers),
      pointSelectedOffers: structuredClone(selectedOffers),
    };
  }

  static parseStateToPoint(state) {
    return {
      point: state.point,
      destination: state.pointDestination,
      selectedOffers: state.pointSelectedOffers
    };
  }
}
