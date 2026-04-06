package ro.pdi.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.dms.model.DmsDocumentVersion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DmsDocumentVersionRepository extends JpaRepository<DmsDocumentVersion, UUID> {
    List<DmsDocumentVersion> findByDocumentIdOrderByVersionDesc(UUID documentId);
    
    @Query("SELECT MAX(v.version) FROM DmsDocumentVersion v WHERE v.documentId = :documentId")
    Optional<Integer> findMaxVersionByDocumentId(@Param("documentId") UUID documentId);
    
    Optional<DmsDocumentVersion> findByDocumentIdAndVersion(UUID documentId, Integer version);
}