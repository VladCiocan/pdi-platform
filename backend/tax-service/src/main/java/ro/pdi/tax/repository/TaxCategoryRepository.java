package ro.pdi.tax.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ro.pdi.tax.model.TaxCategory;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaxCategoryRepository extends JpaRepository<TaxCategory, UUID> {
    
    Optional<TaxCategory> findByCode(String code);
    
    List<TaxCategory> findByTaxType(TaxCategory.TaxType taxType);
    
    List<TaxCategory> findByIsActiveTrue();
    
    @Query("SELECT tc FROM TaxCategory tc WHERE tc.isActive = true AND tc.validFrom <= :date AND (tc.validTo IS NULL OR tc.validTo >= :date)")
    List<TaxCategory> findActiveCategoriesForDate(LocalDate date);
    
    @Query("SELECT tc FROM TaxCategory tc WHERE tc.code = :code AND tc.isActive = true AND tc.validFrom <= :date AND (tc.validTo IS NULL OR tc.validTo >= :date)")
    Optional<TaxCategory> findActiveByCodeForDate(String code, LocalDate date);
}