package ro.pdi.urbanism.model;

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
@Table(name = "urbanism_ac")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Authorization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "ac_number", unique = true, length = 30)
    private String acNumber;

    @Column(name = "cu_id")
    private UUID cuId;

    @Column(name = "register_id")
    private UUID registerId;

    @Column(name = "applicant_id", nullable = false)
    private UUID applicantId;

    @Column(name = "utr_id")
    private UUID utrId;

    @Enumerated(EnumType.STRING)
    @Column(name = "authorization_type", nullable = false, length = 20)
    private AuthorizationType authorizationType;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "ac_status", nullable = false, length = 20)
    @Builder.Default
    private ACStatus status = ACStatus.IN_PROGRESS;

    @Column(name = "construction_type", length = 100)
    private String constructionType;

    @Column(name = "destination", length = 255)
    private String destination;

    @Column(name = "built_area", precision = 10, scale = 2)
    private BigDecimal builtArea;

    @Column(name = "total_area", precision = 10, scale = 2)
    private BigDecimal totalArea;

    @Column(name = "height", precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "floors")
    private Integer floors;

    @Column(name = "rooms")
    private Integer rooms;

    @Column(name = "construction_value", precision = 15, scale = 2)
    private BigDecimal constructionValue;

    @Column(columnDefinition = "TEXT")
    private String technicalConditions;

    @Column(columnDefinition = "TEXT")
    private String urbanismConditions;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "issued_by")
    private UUID issuedBy;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "regularization_tax", precision = 15, scale = 2)
    private BigDecimal regularizationTax;

    @Column(name = "tax_paid", nullable = false)
    @Builder.Default
    private Boolean taxPaid = false;

    @Column(name = "document_path", length = 500)
    private String documentPath;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(name = "receiving_date")
    private LocalDate receivingDate;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AuthorizationType {
        CONSTRUIRE,
        DESFIINTARE
    }

    public enum ACStatus {
        IN_PROGRESS,
        PENDING_TAX,
        ISSUED,
        IN_EXECUTION,
        COMPLETED,
        RECEIVED,
        EXPIRED,
        CANCELLED
    }
}