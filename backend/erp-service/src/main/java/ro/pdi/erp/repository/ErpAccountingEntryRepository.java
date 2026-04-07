package ro.pdi.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.erp.model.accounting.ErpAccountingEntry;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ErpAccountingEntryRepository extends JpaRepository<ErpAccountingEntry, UUID> {

    List<ErpAccountingEntry> findByIsActiveTrue();

    List<ErpAccountingEntry> findByJournalAndIsActiveTrue(String journal);

    List<ErpAccountingEntry> findByDocumentTypeAndIsActiveTrue(String documentType);

    List<ErpAccountingEntry> findByEntryDateBetweenAndIsActiveTrue(LocalDate startDate, LocalDate endDate);

    List<ErpAccountingEntry> findByIsPostedTrueAndIsActiveTrue();
}
