package VnITJobs.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email khong duoc de trong")
    private String email;
    @NotBlank(message = "Mat khau khong duoc de trong")
    private String password;
}
