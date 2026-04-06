package ro.pdi.dms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dms_workflow_instances")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DmsWorkflowInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "workflow_id", nullable = false)
    private UUID workflowId;

    @Column(name = "document_id")
    private UUID documentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "instance_status", length = 20)
    @Builder.Default
    private InstanceStatus status = InstanceStatus.PENDING;

    @Column(name = "current_task")
    private String currentTask;

    @Column(name = "started_by")
    private UUID startedBy;

    @Column(name = "completed_by")
    private UUID completedBy;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(columnDefinition = "JSONB")
    private String variables;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum InstanceStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        SUSPENDED
    }
}