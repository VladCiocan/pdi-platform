package ro.pdi.tax.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.pdi.tax.model.TaxPayment;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @NotNull(message = "Contributor ID is required")
    private UUID contributorId;

    private UUID propertyId;
    private UUID taxLiabilityId;

    @NotNull(message = "Payment type is required")
    private TaxPayment.PaymentType paymentType;

    @NotNull(message = "Payment method is required")
    private TaxPayment.PaymentMethod paymentMethod;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private BigDecimal penaltyAmount;
    private BigDecimal discountAmount;
    private String transactionId;
    private String bankReference;
    private String paymentDetails;
}