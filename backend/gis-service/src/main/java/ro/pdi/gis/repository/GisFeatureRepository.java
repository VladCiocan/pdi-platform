package ro.pdi.gis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.gis.model.GisFeature;

import java.util.List;
import java.util.UUID;

@Repository
public interface GisFeatureRepository extends JpaRepository<GisFeature, UUID> {

    List<GisFeature> findByLayerIdAndIsActiveTrue(String layerId);

    List<GisFeature> findByIsActiveTrue();

    @Query("SELECT f FROM GisFeature f WHERE f.isActive = true " +
           "AND f.latitude BETWEEN :minLat AND :maxLat " +
           "AND f.longitude BETWEEN :minLon AND :maxLon")
    List<GisFeature> findByBoundingBox(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon);

    @Query("SELECT f FROM GisFeature f WHERE f.isActive = true " +
           "AND f.layerId = :layerId " +
           "AND f.latitude BETWEEN :minLat AND :maxLat " +
           "AND f.longitude BETWEEN :minLon AND :maxLon")
    List<GisFeature> findByLayerIdAndBoundingBox(
            @Param("layerId") String layerId,
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon);

    @Query("SELECT f FROM GisFeature f WHERE f.isActive = true " +
           "AND LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<GisFeature> searchByName(@Param("query") String query);

    @Query("SELECT f FROM GisFeature f WHERE f.isActive = true " +
           "AND f.layerId = :layerId " +
           "AND LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<GisFeature> searchByNameAndLayerId(
            @Param("query") String query,
            @Param("layerId") String layerId);

    @Query("SELECT f FROM GisFeature f WHERE f.isActive = true " +
           "AND f.latitude IS NOT NULL AND f.longitude IS NOT NULL " +
           "ORDER BY ((f.latitude - :lat) * (f.latitude - :lat) + " +
           "(f.longitude - :lon) * (f.longitude - :lon))")
    List<GisFeature> findNearestFeatures(
            @Param("lat") Double lat,
            @Param("lon") Double lon);

    @Query("SELECT COUNT(f) FROM GisFeature f WHERE f.isActive = true")
    long countActiveFeatures();

    @Query("SELECT COUNT(f) FROM GisFeature f WHERE f.layerId = :layerId AND f.isActive = true")
    long countActiveFeaturesByLayerId(@Param("layerId") String layerId);

    @Query("SELECT MIN(f.latitude) FROM GisFeature f WHERE f.layerId = :layerId AND f.isActive = true AND f.latitude IS NOT NULL")
    Double findMinLatByLayerId(@Param("layerId") String layerId);

    @Query("SELECT MAX(f.latitude) FROM GisFeature f WHERE f.layerId = :layerId AND f.isActive = true AND f.latitude IS NOT NULL")
    Double findMaxLatByLayerId(@Param("layerId") String layerId);

    @Query("SELECT MIN(f.longitude) FROM GisFeature f WHERE f.layerId = :layerId AND f.isActive = true AND f.longitude IS NOT NULL")
    Double findMinLonByLayerId(@Param("layerId") String layerId);

    @Query("SELECT MAX(f.longitude) FROM GisFeature f WHERE f.layerId = :layerId AND f.isActive = true AND f.longitude IS NOT NULL")
    Double findMaxLonByLayerId(@Param("layerId") String layerId);
}
