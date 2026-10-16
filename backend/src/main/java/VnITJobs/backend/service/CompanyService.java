package VnITJobs.backend.service;

import VnITJobs.backend.dto.company.CompanyResponse;
import VnITJobs.backend.dto.company.CompanyUpdateRequest;
import VnITJobs.backend.entity.Employer;
import VnITJobs.backend.repository.EmployerRepository;
import VnITJobs.backend.repository.JobRepository;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
    private final EmployerRepository employerRepository;
    private final JobRepository jobRepository;
    public CompanyService(EmployerRepository employerRepository, JobRepository jobRepository){
        this.employerRepository = employerRepository;
        this.jobRepository = jobRepository;
    }

    public CompanyResponse getMyCompany(Long userId){
        Optional<Employer> kq = employerRepository.findByUserId(userId);
        if (kq.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "thong tin cong ty khong ton tai");

        Employer employer = kq.get();
        CompanyResponse companyResponse =new CompanyResponse(
                employer.getId(),
                employer.getCompanyName(),
                employer.getLogoUrl(),
                employer.getCity(),
                employer.getAddress(),
                employer.getUser().getEmail(),
                employer.getPhone(),
                employer.getCompanySize(),
                employer.getCompanyModel(),
                employer.getWorkingTime(),
                employer.getOvertimePolicy(),
                employer.getDescription(),
                jobRepository.countByEmployerId(employer.getId())
        );
        return companyResponse;
    }
    public CompanyResponse updateMyCompany(Long userId, CompanyUpdateRequest companyUpdateRequest){
        Optional<Employer> kq = employerRepository.findByUserId(userId);
        if (kq.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "thong tin cong ty khong ton tai");

        Employer employer = kq.get();
                employer.setCompanyName(companyUpdateRequest.getCompanyName());
                employer.setLogoUrl(companyUpdateRequest.getLogoUrl());
                employer.setCity(companyUpdateRequest.getCity());
                employer.setAddress(companyUpdateRequest.getAddress());
                employer.setPhone(companyUpdateRequest.getPhone());
                employer.setCompanySize(companyUpdateRequest.getCompanySize());
                employer.setCompanyModel(companyUpdateRequest.getCompanyModel());
                employer.setWorkingTime(companyUpdateRequest.getWorkingTime());
                employer.setOvertimePolicy(companyUpdateRequest.getOvertimePolicy());
                employer.setDescription(companyUpdateRequest.getDescription());
        employerRepository.save(employer);

        CompanyResponse companyResponse =new CompanyResponse(
                employer.getId(),
                employer.getCompanyName(),
                employer.getLogoUrl(),
                employer.getCity(),
                employer.getAddress(),
                employer.getUser().getEmail(),
                employer.getPhone(),
                employer.getCompanySize(),
                employer.getCompanyModel(),
                employer.getWorkingTime(),
                employer.getOvertimePolicy(),
                employer.getDescription(),
                jobRepository.countByEmployerId(employer.getId())
        );
        return companyResponse;
    }
    public List<CompanyResponse> getAllCompanies(String keyword, String city){
        if (keyword == null || keyword.isBlank()) {
            keyword = null;
        }

        if (city == null || city.isBlank()) {
            city = null;
        }
        List<Employer> employers = employerRepository.searchCompanies(keyword, city);
        
        List<CompanyResponse> companyResponseList = new ArrayList<>();
        for(Employer employer : employers){
            CompanyResponse companyResponse =new CompanyResponse(
                    employer.getId(),
                    employer.getCompanyName(),
                    employer.getLogoUrl(),
                    employer.getCity(),
                    employer.getAddress(),
                    employer.getUser().getEmail(),
                    employer.getPhone(),
                    employer.getCompanySize(),
                    employer.getCompanyModel(),
                    employer.getWorkingTime(),
                    employer.getOvertimePolicy(),
                    employer.getDescription(),
                    jobRepository.countByEmployerId(employer.getId())
            );
            companyResponseList.add(companyResponse);
        }
        return companyResponseList;
    }
    public CompanyResponse getCompany(Long employerId){
        Optional<Employer> employerOptional = employerRepository.findById(employerId);
        if(employerOptional.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cong ty nay khong ton tai");
        Employer employer = employerOptional.get();
        CompanyResponse companyResponse =new CompanyResponse(
                employer.getId(),
                employer.getCompanyName(),
                employer.getLogoUrl(),
                employer.getCity(),
                employer.getAddress(),
                employer.getUser().getEmail(),
                employer.getPhone(),
                employer.getCompanySize(),
                employer.getCompanyModel(),
                employer.getWorkingTime(),
                employer.getOvertimePolicy(),
                employer.getDescription(),
                jobRepository.countByEmployerId(employer.getId())
        );
        return companyResponse;
    }
}
