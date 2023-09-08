type Pagination = {
  current_page: number;
  page_size: number;
  total_pages: number;
};

type PaginatedData<T> = {
  data: T[];
  pagination: Pagination;
};

function paginate<T>(data: T[], current_page: number, page_size: number): PaginatedData<T> {
  const paginatedData = data.slice((current_page - 1) * page_size, current_page * page_size);
  const pagination = {
    current_page: current_page,
    page_size: page_size,
    total_pages: Math.ceil(data.length / page_size),
  };

  return {
    data: paginatedData,
    pagination,
  };
}

export default paginate;
