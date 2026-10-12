package VnITJobs.backend.service;

import VnITJobs.backend.dto.application.ApplicationResponse;
import VnITJobs.backend.dto.application.ApplyRequest;
import VnITJobs.backend.dto.application.UpdateApplicationStatusRequest;
import VnITJobs.backend.entity.*;
import VnITJobs.backend.repository.ApplicationRepository;
import VnITJobs.backend.repository.CandidateRepository;
import VnITJobs.backend.repository.CvRepository;
import VnITJobs.backend.repository.JobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final CvStorageService cvStorageService;
    public ApplicationService(ApplicationRepository applicationRepository, CvRepository cvRepository, JobRepository jobRepository, CandidateRepository candidateRepository, CvStorageService cvStorageService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.cvStorageService = cvStorageService;
    }

    public ApplicationResponse apply(
        Long candidateId,
        Long jobId,
        MultipartFile cvFile
    ) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cong viec khong ton tai"
                ));

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ung vien khong ton tai"
                ));

        Optional<Application> existingApplication =
                applicationRepository.findByCandidateIdAndJobId(
                        candidateId, jobId
                );

        if (existingApplication.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Don ung tuyen nay da ton tai"
            );
        }

        // Lưu file PDF và nhận đường dẫn
        String cvFileUrl = cvStorageService.storePdf(cvFile);

        // Tạo bản ghi Application
        Application application = new Application();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setCvFileUrl(cvFileUrl);
        application.setViewed(false);
        application.setStatus(ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        Application savedApplication =
                applicationRepository.save(application);

        return new ApplicationResponse(
                savedApplication.getId(),
                job.getTitle(),
                job.getLevel(),
                job.getMinSalary(),
                job.getMaxSalary(),
                job.getWorkType(),
                candidate.getFullName(),
                candidate.getUser().getEmail(),
                candidate.getPhone(),
                savedApplication.getCvFileUrl(),
                savedApplication.isViewed(),
                savedApplication.getStatus(),
                savedApplication.getAppliedAt()
        );
    }

    public List<ApplicationResponse> getMyApplications(Long candidateId) {
        List<Application> applicationList = applicationRepository.findByCandidateId(candidateId);

        List<ApplicationResponse> applicationResponseList = new ArrayList<>();
        for (Application application : applicationList) {
            ApplicationResponse applicationResponse = new ApplicationResponse(
                    application.getId(),
                    application.getJob().getTitle(),
                    application.getJob().getLevel(),
                    application.getJob().getMinSalary(),
                    application.getJob().getMaxSalary(),
                    application.getJob().getWorkType(),
                    application.getCandidate().getFullName(),
                    application.getCandidate().getUser().getEmail(),
                    application.getCandidate().getPhone(),
                    application.getCvFileUrl(),
                    application.isViewed(),
                    application.getStatus(),
                    application.getAppliedAt()
            );
            applicationResponseList.add(applicationResponse);
        }
        return applicationResponseList;
    }

    public List<ApplicationResponse> getApplicationForEmployer(Long employerId) {
        List<Application> applicationList = applicationRepository.findByJob_Employer_Id(employerId);

        List<ApplicationResponse> applicationResponses = new ArrayList<>();
        for(Application application : applicationList){
            ApplicationResponse applicationResponse = new ApplicationResponse(
                    application.getId(),
                    application.getJob().getTitle(),
                    application.getJob().getLevel(),
                    application.getJob().getMinSalary(),
                    application.getJob().getMaxSalary(),
                    application.getJob().getWorkType(),
                    application.getCandidate().getFullName(),
                    application.getCandidate().getUser().getEmail(),
                    application.getCandidate().getPhone(),
                    application.getCvFileUrl(),
                    application.isViewed(),
                    application.getStatus(),
                    application.getAppliedAt()
            );
            applicationResponses.add(applicationResponse);
        }
        return applicationResponses;
    }
    public void updateApplicationStatus(Long employerId, Long applicationId, UpdateApplicationStatusRequest request){
        Optional<Application> applicationOptional = applicationRepository.findById(applicationId);
        if(applicationOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"khong ton tai don ung tuyen nay");

        Application application = applicationOptional.get();
        if(!application.getJob().getEmployer().getId().equals(employerId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Don ung tuyen nay khong thuoc ve cong ty ban");

        if (request == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trang thai don ung tuyen khong duoc de trong");


        if (request.getStatus() != ApplicationStatus.APPROVED && request.getStatus() != ApplicationStatus.REJECTED) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trang thai chi duoc la APPROVED hoac REJECTED");

        application.setStatus(request.getStatus());
        applicationRepository.save(application);
    }
    public void markApplicationViewed(Long employerId, Long applicationId){
        Optional<Application> applicationOptional = applicationRepository.findById(applicationId);
        if(applicationOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"khong ton tai don ung tuyen nay");

        Application application = applicationOptional.get();
        if(!application.getJob().getEmployer().getId().equals(employerId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Don ung tuyen nay khong thuoc ve cong ty ban");


        application.setViewed(true);
        applicationRepository.save(application);
    }
    public void deleteApplication(Long employerId, Long applicationId){
        Optional<Application> applicationOptional = applicationRepository.findById(applicationId);
        if(applicationOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"khong ton tai don ung tuyen nay");

        Application application = applicationOptional.get();
        if(!application.getJob().getEmployer().getId().equals(employerId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Don ung tuyen nay khong thuoc ve cong ty ban");

        applicationRepository.delete(application);

    }
}