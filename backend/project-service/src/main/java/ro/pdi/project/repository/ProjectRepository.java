package ro.pdi.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pdi.project.model.Project;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByIsActiveTrue();

    List<Project> findByStatusAndIsActiveTrue(String status);

    List<Project> findByManagerIdAndIsActiveTrue(UUID managerId);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.isActive = true")
    long countByIsActiveTrue();
}
