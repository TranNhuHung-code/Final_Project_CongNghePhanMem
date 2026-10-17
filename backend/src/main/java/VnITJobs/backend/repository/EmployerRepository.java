package VnITJobs.backend.repository;

import VnITJobs.backend.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface EmployerRepository extends JpaRepository<Employer,Long> {
    Optional<Employer> findByUserId(Long userId);

    @Query("""
        SELECT e FROM Employer e
        WHERE (
            :keyword IS NULL
            OR LOWER(e.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (
            :city IS NULL
            OR LOWER(e.city) = LOWER(:city)
        )
        """)
    List<Employer> searchCompanies(
            @Param("keyword") String keyword,
            @Param("city") String city
    );
}
