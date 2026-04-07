package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.hr.ErpPayroll;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ErpPayrollRepository extends JpaRepository<ErpPayroll, UUID> {

    List<ErpPayroll> findByEmployeeIdAndIsActiveTrue(UUID employeeId);

    List<ErpPayroll> findByEmployeeIdAndPeriodAndIsActiveTrue(UUID employeeId, LocalDate period);

    List<ErpPayroll> findByPeriodAndIsActiveTrue(LocalDate period);

    List<ErpPayroll> findByIsActiveTrue();

    List<ErpPayroll> findByStatusAndIsActiveTrue(ErpPayroll.PayrollStatus status);
}
