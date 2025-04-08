export interface ReadingProgress {
    id?: number;
    user: {
      id: number;
    };
    book: {
      id: number;
      totalPages?: number;
    };
    currentPage: number;
    percentageRead: number;
  }