export const formatDate = (date) => {
  const originalDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat('en-GB').format(originalDate);
  return formattedDate;
};
