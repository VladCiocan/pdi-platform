package ro.pdi.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.infrastructure.model.InfrastructureNetwork;

import java.util.List;
import java.util.UUID;

@Repository
public interface InfrastructureNetworkRepository extends JpaRepository<InfrastructureNetwork, UUID> {

    List<InfrastructureNetwork> findByIsActiveTrue();

    List<InfrastructureNetwork> findByNetworkTypeAndIsActiveTrue(InfrastructureNetwork.NetworkType type);

    @Query("SELECT COUNT(n) FROM InfrastructureNetwork n WHERE n.isActive = true")
    long countActiveNetworks();
}
