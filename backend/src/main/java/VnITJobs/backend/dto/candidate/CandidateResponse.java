package VnITJobs.backend.dto.candidate;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse {
    private long id;

    private String email;

    private String fullName;

    private String avatarUrl;

    private String phone;

}
