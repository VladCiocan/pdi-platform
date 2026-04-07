package ro.pdi.gis.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pdi.gis.model.GisFeature;
import ro.pdi.gis.model.GisLayer;
import ro.pdi.gis.service.GisService;

import java.util.*;

@RestController
@RequestMapping("/api/v1/gis")
@RequiredArgsConstructor
@Tag(name = "GIS", description = "Sistem informatic geografic - straturi, features, analize spatiale")
public class GisController {

    private final GisService gisService;

    // === Layers ===

    @Operation(summary = "Lista straturi GIS")
    @GetMapping("/layers")
    public ResponseEntity<List<GisLayer>> getLayers() {
        return ResponseEntity.ok(gisService.getLayers());
    }

    @Operation(summary = "Detalii strat GIS")
    @GetMapping("/layers/{id}")
    public ResponseEntity<GisLayer> getLayer(@PathVariable UUID id) {
        return ResponseEntity.ok(gisService.getLayerById(id));
    }

    @Operation(summary = "Creare strat GIS")
    @PostMapping("/layers")
    public ResponseEntity<GisLayer> createLayer(@RequestBody GisLayer layer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gisService.createLayer(layer));
    }

    @Operation(summary = "Actualizare strat GIS")
    @PutMapping("/layers/{id}")
    public ResponseEntity<GisLayer> updateLayer(@PathVariable UUID id, @RequestBody GisLayer layer) {
        return ResponseEntity.ok(gisService.updateLayer(id, layer));
    }

    @Operation(summary = "Stergere strat GIS")
    @DeleteMapping("/layers/{id}")
    public ResponseEntity<Void> deleteLayer(@PathVariable UUID id) {
        gisService.deleteLayer(id);
        return ResponseEntity.noContent().build();
    }

    // === Features ===

    @Operation(summary = "Features dintr-un strat GIS")
    @GetMapping("/layers/{layerId}/features")
    public ResponseEntity<Map<String, Object>> getLayerFeatures(
            @PathVariable String layerId,
            @RequestParam(required = false) Double bboxMinX,
            @RequestParam(required = false) Double bboxMinY,
            @RequestParam(required = false) Double bboxMaxX,
            @RequestParam(required = false) Double bboxMaxY) {

        List<GisFeature> features = gisService.getLayerFeatures(layerId, bboxMinX, bboxMinY, bboxMaxX, bboxMaxY);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("type", "FeatureCollection");
        response.put("layer", layerId);
        response.put("features", features);
        response.put("totalFeatures", features.size());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Detalii feature GIS")
    @GetMapping("/features/{id}")
    public ResponseEntity<GisFeature> getFeature(@PathVariable UUID id) {
        return ResponseEntity.ok(gisService.getFeatureById(id));
    }

    @Operation(summary = "Creare feature GIS")
    @PostMapping("/features")
    public ResponseEntity<GisFeature> createFeature(@RequestBody GisFeature feature) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gisService.createFeature(feature));
    }

    @Operation(summary = "Actualizare feature GIS")
    @PutMapping("/features/{id}")
    public ResponseEntity<GisFeature> updateFeature(@PathVariable UUID id, @RequestBody GisFeature feature) {
        return ResponseEntity.ok(gisService.updateFeature(id, feature));
    }

    @Operation(summary = "Stergere feature GIS")
    @DeleteMapping("/features/{id}")
    public ResponseEntity<Void> deleteFeature(@PathVariable UUID id) {
        gisService.deleteFeature(id);
        return ResponseEntity.noContent().build();
    }

    // === Search ===

    @Operation(summary = "Cautare spatiala")
    @GetMapping("/search")
    public ResponseEntity<List<GisFeature>> search(
            @RequestParam String query,
            @RequestParam(required = false) String layer) {
        return ResponseEntity.ok(gisService.search(query, layer));
    }

    // === Reverse Geocode ===

    @Operation(summary = "Geocodare inversa")
    @GetMapping("/reverse-geocode")
    public ResponseEntity<Map<String, Object>> reverseGeocode(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        return ResponseEntity.ok(gisService.reverseGeocode(lat, lon));
    }

    // === Buffer ===

    @Operation(summary = "Creare zona buffer")
    @GetMapping("/buffer")
    public ResponseEntity<Map<String, Object>> createBuffer(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam Double distanceMeters) {
        return ResponseEntity.ok(gisService.createBuffer(lat, lon, distanceMeters));
    }

    // === Stats ===

    @Operation(summary = "Statistici strat GIS")
    @GetMapping("/stats/layer/{layerId}")
    public ResponseEntity<Map<String, Object>> getLayerStats(@PathVariable String layerId) {
        return ResponseEntity.ok(gisService.getLayerStats(layerId));
    }

    @Operation(summary = "Statistici generale GIS")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(gisService.getStats());
    }
}
