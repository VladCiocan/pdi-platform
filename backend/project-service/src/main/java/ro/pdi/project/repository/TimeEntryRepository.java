package ro.pdi.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.project.model.TimeEntry;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, UUID> {

    List<TimeEntry> findByProjectIdAndIsActiveTrue(UUID projectId);

    List<TimeEntry> findByTaskIdAndIsActiveTrue(UUID taskId);
}
