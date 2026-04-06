package ro.pdi.tax.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import ro.pdi.tax.model.*;
import ro.pdi.tax.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class TaxCalculationService {

    private final TaxCategoryRepository taxCategoryRepository;
    private final TaxLiabilityRepository taxLiabilityRepository;
    private final ObjectMapper objectMapper;

    @Value("${app.tax.penalty.daily-rate:0.0002}")
    private BigDecimal dailyPenaltyRate;

    @Value("${app.tax.penalty.grace-period-days:30}")
    private int gracePeriodDays;

    @Value("${app.tax.discount.early-payment-days:30}")
    private int earlyPaymentDays;

    @Value("${app.tax.discount.early-payment-percent:0.10}")
    private BigDecimal earlyPaymentDiscount;

    @Value("${app.tax.discount.full-year-percent:0.10}")
    private BigDecimal fullYearDiscount;

    public TaxCalculationService(
            TaxCategoryRepository taxCategoryRepository,
            TaxLiabilityRepository taxLiabilityRepository,
            ObjectMapper objectMapper) {
        this.taxCategoryRepository = taxCategoryRepository;
        this.taxLiabilityRepository = taxLiabilityRepository;
        this.objectMapper = objectMapper;
    }

    public BigDecimal calculateBuildingTax(TaxProperty property, Integer taxYear, TaxCategory category) {
        if (property.getIsExempt()) {
            return BigDecimal.ZERO;
        }

        BigDecimal baseTax = BigDecimal.ZERO;
        BigDecimal propertyValue = property.getPropertyValue();
        BigDecimal zoneMultiplier = property.getStreetZoneMultiplier() != null 
                ? property.getStreetZoneMultiplier() 
                : BigDecimal.ONE;

        if (propertyValue != null && category.getTaxRate() != null) {
            baseTax = propertyValue.multiply(category.getTaxRate())
                    .multiply(zoneMultiplier)
                    .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP);
        }

        int buildingAge = calculateBuildingAge(property.getConstructionYear(), taxYear);
        if (buildingAge > 50 && buildingAge <= 100) {
            baseTax = baseTax.multiply(BigDecimal.valueOf(1.5));
        } else if (buildingAge > 100) {
            baseTax = baseTax.multiply(BigDecimal.valueOf(2.0));
        }

        return baseTax.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateLandTax(TaxProperty property, Integer taxYear, TaxCategory category) {
        if (property.getIsExempt()) {
            return BigDecimal.ZERO;
        }

        BigDecimal area = property.getArea();
        BigDecimal zoneMultiplier = property.getStreetZoneMultiplier() != null 
                ? property.getStreetZoneMultiplier() 
                : BigDecimal.valueOf(1.0);

        if (category.getCalculationMethod() == TaxCategory.CalculationMethod.PERCENTAGE) {
            BigDecimal taxRate = category.getTaxRate() != null ? category.getTaxRate() : BigDecimal.valueOf(0.003);
            return area.multiply(taxRate).multiply(zoneMultiplier).setScale(2, RoundingMode.HALF_UP);
        }

        return BigDecimal.ZERO;
    }

    public BigDecimal calculateVehicleTax(TaxProperty property, Integer taxYear) {
        if (property.getIsExempt()) {
            return BigDecimal.ZERO;
        }

        BigDecimal area = property.getArea();
        if (area == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal taxRate = BigDecimal.ONE;
        if (area.compareTo(BigDecimal.valueOf(1600)) <= 0) {
            taxRate = BigDecimal.valueOf(8);
        } else if (area.compareTo(BigDecimal.valueOf(2000)) <= 0) {
            taxRate = BigDecimal.valueOf(18);
        } else if (area.compareTo(BigDecimal.valueOf(2600)) <= 0) {
            taxRate = BigDecimal.valueOf(36);
        } else if (area.compareTo(BigDecimal.valueOf(3000)) <= 0) {
            taxRate = BigDecimal.valueOf(72);
        } else {
            taxRate = BigDecimal.valueOf(144);
        }

        int yearsOld = LocalDate.now().getYear() - (property.getConstructionYear() != null ? property.getConstructionYear() : LocalDate.now().getYear());
        if (yearsOld > 15) {
            taxRate = taxRate.multiply(BigDecimal.valueOf(0.5));
        }

        return taxRate.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateUrbanismTax(String taxType, BigDecimal constructionValue) {
        return switch (taxType.toUpperCase()) {
            case "CERTIFICAT_URBANISM" -> BigDecimal.valueOf(100);
            case "AUTORIZATIE_CONSTRUIRE" -> constructionValue != null 
                    ? constructionValue.multiply(BigDecimal.valueOf(0.01)) 
                    : BigDecimal.ZERO;
            case "AUTORIZATIE_DESFIINTARE" -> BigDecimal.valueOf(50);
            default -> BigDecimal.ZERO;
        };
    }

    public BigDecimal calculatePenalty(BigDecimal amount, LocalDate dueDate, LocalDate paymentDate) {
        if (paymentDate == null || dueDate == null) {
            return BigDecimal.ZERO;
        }

        long daysLate = ChronoUnit.DAYS.between(dueDate, paymentDate);
        if (daysLate <= gracePeriodDays) {
            return BigDecimal.ZERO;
        }

        BigDecimal penaltyDays = BigDecimal.valueOf(daysLate - gracePeriodDays);
        return amount.multiply(penaltyDays).multiply(dailyPenaltyRate)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateEarlyPaymentDiscount(BigDecimal taxAmount, LocalDate paymentDate, LocalDate dueDate) {
        if (paymentDate == null || dueDate == null) {
            return BigDecimal.ZERO;
        }

        long daysBeforeDue = ChronoUnit.DAYS.between(paymentDate, dueDate);
        if (daysBeforeDue >= earlyPaymentDays) {
            return taxAmount.multiply(earlyPaymentDiscount).setScale(2, RoundingMode.HALF_UP);
        }

        return BigDecimal.ZERO;
    }

    public BigDecimal calculateFullYearDiscount(BigDecimal taxAmount) {
        return taxAmount.multiply(fullYearDiscount).setScale(2, RoundingMode.HALF_UP);
    }

    public TaxLiability generateLiability(TaxProperty property, Integer taxYear) {
        TaxCategory category = taxCategoryRepository
                .findActiveByCodeForDate(getCategoryCodeForPropertyType(property.getPropertyType()), LocalDate.of(taxYear, 1, 1))
                .orElse(null);

        if (category == null) {
            return null;
        }

        TaxLiability.TaxType taxType = mapPropertyTypeToTaxType(property.getPropertyType());
        BigDecimal grossTax = calculatePropertyTax(property, taxYear, category);

        BigDecimal exemptionAmount = BigDecimal.ZERO;
        if (property.getIsExempt()) {
            exemptionAmount = grossTax;
        }

        BigDecimal netTax = grossTax.subtract(exemptionAmount).setScale(2, RoundingMode.HALF_UP);

        LocalDate dueDate = calculateDueDate(property.getPropertyType(), taxYear);

        TaxLiability liability = TaxLiability.builder()
                .contributorId(property.getOwnerId())
                .propertyId(property.getId())
                .taxType(taxType)
                .taxYear(taxYear)
                .categoryId(category.getId())
                .grossTax(grossTax)
                .exemptionAmount(exemptionAmount)
                .netTax(netTax)
                .totalDue(netTax)
                .remainingAmount(netTax)
                .status(TaxLiability.LiabilityStatus.DUE)
                .dueDate(dueDate)
                .build();

        return liability;
    }

    private BigDecimal calculatePropertyTax(TaxProperty property, Integer taxYear, TaxCategory category) {
        return switch (property.getPropertyType()) {
            case CLADIRE -> calculateBuildingTax(property, taxYear, category);
            case TEREN -> calculateLandTax(property, taxYear, category);
            case AUTO -> calculateVehicleTax(property, taxYear);
        };
    }

    private String getCategoryCodeForPropertyType(TaxProperty.PropertyType propertyType) {
        return switch (propertyType) {
            case CLADIRE -> "IMP_CLAD_ART";
            case TEREN -> "IMP_TEREN_INTRA";
            case AUTO -> "IMP_AUTO";
        };
    }

    private TaxLiability.TaxType mapPropertyTypeToTaxType(TaxProperty.PropertyType propertyType) {
        return switch (propertyType) {
            case CLADIRE -> TaxLiability.TaxType.IMPOZIT_CLADIRE;
            case TEREN -> TaxLiability.TaxType.IMPOZIT_TEREN;
            case AUTO -> TaxLiability.TaxType.IMPOZIT_AUTO;
        };
    }

    private int calculateBuildingAge(Integer constructionYear, int taxYear) {
        if (constructionYear == null) {
            return 0;
        }
        return taxYear - constructionYear;
    }

    private LocalDate calculateDueDate(TaxProperty.PropertyType propertyType, Integer taxYear) {
        return switch (propertyType) {
            case CLADIRE, TEREN -> LocalDate.of(taxYear, 3, 31);
            case AUTO -> LocalDate.of(taxYear, 12, 31);
        };
    }
}