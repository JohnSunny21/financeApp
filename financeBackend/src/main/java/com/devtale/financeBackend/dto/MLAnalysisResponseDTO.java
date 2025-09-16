package com.devtale.financeBackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class MLAnalysisResponseDTO {
    private String message;
    private List<MLInsightDTO> insights;
}
