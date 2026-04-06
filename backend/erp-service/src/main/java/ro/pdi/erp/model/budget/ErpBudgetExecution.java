package ro.pdi.erp.model.budget;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "erp_budget_executions")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpBudgetExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "budget_id", nullable = false)
    private UUID budgetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "alop_phase", length = 20)
    private ALOPPhase phase;

    @Column(name = "commitment_number", length = 50)
    private String commitmentNumber;

    @Column(name = "commitment_date")
    private LocalDate commitmentDate;

    @Column(name = "liquidation_number", length = 50)
    private String liquidationNumber;

    @Column(name = "liquidation_date")
    private LocalDate liquidationDate;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "payment_number", length = 50)
    private String paymentNumber;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "beneficiary_id")
    private UUID beneficiaryId;

    @Column(name = "contract_id")
    private UUID contractId;

    @Column(name = "invoice_id")
    private UUID invoiceId;

    @Column(name = "expense_purpose", columnDefinition = "TEXT")
    private String expensePurpose;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ExecutionStatus status = ExecutionStatus.PENDING;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ALOPPhase {
        ENGAGEMENT,
        LIQUIDATION,
        ORDER,
        PAYMENT
    }

    public enum ExecutionStatus {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }
}