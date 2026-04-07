package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.budget.ErpBudget;

import java.util.List;
import java.util.UUID;

@Repository
public interface ErpBudgetRepository extends JpaRepository<ErpBudget, UUID> {

    List<ErpBudget> findByYearAndIsActiveTrue(Integer year);

    List<ErpBudget> findBySourceCodeAndIsActiveTrue(String sourceCode);

    List<ErpBudget> findByYearAndSourceCodeAndIsActiveTrue(Integer year, String sourceCode);

    List<ErpBudget> findByIsActiveTrue();

    List<ErpBudget> findByStatusAndIsActiveTrue(ErpBudget.BudgetStatus status);

    @Query("SELECT COUNT(b) FROM ErpBudget b WHERE b.isActive = true")
    long countActiveBudgets();
}
