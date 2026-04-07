package ro.pdi.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.project.model.ProjectTask;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectTaskRepository extends JpaRepository<ProjectTask, UUID> {

    List<ProjectTask> findByProjectIdAndIsActiveTrue(UUID projectId);

    List<ProjectTask> findByStatusAndIsActiveTrue(String status);

    @Query("SELECT COUNT(t) FROM ProjectTask t WHERE t.projectId = :projectId AND t.isActive = true")
    long countByProjectIdAndIsActiveTrue(@Param("projectId") UUID projectId);
}
