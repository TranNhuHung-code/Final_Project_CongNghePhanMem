package VnITJobs.backend.controller.api.company;

import VnITJobs.backend.dto.company.CompanyResponse;
import VnITJobs.backend.dto.company.CompanyUpdateRequest;
import VnITJobs.backend.entity.Employer;
import VnITJobs.backend.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    private final CompanyService companyService;
    public CompanyController(CompanyService companyService){this.companyService = companyService;}

    @GetMapping("/me")
    public CompanyResponse getMyCompany(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        return companyService.getMyCompany(userId);
    }
    @PatchMapping("/me")
    public CompanyResponse updateMyCompany(Authentication authentication,@RequestBody @Valid CompanyUpdateRequest companyUpdateRequest){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        return companyService.updateMyCompany(userId, companyUpdateRequest);
    }
}