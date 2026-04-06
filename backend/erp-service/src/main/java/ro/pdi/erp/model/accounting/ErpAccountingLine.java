package ro.pdi.erp.model.accounting;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "erp_accounting_lines")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpAccountingLine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "entry_id", nullable = false)
    private UUID entryId;

    @Column(name = "account_code", length = 20, nullable = false)
    private String accountCode;

    @Column(name = "debit_amount", precision = 15, scale = 2)
    private BigDecimal debitAmount;

    @Column(name = "credit_amount", precision = 15, scale = 2)
    private BigDecimal creditAmount;

    @Column(name = "partner_id")
    private UUID partnerId;

    @Column(name = "document_ref", length = 100)
    private String documentRef;

    @Column(name = "currency_code", length = 3)
    private String currencyCode;

    @Column(name = "currency_rate", precision = 10, scale = 4)
    private BigDecimal currencyRate;

    @Column(name = "analytic_account", length = 50)
    private String analyticAccount;

    @Column(name = "cost_center", length = 50)
    private String costCenter;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}