export const getItemById = (items, id) => items.find((item) => item.id === id) || null;

export const getPairsByCategory = (pairs, category) =>
  pairs.filter((pair) => pair.category === category).sort((a, b) => b.similarity - a.similarity);
