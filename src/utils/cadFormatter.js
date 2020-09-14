export const cadFormatter = (amt) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD',
  }).format(amt);
