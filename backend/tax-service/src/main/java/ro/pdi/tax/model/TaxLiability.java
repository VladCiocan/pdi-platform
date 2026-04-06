package ro.pdi.tax.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tax_liabilities")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxLiability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "contributor_id", nullable = false)
    private UUID contributorId;

    @Column(name = "property_id")
    private UUID propertyId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tax_type", nullable = false, length = 30)
    private TaxType taxType;

    @Column(name = "tax_year", nullable = false)
    private Integer taxYear;

    @Column(name = "tax_period", length = 10)
    private String taxPeriod;

    @Column(name = "category_id")
    private UUID categoryId;

    @Column(name = "gross_tax", precision = 15, scale = 2, nullable = false)
    private BigDecimal grossTax;

    @Column(name = "exemption_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal exemptionAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "net_tax", precision = 15, scale = 2, nullable = false)
    private BigDecimal netTax;

    @Column(name = "penalty_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal penaltyAmount = BigDecimal.ZERO;

    @Column(name = "total_due", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalDue;

    @Column(name = "paid_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal remainingAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "liability_status", nullable = false, length = 20)
    @Builder.Default
    private LiabilityStatus status = LiabilityStatus.DUE;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "settlement_date")
    private LocalDate settlementDate;

    @Column(name = "supersolva_balance", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal supersolvaBalance = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TaxType {
        IMPOZIT_CLADIRE,
        IMPOZIT_TEREN,
        IMPOZIT_AUTO,
        TAXA_URBANISM,
        ALTE_TAXE
    }

    public enum LiabilityStatus {
        DUE,
        PARTIAL_PAID,
        PAID,
        OVERDUE,
        EXTINGUISHED,
        PRESCRIBED
    }
}