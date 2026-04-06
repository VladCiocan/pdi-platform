package ro.pdi.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.dms.model.DmsWorkflow;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DmsWorkflowRepository extends JpaRepository<DmsWorkflow, UUID> {
    List<DmsWorkflow> findByIsActiveTrue();
    List<DmsWorkflow> findByWorkflowTypeAndIsActiveTrue(String workflowType);
    Optional<DmsWorkflow> findByNameAndIsActiveTrue(String name);
}