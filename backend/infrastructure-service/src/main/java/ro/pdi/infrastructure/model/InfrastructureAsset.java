package ro.pdi.infrastructure.model;

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
@Table(name = "infrastructure_assets")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfrastructureAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "network_id")
    private UUID networkId;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_type", nullable = false, length = 30)
    private AssetType assetType;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "JSONB")
    private String technicalSpecifications;

    @Column(length = 100)
    private String manufacturer;

    @Column(length = 100)
    private String model;

    @Column(name = "installation_date")
    private LocalDate installationDate;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_status", length = 20)
    @Builder.Default
    private AssetStatus status = AssetStatus.ACTIVE;

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

    public enum AssetType {
        PUMP,
        VALVE,
        METER,
        HYDRANT,
        TRANSFORMER,
        POLE,
        MANHOLE,
        CABLE,
        PIPE,
        LIGHT_POINT,
        SENSOR
    }

    public enum AssetStatus {
        ACTIVE,
        INACTIVE,
        UNDER_REPAIR,
        DEFECTIVE,
        DECOMMISSIONED
    }
}