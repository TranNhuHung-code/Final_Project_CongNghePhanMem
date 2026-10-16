package VnITJobs.backend.repository;

import VnITJobs.backend.dto.job.JobResponse;
import VnITJobs.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId (Long employerId);
    long countByEmployerId(Long employerId);

    @Query("""
        SELECT j FROM Job j
        JOIN j.employer e
        WHERE (
            :keyword IS NULL
            OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(j.technologies) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(e.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (
            :city IS NULL
            OR LOWER(e.city) = LOWER(:city)
        )
        AND (
            :level IS NULL
            OR LOWER(j.level) = LOWER(:level)
        )
        AND (
            :workType IS NULL
            OR LOWER(j.workType) = LOWER(:workType)
        )    
         AND (
            :companyId IS NULL
            OR e.id = :companyId
        )   
        """)
    List<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("city") String city,
            @Param("level") String level,
            @Param("workType") String workType,
            @Param("companyId") Long companyId
    );
}
