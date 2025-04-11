export interface ReadingProgress {
    id?: number;
    user: {
      id: number;
    };
    book: {
      id: number;
    };
    currentPage: number;
    percentageRead: number;
  }