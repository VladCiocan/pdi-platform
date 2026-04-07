package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.accounting.ErpAccountingLine;

import java.util.List;
import java.util.UUID;

@Repository
public interface ErpAccountingLineRepository extends JpaRepository<ErpAccountingLine, UUID> {

    List<ErpAccountingLine> findByEntryId(UUID entryId);
}
