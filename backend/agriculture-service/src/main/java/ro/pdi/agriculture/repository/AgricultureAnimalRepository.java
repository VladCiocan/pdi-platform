package ro.pdi.agriculture.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.agriculture.model.AgricultureAnimal;

import java.util.List;
import java.util.UUID;

@Repository
public interface AgricultureAnimalRepository extends JpaRepository<AgricultureAnimal, UUID> {

    List<AgricultureAnimal> findByHouseholdIdAndIsActiveTrue(UUID householdId);

    List<AgricultureAnimal> findByIsActiveTrue();

    @Query("SELECT COUNT(a) FROM AgricultureAnimal a WHERE a.householdId = :householdId AND a.isActive = true")
    long countByHouseholdId(@Param("householdId") UUID householdId);

    @Query("SELECT COUNT(a) FROM AgricultureAnimal a WHERE a.isActive = true")
    long countActiveAnimals();
}
