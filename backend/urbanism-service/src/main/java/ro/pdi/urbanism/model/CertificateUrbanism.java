package ro.pdi.urbanism.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "urbanism_cu")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateUrbanism {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cu_number", unique = true, length = 30)
    private String cuNumber;

    @Column(name = "register_id")
    private UUID registerId;

    @Column(name = "applicant_id", nullable = false)
    private UUID applicantId;

    @Column(name = "utr_id")
    private UUID utrId;

    @Column(name = "address_id")
    private UUID addressId;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "cu_status", nullable = false, length = 20)
    @Builder.Default
    private CUStatus status = CUStatus.IN_PROGRESS;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "legal_regime", length = 500)
    private String legalRegime;

    @Column(name = "urbanism_certificate_type", length = 50)
    private String urbanismCertificateType;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String conditions;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "issued_by")
    private UUID issuedBy;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    private java.math.BigDecimal taxAmount;

    @Column(name = "tax_paid", nullable = false)
    @Builder.Default
    private Boolean taxPaid = false;

    @Column(name = "document_path", length = 500)
    private String documentPath;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CUStatus {
        IN_PROGRESS,
        PENDING_TAX,
        ISSUED,
        EXPIRED,
        CANCELLED
    }
}