package VnITJobs.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class EmployerRegisterRequest {
    @NotBlank(message ="Ten cong ty khong duoc de trong")
    private String companyName;

    @Email
    @NotBlank(message ="Email khong duoc de trong")
    private String email;

    @NotBlank(message ="Mat khau khong duoc de trong")
    private String password;
}
