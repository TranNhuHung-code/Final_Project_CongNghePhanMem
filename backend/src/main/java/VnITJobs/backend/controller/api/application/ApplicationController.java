package VnITJobs.backend.controller.api.application;

import VnITJobs.backend.dto.application.ApplicationResponse;
import VnITJobs.backend.dto.application.UpdateApplicationStatusRequest;
import VnITJobs.backend.entity.Candidate;
import VnITJobs.backend.entity.Employer;
import VnITJobs.backend.repository.CandidateRepository;
import VnITJobs.backend.repository.EmployerRepository;
import VnITJobs.backend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {
    private final ApplicationService applicationService;
    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;
    public ApplicationController(ApplicationService applicationService, CandidateRepository candidateRepository, EmployerRepository employerRepository){
        this.applicationService = applicationService;
        this.candidateRepository = candidateRepository;
        this.employerRepository = employerRepository;
    }
    @PostMapping(
        value = "/me",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApplicationResponse apply(
            Authentication authentication,
            @RequestParam("jobId") Long jobId,
            @RequestParam("cvFile") MultipartFile cvFile
    ) {
        String userIdStr = (String) authentication.getPrincipal();
        Long userId = Long.valueOf(userIdStr);

        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ban khong phai la ung vien"
                ));

        return applicationService.apply(
                candidate.getId(),
                jobId,
                cvFile
        );
    }
    @GetMapping("/me")
    public List<ApplicationResponse> getMyApplications (Authentication authentication){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        Optional<Candidate> candidateOptional = candidateRepository.findByUserId(userId);
        if(candidateOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ban khong phai la ung vien");
        Candidate candidate = candidateOptional.get();
        return applicationService.getMyApplications(candidate.getId());
    }
    @GetMapping("/employer/me")
    public List<ApplicationResponse> getApplicationForEmployer(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        Optional<Employer> employerOptional = employerRepository.findByUserId(userId);
        if(employerOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ban khong phai la nha tuyen dung");
        Employer employer = employerOptional.get();

        return applicationService.getApplicationForEmployer(employer.getId());
    }
    @PatchMapping("/employer/{applicationId}/status")
    public void updateApplicationStatus(Authentication authentication, @PathVariable ("applicationId") Long applicationId, @RequestBody UpdateApplicationStatusRequest request){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        Optional<Employer> employerOptional = employerRepository.findByUserId(userId);
        if(employerOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ban khong phai la nha tuyen dung");
        Employer employer = employerOptional.get();
        applicationService.updateApplicationStatus(employer.getId(), applicationId, request);
    }
    @PatchMapping("/employer/{applicationId}/viewed")
    public void markApplicationViewed(Authentication authentication, @PathVariable ("applicationId") Long applicationId){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        Optional<Employer> employerOptional = employerRepository.findByUserId(userId);
        if(employerOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ban khong phai la nha tuyen dung");
        Employer employer = employerOptional.get();
        applicationService.markApplicationViewed(employer.getId(), applicationId);
    }
    @DeleteMapping("/employer/{applicationId}")
    public void deleteApplication(Authentication authentication, @PathVariable ("applicationId") Long applicationId){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);
        Optional<Employer> employerOptional = employerRepository.findByUserId(userId);
        if(employerOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ban khong phai la nha tuyen dung");
        Employer employer = employerOptional.get();

        applicationService.deleteApplication(employer.getId(), applicationId);
    }
}
