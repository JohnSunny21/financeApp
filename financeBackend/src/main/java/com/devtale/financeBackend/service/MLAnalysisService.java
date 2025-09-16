package com.devtale.financeBackend.service;

import com.devtale.financeBackend.dto.MLAnalysisResponseDTO;
import com.devtale.financeBackend.model.Transaction;
import com.devtale.financeBackend.model.User;
import com.devtale.financeBackend.repository.TransactionRepository;
import com.devtale.financeBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class MLAnalysisService {

    private RestTemplate restTemplate;

    private TransactionRepository transactionRepository;

    private UserRepository userRepository;

    public MLAnalysisService(RestTemplate restTemplate, TransactionRepository transactionRepository, UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }



    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public MLAnalysisResponseDTO getAnalysisForUser(String username, LocalDate startDate, LocalDate endDate){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        List<Transaction> transactionList;


        // If dates are provided, fetch transactions within that range.
        // Otherwise, fetch all transactions (or last 30/60 days, your chioce).
        if(startDate != null && endDate != null){

            transactionList = transactionRepository.findByUserIdAndDateBetween(user.getId(),startDate,endDate);
        }else{
            // Default behaviour: Fetch all transactions.
            // A better default might be the last 90 days to keep the analysis relevant.
            LocalDate defaultEndDate = LocalDate.now();
            LocalDate defaultStartDate = defaultEndDate.minusDays(90);
            transactionList = transactionRepository.findByUserIdAndDateBetween(user.getId(), defaultStartDate,defaultEndDate);
        }

        if(transactionList.isEmpty()){
            // Create a specific DTO for an empty response
            MLAnalysisResponseDTO emptyResponse = new MLAnalysisResponseDTO();
            emptyResponse.setMessage("No Transactions found for the selected period.");
            emptyResponse.setInsights(new ArrayList<>());
            return emptyResponse;
        }






        // 2. The URL of the Python service's endpoint

        String url = mlServiceUrl + "/analyze";

        // 3. Make the POST request to the Python service
        // we send the list of transactions and expect an MLAnalysisResponseDTO back.
        // RestTemplate handles the JSON serialization/ deserialization automatically.
        MLAnalysisResponseDTO response = restTemplate.postForObject(url, transactionList, MLAnalysisResponseDTO.class);


        if(response != null){
            String originalMessage = response.getMessage();
            if(startDate !=null && endDate != null){
                response.setMessage(originalMessage + " ( From " + startDate + " to " + endDate + " ) ");
            } else{
                response.setMessage(originalMessage + " (Last 90 Days)");
            }
        }

        return response;

    }
}
