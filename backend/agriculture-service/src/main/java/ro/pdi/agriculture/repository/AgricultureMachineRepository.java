package ro.pdi.agriculture.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.agriculture.model.AgricultureMachine;

import java.util.List;
import java.util.UUID;

@Repository
public interface AgricultureMachineRepository extends JpaRepository<AgricultureMachine, UUID> {

    List<AgricultureMachine> findByHouseholdIdAndIsActiveTrue(UUID householdId);

    List<AgricultureMachine> findByIsActiveTrue();

    @Query("SELECT COUNT(m) FROM AgricultureMachine m WHERE m.householdId = :householdId AND m.isActive = true")
    long countByHouseholdId(@Param("householdId") UUID householdId);

    @Query("SELECT COUNT(m) FROM AgricultureMachine m WHERE m.isActive = true")
    long countActiveMachines();
}
