package com.devtale.financeBackend.config.jwt;


import com.devtale.financeBackend.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;


@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;



    private static final List<String> EXCLUDE_PATHS = Arrays.asList("/api/auth/login","/api/auth/register","/hello");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String requestURI = request.getRequestURI();

        if(EXCLUDE_PATHS.stream().anyMatch(path -> requestURI.startsWith(path))){
            filterChain.doFilter(request,response);
            return;
        }

        // 1. Get the Authorization header from the request.
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // 2. Check if the header exists and starts with "Bearer "
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){

            jwt = authorizationHeader.substring(7);


            username = jwtUtil.extractUsername(jwt);
        }

        // 3. If we have a username and the user is not already authenticated in the security context...
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            // load the users' details from the database.
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 4. Validate the token.
            if(jwtUtil.validateToken(jwt,userDetails)){
                // If the token is valid, we create an authenticated token.
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,null, userDetails.getAuthorities());

                usernamePasswordAuthenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

            }
        }

        // 5. Continue the Filter chain. The request will now proceed to the next filter and eventually to the controller.
        filterChain.doFilter(request,response);
    }
}
