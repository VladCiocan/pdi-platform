package ro.pdi.urbanism.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "urbanism_registers")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrbanismRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "register_type", nullable = false, length = 20)
    private RegisterType registerType;

    @Column(name = "register_number", length = 30)
    private String registerNumber;

    @Column(name = "session_date")
    private LocalDate sessionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "register_status", length = 20)
    @Builder.Default
    private RegisterStatus status = RegisterStatus.OPEN;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(name = "total_records")
    @Builder.Default
    private Integer totalRecords = 0;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RegisterType {
        MINUTES,
        CU,
        AC_AD,
        CNS
    }

    public enum RegisterStatus {
        OPEN,
        CLOSED,
        ARCHIVED
    }
}