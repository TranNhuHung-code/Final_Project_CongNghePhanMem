package VnITJobs.backend.controller.api.job;

import VnITJobs.backend.dto.job.CreateJobRequest;
import VnITJobs.backend.dto.job.JobResponse;
import VnITJobs.backend.dto.job.UpdateJobRequest;
import VnITJobs.backend.service.JobService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/api/job")
public class JobController {
    private final JobService jobService;
    public JobController (JobService jobService){
        this.jobService = jobService;
    }

    @PostMapping("/me")
    public JobResponse createJob(@RequestBody @Valid CreateJobRequest request, Authentication authentication){
        return jobService.createJob(request,authentication);
    }
    @PatchMapping("/{jobId}")
    public JobResponse updateJob(@PathVariable("jobId") Long jobId, @RequestBody @Valid UpdateJobRequest request, Authentication authentication){
        return jobService.updateJob(jobId, request, authentication);
    }
    @GetMapping("/me")
    public List<JobResponse> getAllJob(Authentication authentication){
        return jobService.getAllJob(authentication);
    }
    @DeleteMapping("/{jobId}")
    public void deleteJob(@PathVariable("jobId") Long jobId, Authentication authentication){
        jobService.deleteJob(jobId,authentication);
    }
    @GetMapping("/public/{jobId}")
    public JobResponse getJob(@PathVariable("jobId") Long jobId) {
        return jobService.getJob(jobId);
    }

    @GetMapping("/public")
    public List<JobResponse> getPublicJobs(@RequestParam(required = false) String keyword, @RequestParam(required = false) String city, @RequestParam(required = false) String level, @RequestParam(required = false) String workType, @RequestParam(required = false) Long companyId){
        return jobService.getPublicJobs(keyword, city, level, workType, companyId);
    }
}
