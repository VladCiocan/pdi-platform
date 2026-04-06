package ro.pdi.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.dms.model.DmsDocument;

import java.util.List;
import java.util.UUID;

@Repository
public interface DmsDocumentRepository extends JpaRepository<DmsDocument, UUID> {
    List<DmsDocument> findByFolderIdAndIsActiveTrue(UUID folderId);
    List<DmsDocument> findByOwnerIdAndIsActiveTrue(UUID ownerId);
    List<DmsDocument> findByStatusAndIsActiveTrue(DmsDocument.DocumentStatus status);
    List<DmsDocument> findByIsActiveTrue();
    
    @Query("SELECT d FROM DmsDocument d WHERE d.isActive = true AND " +
           "(LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.tags) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<DmsDocument> searchDocuments(@Param("query") String query);
    
    List<DmsDocument> findByDocumentTypeAndIsActiveTrue(String documentType);
}