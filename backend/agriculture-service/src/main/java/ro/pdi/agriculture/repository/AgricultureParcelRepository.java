package ro.pdi.agriculture.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.agriculture.model.AgricultureParcel;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgricultureParcelRepository extends JpaRepository<AgricultureParcel, UUID> {

    List<AgricultureParcel> findByHouseholdIdAndIsActiveTrue(UUID householdId);

    List<AgricultureParcel> findByOwnerIdAndIsActiveTrue(UUID ownerId);

    Optional<AgricultureParcel> findByCadastralNumberAndIsActiveTrue(String cadastralNumber);

    List<AgricultureParcel> findByIsActiveTrue();

    @Query("SELECT SUM(p.area) FROM AgricultureParcel p WHERE p.householdId = :householdId AND p.isActive = true")
    BigDecimal sumAreaByHouseholdId(@Param("householdId") UUID householdId);

    @Query("SELECT COUNT(p) FROM AgricultureParcel p WHERE p.isActive = true")
    long countActiveParcels();
}
