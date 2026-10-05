package VnITJobs.backend.dto.job;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {
    @NotBlank
    private String title;

    private long minSalary;
    private long maxSalary;

    @NotBlank 
    private String level;

    @NotBlank 
    private String workType;

    private String technologies;

    private String images;

    private String description;

}
