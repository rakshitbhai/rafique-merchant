export const formatPrice = n => '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
