import {NoPointsText} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createNoPointsTemplate(filterType) {
  const noPointsText = NoPointsText[filterType] || NoPointsText['everything'];
  return `<p class="trip-events__msg">${noPointsText}</p>`;
}

export default class NoPointsView extends AbstractView {
  #filterType;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
