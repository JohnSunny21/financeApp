package com.devtale.financeBackend.repository;

import com.devtale.financeBackend.constants.TransactionType;
import com.devtale.financeBackend.dto.CategorySpendingDTO;
import com.devtale.financeBackend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Long> , JpaSpecificationExecutor<Transaction> {

    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);


    // ---- New Custom Query ----
//    @Query("SELECT new com.devtale.financeBackend.dto.CategorySpendingDTO(t.category,SUM(t.amount)) " +
//    "FROM Transaction t " +
//    "WHERE t.user.id =: userId AND t.type= 'EXPENSE' AND t.date BETWEEN : startDate AND : endDate " +
//    "GROUP BY t.category")

    @Query("SELECT new com.devtale.financeBackend.dto.CategorySpendingDTO(t.category, SUM(t.amount)) " +
            "FROM Transaction t " +
            "WHERE t.user.id = :userId AND t.type = 'EXPENSE' AND t.date BETWEEN :startDate AND :endDate " +
            "GROUP BY t.category")
    List<CategorySpendingDTO> getSpendingByCategory(@Param("userId") Long userId,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);


    @Query("SELECT DISTINCT t.category FROM Transaction t WHERE t.user.id = :userId ORDER BY t.category ASC")
    List<String> findDistinctCategoriesByUserId(@Param("userId") Long userId);
}
