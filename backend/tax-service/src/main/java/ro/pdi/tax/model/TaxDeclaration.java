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
@Table(name = "tax_declarations")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "declaration_number", unique = true, length = 30)
    private String declarationNumber;

    @Column(name = "contributor_id", nullable = false)
    private UUID contributorId;

    @Column(name = "property_id")
    private UUID propertyId;

    @Enumerated(EnumType.STRING)
    @Column(name = "declaration_type", nullable = false, length = 30)
    private DeclarationType declarationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "declaration_status", nullable = false, length = 20)
    @Builder.Default
    private DeclarationStatus status = DeclarationStatus.DRAFT;

    @Column(name = "tax_year")
    private Integer taxYear;

    @Column(columnDefinition = "jsonb")
    private String declarationData;

    @Column(name = "calculated_tax", precision = 15, scale = 2)
    private BigDecimal calculatedTax;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    @Column(name = "validated_by")
    private UUID validatedBy;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

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

    public enum DeclarationType {
        DECLARARE_CLADIRE,
        DECLARARE_TEREN,
        DECLARARE_AUTO,
        MODIFICARE,
        INCETARE
    }

    public enum DeclarationStatus {
        DRAFT,
        SUBMITTED,
        VALIDATED,
        REJECTED,
        CANCELLED
    }
}