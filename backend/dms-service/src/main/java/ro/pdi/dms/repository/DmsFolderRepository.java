package ro.pdi.dms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.pdi.dms.model.DmsFolder;

import java.util.List;
import java.util.UUID;

@Repository
public interface DmsFolderRepository extends JpaRepository<DmsFolder, UUID> {
    List<DmsFolder> findByParentIdAndIsActiveTrue(UUID parentId);
    List<DmsFolder> findByOwnerIdAndIsActiveTrue(UUID ownerId);
    List<DmsFolder> findByIsActiveTrue();
}