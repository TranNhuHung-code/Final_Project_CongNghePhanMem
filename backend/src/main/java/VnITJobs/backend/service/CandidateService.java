package VnITJobs.backend.service;

import VnITJobs.backend.dto.candidate.CandidateResponse;
import VnITJobs.backend.dto.candidate.CandidateUpdateRequest;
import VnITJobs.backend.entity.Candidate;
import VnITJobs.backend.repository.CandidateRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CandidateService {
    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository){
        this.candidateRepository = candidateRepository;
    }

    public CandidateResponse getMyCandidate(Long userId){
        Optional<Candidate> kq = candidateRepository.findByUserId(userId);
        if(kq.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Khong tim thay ung vien nay");

        Candidate candidate = kq.get();
        CandidateResponse candidateResponse = new CandidateResponse(
                candidate.getId(),
                candidate.getUser().getEmail(),
                candidate.getFullName(),
                candidate.getAvatarUrl(),
                candidate.getPhone()
        );
        return candidateResponse;
    }


    public CandidateResponse updateMyCandidate(Long userId, CandidateUpdateRequest request){
        Optional<Candidate> kq = candidateRepository.findByUserId(userId);
        if(kq.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Khong tim thay ung vien nay");

        Candidate candidate = kq.get();
        candidate.setFullName(request.getFullName());
        candidate.setPhone(request.getPhone());
        candidate.setAvatarUrl(request.getAvatarUrl());
        candidateRepository.save(candidate);

        CandidateResponse candidateResponse = new CandidateResponse(
                candidate.getId(),
                candidate.getUser().getEmail(),
                candidate.getFullName(),
                candidate.getAvatarUrl(),
                candidate.getPhone()
        );
        return candidateResponse;
    }

}
