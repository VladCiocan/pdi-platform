package ro.pdi.erp.model.inventory;

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
@Table(name = "erp_inventory_items")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErpInventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "unit_of_measure", length = 20)
    private String unitOfMeasure;

    @Column(name = "quantity", precision = 15, scale = 3)
    private BigDecimal quantity;

    @Column(name = "unit_price", precision = 15, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_value", precision = 15, scale = 2)
    private BigDecimal totalValue;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private InventoryMethod inventoryMethod = InventoryMethod.FIFO;

    @Column(name = " warehouse_id")
    private UUID warehouseId;

    @Column(name = "min_stock", precision = 15, scale = 3)
    private BigDecimal minStock;

    @Column(name = "max_stock", precision = 15, scale = 3)
    private BigDecimal maxStock;

    @Column(name = "reorder_point", precision = 15, scale = 3)
    private BigDecimal reorderPoint;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ItemStatus status = ItemStatus.ACTIVE;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum InventoryMethod {
        FIFO,
        LIFO,
        PMP
    }

    public enum ItemStatus {
        ACTIVE,
        INACTIVE,
        DISCONTINUED
    }
}