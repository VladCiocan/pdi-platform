package ro.pdi.tax.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ro.pdi.tax.model.TaxLiability;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaxLiabilityRepository extends JpaRepository<TaxLiability, UUID> {
    
    List<TaxLiability> findByContributorId(UUID contributorId);
    
    List<TaxLiability> findByPropertyId(UUID propertyId);
    
    List<TaxLiability> findByTaxType(TaxLiability.TaxType taxType);
    
    List<TaxLiability> findByTaxYear(Integer taxYear);
    
    List<TaxLiability> findByStatus(TaxLiability.LiabilityStatus status);
    
    @Query("SELECT tl FROM TaxLiability tl WHERE tl.contributorId = :contributorId AND tl.taxYear = :year AND tl.isActive = true")
    List<TaxLiability> findByContributorAndYear(UUID contributorId, Integer year);
    
    @Query("SELECT tl FROM TaxLiability tl WHERE tl.status IN ('DUE', 'PARTIAL_PAID', 'OVERDUE') AND tl.dueDate < :date")
    List<TaxLiability> findOverdueLiabilities(LocalDate date);
    
    @Query("SELECT SUM(tl.remainingAmount) FROM TaxLiability tl WHERE tl.contributorId = :contributorId AND tl.status IN ('DUE', 'PARTIAL_PAID', 'OVERDUE')")
    BigDecimal getTotalOutstandingByContributor(UUID contributorId);
    
    @Query("SELECT SUM(tl.totalDue) FROM TaxLiability tl WHERE tl.taxYear = :year AND tl.taxType = :taxType")
    BigDecimal getTotalByYearAndType(Integer year, TaxLiability.TaxType taxType);
    
    @Query("SELECT tl FROM TaxLiability tl WHERE tl.contributorId = :contributorId AND tl.taxYear = :year AND tl.taxType = :taxType")
    List<TaxLiability> findByContributorYearAndType(UUID contributorId, Integer year, TaxLiability.TaxType taxType);
}