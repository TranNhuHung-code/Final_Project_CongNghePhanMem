package VnITJobs.backend.dto.company;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private long id;

    private String companyName;

    private String logoUrl;

    private String city;

    private String address;

    private String email;

    private String phone;

    private String companySize;

    private String companyModel;

    private String workingTime;

    private String overtimePolicy;

    private String description;
}