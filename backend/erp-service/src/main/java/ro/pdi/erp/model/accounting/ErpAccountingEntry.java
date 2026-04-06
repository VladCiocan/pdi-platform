package ro.pdi.erp.model.accounting;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "erp_accounting_entries")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpAccountingEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 20)
    private String journal;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "document_number", length = 50)
    private String documentNumber;

    @Column(name = "document_type", length = 50)
    private String documentType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_debit", precision = 15, scale = 2)
    private BigDecimal totalDebit;

    @Column(name = "total_credit", precision = 15, scale = 2)
    private BigDecimal totalCredit;

    @Builder.Default
    @Column(name = "is_posted", nullable = false)
    private Boolean isPosted = false;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @Column(name = "is_reversed", nullable = false)
    @Builder.Default
    private Boolean isReversed = false;

    @Column(name = "reversed_by")
    private UUID reversedBy;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}