export const formatDate = (date) => {
  const originalDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat('ru', {
    dateStyle: 'long',
  }).format(originalDate);
  return formattedDate;
};

export const formatCountVotes = (votes, totalVotes) => {
  if (votes === 0 || totalVotes === 0) return;
  return `${Number((votes / totalVotes) * 100).toFixed(1)}%`;
};
