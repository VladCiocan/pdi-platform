package ro.pdi.tax.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ro.pdi.tax.model.TaxDeclaration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaxDeclarationRepository extends JpaRepository<TaxDeclaration, UUID> {
    
    List<TaxDeclaration> findByContributorId(UUID contributorId);
    
    List<TaxDeclaration> findByPropertyId(UUID propertyId);
    
    List<TaxDeclaration> findByDeclarationType(TaxDeclaration.DeclarationType declarationType);
    
    List<TaxDeclaration> findByStatus(TaxDeclaration.DeclarationStatus status);
    
    Optional<TaxDeclaration> findByDeclarationNumber(String declarationNumber);
    
    @Query("SELECT td FROM TaxDeclaration td WHERE td.contributorId = :contributorId AND td.taxYear = :year AND td.isActive = true")
    List<TaxDeclaration> findByContributorAndYear(UUID contributorId, Integer year);
    
    @Query("SELECT COUNT(td) FROM TaxDeclaration td WHERE td.status = :status AND td.taxYear = :year")
    Long countByStatusAndYear(TaxDeclaration.DeclarationStatus status, Integer year);
}