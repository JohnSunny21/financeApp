package com.devtale.financeBackend.service;

import com.devtale.financeBackend.Exception.TransactionNotFoundException;
import com.devtale.financeBackend.Exception.UnauthorizedException;
import com.devtale.financeBackend.constants.TransactionType;
import com.devtale.financeBackend.dto.CategorySpendingDTO;
import com.devtale.financeBackend.dto.TransactionDto;
import com.devtale.financeBackend.dto.TransactionSummaryDTO;
import com.devtale.financeBackend.mapper.TransactionMapper;
import com.devtale.financeBackend.model.Transaction;
import com.devtale.financeBackend.model.User;
import com.devtale.financeBackend.repository.TransactionRepository;
import com.devtale.financeBackend.repository.UserRepository;
import com.devtale.financeBackend.repository.specification.TransactionSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final UserRepository userRepository; // we need this to fetch the user.

    private final TransactionMapper transactionMapper;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, TransactionMapper transactionMapper) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.transactionMapper = transactionMapper;
    }


    public List<TransactionDto> getTransactionsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(transactionMapper::toDto)
                .toList();
    }


    public TransactionDto addTransaction(TransactionDto transactionDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Transaction transaction = transactionMapper.toEntity(transactionDto);
        transaction.setUser(user);  // Set the user for the new transaction : Important : Associate with the logged-in user.
        Transaction savedTransaction = transactionRepository.save(transaction);
        return transactionMapper.toDto(savedTransaction);
    }


    public TransactionDto updateTransaction(Long id, TransactionDto transactionDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found !!! with the id: " + id));

        // SECURITY CHECK : Ensure the transaction belongs to the user trying to update it.
        if (!existingTransaction.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("User not authorized to update this transaction");
        }

        // else update fields
        existingTransaction.setDescription(transactionDto.getDescription());
        existingTransaction.setAmount(transactionDto.getAmount());
        existingTransaction.setDate(transactionDto.getDate());
        existingTransaction.setCategory(transactionDto.getCategory());
        existingTransaction.setType(transactionDto.getType());

        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        return transactionMapper.toDto(updatedTransaction);
    }



    public void deleteTransaction(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction is not found with the id : " + id));

        // SECURITY CHECK : Ensure the transaction belongs to the user trying to delete it
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("User not authorized to delete this transaction");
        }
        transactionRepository.delete(transaction);
    }

    public TransactionSummaryDTO getTransactionSummaryForCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(today.lengthOfMonth());

        // We need a way to get transactions within a date range. Let's add it to the repository.
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate);

        // Using Java streams to efficiently calculate sums
        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TransactionSummaryDTO(totalIncome, totalExpenses);
    }


    public List<CategorySpendingDTO> getSpendingByCategoryForCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(today.lengthOfMonth());

        return transactionRepository.getSpendingByCategory(user.getId(), startDate, endDate);
    }


    public List<TransactionDto> getFilteredTransactionForUser(String username, LocalDate startDate, LocalDate endDate, TransactionType type, String keyword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build the specification dynamically.

        // 1. Start with a base specification that is always true (the user's ID).
        Specification<Transaction> spec = TransactionSpecification.hasUserId(user.getId());


        // 2. Conditionally chain '.and()' for each filter that is provided.
        // This is much cleaner than the old way.
        if (startDate != null) {
            spec = spec.and(TransactionSpecification.isGTE(startDate));
        }
        if (endDate != null) {
            spec = spec.and(TransactionSpecification.isLTE(endDate));
        }

        if (type != null) {
            spec = spec.and(TransactionSpecification.hasType(type));
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            spec = spec.and(TransactionSpecification.descriptionContains(keyword));

        }


        // ALSO APPLY SORTING
        return transactionRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(transactionMapper::toDto)
                .toList();
    }

    public Page<TransactionDto> searchTransactions(String username, LocalDate startDate, LocalDate endDate, TransactionType type, String category, String description, Pageable pageable){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 1. Start with the mandatory user Id Specification.
        Specification<Transaction> spec = TransactionSpecification.hasUserId(user.getId());

        // 2. Chain the other specification using. and()
        // The beauty of this is that each method in your class handles its own null/empty checks.
        spec = spec.and(TransactionSpecification.descriptionContains(description))
                .and(TransactionSpecification.hasCategory(category))
                .and(TransactionSpecification.hasType(type))
                .and(TransactionSpecification.isGTE(startDate))
                .and(TransactionSpecification.isLTE(endDate));

        // 3. Define sorting
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        // 4. Execute the query with the combined specification and sorting.
        Page<Transaction> transactionsPage = transactionRepository.findAll(spec,pageable);

        return transactionsPage.map(
                transactionMapper::toDto
        );
    }

    public List<String> findUniqueCategoriesForUser(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return transactionRepository.findDistinctCategoriesByUserId(user.getId());
    }
}
