package com.vactrack.dto;

import java.util.List;

public class FeedbackListResponse {
    private boolean success;
    private List<FeedbackResponse> data;
    private PaginationInfo pagination;

    // Constructor
    public FeedbackListResponse(boolean success, List<FeedbackResponse> data, PaginationInfo pagination) {
        this.success = success;
        this.data = data;
        this.pagination = pagination;
    }

    // Getters và Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public List<FeedbackResponse> getData() {
        return data;
    }

    public void setData(List<FeedbackResponse> data) {
        this.data = data;
    }

    public PaginationInfo getPagination() {
        return pagination;
    }

    public void setPagination(PaginationInfo pagination) {
        this.pagination = pagination;
    }

    // Class thông tin phân trang
    public static class PaginationInfo {
        private int totalItems;
        private int totalPages;
        private int currentPage;
        private int itemsPerPage;

        // Constructor
        public PaginationInfo(int totalItems, int totalPages, int currentPage, int itemsPerPage) {
            this.totalItems = totalItems;
            this.totalPages = totalPages;
            this.currentPage = currentPage;
            this.itemsPerPage = itemsPerPage;
        }

        // Getters và Setters
        public int getTotalItems() {
            return totalItems;
        }

        public void setTotalItems(int totalItems) {
            this.totalItems = totalItems;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getItemsPerPage() {
            return itemsPerPage;
        }

        public void setItemsPerPage(int itemsPerPage) {
            this.itemsPerPage = itemsPerPage;
        }
    }
}
