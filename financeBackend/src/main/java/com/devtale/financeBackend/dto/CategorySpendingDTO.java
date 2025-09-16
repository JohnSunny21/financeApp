package com.devtale.financeBackend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CategorySpendingDTO {

    private String category;
    private BigDecimal totalAmount;

    public CategorySpendingDTO(String category, BigDecimal totalAmount) {
        this.category = category;
        this.totalAmount = totalAmount;
    }

}
