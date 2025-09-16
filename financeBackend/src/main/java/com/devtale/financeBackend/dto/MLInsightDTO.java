package com.devtale.financeBackend.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;


// This annotation tells Jackson to ignore any unknown properties from the Json
// It makes our DTO more resilient if the Python service adds new fields later.
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class MLInsightDTO {
    private String clusterName;
    private int transactionCount;
    private BigDecimal averageAmount;
    private String dominantCategory;
    private List<TransactionDto> transactions;
}
