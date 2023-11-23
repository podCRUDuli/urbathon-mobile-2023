export const formatDate = (date) => {
  const originalDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat('ru', {
    dateStyle: 'long',
  }).format(originalDate);
  return formattedDate;
};
