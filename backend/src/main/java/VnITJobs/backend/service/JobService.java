package VnITJobs.backend.service;

import VnITJobs.backend.dto.job.CreateJobRequest;
import VnITJobs.backend.dto.job.JobResponse;
import VnITJobs.backend.dto.job.UpdateJobRequest;
import VnITJobs.backend.entity.Employer;
import VnITJobs.backend.entity.Job;
import VnITJobs.backend.repository.EmployerRepository;
import VnITJobs.backend.repository.JobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;


@Service
public class JobService {
    private final JobRepository jobRepository;
    private final EmployerRepository employerRepository;
    public JobService(JobRepository jobRepository, EmployerRepository employerRepository){
        this.jobRepository = jobRepository;
        this.employerRepository = employerRepository;
    }

    public JobResponse createJob(CreateJobRequest request, Authentication authentication) {
        String title = request.getTitle();
        long minSalary = request.getMinSalary();
        long maxSalary = request.getMaxSalary();
        if (minSalary > maxSalary) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mức lương tối thiểu phải nhỏ hơn mức lương tối đa");
        String level = request.getLevel();
        String images = request.getImages();
        String workType = request.getWorkType();
        String technologies = request.getTechnologies();
        String description = request.getDescription();

        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);

        Job job = new Job();
        job.setTitle(title);
        job.setMinSalary(minSalary);
        job.setMaxSalary(maxSalary);
        job.setLevel(level);
        job.setImages(images);
        job.setWorkType(workType);
        job.setTechnologies(technologies);
        job.setDescription(description);

        Employer employer = employerRepository.findByUserId(userId).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tồn tại nhà tuyển dụng này"));
        job.setEmployer(employer);

        jobRepository.save(job);

        JobResponse jobResponse = new JobResponse(
                job.getId(),
                job.getTitle(),
                employer.getCompanyName(),
                job.getMinSalary(),
                job.getMaxSalary(),
                job.getLevel(),
                job.getImages(),
                job.getWorkType(),
                employer.getAddress(),
                job.getTechnologies(),
                job.getDescription()
        );

        return jobResponse;

    }
    public JobResponse updateJob(Long jobId,UpdateJobRequest request, Authentication authentication){
        String title = request.getTitle();
        long minSalary = request.getMinSalary();
        long maxSalary = request.getMaxSalary();
        if (minSalary > maxSalary) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mức lương tối thiểu phải nhỏ hơn mức lương tối đa");
        String level = request.getLevel();
        String images = request.getImages();
        String workType = request.getWorkType();
        String technologies = request.getTechnologies();
        String description = request.getDescription();

        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);


        Employer employer = employerRepository.findByUserId(userId).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tồn tại nhà tuyển dụng này"));
        Job job = jobRepository.findById(jobId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy job"));
        if (!employer.getId().equals(job.getEmployer().getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Đây không phải là job của bạn");

        job.setTitle(title);
        job.setMinSalary(minSalary);
        job.setMaxSalary(maxSalary);
        job.setLevel(level);
        job.setImages(images);
        job.setWorkType(workType);
        job.setTechnologies(technologies);
        job.setDescription(description);
        jobRepository.save(job);

        JobResponse jobResponse = new JobResponse(
                job.getId(),
                job.getTitle(),
                employer.getCompanyName(),
                job.getMinSalary(),
                job.getMaxSalary(),
                job.getLevel(),
                job.getImages(),
                job.getWorkType(),
                employer.getAddress(),
                job.getTechnologies(),
                job.getDescription()
        );
        return jobResponse;
    }
    public List<JobResponse> getAllJob(Authentication authentication){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);

        Employer employer = employerRepository.findByUserId(userId).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tồn tại nhà tuyển dụng này"));

        List<Job> jobs = jobRepository.findByEmployerId(employer.getId());
        List<JobResponse> jobResponses = new ArrayList<>();
        for (Job job : jobs){
            JobResponse jobResponse = new JobResponse(
                    job.getId(),
                    job.getTitle(),
                    employer.getCompanyName(),
                    job.getMinSalary(),
                    job.getMaxSalary(),
                    job.getLevel(),
                    job.getImages(),
                    job.getWorkType(),
                    employer.getAddress(),
                    job.getTechnologies(),
                    job.getDescription()
            );
            jobResponses.add(jobResponse);
        }
        return jobResponses;
    }
    public void deleteJob(Long jobId, Authentication authentication){
        Object principal = authentication.getPrincipal();
        String userIdStr = (String) principal;
        Long userId = Long.valueOf(userIdStr);

        Employer employer = employerRepository.findByUserId(userId).orElseThrow(() ->new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tồn tại nhà tuyển dụng này"));
        Job job = jobRepository.findById(jobId).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Không tìm thấy job"));
        if (!employer.getId().equals(job.getEmployer().getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Đây không phải là job của bạn");

        jobRepository.deleteById(jobId);
    }


}
