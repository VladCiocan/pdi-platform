package ro.pdi.tax.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tax_payments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "payment_number", unique = true, length = 30)
    private String paymentNumber;

    @Column(name = "contributor_id", nullable = false)
    private UUID contributorId;

    @Column(name = "property_id")
    private UUID propertyId;

    @Column(name = "tax_liability_id")
    private UUID taxLiabilityId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 20)
    private PaymentType paymentType;

    @Column(name = "payment_method", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "penalty_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal penaltyAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "receipt_number", length = 30)
    private String receiptNumber;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "bank_reference", length = 100)
    private String bankReference;

    @Column(name = "payment_details", columnDefinition = "TEXT")
    private String paymentDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum PaymentType {
        IMPOZIT_CLADIRE,
        IMPOZIT_TEREN,
        IMPOZIT_AUTO,
        TAXA_URBANISM,
        ALTE_TAXE
    }

    public enum PaymentMethod {
        NUMERAR,
        ORDIN_PLATA,
        CARD,
        ONLINE,
        GHISEUL_RO,
        VIRAMENT
    }

    public enum PaymentStatus {
        PENDING,
        PROCESSED,
        RECONCILED,
        CANCELLED,
        REFUNDED
    }
}