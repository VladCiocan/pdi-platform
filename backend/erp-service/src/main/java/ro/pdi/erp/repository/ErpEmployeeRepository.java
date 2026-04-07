package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.hr.ErpEmployee;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ErpEmployeeRepository extends JpaRepository<ErpEmployee, UUID> {

    List<ErpEmployee> findByIsActiveTrue();

    List<ErpEmployee> findByDepartmentAndIsActiveTrue(String department);

    List<ErpEmployee> findByStatusAndIsActiveTrue(ErpEmployee.EmployeeStatus status);

    List<ErpEmployee> findByDepartmentAndStatusAndIsActiveTrue(String department, ErpEmployee.EmployeeStatus status);

    Optional<ErpEmployee> findByCnpAndIsActiveTrue(String cnp);

    @Query("SELECT COUNT(e) FROM ErpEmployee e WHERE e.isActive = true")
    long countActiveEmployees();
}
