package com.devtale.financeBackend.controller;


import com.devtale.financeBackend.constants.TransactionType;
import com.devtale.financeBackend.dto.CategorySpendingDTO;
import com.devtale.financeBackend.dto.PagedResponseDTO;
import com.devtale.financeBackend.dto.TransactionDto;
import com.devtale.financeBackend.dto.TransactionSummaryDTO;
import com.devtale.financeBackend.model.Transaction;
import com.devtale.financeBackend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {


    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Get /api/transactions
//    @GetMapping
//    public ResponseEntity<List<TransactionDto>> getAllTransactionsForUser(Principal principal){
//        // The 'Principal' object contains the currently logged in user's name (username)
//        List<TransactionDto> transactions = transactionService.getTransactionsForUser(principal.getName());
//        return ResponseEntity.ok(transactions);
//    }

    // POST /api/transactions - ADD a new transaction for the logged-in user
    @PostMapping
    public ResponseEntity<TransactionDto> addTransaction(@Valid @RequestBody TransactionDto transactionDto, Principal principal) {
        // @Valid triggers the validation annotations on TransactionDto
        TransactionDto newTransaction = transactionService.addTransaction(transactionDto, principal.getName());
        return ResponseEntity.ok(newTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDto transactionDto,
            Principal principal) {
        try {
            TransactionDto updatedTransaction = transactionService.updateTransaction(id, transactionDto, principal.getName());
            return ResponseEntity.ok(updatedTransaction);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();  // 403 Forbidden
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();  // 404 Not Found
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Principal principal) {
        try {
            transactionService.deleteTransaction(id, principal.getName());
            return ResponseEntity.noContent().build(); // Standard response for successful delete.
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryDTO> getTransactionSummary(Principal principal) {
        TransactionSummaryDTO summary = transactionService.getTransactionSummaryForCurrentUser(principal.getName());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/summary/category")
    public ResponseEntity<List<CategorySpendingDTO>> getSpendingByCategory(Principal principal) {
        List<CategorySpendingDTO> spendingData = transactionService.getSpendingByCategoryForCurrentUser(principal.getName());
        return ResponseEntity.ok(spendingData);
    }


    @GetMapping
    public ResponseEntity<PagedResponseDTO<TransactionDto>> getAllTransactionsForUser(
            Principal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false)
            String description,
            // Add pagination parameters with default values.
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {


        // 1. Create a Pagable object with sorting information
        Pageable pagable = PageRequest.of(page,size, Sort.by("createdAt").descending());

        // 2. Call the service method, which now returns a Page object.
        Page<TransactionDto> transactionDtoPage = transactionService.searchTransactions(
                principal.getName(), startDate,endDate,type,category,description,pagable);

        // 3. Create our custom DTO from the Page Object

        PagedResponseDTO<TransactionDto> response = new PagedResponseDTO<>(
                transactionDtoPage.getContent(),
                transactionDtoPage.getNumber(),
                transactionDtoPage.getSize(),
                transactionDtoPage.getTotalElements(),
                transactionDtoPage.getTotalPages(),
                transactionDtoPage.isLast()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getUniqueUserCategories(Principal principal){
        List<String> categories = transactionService.findUniqueCategoriesForUser(principal.getName());
        return ResponseEntity.ok(categories);
    }
}
