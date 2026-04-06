package ro.pdi.gis.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/gis")
@RequiredArgsConstructor
public class GisController {

    @GetMapping("/layers")
    public ResponseEntity<List<Map<String, Object>>> getLayers() {
        List<Map<String, Object>> layers = Arrays.asList(
            Map.of("id", "parcels", "name", "Parcele Agricole", "type", "polygon", "visible", true),
            Map.of("id", "networks", "name", "Rețele Utilități", "type", "line", "visible", true),
            Map.of("id", "streets", "name", "Străzi", "type", "line", "visible", true),
            Map.of("id", "addresses", "name", "Adrese", "type", "point", "visible", true),
            Map.of("id", "utr_zones", "name", "Zone UTR", "type", "polygon", "visible", true),
            Map.of("id", "buildings", "name", "Clădiri", "type", "polygon", "visible", true)
        );
        return ResponseEntity.ok(layers);
    }

    @GetMapping("/layers/{layerId}/features")
    public ResponseEntity<Map<String, Object>> getLayerFeatures(
            @PathVariable String layerId,
            @RequestParam(required = false) Double bboxMinX,
            @RequestParam(required = false) Double bboxMinY,
            @RequestParam(required = false) Double bboxMaxX,
            @RequestParam(required = false) Double bboxMaxY) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("type", "FeatureCollection");
        response.put("layer", layerId);
        response.put("features", new ArrayList<>());
        response.put("totalFeatures", 0);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(
            @RequestParam String query,
            @RequestParam(required = false) String layer) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/reverse-geocode")
    public ResponseEntity<Map<String, Object>> reverseGeocode(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        
        Map<String, Object> result = new HashMap<>();
        result.put("address", "Strada Example, Nr. 1");
        result.put("parcelId", "12345");
        result.put("zone", "UTR-1");
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/buffer")
    public ResponseEntity<Map<String, Object>> createBuffer(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam Double distanceMeters) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("type", "Polygon");
        response.put("center", Map.of("lat", lat, "lon", lon));
        response.put("radius", distanceMeters);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/intersects")
    public ResponseEntity<List<Map<String, Object>>> findIntersections(
            @RequestParam String layer1,
            @RequestParam String layer2,
            @RequestParam Double bboxMinX,
            @RequestParam Double bboxMinY,
            @RequestParam Double bboxMaxX,
            @RequestParam Double bboxMaxY) {
        
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/raster/orthophoto")
    public ResponseEntity<Map<String, Object>> getOrthophoto(
            @RequestParam Double bboxMinX,
            @RequestParam Double bboxMinY,
            @RequestParam Double bboxMaxX,
            @RequestParam Double bboxMaxY,
            @RequestParam(defaultValue = "150") Integer dpi) {
        
        Map<String, Object> result = Map.of(
            "url", "/api/v1/gis/raster/orthophoto/tile",
            "bounds", Map.of("minX", bboxMinX, "minY", bboxMinY, "maxX", bboxMaxX, "maxY", bboxMaxY),
            "dpi", dpi
        );
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/export")
    public ResponseEntity<Map<String, Object>> exportData(
            @RequestParam String layer,
            @RequestParam(defaultValue = "geojson") String format) {
        
        Map<String, Object> result = Map.of(
            "layer", layer,
            "format", format,
            "url", "/api/v1/gis/download/" + layer + "." + format
        );
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats/layer/{layerId}")
    public ResponseEntity<Map<String, Object>> getLayerStats(@PathVariable String layerId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("layerId", layerId);
        stats.put("totalFeatures", 0);
        stats.put("areaCovered", 0.0);
        stats.put("lastUpdated", new Date());
        
        return ResponseEntity.ok(stats);
    }
}