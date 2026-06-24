import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import {humanizePointDate, sortPointsByDate} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {UpdateType, FilterType} from '../const.js';

export default class TripInfoPresenter {
  #container = null;
  #pointModel = null;
  #tripInfoComponent = null;

  constructor({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = filter[FilterType.EVERYTHING](this.#pointModel.points).sort(sortPointsByDate);
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      title: this.#getTitle(points),
      dates: this.#getDates(points),
      totalPrice: this.#countTotalPrice(points),
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return null;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #getTitle(points) {
    if (points.length <= 3) {
      const foundDestinations = points.map((point) => this.#pointModel.getDestinationById(point.destination));
      const names = foundDestinations.map((destination) => destination.name);
      return names.join(' &mdash; ');
    }

    const firstDestination = this.#pointModel.getDestinationById(points[0].destination);
    const lastDestination = this.#pointModel.getDestinationById(points[points.length - 1].destination);
    return `${firstDestination.name} &mdash; ... &mdash; ${lastDestination.name}`;
  }

  #getDates(points) {
    if (points && points.length) {
      const formattedDateFrom = humanizePointDate(points[0].dateFrom, 'D MMM');
      const formattedDateTo = humanizePointDate(points[points.length - 1].dateTo, 'D MMM');
      return `${formattedDateFrom}&nbsp;&mdash;&nbsp;${formattedDateTo}`;
    }

    return '';
  }

  #countTotalPrice(points) {
    let result = 0;
    points.forEach((point) => {
      result += point.basePrice;
      point.offers.forEach((offerId) => {
        const foundOffer = this.#pointModel.getOfferById(offerId);
        result += foundOffer.price;
      });
    });

    return result;
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.FAIL || this.#pointModel.points.length === 0) {
      remove(this.#tripInfoComponent);
      this.#tripInfoComponent = null;
      return null;
    }

    this.init();
  };
}
