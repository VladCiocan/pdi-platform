package ro.pdi.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.dms.model.DmsDocumentMetadata;

import java.util.List;
import java.util.UUID;

@Repository
public interface DmsDocumentMetadataRepository extends JpaRepository<DmsDocumentMetadata, UUID> {
    List<DmsDocumentMetadata> findByDocumentId(UUID documentId);
    List<DmsDocumentMetadata> findByDocumentIdAndIsIndexableTrue(UUID documentId);
    List<DmsDocumentMetadata> findByKeyAndDocumentId(String key, UUID documentId);
    void deleteByDocumentId(UUID documentId);
}