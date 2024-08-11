const buildTaskFilterQuery = (query) => {
  const filter = {};

  // Add dynamic filtering based on query parameters
  if (query.status) filter.status = query.status;

  // Date range filtering
  if (query.startDate || query.endDate) {
    filter.dueDate = {};
    if (query.startDate) filter.dueDate.$gte = new Date(query.startDate);
    if (query.endDate) filter.dueDate.$lte = new Date(query.endDate);
  }

  return filter;
};

const buildSortQuery = (query) => {
  const sort = {};
  if (query.sortBy) {
    sort[query.sortBy] = query.sortOrder === 'asc' ? 1 : -1;
  }

  return sort;
};

module.exports = {
  buildTaskFilterQuery,
  buildSortQuery,
};
