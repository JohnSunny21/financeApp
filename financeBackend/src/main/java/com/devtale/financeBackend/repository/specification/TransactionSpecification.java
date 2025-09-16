package com.devtale.financeBackend.repository.specification;

import com.devtale.financeBackend.constants.TransactionType;
import com.devtale.financeBackend.model.Transaction;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class TransactionSpecification {


    private static Specification<Transaction> alwaysTrue(){
        return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
    }

    public static Specification<Transaction> hasUserId(Long userId){
        // This is a mandatory filter, so it doesn't need a null check.
        return (root, query, criteriabuilder) ->
                criteriabuilder.equal(root.get("user").get("id"),userId);
    }

    public static Specification<Transaction> hasType(TransactionType type){
        return (root, query, criteriaBuilder) ->
                type == null  ? criteriaBuilder.conjunction() :
                        criteriaBuilder.equal(root.get("type"),type);
    }

    public static Specification<Transaction> descriptionContains(String description){
        // If the description is missing, return a "do-nothing" specification
        // criteriaBuilder.conjunction() is a predicate that is always true (like saying "WHERE 1=1").
        // It has NO effect on the final query.
        return (root, query, criteriaBuilder) ->
                description == null || description.isEmpty() ? criteriaBuilder.conjunction() :
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%");
    }
    public static Specification<Transaction> hasCategory(String category){
        return (root, query, criteriaBuilder) ->
        category == null || category.isEmpty() ? criteriaBuilder.conjunction() :
        criteriaBuilder.equal(root.get("category"), category);
    }

    public static Specification<Transaction> isGTE(LocalDate date){
        return (root, query, criteriaBuilder) ->
                date == null ? criteriaBuilder.conjunction() :
                        criteriaBuilder.greaterThanOrEqualTo(root.get("date"),date);
    }

    public static Specification<Transaction> isLTE(LocalDate date){
        return (root, query, criteriaBuilder) ->
               date == null ? criteriaBuilder.conjunction() :
               criteriaBuilder.lessThanOrEqualTo(root.get("date"),date);
    }
}
