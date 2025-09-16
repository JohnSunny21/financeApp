import { Pagination } from "react-bootstrap";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render controls it there's only one page or no pages.
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (pageNumber) => {
    // Prevent changing to a non-existent page
    if (pageNumber >= 0 && pageNumber < totalPages) {
      onPageChange(pageNumber);
    }
  };

  let items = [];
  // Previous button
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => handlePageClick(currentPage - 1)}
      disabled={currentPage === 0}
    />
  );

  // Page number buttons (simplified logic for now)
  // we'll show the first , last, current , and adjacent pages.
  for (let number = 0; number < totalPages; number++) {
    if (
      number === 0 ||
      number === totalPages - 1 ||
      (number >= currentPage - 1 && number <= currentPage + 1)
    ) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageClick(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    } else if (number === currentPage - 2 || number === currentPage + 2) {
      // Add ellipsis for gaps
      items.push(<Pagination.Ellipsis key={`ellipsis-${number}`} />);
    }
  }

  // Next button
  items.push(
    <Pagination.Next
      key="next"
      onClick={() => handlePageClick(currentPage + 1)}
      disabled={currentPage === totalPages - 1}
    />
  );

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default PaginationControls;
