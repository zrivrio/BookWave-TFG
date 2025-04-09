package com.BookWave.bookstreaming.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadingProgressDTO {
    private Long userId;
    private Long bookId;
    private Integer currentPage;
    private Double percentageRead;
}
