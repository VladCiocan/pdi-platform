package ro.pdi.urbanism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.urbanism.model.CertificateNomenclature;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificateNomenclatureRepository extends JpaRepository<CertificateNomenclature, UUID> {
    List<CertificateNomenclature> findByApplicantId(UUID applicantId);
}