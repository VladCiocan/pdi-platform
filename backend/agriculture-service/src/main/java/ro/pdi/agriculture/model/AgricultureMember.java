package ro.pdi.agriculture.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agriculture_members")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgricultureMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "household_id", nullable = false)
    private UUID householdId;

    @Column(name = "person_id")
    private UUID personId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 13)
    private String cnp;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MemberType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private FamilyRelation relation;

    @Column(length = 20)
    private String idSeries;

    @Column(length = 20)
    private String idNumber;

    @Column(name = "id_issue_date")
    private LocalDate idIssueDate;

    @Column(name = "id_issued_by", length = 100)
    private String idIssuedBy;

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum MemberType {
        OWNER,
        MEMBER,
        TENANT
    }

    public enum FamilyRelation {
        HEAD,
        SPOUSE,
        CHILD,
        PARENT,
        SIBLING,
        OTHER
    }
}