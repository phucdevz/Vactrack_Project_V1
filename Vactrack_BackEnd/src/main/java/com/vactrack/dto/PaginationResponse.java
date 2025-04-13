package com.vactrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationResponse {
    private long totalItems;
    private int totalPages;
    private int currentPage;
    private int itemsPerPage;
}
