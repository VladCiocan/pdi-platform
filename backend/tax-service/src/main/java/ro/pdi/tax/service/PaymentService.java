package ro.pdi.tax.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.pdi.tax.dto.PaymentRequest;
import ro.pdi.tax.model.TaxLiability;
import ro.pdi.tax.model.TaxPayment;
import ro.pdi.tax.repository.TaxLiabilityRepository;
import ro.pdi.tax.repository.TaxPaymentRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final TaxPaymentRepository paymentRepository;
    private final TaxLiabilityRepository liabilityRepository;
    private final TaxCalculationService calculationService;

    public PaymentService(
            TaxPaymentRepository paymentRepository,
            TaxLiabilityRepository liabilityRepository,
            TaxCalculationService calculationService) {
        this.paymentRepository = paymentRepository;
        this.liabilityRepository = liabilityRepository;
        this.calculationService = calculationService;
    }

    @Transactional
    public TaxPayment processPayment(PaymentRequest request) {
        BigDecimal totalAmount = request.getAmount();

        BigDecimal penaltyAmount = BigDecimal.ZERO;
        if (request.getTaxLiabilityId() != null) {
            TaxLiability liability = liabilityRepository.findById(request.getTaxLiabilityId())
                    .orElse(null);

            if (liability != null) {
                penaltyAmount = calculationService.calculatePenalty(
                        liability.getTotalDue(),
                        liability.getDueDate(),
                        request.getPaymentDate()
                );
                totalAmount = totalAmount.add(penaltyAmount);
            }
        }

        BigDecimal discountAmount = request.getDiscountAmount() != null 
                ? request.getDiscountAmount() 
                : BigDecimal.ZERO;
        totalAmount = totalAmount.subtract(discountAmount);

        TaxPayment payment = TaxPayment.builder()
                .paymentNumber(generatePaymentNumber())
                .contributorId(request.getContributorId())
                .propertyId(request.getPropertyId())
                .taxLiabilityId(request.getTaxLiabilityId())
                .paymentType(request.getPaymentType())
                .paymentMethod(request.getPaymentMethod())
                .paymentDate(request.getPaymentDate())
                .amount(request.getAmount())
                .penaltyAmount(penaltyAmount)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .transactionId(request.getTransactionId())
                .bankReference(request.getBankReference())
                .paymentDetails(request.getPaymentDetails())
                .status(TaxPayment.PaymentStatus.PROCESSED)
                .processedAt(LocalDateTime.now())
                .build();

        payment = paymentRepository.save(payment);

        if (request.getTaxLiabilityId() != null) {
            settleLiability(request.getTaxLiabilityId(), totalAmount);
        }

        return payment;
    }

    @Transactional
    public void settleLiability(UUID liabilityId, BigDecimal paymentAmount) {
        TaxLiability liability = liabilityRepository.findById(liabilityId)
                .orElseThrow(() -> new RuntimeException("Liability not found"));

        BigDecimal newPaidAmount = liability.getPaidAmount().add(paymentAmount);
        BigDecimal newRemainingAmount = liability.getTotalDue().subtract(newPaidAmount);

        liability.setPaidAmount(newPaidAmount);
        liability.setRemainingAmount(newRemainingAmount.setScale(2, RoundingMode.HALF_UP));

        if (newRemainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
            liability.setStatus(TaxLiability.LiabilityStatus.PAID);
            liability.setSettlementDate(LocalDateTime.now().toLocalDate());
            liability.setRemainingAmount(BigDecimal.ZERO);
        } else if (newRemainingAmount.compareTo(liability.getTotalDue()) < 0) {
            liability.setStatus(TaxLiability.LiabilityStatus.PARTIAL_PAID);
        }

        liabilityRepository.save(liability);
    }

    @Transactional
    public void reconcilePayment(UUID paymentId) {
        TaxPayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == TaxPayment.PaymentStatus.PENDING) {
            payment.setStatus(TaxPayment.PaymentStatus.RECONCILED);
            paymentRepository.save(payment);
        }
    }

    @Transactional
    public void cancelPayment(UUID paymentId) {
        TaxPayment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(TaxPayment.PaymentStatus.CANCELLED);
        paymentRepository.save(payment);

        if (payment.getTaxLiabilityId() != null) {
            TaxLiability liability = liabilityRepository.findById(payment.getTaxLiabilityId())
                    .orElse(null);
            if (liability != null) {
                liability.setPaidAmount(liability.getPaidAmount().subtract(payment.getTotalAmount()));
                if (liability.getPaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    liability.setPaidAmount(BigDecimal.ZERO);
                    liability.setStatus(TaxLiability.LiabilityStatus.DUE);
                } else {
                    liability.setStatus(TaxLiability.LiabilityStatus.PARTIAL_PAID);
                }
                liability.setRemainingAmount(liability.getTotalDue().subtract(liability.getPaidAmount()));
                liabilityRepository.save(liability);
            }
        }
    }

    public List<TaxPayment> getPaymentsByContributor(UUID contributorId) {
        return paymentRepository.findByContributorId(contributorId);
    }

    public BigDecimal getTotalPaymentsByContributor(UUID contributorId) {
        BigDecimal total = paymentRepository.sumTotalPaymentsByContributor(contributorId);
        return total != null ? total : BigDecimal.ZERO;
    }

    private String generatePaymentNumber() {
        return "P" + System.currentTimeMillis();
    }
}