package ro.pdi.infrastructure.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "infrastructure_incidents")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfrastructureIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "network_id")
    private UUID networkId;

    @Column(name = "asset_id")
    private UUID assetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "incident_type", nullable = false, length = 30)
    private IncidentType incidentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Severity severity;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "reported_by")
    private UUID reportedBy;

    @Column(name = "reported_at")
    private LocalDateTime reportedAt;

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "incident_status", nullable = false, length = 20)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.NEW;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum IncidentType {
        BREAKDOWN,
        LEAK,
        BLOCKAGE,
        DAMAGE,
        MALFUNCTION,
        ACCIDENT,
        PLANNED_WORK
    }

    public enum Severity {
        CRITICAL,
        HIGH,
        MEDIUM,
        LOW
    }

    public enum IncidentStatus {
        NEW,
        ACQUIRED,
        IN_PROGRESS,
        RESOLVED,
        CLOSED,
        CANCELLED
    }
}