package ro.pdi.erp.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pdi.erp.model.budget.ErpBudget;
import ro.pdi.erp.model.budget.ErpBudgetExecution;
import ro.pdi.erp.model.accounting.ErpAccountingEntry;
import ro.pdi.erp.model.accounting.ErpAccountingLine;
import ro.pdi.erp.model.hr.ErpEmployee;
import ro.pdi.erp.model.hr.ErpPayroll;
import ro.pdi.erp.model.inventory.ErpInventoryItem;
import ro.pdi.erp.model.inventory.ErpFixedAsset;
import ro.pdi.erp.service.ErpService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/erp")
@RequiredArgsConstructor
@Tag(name = "ERP", description = "Planificare resurse - buget, contabilitate, HR, inventar")
public class ErpController {

    private final ErpService erpService;

    // === Budgets ===
    @Operation(summary = "Lista bugete")
    @GetMapping("/budgets")
    public ResponseEntity<List<ErpBudget>> getBudgets(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String sourceCode) {
        return ResponseEntity.ok(erpService.getBudgets(year, sourceCode));
    }

    @Operation(summary = "Detalii buget")
    @GetMapping("/budgets/{id}")
    public ResponseEntity<ErpBudget> getBudget(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getBudgetById(id));
    }

    @Operation(summary = "Creare buget")
    @PostMapping("/budgets")
    public ResponseEntity<ErpBudget> createBudget(@RequestBody ErpBudget budget) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createBudget(budget));
    }

    @Operation(summary = "Actualizare buget")
    @PutMapping("/budgets/{id}")
    public ResponseEntity<ErpBudget> updateBudget(@PathVariable UUID id, @RequestBody ErpBudget budget) {
        return ResponseEntity.ok(erpService.updateBudget(id, budget));
    }

    @Operation(summary = "Stergere buget")
    @DeleteMapping("/budgets/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable UUID id) {
        erpService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    // === Budget Executions ===
    @Operation(summary = "Lista executii bugetare")
    @GetMapping("/budget-executions")
    public ResponseEntity<List<ErpBudgetExecution>> getBudgetExecutions(
            @RequestParam(required = false) UUID budgetId) {
        return ResponseEntity.ok(erpService.getBudgetExecutions(budgetId));
    }

    @Operation(summary = "Detalii executie bugetara")
    @GetMapping("/budget-executions/{id}")
    public ResponseEntity<ErpBudgetExecution> getBudgetExecution(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getBudgetExecutionById(id));
    }

    @Operation(summary = "Inregistrare executie bugetara")
    @PostMapping("/budget-executions")
    public ResponseEntity<ErpBudgetExecution> createBudgetExecution(@RequestBody ErpBudgetExecution execution) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createBudgetExecution(execution));
    }

    @Operation(summary = "Actualizare executie bugetara")
    @PutMapping("/budget-executions/{id}")
    public ResponseEntity<ErpBudgetExecution> updateBudgetExecution(@PathVariable UUID id, @RequestBody ErpBudgetExecution execution) {
        return ResponseEntity.ok(erpService.updateBudgetExecution(id, execution));
    }

    @Operation(summary = "Stergere executie bugetara")
    @DeleteMapping("/budget-executions/{id}")
    public ResponseEntity<Void> deleteBudgetExecution(@PathVariable UUID id) {
        erpService.deleteBudgetExecution(id);
        return ResponseEntity.noContent().build();
    }

    // === Accounting Entries ===
    @Operation(summary = "Lista inregistrari contabile")
    @GetMapping("/accounting/entries")
    public ResponseEntity<List<ErpAccountingEntry>> getAccountingEntries(
            @RequestParam(required = false) String journal,
            @RequestParam(required = false) String documentType) {
        return ResponseEntity.ok(erpService.getAccountingEntries(journal, documentType));
    }

    @Operation(summary = "Detalii inregistrare contabila")
    @GetMapping("/accounting/entries/{id}")
    public ResponseEntity<ErpAccountingEntry> getAccountingEntry(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getAccountingEntryById(id));
    }

    @Operation(summary = "Creare inregistrare contabila")
    @PostMapping("/accounting/entries")
    public ResponseEntity<ErpAccountingEntry> createAccountingEntry(@RequestBody ErpAccountingEntry entry) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createAccountingEntry(entry));
    }

    @Operation(summary = "Actualizare inregistrare contabila")
    @PutMapping("/accounting/entries/{id}")
    public ResponseEntity<ErpAccountingEntry> updateAccountingEntry(@PathVariable UUID id, @RequestBody ErpAccountingEntry entry) {
        return ResponseEntity.ok(erpService.updateAccountingEntry(id, entry));
    }

    @Operation(summary = "Stergere inregistrare contabila")
    @DeleteMapping("/accounting/entries/{id}")
    public ResponseEntity<Void> deleteAccountingEntry(@PathVariable UUID id) {
        erpService.deleteAccountingEntry(id);
        return ResponseEntity.noContent().build();
    }

    // === Accounting Lines ===
    @Operation(summary = "Linii inregistrare contabila")
    @GetMapping("/accounting/entries/{id}/lines")
    public ResponseEntity<List<ErpAccountingLine>> getAccountingLines(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getAccountingLines(id));
    }

    @PostMapping("/accounting/lines")
    public ResponseEntity<ErpAccountingLine> createAccountingLine(@RequestBody ErpAccountingLine line) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createAccountingLine(line));
    }

    @PutMapping("/accounting/lines/{id}")
    public ResponseEntity<ErpAccountingLine> updateAccountingLine(@PathVariable UUID id, @RequestBody ErpAccountingLine line) {
        return ResponseEntity.ok(erpService.updateAccountingLine(id, line));
    }

    @DeleteMapping("/accounting/lines/{id}")
    public ResponseEntity<Void> deleteAccountingLine(@PathVariable UUID id) {
        erpService.deleteAccountingLine(id);
        return ResponseEntity.noContent().build();
    }

    // === Employees ===
    @Operation(summary = "Lista angajati")
    @GetMapping("/hr/employees")
    public ResponseEntity<List<ErpEmployee>> getEmployees(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) ErpEmployee.EmployeeStatus status) {
        return ResponseEntity.ok(erpService.getEmployees(department, status));
    }

    @Operation(summary = "Detalii angajat")
    @GetMapping("/hr/employees/{id}")
    public ResponseEntity<ErpEmployee> getEmployee(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getEmployeeById(id));
    }

    @Operation(summary = "Adaugare angajat")
    @PostMapping("/hr/employees")
    public ResponseEntity<ErpEmployee> createEmployee(@RequestBody ErpEmployee employee) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createEmployee(employee));
    }

    @Operation(summary = "Actualizare angajat")
    @PutMapping("/hr/employees/{id}")
    public ResponseEntity<ErpEmployee> updateEmployee(@PathVariable UUID id, @RequestBody ErpEmployee employee) {
        return ResponseEntity.ok(erpService.updateEmployee(id, employee));
    }

    @Operation(summary = "Stergere angajat")
    @DeleteMapping("/hr/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable UUID id) {
        erpService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // === Payroll ===
    @Operation(summary = "Lista state de plata")
    @GetMapping("/hr/payroll")
    public ResponseEntity<List<ErpPayroll>> getPayrolls(
            @RequestParam(required = false) UUID employeeId,
            @RequestParam(required = false) LocalDate period) {
        return ResponseEntity.ok(erpService.getPayrolls(employeeId, period));
    }

    @Operation(summary = "Detalii stat de plata")
    @GetMapping("/hr/payroll/{id}")
    public ResponseEntity<ErpPayroll> getPayroll(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getPayrollById(id));
    }

    @Operation(summary = "Creare stat de plata")
    @PostMapping("/hr/payroll")
    public ResponseEntity<ErpPayroll> createPayroll(@RequestBody ErpPayroll payroll) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createPayroll(payroll));
    }

    @Operation(summary = "Actualizare stat de plata")
    @PutMapping("/hr/payroll/{id}")
    public ResponseEntity<ErpPayroll> updatePayroll(@PathVariable UUID id, @RequestBody ErpPayroll payroll) {
        return ResponseEntity.ok(erpService.updatePayroll(id, payroll));
    }

    @Operation(summary = "Calculare stat de plata")
    @PostMapping("/hr/payroll/calculate")
    public ResponseEntity<List<ErpPayroll>> calculatePayroll(@RequestParam LocalDate period) {
        return ResponseEntity.ok(erpService.getPayrolls(null, period));
    }

    @Operation(summary = "Aprobare stat de plata")
    @PostMapping("/hr/payroll/{id}/approve")
    public ResponseEntity<Void> approvePayroll(@PathVariable UUID id) {
        ErpPayroll payroll = erpService.getPayrollById(id);
        payroll.setStatus(ErpPayroll.PayrollStatus.APPROVED);
        erpService.updatePayroll(id, payroll);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/hr/payroll/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable UUID id) {
        erpService.deletePayroll(id);
        return ResponseEntity.noContent().build();
    }

    // === Inventory Items ===
    @Operation(summary = "Lista articole inventar")
    @GetMapping("/inventory/items")
    public ResponseEntity<List<ErpInventoryItem>> getInventoryItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) UUID warehouseId) {
        return ResponseEntity.ok(erpService.getInventoryItems(category, warehouseId));
    }

    @Operation(summary = "Detalii articol inventar")
    @GetMapping("/inventory/items/{id}")
    public ResponseEntity<ErpInventoryItem> getInventoryItem(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getInventoryItemById(id));
    }

    @Operation(summary = "Adaugare articol inventar")
    @PostMapping("/inventory/items")
    public ResponseEntity<ErpInventoryItem> createInventoryItem(@RequestBody ErpInventoryItem item) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createInventoryItem(item));
    }

    @Operation(summary = "Actualizare articol inventar")
    @PutMapping("/inventory/items/{id}")
    public ResponseEntity<ErpInventoryItem> updateInventoryItem(@PathVariable UUID id, @RequestBody ErpInventoryItem item) {
        return ResponseEntity.ok(erpService.updateInventoryItem(id, item));
    }

    @Operation(summary = "Stergere articol inventar")
    @DeleteMapping("/inventory/items/{id}")
    public ResponseEntity<Void> deleteInventoryItem(@PathVariable UUID id) {
        erpService.deleteInventoryItem(id);
        return ResponseEntity.noContent().build();
    }

    // === Fixed Assets ===
    @Operation(summary = "Lista mijloace fixe")
    @GetMapping("/inventory/assets")
    public ResponseEntity<List<ErpFixedAsset>> getFixedAssets(
            @RequestParam(required = false) String assetCategory,
            @RequestParam(required = false) ErpFixedAsset.AssetStatus status) {
        return ResponseEntity.ok(erpService.getFixedAssets(assetCategory, status));
    }

    @Operation(summary = "Detalii mijloc fix")
    @GetMapping("/inventory/assets/{id}")
    public ResponseEntity<ErpFixedAsset> getFixedAsset(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.getFixedAssetById(id));
    }

    @Operation(summary = "Inregistrare mijloc fix")
    @PostMapping("/inventory/assets")
    public ResponseEntity<ErpFixedAsset> createFixedAsset(@RequestBody ErpFixedAsset asset) {
        return ResponseEntity.status(HttpStatus.CREATED).body(erpService.createFixedAsset(asset));
    }

    @Operation(summary = "Actualizare mijloc fix")
    @PutMapping("/inventory/assets/{id}")
    public ResponseEntity<ErpFixedAsset> updateFixedAsset(@PathVariable UUID id, @RequestBody ErpFixedAsset asset) {
        return ResponseEntity.ok(erpService.updateFixedAsset(id, asset));
    }

    @Operation(summary = "Calculare amortizare mijloc fix")
    @PostMapping("/inventory/assets/{id}/depreciate")
    public ResponseEntity<ErpFixedAsset> calculateDepreciation(@PathVariable UUID id) {
        return ResponseEntity.ok(erpService.calculateDepreciation(id));
    }

    @Operation(summary = "Stergere mijloc fix")
    @DeleteMapping("/inventory/assets/{id}")
    public ResponseEntity<Void> deleteFixedAsset(@PathVariable UUID id) {
        erpService.deleteFixedAsset(id);
        return ResponseEntity.noContent().build();
    }

    // === Stats ===
    @Operation(summary = "Statistici ERP")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(erpService.getStats());
    }
}
