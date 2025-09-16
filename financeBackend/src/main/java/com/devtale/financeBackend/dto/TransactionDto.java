package com.devtale.financeBackend.dto;

import com.devtale.financeBackend.constants.TransactionType;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;


import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionDto {

    private Long id;

    @NotBlank(message = "Description cannot be empty")
    @Size(max = 100, message = "Description cannot be over 100 characters")
    private String description;

    @NotNull(message = "Amount cannot be null")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Date cannot be null")
    @PastOrPresent(message = "Date cannot be in the future")
    private LocalDate date;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    @NotNull(message = "Transaction type cannot be null")
    private TransactionType type;

}
