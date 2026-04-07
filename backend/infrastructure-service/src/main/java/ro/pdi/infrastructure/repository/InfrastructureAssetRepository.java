package ro.pdi.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.infrastructure.model.InfrastructureAsset;

import java.util.List;
import java.util.UUID;

@Repository
public interface InfrastructureAssetRepository extends JpaRepository<InfrastructureAsset, UUID> {

    List<InfrastructureAsset> findByNetworkIdAndIsActiveTrue(UUID networkId);

    List<InfrastructureAsset> findByIsActiveTrue();

    List<InfrastructureAsset> findByAssetTypeAndIsActiveTrue(InfrastructureAsset.AssetType type);

    List<InfrastructureAsset> findByNetworkIdAndAssetTypeAndIsActiveTrue(UUID networkId, InfrastructureAsset.AssetType type);

    @Query("SELECT COUNT(a) FROM InfrastructureAsset a WHERE a.isActive = true")
    long countActiveAssets();
}
