package ro.pdi.dms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dms_workflows")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DmsWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "workflow_type", length = 50)
    private String workflowType;

    @Enumerated(EnumType.STRING)
    @Column(name = "workflow_status", length = 20)
    @Builder.Default
    private WorkflowStatus status = WorkflowStatus.ACTIVE;

    @Column(name = "bpmn_definition", columnDefinition = "TEXT")
    private String bpmnDefinition;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum WorkflowStatus {
        DRAFT,
        ACTIVE,
        SUSPENDED,
        ARCHIVED
    }
}