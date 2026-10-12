package VnITJobs.backend.repository;

import VnITJobs.backend.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CvRepository extends JpaRepository<CV,Long> {
    List<CV> findByCandidateId(Long candidateId);
}
