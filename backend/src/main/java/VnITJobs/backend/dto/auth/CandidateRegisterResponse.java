package VnITJobs.backend.dto.auth;

import VnITJobs.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidateRegisterResponse {
    private Long id;

    private String fullName;

    private String email;

    private Role role;
}
