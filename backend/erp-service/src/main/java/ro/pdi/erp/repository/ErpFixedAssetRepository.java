package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.inventory.ErpFixedAsset;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ErpFixedAssetRepository extends JpaRepository<ErpFixedAsset, UUID> {

    List<ErpFixedAsset> findByIsActiveTrue();

    List<ErpFixedAsset> findByAssetCategoryAndIsActiveTrue(String assetCategory);

    List<ErpFixedAsset> findByStatusAndIsActiveTrue(ErpFixedAsset.AssetStatus status);

    Optional<ErpFixedAsset> findByInventoryNumberAndIsActiveTrue(String inventoryNumber);

    @Query("SELECT COUNT(a) FROM ErpFixedAsset a WHERE a.isActive = true")
    long countActiveAssets();
}
