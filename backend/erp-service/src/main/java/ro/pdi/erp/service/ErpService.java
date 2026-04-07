package ro.pdi.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.erp.model.budget.*;
import ro.pdi.erp.model.accounting.*;
import ro.pdi.erp.model.hr.*;
import ro.pdi.erp.model.inventory.*;
import ro.pdi.erp.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ErpService {

    private final ErpBudgetRepository budgetRepository;
    private final ErpBudgetExecutionRepository budgetExecutionRepository;
    private final ErpAccountingEntryRepository accountingEntryRepository;
    private final ErpAccountingLineRepository accountingLineRepository;
    private final ErpEmployeeRepository employeeRepository;
    private final ErpPayrollRepository payrollRepository;
    private final ErpInventoryItemRepository inventoryItemRepository;
    private final ErpFixedAssetRepository fixedAssetRepository;

    // === Budgets ===
    public List<ErpBudget> getBudgets(Integer year, String sourceCode) {
        if (year != null && sourceCode != null) {
            return budgetRepository.findByYearAndSourceCodeAndIsActiveTrue(year, sourceCode);
        } else if (year != null) {
            return budgetRepository.findByYearAndIsActiveTrue(year);
        } else if (sourceCode != null) {
            return budgetRepository.findBySourceCodeAndIsActiveTrue(sourceCode);
        }
        return budgetRepository.findByIsActiveTrue();
    }

    public ErpBudget getBudgetById(UUID id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found: " + id));
    }

    @Transactional
    public ErpBudget createBudget(ErpBudget budget) {
        log.info("Creating budget: {} - {}", budget.getYear(), budget.getSourceCode());
        return budgetRepository.save(budget);
    }

    @Transactional
    public ErpBudget updateBudget(UUID id, ErpBudget updated) {
        log.info("Updating budget: {}", id);
        ErpBudget existing = getBudgetById(id);
        existing.setYear(updated.getYear());
        existing.setSourceCode(updated.getSourceCode());
        existing.setClassificationCode(updated.getClassificationCode());
        existing.setChapter(updated.getChapter());
        existing.setArticle(updated.getArticle());
        existing.setParagraph(updated.getParagraph());
        existing.setAuthorizedCredit(updated.getAuthorizedCredit());
        existing.setBudgetaryCredit(updated.getBudgetaryCredit());
        existing.setRevisedCredit(updated.getRevisedCredit());
        existing.setStatus(updated.getStatus());
        return budgetRepository.save(existing);
    }

    @Transactional
    public void deleteBudget(UUID id) {
        log.info("Soft-deleting budget: {}", id);
        ErpBudget budget = getBudgetById(id);
        budget.setIsActive(false);
        budgetRepository.save(budget);
    }

    // === Budget Executions ===
    public List<ErpBudgetExecution> getBudgetExecutions(UUID budgetId) {
        if (budgetId != null) {
            return budgetExecutionRepository.findByBudgetIdAndIsActiveTrue(budgetId);
        }
        return budgetExecutionRepository.findByIsActiveTrue();
    }

    public ErpBudgetExecution getBudgetExecutionById(UUID id) {
        return budgetExecutionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget execution not found: " + id));
    }

    @Transactional
    public ErpBudgetExecution createBudgetExecution(ErpBudgetExecution execution) {
        log.info("Creating budget execution: {} - {}", execution.getPhase(), execution.getAmount());
        return budgetExecutionRepository.save(execution);
    }

    @Transactional
    public ErpBudgetExecution updateBudgetExecution(UUID id, ErpBudgetExecution updated) {
        log.info("Updating budget execution: {}", id);
        ErpBudgetExecution existing = getBudgetExecutionById(id);
        existing.setPhase(updated.getPhase());
        existing.setCommitmentNumber(updated.getCommitmentNumber());
        existing.setCommitmentDate(updated.getCommitmentDate());
        existing.setLiquidationNumber(updated.getLiquidationNumber());
        existing.setLiquidationDate(updated.getLiquidationDate());
        existing.setOrderNumber(updated.getOrderNumber());
        existing.setOrderDate(updated.getOrderDate());
        existing.setPaymentNumber(updated.getPaymentNumber());
        existing.setPaymentDate(updated.getPaymentDate());
        existing.setAmount(updated.getAmount());
        existing.setBeneficiaryId(updated.getBeneficiaryId());
        existing.setExpensePurpose(updated.getExpensePurpose());
        existing.setStatus(updated.getStatus());
        return budgetExecutionRepository.save(existing);
    }

    @Transactional
    public void deleteBudgetExecution(UUID id) {
        log.info("Soft-deleting budget execution: {}", id);
        ErpBudgetExecution execution = getBudgetExecutionById(id);
        execution.setIsActive(false);
        budgetExecutionRepository.save(execution);
    }

    // === Accounting Entries ===
    public List<ErpAccountingEntry> getAccountingEntries(String journal, String documentType) {
        if (journal != null && documentType != null) {
            return accountingEntryRepository.findByJournalAndIsActiveTrue(journal).stream()
                    .filter(e -> e.getDocumentType() != null && e.getDocumentType().equals(documentType))
                    .toList();
        } else if (journal != null) {
            return accountingEntryRepository.findByJournalAndIsActiveTrue(journal);
        } else if (documentType != null) {
            return accountingEntryRepository.findByDocumentTypeAndIsActiveTrue(documentType);
        }
        return accountingEntryRepository.findByIsActiveTrue();
    }

    public ErpAccountingEntry getAccountingEntryById(UUID id) {
        return accountingEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accounting entry not found: " + id));
    }

    @Transactional
    public ErpAccountingEntry createAccountingEntry(ErpAccountingEntry entry) {
        log.info("Creating accounting entry: {} - {}", entry.getDocumentNumber(), entry.getDocumentType());
        return accountingEntryRepository.save(entry);
    }

    @Transactional
    public ErpAccountingEntry updateAccountingEntry(UUID id, ErpAccountingEntry updated) {
        log.info("Updating accounting entry: {}", id);
        ErpAccountingEntry existing = getAccountingEntryById(id);
        existing.setJournal(updated.getJournal());
        existing.setEntryDate(updated.getEntryDate());
        existing.setDocumentNumber(updated.getDocumentNumber());
        existing.setDocumentType(updated.getDocumentType());
        existing.setDescription(updated.getDescription());
        existing.setTotalDebit(updated.getTotalDebit());
        existing.setTotalCredit(updated.getTotalCredit());
        existing.setIsPosted(updated.getIsPosted());
        existing.setIsReversed(updated.getIsReversed());
        return accountingEntryRepository.save(existing);
    }

    @Transactional
    public void deleteAccountingEntry(UUID id) {
        log.info("Soft-deleting accounting entry: {}", id);
        ErpAccountingEntry entry = getAccountingEntryById(id);
        entry.setIsActive(false);
        accountingEntryRepository.save(entry);
    }

    // === Accounting Lines ===
    public List<ErpAccountingLine> getAccountingLines(UUID entryId) {
        return accountingLineRepository.findByEntryId(entryId);
    }

    @Transactional
    public ErpAccountingLine createAccountingLine(ErpAccountingLine line) {
        log.info("Creating accounting line for entry: {}", line.getEntryId());
        return accountingLineRepository.save(line);
    }

    @Transactional
    public ErpAccountingLine updateAccountingLine(UUID id, ErpAccountingLine updated) {
        log.info("Updating accounting line: {}", id);
        ErpAccountingLine existing = accountingLineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accounting line not found: " + id));
        existing.setAccountCode(updated.getAccountCode());
        existing.setDebitAmount(updated.getDebitAmount());
        existing.setCreditAmount(updated.getCreditAmount());
        existing.setPartnerId(updated.getPartnerId());
        existing.setDocumentRef(updated.getDocumentRef());
        existing.setCurrencyCode(updated.getCurrencyCode());
        existing.setCurrencyRate(updated.getCurrencyRate());
        existing.setAnalyticAccount(updated.getAnalyticAccount());
        existing.setCostCenter(updated.getCostCenter());
        existing.setDescription(updated.getDescription());
        return accountingLineRepository.save(existing);
    }

    @Transactional
    public void deleteAccountingLine(UUID id) {
        log.info("Deleting accounting line: {}", id);
        accountingLineRepository.deleteById(id);
    }

    // === Employees ===
    public List<ErpEmployee> getEmployees(String department, ErpEmployee.EmployeeStatus status) {
        if (department != null && status != null) {
            return employeeRepository.findByDepartmentAndStatusAndIsActiveTrue(department, status);
        } else if (department != null) {
            return employeeRepository.findByDepartmentAndIsActiveTrue(department);
        } else if (status != null) {
            return employeeRepository.findByStatusAndIsActiveTrue(status);
        }
        return employeeRepository.findByIsActiveTrue();
    }

    public ErpEmployee getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
    }

    @Transactional
    public ErpEmployee createEmployee(ErpEmployee employee) {
        log.info("Creating employee: {} {}", employee.getFirstName(), employee.getLastName());
        return employeeRepository.save(employee);
    }

    @Transactional
    public ErpEmployee updateEmployee(UUID id, ErpEmployee updated) {
        log.info("Updating employee: {}", id);
        ErpEmployee existing = getEmployeeById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setPosition(updated.getPosition());
        existing.setDepartment(updated.getDepartment());
        existing.setEmploymentType(updated.getEmploymentType());
        existing.setContractNumber(updated.getContractNumber());
        existing.setContractType(updated.getContractType());
        existing.setHireDate(updated.getHireDate());
        existing.setTerminationDate(updated.getTerminationDate());
        existing.setStatus(updated.getStatus());
        existing.setBaseSalary(updated.getBaseSalary());
        existing.setGrade(updated.getGrade());
        existing.setWorkSchedule(updated.getWorkSchedule());
        existing.setManagerId(updated.getManagerId());
        return employeeRepository.save(existing);
    }

    @Transactional
    public void deleteEmployee(UUID id) {
        log.info("Soft-deleting employee: {}", id);
        ErpEmployee employee = getEmployeeById(id);
        employee.setIsActive(false);
        employeeRepository.save(employee);
    }

    // === Payroll ===
    public List<ErpPayroll> getPayrolls(UUID employeeId, LocalDate period) {
        if (employeeId != null && period != null) {
            return payrollRepository.findByEmployeeIdAndPeriodAndIsActiveTrue(employeeId, period);
        } else if (employeeId != null) {
            return payrollRepository.findByEmployeeIdAndIsActiveTrue(employeeId);
        } else if (period != null) {
            return payrollRepository.findByPeriodAndIsActiveTrue(period);
        }
        return payrollRepository.findByIsActiveTrue();
    }

    public ErpPayroll getPayrollById(UUID id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found: " + id));
    }

    @Transactional
    public ErpPayroll createPayroll(ErpPayroll payroll) {
        log.info("Creating payroll for employee: {} - period: {}", payroll.getEmployeeId(), payroll.getPeriod());
        return payrollRepository.save(payroll);
    }

    @Transactional
    public ErpPayroll updatePayroll(UUID id, ErpPayroll updated) {
        log.info("Updating payroll: {}", id);
        ErpPayroll existing = getPayrollById(id);
        existing.setBaseSalary(updated.getBaseSalary());
        existing.setOvertimeHours(updated.getOvertimeHours());
        existing.setOvertimePay(updated.getOvertimePay());
        existing.setBonuses(updated.getBonuses());
        existing.setGrossSalary(updated.getGrossSalary());
        existing.setIncomeTax(updated.getIncomeTax());
        existing.setCas(updated.getCas());
        existing.setCass(updated.getCass());
        existing.setCam(updated.getCam());
        existing.setOtherDeductions(updated.getOtherDeductions());
        existing.setNetSalary(updated.getNetSalary());
        existing.setAdvanceAmount(updated.getAdvanceAmount());
        existing.setSettlementAmount(updated.getSettlementAmount());
        existing.setStatus(updated.getStatus());
        existing.setPaymentDate(updated.getPaymentDate());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setBankTransferId(updated.getBankTransferId());
        return payrollRepository.save(existing);
    }

    @Transactional
    public void deletePayroll(UUID id) {
        log.info("Soft-deleting payroll: {}", id);
        ErpPayroll payroll = getPayrollById(id);
        payroll.setIsActive(false);
        payrollRepository.save(payroll);
    }

    // === Inventory Items ===
    public List<ErpInventoryItem> getInventoryItems(String category, UUID warehouseId) {
        if (category != null) {
            return inventoryItemRepository.findByCategoryAndIsActiveTrue(category);
        }
        return inventoryItemRepository.findByIsActiveTrue();
    }

    public ErpInventoryItem getInventoryItemById(UUID id) {
        return inventoryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found: " + id));
    }

    @Transactional
    public ErpInventoryItem createInventoryItem(ErpInventoryItem item) {
        log.info("Creating inventory item: {} - {}", item.getCode(), item.getName());
        return inventoryItemRepository.save(item);
    }

    @Transactional
    public ErpInventoryItem updateInventoryItem(UUID id, ErpInventoryItem updated) {
        log.info("Updating inventory item: {}", id);
        ErpInventoryItem existing = getInventoryItemById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setUnitOfMeasure(updated.getUnitOfMeasure());
        existing.setQuantity(updated.getQuantity());
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setTotalValue(updated.getTotalValue());
        existing.setInventoryMethod(updated.getInventoryMethod());
        existing.setWarehouseId(updated.getWarehouseId());
        existing.setMinStock(updated.getMinStock());
        existing.setMaxStock(updated.getMaxStock());
        existing.setReorderPoint(updated.getReorderPoint());
        existing.setStatus(updated.getStatus());
        return inventoryItemRepository.save(existing);
    }

    @Transactional
    public void deleteInventoryItem(UUID id) {
        log.info("Soft-deleting inventory item: {}", id);
        ErpInventoryItem item = getInventoryItemById(id);
        item.setIsActive(false);
        inventoryItemRepository.save(item);
    }

    // === Fixed Assets ===
    public List<ErpFixedAsset> getFixedAssets(String assetCategory, ErpFixedAsset.AssetStatus status) {
        if (assetCategory != null && status != null) {
            return getFixedAssetsByCategoryAndStatus(assetCategory, status);
        } else if (assetCategory != null) {
            return fixedAssetRepository.findByAssetCategoryAndIsActiveTrue(assetCategory);
        } else if (status != null) {
            return fixedAssetRepository.findByStatusAndIsActiveTrue(status);
        }
        return fixedAssetRepository.findByIsActiveTrue();
    }

    private List<ErpFixedAsset> getFixedAssetsByCategoryAndStatus(String category, ErpFixedAsset.AssetStatus status) {
        return fixedAssetRepository.findByAssetCategoryAndIsActiveTrue(category).stream()
                .filter(a -> a.getStatus() == status)
                .toList();
    }

    public ErpFixedAsset getFixedAssetById(UUID id) {
        return fixedAssetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fixed asset not found: " + id));
    }

    @Transactional
    public ErpFixedAsset createFixedAsset(ErpFixedAsset asset) {
        log.info("Creating fixed asset: {} - {}", asset.getInventoryNumber(), asset.getName());
        return fixedAssetRepository.save(asset);
    }

    @Transactional
    public ErpFixedAsset updateFixedAsset(UUID id, ErpFixedAsset updated) {
        log.info("Updating fixed asset: {}", id);
        ErpFixedAsset existing = getFixedAssetById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setAssetCategory(updated.getAssetCategory());
        existing.setAcquisitionDate(updated.getAcquisitionDate());
        existing.setAcquisitionValue(updated.getAcquisitionValue());
        existing.setResidualValue(updated.getResidualValue());
        existing.setDepreciableValue(updated.getDepreciableValue());
        existing.setUsefulLifeYears(updated.getUsefulLifeYears());
        existing.setDepreciationRate(updated.getDepreciationRate());
        existing.setCurrentDepreciation(updated.getCurrentDepreciation());
        existing.setAccumulatedDepreciation(updated.getAccumulatedDepreciation());
        existing.setBookValue(updated.getBookValue());
        existing.setDepreciationMethod(updated.getDepreciationMethod());
        existing.setLocation(updated.getLocation());
        existing.setResponsiblePersonId(updated.getResponsiblePersonId());
        existing.setSupplier(updated.getSupplier());
        existing.setInvoiceNumber(updated.getInvoiceNumber());
        existing.setWarrantyExpiry(updated.getWarrantyExpiry());
        existing.setStatus(updated.getStatus());
        return fixedAssetRepository.save(existing);
    }

    @Transactional
    public void deleteFixedAsset(UUID id) {
        log.info("Soft-deleting fixed asset: {}", id);
        ErpFixedAsset asset = getFixedAssetById(id);
        asset.setIsActive(false);
        fixedAssetRepository.save(asset);
    }

    @Transactional
    public ErpFixedAsset calculateDepreciation(UUID id) {
        log.info("Calculating depreciation for fixed asset: {}", id);
        ErpFixedAsset asset = getFixedAssetById(id);
        if (asset.getAcquisitionValue() != null && asset.getUsefulLifeYears() != null && asset.getUsefulLifeYears() > 0) {
            BigDecimal annualDepreciation = asset.getAcquisitionValue()
                    .subtract(asset.getResidualValue() != null ? asset.getResidualValue() : BigDecimal.ZERO)
                    .divide(BigDecimal.valueOf(asset.getUsefulLifeYears()), 2, BigDecimal.ROUND_HALF_UP);

            BigDecimal monthlyDepreciation = annualDepreciation.divide(BigDecimal.valueOf(12), 2, BigDecimal.ROUND_HALF_UP);

            asset.setCurrentDepreciation(monthlyDepreciation);
            if (asset.getAccumulatedDepreciation() == null) {
                asset.setAccumulatedDepreciation(monthlyDepreciation);
            } else {
                asset.setAccumulatedDepreciation(asset.getAccumulatedDepreciation().add(monthlyDepreciation));
            }
            asset.setBookValue(asset.getAcquisitionValue().subtract(asset.getAccumulatedDepreciation()));
        }
        return fixedAssetRepository.save(asset);
    }

    // === Stats ===
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBudgets", budgetRepository.countActiveBudgets());
        stats.put("totalEmployees", employeeRepository.countActiveEmployees());
        stats.put("totalInventoryItems", inventoryItemRepository.countActiveItems());
        stats.put("totalFixedAssets", fixedAssetRepository.countActiveAssets());
        return stats;
    }
}
