package ro.pdi.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.infrastructure.model.InfrastructureIncident;

import java.util.List;
import java.util.UUID;

@Repository
public interface InfrastructureIncidentRepository extends JpaRepository<InfrastructureIncident, UUID> {

    List<InfrastructureIncident> findByIsActiveTrue();

    List<InfrastructureIncident> findByStatusAndIsActiveTrue(InfrastructureIncident.IncidentStatus status);

    List<InfrastructureIncident> findBySeverityAndIsActiveTrue(InfrastructureIncident.Severity severity);

    List<InfrastructureIncident> findByNetworkIdAndIsActiveTrue(UUID networkId);

    List<InfrastructureIncident> findByAssetIdAndIsActiveTrue(UUID assetId);

    List<InfrastructureIncident> findByAssignedToAndIsActiveTrue(UUID assignedTo);

    @Query("SELECT COUNT(i) FROM InfrastructureIncident i WHERE i.status = 'NEW' AND i.isActive = true")
    long countNewIncidents();

    @Query("SELECT COUNT(i) FROM InfrastructureIncident i WHERE i.status = 'IN_PROGRESS' AND i.isActive = true")
    long countInProgressIncidents();
}
