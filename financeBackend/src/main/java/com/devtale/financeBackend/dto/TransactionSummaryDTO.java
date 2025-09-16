package com.devtale.financeBackend.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Data
public class TransactionSummaryDTO {

    private  BigDecimal totalIncome;
    private  BigDecimal totalExpenses;
    private  BigDecimal netBalance;

    public TransactionSummaryDTO(BigDecimal totalIncome, BigDecimal totalExpenses) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.netBalance = totalIncome.subtract(totalExpenses);
    }

}
