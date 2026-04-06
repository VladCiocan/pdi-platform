package ro.pdi.urbanism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.urbanism.model.CertificateUrbanism;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificateUrbanismRepository extends JpaRepository<CertificateUrbanism, UUID> {
    List<CertificateUrbanism> findByApplicantId(UUID applicantId);
    List<CertificateUrbanism> findByStatus(CertificateUrbanism.CUStatus status);
}