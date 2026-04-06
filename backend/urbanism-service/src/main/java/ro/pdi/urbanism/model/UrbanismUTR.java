package ro.pdi.urbanism.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "urbanism_utrs")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrbanismUTR {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "pot_code")
    private Integer potCode;

    @Column(name = "cut_code")
    private Integer cutCode;

    @Column(name = "max_build_height", precision = 5, scale = 2)
    private BigDecimal maxBuildHeight;

    @Column(name = "pot_percentage")
    private Integer potPercentage;

    @Column(name = "cut_index", precision = 5, scale = 2)
    private BigDecimal cutIndex;

    @Column(name = "zoning_type", length = 50)
    private String zoningType;

    @Column(columnDefinition = "TEXT")
    private String regulations;

    @Column(columnDefinition = "TEXT")
    private String typography;

    @Column(name = "min_lot_area")
    private Integer minLotArea;

    @Column(name = "max_floors")
    private Integer maxFloors;

    @Column(columnDefinition = "TEXT")
    private String additionalConditions;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}