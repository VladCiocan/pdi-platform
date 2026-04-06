package ro.pdi.tax.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ro.pdi.tax.model.TaxPayment;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaxPaymentRepository extends JpaRepository<TaxPayment, UUID> {
    
    List<TaxPayment> findByContributorId(UUID contributorId);
    
    List<TaxPayment> findByPropertyId(UUID propertyId);
    
    List<TaxPayment> findByPaymentType(TaxPayment.PaymentType paymentType);
    
    List<TaxPayment> findByPaymentMethod(TaxPayment.PaymentMethod paymentMethod);
    
    List<TaxPayment> findByStatus(TaxPayment.PaymentStatus status);
    
    @Query("SELECT tp FROM TaxPayment tp WHERE tp.contributorId = :contributorId AND tp.paymentDate BETWEEN :startDate AND :endDate")
    List<TaxPayment> findByContributorAndDateRange(UUID contributorId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(tp.totalAmount) FROM TaxPayment tp WHERE tp.status = 'PROCESSED' AND tp.paymentDate BETWEEN :startDate AND :endDate")
    java.math.BigDecimal sumTotalPaymentsBetweenDates(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(tp.totalAmount) FROM TaxPayment tp WHERE tp.contributorId = :contributorId AND tp.status = 'PROCESSED'")
    java.math.BigDecimal sumTotalPaymentsByContributor(UUID contributorId);
}