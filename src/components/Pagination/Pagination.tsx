import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav
      className={styles.pagination}
      role='navigation'
      aria-label='Pokemon list pagination'
    >
      <button
        className={`${styles.button} ${styles.prev}`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={`Go to previous page, page ${currentPage - 1}`}
        type='button'
      >
        <i className='bi bi-chevron-left' aria-hidden='true'></i>
        <span>Previous</span>
      </button>

      <div className={styles.pages} role='group' aria-label='Pagination pages'>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`${styles.page} ${
              page === currentPage ? styles.active : ''
            } ${typeof page === 'string' ? styles.ellipsis : ''}`}
            disabled={typeof page === 'string'}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            aria-label={
              typeof page === 'string'
                ? 'More pages'
                : page === currentPage
                  ? `Current page, page ${page}`
                  : `Go to page ${page}`
            }
            aria-current={page === currentPage ? 'page' : undefined}
            type='button'
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`${styles.button} ${styles.next}`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={`Go to next page, page ${currentPage + 1}`}
        type='button'
      >
        <span>Next</span>
        <i className='bi bi-chevron-right' aria-hidden='true'></i>
      </button>
    </nav>
  );
}
