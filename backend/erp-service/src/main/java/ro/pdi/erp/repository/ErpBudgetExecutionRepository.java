package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.budget.ErpBudgetExecution;

import java.util.List;
import java.util.UUID;

@Repository
public interface ErpBudgetExecutionRepository extends JpaRepository<ErpBudgetExecution, UUID> {

    List<ErpBudgetExecution> findByBudgetIdAndIsActiveTrue(UUID budgetId);

    List<ErpBudgetExecution> findByIsActiveTrue();

    List<ErpBudgetExecution> findByStatusAndIsActiveTrue(ErpBudgetExecution.ExecutionStatus status);
}
