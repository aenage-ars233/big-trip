import {getRandomArrayElement} from '../utils.js';

const points = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: 1100,
    dateFrom: '2019-07-10T23:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281315baa31'
    ],
    type: 'taxi'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808d',
    basePrice: 1500,
    dateFrom: '2019-09-05T22:55:56.845Z',
    dateTo: '2019-09-06T11:22:13.375Z',
    destination: 'cfe416cq-13xa-ye10-8077-2fs9a01edcab',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314bba32'
    ],
    type: 'flight'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808t',
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
    id: 'f4b62099-293f-4c3d-a902-94eec4a2808t',
    basePrice: 700,
    dateFrom: '2019-03-10T22:55:56.845Z',
    dateTo: '2019-03-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: true,
    offers: [],
    type: 'ship'
  },
  {
    id: 'f4b62099-293f-4c3d-a902-94eec4a2808t',
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
  return getRandomArrayElement(points);
}

export {getRandomPoint};
