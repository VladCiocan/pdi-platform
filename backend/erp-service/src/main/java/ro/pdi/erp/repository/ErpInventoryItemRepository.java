package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.inventory.ErpInventoryItem;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ErpInventoryItemRepository extends JpaRepository<ErpInventoryItem, UUID> {

    List<ErpInventoryItem> findByIsActiveTrue();

    List<ErpInventoryItem> findByCategoryAndIsActiveTrue(String category);

    List<ErpInventoryItem> findByIsActiveTrueAndStatus(ErpInventoryItem.ItemStatus status);

    Optional<ErpInventoryItem> findByCodeAndIsActiveTrue(String code);

    @Query("SELECT COUNT(i) FROM ErpInventoryItem i WHERE i.isActive = true")
    long countActiveItems();
}
