package ro.pdi.tax.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tax_properties")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false, length = 20)
    private PropertyType propertyType;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "address_id")
    private UUID addressId;

    @Column(name = "cadastral_number", length = 50)
    private String cadastralNumber;

    @Column(name = "land_registry_number", length = 50)
    private String landRegistryNumber;

    @Column(precision = 12, scale = 3)
    private BigDecimal area;

    @Column(name = "construction_year")
    private Integer constructionYear;

    @Column(length = 10)
    private String zone;

    @Column(name = "street_zone_multiplier", precision = 5, scale = 2)
    private BigDecimal streetZoneMultiplier;

    @Column(name = "property_value", precision = 15, scale = 2)
    private BigDecimal propertyValue;

    @Column(precision = 10, scale = 2)
    private BigDecimal yardsArea;

    @Column(name = "is_exempt", nullable = false)
    @Builder.Default
    private Boolean isExempt = false;

    @Column(name = "exemption_reason", length = 500)
    private String exemptionReason;

    @Column(name = "exemption_start_date")
    private LocalDateTime exemptionStartDate;

    @Column(name = "exemption_end_date")
    private LocalDateTime exemptionEndDate;

    @Column(columnDefinition = "jsonb")
    private String additionalData;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PropertyType {
        CLADIRE,
        TEREN,
        AUTO
    }
}