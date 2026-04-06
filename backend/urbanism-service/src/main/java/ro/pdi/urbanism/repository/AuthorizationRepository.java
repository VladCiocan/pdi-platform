package ro.pdi.urbanism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.urbanism.model.Authorization;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuthorizationRepository extends JpaRepository<Authorization, UUID> {
    List<Authorization> findByApplicantId(UUID applicantId);
    List<Authorization> findByStatus(Authorization.ACStatus status);
}