package VnITJobs.backend.dto.job;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;

    private String companyName;

    private long minSalary;

    private long maxSalary;

    private String level;

    private String images;

    private String workType;

    private String address;

    private String technologies;

    private String description;
}
