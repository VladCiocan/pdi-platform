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
@Table(name = "urbanism_cns")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateNomenclature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "cns_number", unique = true, length = 30)
    private String cnsNumber;

    @Column(name = "register_id")
    private UUID registerId;

    @Column(name = "applicant_id", nullable = false)
    private UUID applicantId;

    @Column(name = "address_id")
    private UUID addressId;

    @Column(name = "street_name", length = 255)
    private String streetName;

    @Column(name = "street_code", length = 20)
    private String streetCode;

    @Column(name = "street_number", length = 20)
    private String streetNumber;

    @Column(name = "block", length = 20)
    private String block;

    @Column(name = "entry", length = 20)
    private String entry;

    @Column(name = "floor", length = 20)
    private String floor;

    @Column(name = "apartment", length = 20)
    private String apartment;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "cns_status", nullable = false, length = 20)
    @Builder.Default
    private CNSStatus status = CNSStatus.IN_PROGRESS;

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

    public enum CNSStatus {
        IN_PROGRESS,
        PENDING_TAX,
        ISSUED,
        CANCELLED
    }
}