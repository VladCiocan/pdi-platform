package ro.pdi.agriculture.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agriculture_animals")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgricultureAnimal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "household_id", nullable = false)
    private UUID householdId;

    @Enumerated(EnumType.STRING)
    @Column(name = "animal_type", nullable = false, length = 30)
    private AnimalType animalType;

    @Column(name = "species", length = 50)
    private String species;

    @Column(name = "breed", length = 50)
    private String breed;

    @Column(name = "tag_number", length = 30)
    private String tagNumber;

    @Column(name = "passport_number", length = 30)
    private String passportNumber;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "sex", length = 10)
    private String sex;

    @Column
    private Integer quantity;

    @Column(name = "identification_number", length = 50)
    private String identificationNumber;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum AnimalType {
        BOVINE,
        PORCINE,
        OVINE,
        CAPRINE,
        EQUINE,
        POULTRY,
        RABBIT,
        BEE,
        OTHER
    }
}