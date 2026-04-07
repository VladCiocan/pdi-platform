package ro.pdi.agriculture.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.agriculture.model.AgricultureHousehold;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgricultureHouseholdRepository extends JpaRepository<AgricultureHousehold, UUID> {

    List<AgricultureHousehold> findByOwnerIdAndIsActiveTrue(UUID ownerId);

    Optional<AgricultureHousehold> findByHouseholdCodeAndIsActiveTrue(String householdCode);

    List<AgricultureHousehold> findByIsActiveTrue();

    @Query("SELECT h FROM AgricultureHousehold h WHERE h.ownerId = :ownerId AND h.isActive = true ORDER BY h.registrationDate DESC")
    List<AgricultureHousehold> findActiveByOwnerOrderByDateDesc(@Param("ownerId") UUID ownerId);

    @Query("SELECT COUNT(h) FROM AgricultureHousehold h WHERE h.isActive = true")
    long countActiveHouseholds();
}
