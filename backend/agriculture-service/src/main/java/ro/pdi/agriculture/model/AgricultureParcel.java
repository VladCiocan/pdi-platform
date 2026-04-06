package ro.pdi.agriculture.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agriculture_parcels")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgricultureParcel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "parcel_number", length = 30)
    private String parcelNumber;

    @Column(name = "household_id")
    private UUID householdId;

    @Column(name = "owner_id")
    private UUID ownerId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "cadastral_number", length = 50)
    private String cadastralNumber;

    @Column(name = "land_registry_number", length = 50)
    private String landRegistryNumber;

    @Column(precision = 10, scale = 3)
    private BigDecimal area;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ParcelCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "usage_type", length = 20)
    private UsageType usageType;

    @Column(name = "irrigation_type", length = 50)
    private String irrigationType;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ParcelCategory {
        ARABLE,
        PASTURE,
        FOREST,
        VINEYARD,
        ORCHARD,
        OTHER
    }

    public enum UsageType {
        OWNED,
        LEASED,
        RENTED,
        USED_FREE
    }
}