package ro.pdi.agriculture.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.agriculture.model.AgricultureMember;

import java.util.List;
import java.util.UUID;

@Repository
public interface AgricultureMemberRepository extends JpaRepository<AgricultureMember, UUID> {

    List<AgricultureMember> findByHouseholdIdAndIsActiveTrue(UUID householdId);

    List<AgricultureMember> findByIsActiveTrue();

    @Query("SELECT COUNT(m) FROM AgricultureMember m WHERE m.householdId = :householdId AND m.isActive = true")
    long countByHouseholdId(@Param("householdId") UUID householdId);

    @Query("SELECT COUNT(m) FROM AgricultureMember m WHERE m.isActive = true")
    long countActiveMembers();
}
