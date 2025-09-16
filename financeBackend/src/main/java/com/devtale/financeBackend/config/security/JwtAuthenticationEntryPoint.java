package com.devtale.financeBackend.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    // This method is called whenever an exception is thrown due to an unauthenticated use
    // trying to access a resource that requires authentication

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        System.err.println("Authentication error : " + authException.getMessage());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // Create a clear, consistent error response body
        final Map<String, Object> body = new HashMap<>();
        body.put("status",HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error","Unauthorized");
        body.put("message",authException.getMessage());
        body.put("path",request.getServletPath());

        // Use Jackson's ObjectMapper to write the map as a JSON string to the response.
        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(),body);
    }
}

