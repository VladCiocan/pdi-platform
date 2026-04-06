package ro.pdi.erp.model.budget;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "erp_budgets")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "source_code", length = 20)
    private String sourceCode;

    @Column(name = "classification_code", length = 30)
    private String classificationCode;

    @Column(name = "chapter", length = 10)
    private String chapter;

    @Column(name = "article", length = 10)
    private String article;

    @Column(name = "paragraph", length = 10)
    private String paragraph;

    @Column(name = "authorized_credit", precision = 15, scale = 2)
    private BigDecimal authorizedCredit;

    @Column(name = "budgetary_credit", precision = 15, scale = 2)
    private BigDecimal budgetaryCredit;

    @Column(name = "revised_credit", precision = 15, scale = 2)
    private BigDecimal revisedCredit;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private BudgetStatus status = BudgetStatus.DRAFT;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum BudgetStatus {
        DRAFT,
        APPROVED,
        REVISED,
        CLOSED
    }
}