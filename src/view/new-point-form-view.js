import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDate} from '../utils/point.js';
import {POINT_TYPES} from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createOffersTemplate(offers, checkedOffers) {
  return offers.length > 0 ? (
    `<section class="event__section  event__section--offers">
       <h3 class="event__section-title  event__section-title--offers">Offers</h3>

       <div class="event__available-offers">
        ${offers.map(({ id, title, price }) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${title}" ${checkedOffers.some((offer) => offer.id === id) ? 'checked' : ''} data-offer-title="${title}" data-offer-price="${price}">
        <label class="event__offer-label" for="${id}">
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

function createNewPointFormTemplate(state, allDestinations) {
  const {point, pointDestination, pointOffers, pointSelectedOffers} = state;
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
              <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${point.basePrice}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Cancel</button>
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

export default class NewPointFormView extends AbstractStatefulView {
  #point;
  #allDestinations;
  #allOffers;
  #destination;
  #offers;
  #checkedOffers;

  #dateFromPicker;
  #dateToPicker;

  #handleFormSubmit = null;
  #handleCancelClick = null;

  constructor({point, allDestinations, destination, allOffers, offers, selectedOffers, onFormSubmit, onCancelClick}) {
    super();
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this._setState(NewPointFormView.parsePointToState(point, destination, offers, selectedOffers));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelClick = onCancelClick;
    this._restoreHandlers();
  }

  get template() {
    return createNewPointFormTemplate(this._state, this.#allDestinations);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__details').addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);

    this.#setDatePickers();
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
      pointSelectedOffers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const foundDestination = this.#allDestinations.find((item) => item.name === evt.target.value);

    this.updateElement({
      pointDestination: foundDestination ? foundDestination : '',
      point: {
        ...this._state.point,
        destination: foundDestination ? foundDestination.id : '',
      }
    });
  };

  #dateFromChangeHandler = ([userDateFrom]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: userDateFrom,
      }
    });
  };

  #dateToChangeHandler = ([userDateTo]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: userDateTo,
      }
    });
  };

  #priceInputHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: Number(evt.target.value),
      }
    });
  };

  #offerChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return null;
    }

    if (evt.target.checked) {
      this._setState({
        point: {
          ...this._state.point,
          offers: [
            ...this._state.point.offers,
            evt.target.id,
          ],
        },
        pointSelectedOffers: [
          ...this._state.pointSelectedOffers,
          {
            id: evt.target.id,
            title: evt.target.dataset.offerTitle,
            price: evt.target.dataset.offerPrice,
          }
        ],
      });
    } else {
      this._setState({
        point: {
          ...this._state.point,
          offers: this._state.point.offers.filter((item) => item !== evt.target.id),
        },
        pointSelectedOffers: this._state.pointSelectedOffers.filter((item) => item.id !== evt.target.id),
      });
    }
  };

  #setDatePickers() {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        enableTime: true,
        'time_24hr': true,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        enableTime: true,
        'time_24hr': true,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(NewPointFormView.parseStateToPoint(this._state));
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
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
    return state.point;
  }
}
