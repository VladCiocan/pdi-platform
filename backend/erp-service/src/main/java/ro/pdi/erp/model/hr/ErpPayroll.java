package ro.pdi.erp.model.hr;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "erp_hr_payroll")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpPayroll {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(nullable = false)
    private LocalDate period;

    @Column(name = "base_salary", precision = 10, scale = 2)
    private BigDecimal baseSalary;

    @Column(name = "overtime_hours")
    private Integer overtimeHours;

    @Column(name = "overtime_pay", precision = 10, scale = 2)
    private BigDecimal overtimePay;

    @Column(name = "bonuses", columnDefinition = "JSONB")
    private String bonuses;

    @Column(name = "gross_salary", precision = 10, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "income_tax", precision = 10, scale = 2)
    private BigDecimal incomeTax;

    @Column(precision = 10, scale = 2)
    private BigDecimal cas;

    @Column(precision = 10, scale = 2)
    private BigDecimal cass;

    @Column(precision = 10, scale = 2)
    private BigDecimal cam;

    @Column(name = "other_deductions", precision = 10, scale = 2)
    private BigDecimal otherDeductions;

    @Column(name = "net_salary", precision = 10, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "advance_amount", precision = 10, scale = 2)
    private BigDecimal advanceAmount;

    @Column(name = "settlement_amount", precision = 10, scale = 2)
    private BigDecimal settlementAmount;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private PayrollStatus status = PayrollStatus.DRAFT;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_method", length = 20)
    private String paymentMethod;

    @Column(name = "bank_transfer_id", length = 50)
    private String bankTransferId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum PayrollStatus {
        DRAFT,
        CALCULATED,
        APPROVED,
        PAID,
        CANCELLED
    }
}