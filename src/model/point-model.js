import Observable from '../framework/observable.js';
import {POINT_COUNT} from '../const.js';
import {destinations} from '../mocks/destinations.js';
import {offers} from '../mocks/offers.js';
import {getRandomPoint} from '../mocks/points.js';

export default class PointModel extends Observable {
  #pointsApiService = null;
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = destinations;
  #offers = offers;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      console.log(points.map(this.#adaptToClient));
    });
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationById(id) {
    const foundDestination = this.#destinations.find((item) => item.id === id);
    return foundDestination;
  }

  getOffersByType(type) {
    const foundOffers = this.#offers.find((item) => item.type === type);
    return foundOffers ? foundOffers.offers : [];
  }

  getOfferById(offerId) {
    for (const offerType of this.#offers) {
      const foundOffer = offerType.offers.find((offer) => offer.id === offerId);
      if (foundOffer) {
        return foundOffer;
      }
    }
    return null;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
