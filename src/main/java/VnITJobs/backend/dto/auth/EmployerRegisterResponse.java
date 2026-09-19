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
public class EmployerRegisterResponse {
    private Long id;

    private String companyName;

    private String email;

    private Role role;
}
