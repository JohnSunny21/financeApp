package com.devtale.financeBackend.Exception;

import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler({SecurityException.class,UnauthorizedException.class})
    public ResponseEntity<Object> handleSecurityException(Exception ex, WebRequest request){
       System.err.println("Caught SecurityException: " + ex.getMessage());
       Map<String,Object> body = new HashMap<>();
       body.put("timestamp",new Date());
       body.put("status", HttpStatus.FORBIDDEN.value());
       body.put("error", "Forbidden");
       body.put("message",ex.getMessage());
       body.put("path",request.getDescription(false));
       return new ResponseEntity<>(body,HttpStatus.FORBIDDEN);
    }



    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->{
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage(); // This gets the custom message that
            // we have defined in the validation.
            errors.put(fieldName,errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({TransactionNotFoundException.class, UsernameNotFoundException.class, RuntimeException.class})
    public ResponseEntity<?> handleResourceNotFoundException(Exception ex, WebRequest request){
        System.err.println("Caught ResourceNotFoundException; "+ ex.getMessage());

        Map<String,Object> body = new HashMap<>();
        body.put("timestamp",new Date());
        body.put("status",HttpStatus.NOT_FOUND.value());
        body.put("error","Not Found");
        body.put("message", ex.getMessage());
        body.put("path",request.getDescription(false));
        return new ResponseEntity<>(body,HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request){
        System.err.println("Caught GlobalException: " +ex.getMessage());
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp",new Date());
        body.put("status",HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message","An unexpected error occurred. Please try again later.");
        body.put("path", request.getDescription(false));
        return new ResponseEntity<>(body,HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
