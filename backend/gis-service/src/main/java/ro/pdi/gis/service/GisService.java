package ro.pdi.gis.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.gis.model.GisFeature;
import ro.pdi.gis.model.GisLayer;
import ro.pdi.gis.repository.GisFeatureRepository;
import ro.pdi.gis.repository.GisLayerRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GisService {

    private final GisLayerRepository layerRepository;
    private final GisFeatureRepository featureRepository;

    // === Layers ===

    public List<GisLayer> getLayers() {
        return layerRepository.findByIsActiveTrue();
    }

    public GisLayer getLayerById(UUID id) {
        return layerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Layer not found: " + id));
    }

    public GisLayer getLayerByLayerId(String layerId) {
        return layerRepository.findByLayerIdAndIsActiveTrue(layerId)
                .orElseThrow(() -> new RuntimeException("Layer not found: " + layerId));
    }

    @Transactional
    public GisLayer createLayer(GisLayer layer) {
        log.info("Creating GIS layer: {}", layer.getLayerId());
        return layerRepository.save(layer);
    }

    @Transactional
    public GisLayer updateLayer(UUID id, GisLayer updated) {
        log.info("Updating GIS layer: {}", id);
        GisLayer existing = getLayerById(id);
        existing.setLayerId(updated.getLayerId());
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setDescription(updated.getDescription());
        existing.setVisible(updated.getVisible());
        existing.setMinZoom(updated.getMinZoom());
        existing.setMaxZoom(updated.getMaxZoom());
        existing.setStyle(updated.getStyle());
        return layerRepository.save(existing);
    }

    @Transactional
    public void deleteLayer(UUID id) {
        log.info("Soft-deleting GIS layer: {}", id);
        GisLayer layer = getLayerById(id);
        layer.setIsActive(false);
        layerRepository.save(layer);
    }

    // === Features ===

    public List<GisFeature> getFeatures() {
        return featureRepository.findByIsActiveTrue();
    }

    public List<GisFeature> getLayerFeatures(String layerId, Double bboxMinX, Double bboxMinY,
                                              Double bboxMaxX, Double bboxMaxY) {
        if (bboxMinX != null && bboxMinY != null && bboxMaxX != null && bboxMaxY != null) {
            return featureRepository.findByLayerIdAndBoundingBox(layerId, bboxMinY, bboxMaxY, bboxMinX, bboxMaxX);
        }
        return featureRepository.findByLayerIdAndIsActiveTrue(layerId);
    }

    public GisFeature getFeatureById(UUID id) {
        return featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feature not found: " + id));
    }

    @Transactional
    public GisFeature createFeature(GisFeature feature) {
        log.info("Creating GIS feature: {} in layer {}", feature.getName(), feature.getLayerId());
        return featureRepository.save(feature);
    }

    @Transactional
    public GisFeature updateFeature(UUID id, GisFeature updated) {
        log.info("Updating GIS feature: {}", id);
        GisFeature existing = getFeatureById(id);
        existing.setLayerId(updated.getLayerId());
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        existing.setGeometryGeoJson(updated.getGeometryGeoJson());
        existing.setPropertiesJson(updated.getPropertiesJson());
        return featureRepository.save(existing);
    }

    @Transactional
    public void deleteFeature(UUID id) {
        log.info("Soft-deleting GIS feature: {}", id);
        GisFeature feature = getFeatureById(id);
        feature.setIsActive(false);
        featureRepository.save(feature);
    }

    // === Search ===

    public List<GisFeature> search(String query, String layerId) {
        if (layerId != null && !layerId.isBlank()) {
            return featureRepository.searchByNameAndLayerId(query, layerId);
        }
        return featureRepository.searchByName(query);
    }

    // === Reverse Geocode ===

    public Map<String, Object> reverseGeocode(Double lat, Double lon) {
        List<GisFeature> nearest = featureRepository.findNearestFeatures(lat, lon);

        Map<String, Object> result = new HashMap<>();
        if (!nearest.isEmpty()) {
            GisFeature feature = nearest.get(0);
            result.put("featureId", feature.getId());
            result.put("name", feature.getName());
            result.put("layerId", feature.getLayerId());
            result.put("latitude", feature.getLatitude());
            result.put("longitude", feature.getLongitude());
            result.put("distance", calculateDistance(lat, lon, feature.getLatitude(), feature.getLongitude()));
            result.put("properties", feature.getPropertiesJson());
        } else {
            result.put("message", "No features found near the given coordinates");
        }
        return result;
    }

    // === Buffer ===

    public Map<String, Object> createBuffer(Double lat, Double lon, Double distanceMeters) {
        int numPoints = 64;
        double radiusDeg = distanceMeters / 111320.0;

        List<List<Double>> coordinates = new ArrayList<>();
        for (int i = 0; i <= numPoints; i++) {
            double angle = (2.0 * Math.PI * i) / numPoints;
            double dx = radiusDeg * Math.cos(angle) / Math.cos(Math.toRadians(lat));
            double dy = radiusDeg * Math.sin(angle);
            coordinates.add(List.of(
                    Math.round((lon + dx) * 1_000_000.0) / 1_000_000.0,
                    Math.round((lat + dy) * 1_000_000.0) / 1_000_000.0
            ));
        }

        Map<String, Object> geometry = new LinkedHashMap<>();
        geometry.put("type", "Polygon");
        geometry.put("coordinates", List.of(coordinates));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("type", "Feature");
        response.put("geometry", geometry);
        response.put("properties", Map.of(
                "center", Map.of("lat", lat, "lon", lon),
                "radiusMeters", distanceMeters
        ));
        return response;
    }

    // === Stats ===

    public Map<String, Object> getLayerStats(String layerId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("layerId", layerId);
        stats.put("totalFeatures", featureRepository.countActiveFeaturesByLayerId(layerId));

        Double minLat = featureRepository.findMinLatByLayerId(layerId);
        Double maxLat = featureRepository.findMaxLatByLayerId(layerId);
        Double minLon = featureRepository.findMinLonByLayerId(layerId);
        Double maxLon = featureRepository.findMaxLonByLayerId(layerId);

        if (minLat != null && maxLat != null && minLon != null && maxLon != null) {
            stats.put("bbox", Map.of(
                    "minLat", minLat, "maxLat", maxLat,
                    "minLon", minLon, "maxLon", maxLon
            ));
        } else {
            stats.put("bbox", null);
        }
        return stats;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLayers", layerRepository.countActiveLayers());
        stats.put("totalFeatures", featureRepository.countActiveFeatures());
        return stats;
    }

    // === Helpers ===

    private double calculateDistance(double lat1, double lon1, Double lat2, Double lon2) {
        if (lat2 == null || lon2 == null) {
            return Double.MAX_VALUE;
        }
        double earthRadius = 6371000.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(earthRadius * c * 100.0) / 100.0;
    }
}
