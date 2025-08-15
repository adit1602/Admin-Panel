// src/components/ui/Pagination.tsx

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  paginate,
}: PaginationProps) {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo;
      </button>

      {[...Array(Math.min(5, totalPages))].map((_, i) => {
        const pageNum =
          currentPage > 3 && totalPages > 5
            ? currentPage -
              3 +
              i +
              (currentPage + 2 > totalPages ? totalPages - currentPage - 2 : 0)
            : i + 1;

        if (pageNum <= totalPages) {
          return (
            <button
              key={pageNum}
              onClick={() => paginate(pageNum)}
              className={`px-3 py-1 rounded border text-sm font-medium ${
                currentPage === pageNum
                  ? "bg-orange-500 text-white border-orange-500"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          );
        }
        return null;
      })}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <span className="px-2 text-gray-500">...</span>
      )}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <button
          onClick={() => paginate(totalPages)}
          className={`px-3 py-1 rounded border text-sm font-medium text-gray-700 border-gray-300 hover:bg-gray-50`}
        >
          {totalPages}
        </button>
      )}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &raquo;
      </button>
    </div>
  );
}
