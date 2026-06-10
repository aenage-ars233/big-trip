import dayjs from 'dayjs';

const DATE_FORMAT = 'MMMM D';
const TIME_FORMAT = 'HH:mm';

function getRandomArrayElement(items = []) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(date, format = DATE_FORMAT) {
  return date ? dayjs(date).format(format) : '';
}

function humanizePointTime(date, format = TIME_FORMAT) {
  return date ? dayjs(date).format(format) : '';
}

function countPointDuration(dateFrom, dateTo) {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  const days = Math.floor(durationInMinutes / (60 * 24));
  const hours = Math.floor((durationInMinutes % (60 * 24)) / 60);
  const minutes = durationInMinutes % 60;

  return `${days > 0 ? `${days}D` : ''} ${hours > 0 ? `${hours}H` : ''} ${minutes > 0 ? `${minutes}M` : ''}`;
}

export {getRandomArrayElement, humanizePointDate, humanizePointTime, countPointDuration};
