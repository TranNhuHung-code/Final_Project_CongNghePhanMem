package VnITJobs.backend.dto.application;

import VnITJobs.backend.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private long id;

    private String jobTitle;

    private String level;

    private long minSalary;

    private long maxSalary;

    private String worktype;

    private String candidateName;

    private String candidateEmail;

    private String candidatePhone;

    private String cvFileUrl;

    private boolean viewed;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;
}

