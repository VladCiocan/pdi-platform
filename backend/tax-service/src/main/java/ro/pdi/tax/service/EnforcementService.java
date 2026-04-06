package ro.pdi.tax.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.pdi.tax.model.TaxLiability;
import ro.pdi.tax.model.TaxPayment;
import ro.pdi.tax.repository.TaxLiabilityRepository;
import ro.pdi.tax.repository.TaxPaymentRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EnforcementService {

    private final TaxLiabilityRepository liabilityRepository;
    private final TaxPaymentRepository paymentRepository;

    public EnforcementService(
            TaxLiabilityRepository liabilityRepository,
            TaxPaymentRepository paymentRepository) {
        this.liabilityRepository = liabilityRepository;
        this.paymentRepository = paymentRepository;
    }

    public List<TaxLiability> identifyOverdueCases(int daysOverdue, BigDecimal minimumAmount) {
        LocalDate cutOffDate = LocalDate.now().minusDays(daysOverdue);
        List<TaxLiability> allOverdue = liabilityRepository.findOverdueLiabilities(cutOffDate);

        return allOverdue.stream()
                .filter(l -> l.getRemainingAmount().compareTo(minimumAmount) >= 0)
                .toList();
    }

    @Transactional
    public void applyPrescription(UUID liabilityId) {
        TaxLiability liability = liabilityRepository.findById(liabilityId)
                .orElseThrow(() -> new RuntimeException("Liability not found"));

        liability.setStatus(TaxLiability.LiabilityStatus.PRESCRIBED);
        liability.setIsActive(false);
        liabilityRepository.save(liability);
    }

    public List<TaxLiability> checkPrescription(int prescriptionYears) {
        List<TaxLiability> prescriptions = new ArrayList<>();
        LocalDate prescriptionDate = LocalDate.now().minusYears(prescriptionYears);

        List<TaxLiability> allLiabilities = liabilityRepository.findAll();
        for (TaxLiability liability : allLiabilities) {
            if (liability.getDueDate() != null 
                    && liability.getDueDate().isBefore(prescriptionDate)
                    && liability.getStatus() != TaxLiability.LiabilityStatus.PAID
                    && liability.getStatus() != TaxLiability.LiabilityStatus.PRESCRIBED) {
                prescriptions.add(liability);
            }
        }
        return prescriptions;
    }

    public BigDecimal calculateTotalOverdueAmount(UUID contributorId) {
        return liabilityRepository.getTotalOutstandingByContributor(contributorId);
    }

    @Transactional
    public void writeOffSmallAmounts(BigDecimal threshold) {
        List<TaxLiability> activeLiabilities = liabilityRepository.findAll();
        
        for (TaxLiability liability : activeLiabilities) {
            if (liability.getRemainingAmount() != null 
                    && liability.getRemainingAmount().compareTo(threshold) < 0
                    && liability.getStatus() == TaxLiability.LiabilityStatus.OVERDUE) {
                liability.setStatus(TaxLiability.LiabilityStatus.EXTINGUISHED);
                liability.setRemainingAmount(BigDecimal.ZERO);
                liabilityRepository.save(liability);
            }
        }
    }
}