package ro.pdi.gis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.pdi.gis.model.GisLayer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GisLayerRepository extends JpaRepository<GisLayer, UUID> {

    List<GisLayer> findByIsActiveTrue();

    Optional<GisLayer> findByLayerIdAndIsActiveTrue(String layerId);

    @Query("SELECT COUNT(l) FROM GisLayer l WHERE l.isActive = true")
    long countActiveLayers();
}
