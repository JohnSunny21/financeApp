package com.devtale.financeBackend.controller;

import com.devtale.financeBackend.dto.MLAnalysisResponseDTO;
import com.devtale.financeBackend.service.MLAnalysisService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/ml")
public class MLController {


    private final MLAnalysisService mlAnalysisService;

    public MLController(MLAnalysisService mlAnalysisService) {
        this.mlAnalysisService = mlAnalysisService;
    }

    @GetMapping("/analysis")
    public ResponseEntity<MLAnalysisResponseDTO> performAnalysis(Principal principal,
                                                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // The Principal ensures this is an authenticated user

        MLAnalysisResponseDTO analysis = mlAnalysisService.getAnalysisForUser(principal.getName(), startDate, endDate);
        return ResponseEntity.ok(analysis);
    }

}
