package ro.pdi.erp.controller;

import lombok.RequiredArgsConstructor;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/erp")
@RequiredArgsConstructor
public class ErpController {

    @GetMapping("/budgets")
    public ResponseEntity<List<ErpBudget>> getBudgets(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String sourceCode) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/budgets")
    public ResponseEntity<ErpBudget> createBudget(@RequestBody ErpBudget budget) {
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/budgets/{id}")
    public ResponseEntity<ErpBudget> getBudget(@PathVariable UUID id) {
        return ResponseEntity.ok(ErpBudget.builder().id(id).build());
    }

    @GetMapping("/budget-executions")
    public ResponseEntity<List<ErpBudgetExecution>> getBudgetExecutions(
            @RequestParam UUID budgetId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/budget-executions")
    public ResponseEntity<ErpBudgetExecution> createBudgetExecution(
            @RequestBody ErpBudgetExecution execution) {
        return ResponseEntity.ok(execution);
    }

    @GetMapping("/accounting/entries")
    public ResponseEntity<List<ErpAccountingEntry>> getAccountingEntries(
            @RequestParam(required = false) String journal,
            @RequestParam(required = false) String documentType) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/accounting/entries")
    public ResponseEntity<ErpAccountingEntry> createAccountingEntry(
            @RequestBody ErpAccountingEntry entry) {
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/accounting/entries/{id}")
    public ResponseEntity<ErpAccountingEntry> getAccountingEntry(@PathVariable UUID id) {
        return ResponseEntity.ok(ErpAccountingEntry.builder().id(id).build());
    }

    @GetMapping("/accounting/entries/{id}/lines")
    public ResponseEntity<List<ErpAccountingLine>> getAccountingLines(@PathVariable UUID id) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/hr/employees")
    public ResponseEntity<List<ErpEmployee>> getEmployees(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) ErpEmployee.EmployeeStatus status) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/hr/employees")
    public ResponseEntity<ErpEmployee> createEmployee(@RequestBody ErpEmployee employee) {
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/hr/employees/{id}")
    public ResponseEntity<ErpEmployee> getEmployee(@PathVariable UUID id) {
        return ResponseEntity.ok(ErpEmployee.builder().id(id).build());
    }

    @GetMapping("/hr/payroll")
    public ResponseEntity<List<ErpPayroll>> getPayrolls(
            @RequestParam UUID employeeId,
            @RequestParam(required = false) java.time.LocalDate period) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/hr/payroll/calculate")
    public ResponseEntity<List<ErpPayroll>> calculatePayroll(
            @RequestParam java.time.LocalDate period) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/hr/payroll/approve")
    public ResponseEntity<Void> approvePayroll(
            @RequestParam java.time.LocalDate period) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory/items")
    public ResponseEntity<List<ErpInventoryItem>> getInventoryItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) UUID warehouseId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/inventory/items")
    public ResponseEntity<ErpInventoryItem> createInventoryItem(
            @RequestBody ErpInventoryItem item) {
        return ResponseEntity.ok(item);
    }

    @GetMapping("/inventory/items/{id}")
    public ResponseEntity<ErpInventoryItem> getInventoryItem(@PathVariable UUID id) {
        return ResponseEntity.ok(ErpInventoryItem.builder().id(id).build());
    }

    @GetMapping("/inventory/assets")
    public ResponseEntity<List<ErpFixedAsset>> getFixedAssets(
            @RequestParam(required = false) String assetCategory,
            @RequestParam(required = false) ErpFixedAsset.AssetStatus status) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/inventory/assets")
    public ResponseEntity<ErpFixedAsset> createFixedAsset(@RequestBody ErpFixedAsset asset) {
        return ResponseEntity.ok(asset);
    }

    @GetMapping("/inventory/assets/{id}")
    public ResponseEntity<ErpFixedAsset> getFixedAsset(@PathVariable UUID id) {
        return ResponseEntity.ok(ErpFixedAsset.builder().id(id).build());
    }

    @PostMapping("/inventory/assets/{id}/depreciate")
    public ResponseEntity<ErpFixedAsset> calculateDepreciation(@PathVariable UUID id) {
        return ResponseEntity.ok(ErpFixedAsset.builder().id(id).build());
    }
}