package ro.pdi.erp.model.inventory;

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
@Table(name = "erp_fixed_assets")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpFixedAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String inventoryNumber;

    @Column(name = "serial_number", length = 50)
    private String serialNumber;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "asset_category", length = 50)
    private String assetCategory;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "acquisition_value", precision = 15, scale = 2)
    private BigDecimal acquisitionValue;

    @Column(name = "residual_value", precision = 15, scale = 2)
    private BigDecimal residualValue;

    @Column(name = "depreciable_value", precision = 15, scale = 2)
    private BigDecimal depreciableValue;

    @Column(name = "useful_life_years")
    private Integer usefulLifeYears;

    @Column(name = "depreciation_rate", precision = 5, scale = 2)
    private BigDecimal depreciationRate;

    @Column(name = "current_depreciation", precision = 15, scale = 2)
    private BigDecimal currentDepreciation;

    @Column(name = "accumulated_depreciation", precision = 15, scale = 2)
    private BigDecimal accumulatedDepreciation;

    @Column(name = "book_value", precision = 15, scale = 2)
    private BigDecimal bookValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "depreciation_method", length = 20)
    @Builder.Default
    private DepreciationMethod depreciationMethod = DepreciationMethod.LINEAR;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "responsible_person_id")
    private UUID responsiblePersonId;

    @Column(name = "supplier", length = 200)
    private String supplier;

    @Column(name = "invoice_number", length = 50)
    private String invoiceNumber;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Column(name = "last_revaluation_date")
    private LocalDate lastRevaluationDate;

    @Column(name = "revaluation_value", precision = 15, scale = 2)
    private BigDecimal revaluationValue;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private AssetStatus status = AssetStatus.IN_USE;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum DepreciationMethod {
        LINEAR,
        DEGRESSIVE,
        UNITS_OF_PRODUCTION
    }

    public enum AssetStatus {
        IN_USE,
        IN_STOCK,
        IN_REPAIR,
        DISPOSED,
        LEASED
    }
}