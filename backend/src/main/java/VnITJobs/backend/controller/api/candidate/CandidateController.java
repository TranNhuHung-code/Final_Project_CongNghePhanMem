package VnITJobs.backend.controller.api.candidate;

import VnITJobs.backend.dto.candidate.CandidateResponse;
import VnITJobs.backend.dto.candidate.CandidateUpdateRequest;
import VnITJobs.backend.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/me")
    public CandidateResponse getMyCandidate(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);

        return candidateService.getMyCandidate(userId);
    }

    @PatchMapping("/me")
    public CandidateResponse updateMyCandidate(Authentication authentication, @RequestBody @Valid CandidateUpdateRequest request) {
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);

        return candidateService.updateMyCandidate(userId, request);
    }
}

