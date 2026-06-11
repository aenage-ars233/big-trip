import {POINT_COUNT} from '../const.js';
import {destinations} from '../mocks/destinations.js';
import {offers} from '../mocks/offers.js';
import {getRandomPoint} from '../mocks/points.js';

export default class PointModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #destinations = destinations;
  #offers = offers;

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
}
