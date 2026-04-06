package ro.pdi.agriculture.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "agriculture_machines")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgricultureMachine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "household_id", nullable = false)
    private UUID householdId;

    @Enumerated(EnumType.STRING)
    @Column(name = "machine_type", nullable = false, length = 30)
    private MachineType machineType;

    @Column(name = "registration_number", length = 20)
    private String registrationNumber;

    @Column(length = 100)
    private String brand;

    @Column(length = 100)
    private String model;

    @Column(name = "serial_number", length = 50)
    private String serialNumber;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "registrationExpiry")
    private LocalDate registrationExpiry;

    @Column(name = "engine_number", length = 50)
    private String engineNumber;

    @Column(name = "chassis_number", length = 50)
    private String chassisNumber;

    @Column(name = "horse_power")
    private Integer horsePower;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum MachineType {
        TRACTOR,
        COMBINE,
        PLOW,
        SEEDER,
        SPRAYER,
        HARVESTER,
        TRAILER,
        OTHER
    }
}