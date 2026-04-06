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
@Table(name = "infrastructure_networks")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfrastructureNetwork {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "network_type", nullable = false, length = 20)
    private NetworkType networkType;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "network_status", length = 20)
    @Builder.Default
    private NetworkStatus status = NetworkStatus.ACTIVE;

    @Column(name = "total_length", precision = 10, scale = 2)
    private BigDecimal totalLength;

    @Column(name = "installation_date")
    private LocalDate installationDate;

    @Column(columnDefinition = "TEXT")
    private String technicalSpecifications;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum NetworkType {
        WATER,
        SEWERAGE,
        ELECTRICITY,
        GAS,
        LIGHTING,
        TELEPHONE,
        INTERNET
    }

    public enum NetworkStatus {
        ACTIVE,
        INACTIVE,
        UNDER_REPAIR,
        PLANNED
    }
}