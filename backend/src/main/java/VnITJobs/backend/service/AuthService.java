    package VnITJobs.backend.service;

    import VnITJobs.backend.dto.auth.*;
    import VnITJobs.backend.entity.Candidate;
    import VnITJobs.backend.entity.Employer;
    import VnITJobs.backend.entity.Role;
    import VnITJobs.backend.entity.User;
    import VnITJobs.backend.repository.UserRepository;
    import VnITJobs.backend.security.JwtUtil;
    import org.springframework.http.HttpStatus;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;
    import org.springframework.web.server.ResponseStatusException;

    import java.util.Optional;

    @Service
    public class AuthService {
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
            this.jwtUtil = jwtUtil;
        }

        public CandidateRegisterResponse registerCandidate(CandidateRegisterRequest request) {
            String fullName = request.getFullName();
            String email = request.getEmail();
            Optional<User> ketqua = userRepository.findByEmail(email);
            if (!ketqua.isEmpty()) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email da ton tai");
            String rawPassword = request.getPassword();
            String encodedPassword = passwordEncoder.encode(rawPassword);

            User user = new User();
            Candidate candidate = new Candidate();

            user.setEmail(email);
            user.setPassword(encodedPassword);
            user.setRole(Role.CANDIDATE);

            candidate.setFullName(fullName);

            candidate.setUser(user);
            user.setCandidate(candidate);

            userRepository.save(user);
            CandidateRegisterResponse candidateRegisterResponse = new CandidateRegisterResponse(user.getId(),candidate.getFullName(),user.getEmail(),user.getRole());
            return candidateRegisterResponse;
        }

        public EmployerRegisterResponse registerEmployer(EmployerRegisterRequest request) {
            String companyName = request.getCompanyName();
            String email = request.getEmail();
            Optional<User> ketqua = userRepository.findByEmail(email);
            if (!ketqua.isEmpty()) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email da ton tai");
            String rawPassword = request.getPassword();
            String encodedPassword = passwordEncoder.encode(rawPassword);

            User user = new User();
            Employer employer = new Employer();
            user.setEmail(email);
            user.setPassword(encodedPassword);
            user.setRole(Role.EMPLOYER);

            employer.setCompanyName(companyName);

            employer.setUser(user);
            user.setEmployer(employer);

            userRepository.save(user);
            EmployerRegisterResponse employerRegisterResponse = new EmployerRegisterResponse(user.getId(), employer.getCompanyName(), user.getEmail(), user.getRole());
            return employerRegisterResponse;
        }
        public LoginResponse login(LoginRequest request){
            String email = request.getEmail();
            Optional<User> kq = userRepository.findByEmail(email);
            if(kq.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "email hoac mat khau khong dung");
            }
            User user = kq.get();

            String rawInputPassword = request.getPassword();

            if(!passwordEncoder.matches(rawInputPassword,user.getPassword())){
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "email hoac mat khau khong dung");
            }
            LoginResponse loginResponse = new LoginResponse(user.getId(),user.getRole(),jwtUtil.createToken(user.getId(),user.getRole()));
            return loginResponse;
        }
    }

