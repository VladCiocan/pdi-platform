package ro.pdi.tax.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.pdi.tax.model.*;
import ro.pdi.tax.repository.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/taxes")
public class TaxController {

    private final TaxPropertyRepository taxPropertyRepository;
    private final TaxDeclarationRepository taxDeclarationRepository;
    private final TaxLiabilityRepository taxLiabilityRepository;
    private final TaxPaymentRepository taxPaymentRepository;
    private final TaxCategoryRepository taxCategoryRepository;

    public TaxController(
            TaxPropertyRepository taxPropertyRepository,
            TaxDeclarationRepository taxDeclarationRepository,
            TaxLiabilityRepository taxLiabilityRepository,
            TaxPaymentRepository taxPaymentRepository,
            TaxCategoryRepository taxCategoryRepository) {
        this.taxPropertyRepository = taxPropertyRepository;
        this.taxDeclarationRepository = taxDeclarationRepository;
        this.taxLiabilityRepository = taxLiabilityRepository;
        this.taxPaymentRepository = taxPaymentRepository;
        this.taxCategoryRepository = taxCategoryRepository;
    }

    @GetMapping("/properties")
    public ResponseEntity<List<TaxProperty>> getProperties(
            @RequestParam(required = false) UUID ownerId,
            @RequestParam(required = false) TaxProperty.PropertyType propertyType) {
        if (ownerId != null) {
            return ResponseEntity.ok(taxPropertyRepository.findByOwnerIdAndIsActiveTrue(ownerId));
        }
        if (propertyType != null) {
            return ResponseEntity.ok(taxPropertyRepository.findByPropertyType(propertyType));
        }
        return ResponseEntity.ok(taxPropertyRepository.findAll());
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<TaxProperty> getProperty(@PathVariable UUID id) {
        return taxPropertyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/properties")
    public ResponseEntity<TaxProperty> createProperty(@RequestBody TaxProperty property) {
        return ResponseEntity.ok(taxPropertyRepository.save(property));
    }

    @GetMapping("/declarations")
    public ResponseEntity<List<TaxDeclaration>> getDeclarations(
            @RequestParam(required = false) UUID contributorId,
            @RequestParam(required = false) TaxDeclaration.DeclarationStatus status) {
        if (contributorId != null) {
            return ResponseEntity.ok(taxDeclarationRepository.findByContributorId(contributorId));
        }
        if (status != null) {
            return ResponseEntity.ok(taxDeclarationRepository.findByStatus(status));
        }
        return ResponseEntity.ok(taxDeclarationRepository.findAll());
    }

    @GetMapping("/liabilities")
    public ResponseEntity<List<TaxLiability>> getLiabilities(
            @RequestParam(required = false) UUID contributorId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) TaxLiability.LiabilityStatus status) {
        if (contributorId != null && year != null) {
            return ResponseEntity.ok(taxLiabilityRepository.findByContributorAndYear(contributorId, year));
        }
        if (contributorId != null) {
            return ResponseEntity.ok(taxLiabilityRepository.findByContributorId(contributorId));
        }
        if (year != null) {
            return ResponseEntity.ok(taxLiabilityRepository.findByTaxYear(year));
        }
        return ResponseEntity.ok(taxLiabilityRepository.findAll());
    }

    @GetMapping("/payments")
    public ResponseEntity<List<TaxPayment>> getPayments(
            @RequestParam(required = false) UUID contributorId,
            @RequestParam(required = false) TaxPayment.PaymentStatus status) {
        if (contributorId != null) {
            return ResponseEntity.ok(taxPaymentRepository.findByContributorId(contributorId));
        }
        if (status != null) {
            return ResponseEntity.ok(taxPaymentRepository.findByStatus(status));
        }
        return ResponseEntity.ok(taxPaymentRepository.findAll());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<TaxCategory>> getCategories() {
        return ResponseEntity.ok(taxCategoryRepository.findByIsActiveTrue());
    }
}