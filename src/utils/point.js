import dayjs from 'dayjs';

const DATE_FORMAT = 'MMMM D';
const TIME_FORMAT = 'HH:mm';

function humanizePointDate(date, format = DATE_FORMAT) {
  return date ? dayjs(date).format(format) : '';
}

function humanizePointTime(date, format = TIME_FORMAT) {
  return date ? dayjs(date).format(format) : '';
}

function countPointDuration(dateFrom, dateTo) {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (durationInMinutes < 60) {
    return `${durationInMinutes}M`;
  }

  const days = Math.floor(durationInMinutes / (60 * 24));
  const hours = Math.floor((durationInMinutes % (60 * 24)) / 60);
  const minutes = durationInMinutes % 60;

  if (days === 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

function isPointFuture(dateFrom) {
  return dateFrom && dayjs(dateFrom).isAfter(dayjs());
}

function isPointPast(dateTo) {
  return dateTo && dayjs(dateTo).isBefore(dayjs());
}

function isPointPresent(dateFrom, dateTo) {
  const now = dayjs();
  return dateFrom && dateTo && dayjs(dateFrom).isBefore(now) && dayjs(dateTo).isAfter(now);
}

export {humanizePointDate, humanizePointTime, countPointDuration, isPointFuture, isPointPast, isPointPresent};
