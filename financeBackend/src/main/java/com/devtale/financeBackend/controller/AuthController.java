package com.devtale.financeBackend.controller;


import com.devtale.financeBackend.config.jwt.JwtUtil;
import com.devtale.financeBackend.dto.AuthRequest;
import com.devtale.financeBackend.model.User;
import com.devtale.financeBackend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final AuthenticationManager authenticationManager;

    private final UserDetailsService userDetailsService;

    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtUtil jwtUtil){
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws  Exception{
       Authentication authenticate;
        try{


             authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(),
                    authRequest.getPassword()));
        } catch (Exception e) {
            // It's better to give a generic error message for security reasons.
            return ResponseEntity.status(401).body("Error : Invalid credentials");
        }



        // Step 2: If authentication is successful, the principal is our UserDetails object.
        // We can get it directly from the authentication result without a second DB call.
        final UserDetails userDetails = (UserDetails) authenticate.getPrincipal();
        final String jwt = jwtUtil.generateToken(userDetails);

        // We return the JWT in the response.
        return ResponseEntity.ok(Map.of("jwt",jwt));


    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        try{
            User registeredUser = authService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        }catch (Exception ex){
            return ResponseEntity.badRequest().body("Error: Username or Email already in use!");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(Principal principal){
        if(principal == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Our CustomUserDetailsService loads a User object into the principal
        UserDetails userDetails = userDetailsService.loadUserByUsername(principal.getName());
        return ResponseEntity.ok(userDetails);
    }
}