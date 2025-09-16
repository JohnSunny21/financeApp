package com.devtale.financeBackend.controller;


import com.devtale.financeBackend.dto.PasswordChangeDTO;
import com.devtale.financeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDTO passwordChangeDTO, Principal principal){

        if(!passwordChangeDTO.getNewPassword().equals(passwordChangeDTO.getConfirmNewPassword())) {
            return ResponseEntity.badRequest().body("New Passwords do not match.");
        }

        try{
            // The principal.getName() securely gets the username of the logged-in user
            userService.changeUserPassword(
                    principal.getName(),
                    passwordChangeDTO.getCurrentPassword(),
                    passwordChangeDTO.getNewPassword()
            );
            return ResponseEntity.ok("Password changed Successfully.");
        }catch (IllegalArgumentException e){
            // Catch Specific errors from the service
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("An error occurred while changing the password.");
        }
    }

}
