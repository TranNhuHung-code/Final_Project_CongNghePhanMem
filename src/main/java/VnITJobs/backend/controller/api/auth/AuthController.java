package VnITJobs.backend.controller.api.auth;

import VnITJobs.backend.dto.auth.*;
import VnITJobs.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController (AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register/candidate")
    public CandidateRegisterResponse registerCandidate(@Valid @RequestBody CandidateRegisterRequest request){
        return authService.registerCandidate(request);
    }

    @PostMapping("/register/employer")
    public EmployerRegisterResponse registerEmployer(@Valid @RequestBody EmployerRegisterRequest request){
        return authService.registerEmployer(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request){
        return authService.login(request);
    }

}
