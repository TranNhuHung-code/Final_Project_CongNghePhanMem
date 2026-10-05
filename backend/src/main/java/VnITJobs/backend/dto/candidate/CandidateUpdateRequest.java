package VnITJobs.backend.dto.candidate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CandidateUpdateRequest {
    @NotBlank
    private String fullName;
    private String avatarUrl;
    @NotBlank
    private String phone;

}
