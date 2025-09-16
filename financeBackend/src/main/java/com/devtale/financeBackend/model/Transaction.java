package com.devtale.financeBackend.model;

import com.devtale.financeBackend.constants.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount;  // Using BigDecimal for precise monetary values.

    @Column(nullable = false)
    private LocalDate date;


    @CreationTimestamp
    @Column(columnDefinition = "DATETIME(6)", updatable = false, nullable = false)
    private LocalDateTime createdAt; // This will be the exact timestamp of creation


    @Column(nullable = false)
    private String category;    // e.g., "Groceries", "Utilities" ,"Salary"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // INCOME OR EXPENSE


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id",nullable = false)
    private User user;
}
