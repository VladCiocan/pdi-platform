package ro.pdi.tax.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.pdi.tax.model.TaxProperty;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    private UUID id;

    @NotNull(message = "Property type is required")
    private TaxProperty.PropertyType propertyType;

    @NotNull(message = "Owner ID is required")
    private UUID ownerId;

    private UUID addressId;
    private String cadastralNumber;
    private String landRegistryNumber;
    private BigDecimal area;
    private Integer constructionYear;
    private String zone;
    private BigDecimal streetZoneMultiplier;
    private BigDecimal propertyValue;
    private BigDecimal yardsArea;
    private Boolean isExempt;
    private String exemptionReason;
}