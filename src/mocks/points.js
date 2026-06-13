import {nanoid} from 'nanoid';
import {getRandomArrayElement} from '../utils/common.js';

const points = [
  {
    id: nanoid(),
    basePrice: 1100,
    dateFrom: '2026-07-10T23:55:56.845Z',
    dateTo: '2026-08-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281315baa31'
    ],
    type: 'taxi'
  },
  {
    id: nanoid(),
    basePrice: 1500,
    dateFrom: '2026-05-05T22:55:56.845Z',
    dateTo: '2026-07-06T11:22:13.375Z',
    destination: 'cfe416cq-13xa-ye10-8077-2fs9a01edcab',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314bba32'
    ],
    type: 'flight'
  },
  {
    id: nanoid(),
    basePrice: 500,
    dateFrom: '2019-02-10T22:55:56.845Z',
    dateTo: '2019-02-11T11:22:13.375Z',
    destination: 'tfe416cq-13xa-ye10-8077-2fs9a01edcab',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa33'
    ],
    type: 'check-in'
  },
  {
    id: nanoid(),
    basePrice: 700,
    dateFrom: '2019-03-10T22:55:56.845Z',
    dateTo: '2019-03-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: true,
    offers: [],
    type: 'ship'
  },
  {
    id: nanoid(),
    basePrice: 900,
    dateFrom: '2020-07-10T22:55:56.845Z',
    dateTo: '2022-07-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: false,
    offers: [],
    type: 'bus'
  },
];

function getRandomPoint() {
  const randomPoint = getRandomArrayElement(points);

  return {
    ...randomPoint,
    id: nanoid(),
    offers: [...randomPoint.offers],
  };
}

export {getRandomPoint};
