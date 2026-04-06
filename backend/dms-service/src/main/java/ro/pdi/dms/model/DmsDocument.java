package ro.pdi.dms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dms_documents")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DmsDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "folder_id")
    private UUID folderId;

    @Column(name = "document_type", length = 50)
    private String documentType;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(length = 64)
    private String checksum;

    @Builder.Default
    @Column
    private Integer version = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_status", length = 20)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Column(name = "owner_id")
    private UUID ownerId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(name = "retention_date")
    private LocalDateTime retentionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "retention_policy", length = 20)
    private RetentionPolicy retentionPolicy;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum DocumentStatus {
        DRAFT,
        REVIEW,
        APPROVED,
        PUBLISHED,
        ARCHIVED,
        DELETED
    }

    public enum RetentionPolicy {
        PERMANENT,
        TEMPORARY,
        CUSTOM
    }
}