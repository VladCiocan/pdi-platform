package ro.pdi.infrastructure.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pdi.infrastructure.model.*;
import ro.pdi.infrastructure.service.InfrastructureService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/infrastructure")
@Tag(name = "Infrastructura", description = "Retele de utilitati, active si incidente")
@RequiredArgsConstructor
public class InfrastructureController {

    private final InfrastructureService infrastructureService;

    // === Networks ===
    @Operation(summary = "Lista retele de utilitati")
    @GetMapping("/networks")
    public ResponseEntity<List<InfrastructureNetwork>> getNetworks(
            @RequestParam(required = false) InfrastructureNetwork.NetworkType type) {
        return ResponseEntity.ok(infrastructureService.getNetworks(type));
    }

    @Operation(summary = "Detalii retea")
    @GetMapping("/networks/{id}")
    public ResponseEntity<InfrastructureNetwork> getNetwork(@PathVariable UUID id) {
        return ResponseEntity.ok(infrastructureService.getNetworkById(id));
    }

    @Operation(summary = "Inregistrare retea noua")
    @PostMapping("/networks")
    public ResponseEntity<InfrastructureNetwork> createNetwork(@RequestBody InfrastructureNetwork network) {
        return ResponseEntity.status(HttpStatus.CREATED).body(infrastructureService.createNetwork(network));
    }

    @Operation(summary = "Actualizare retea")
    @PutMapping("/networks/{id}")
    public ResponseEntity<InfrastructureNetwork> updateNetwork(@PathVariable UUID id, @RequestBody InfrastructureNetwork network) {
        return ResponseEntity.ok(infrastructureService.updateNetwork(id, network));
    }

    @Operation(summary = "Stergere retea")
    @DeleteMapping("/networks/{id}")
    public ResponseEntity<Void> deleteNetwork(@PathVariable UUID id) {
        infrastructureService.deleteNetwork(id);
        return ResponseEntity.noContent().build();
    }

    // === Assets ===
    @Operation(summary = "Lista active de infrastructura")
    @GetMapping("/assets")
    public ResponseEntity<List<InfrastructureAsset>> getAssets(
            @RequestParam(required = false) UUID networkId,
            @RequestParam(required = false) InfrastructureAsset.AssetType type) {
        return ResponseEntity.ok(infrastructureService.getAssets(networkId, type));
    }

    @Operation(summary = "Detalii activ")
    @GetMapping("/assets/{id}")
    public ResponseEntity<InfrastructureAsset> getAsset(@PathVariable UUID id) {
        return ResponseEntity.ok(infrastructureService.getAssetById(id));
    }

    @Operation(summary = "Inregistrare activ nou")
    @PostMapping("/assets")
    public ResponseEntity<InfrastructureAsset> createAsset(@RequestBody InfrastructureAsset asset) {
        return ResponseEntity.status(HttpStatus.CREATED).body(infrastructureService.createAsset(asset));
    }

    @Operation(summary = "Actualizare activ")
    @PutMapping("/assets/{id}")
    public ResponseEntity<InfrastructureAsset> updateAsset(@PathVariable UUID id, @RequestBody InfrastructureAsset asset) {
        return ResponseEntity.ok(infrastructureService.updateAsset(id, asset));
    }

    @Operation(summary = "Stergere activ")
    @DeleteMapping("/assets/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable UUID id) {
        infrastructureService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    // === Incidents ===
    @Operation(summary = "Lista incidente raportate")
    @GetMapping("/incidents")
    public ResponseEntity<List<InfrastructureIncident>> getIncidents(
            @RequestParam(required = false) InfrastructureIncident.IncidentStatus status,
            @RequestParam(required = false) InfrastructureIncident.Severity severity) {
        return ResponseEntity.ok(infrastructureService.getIncidents(status, severity));
    }

    @Operation(summary = "Detalii incident")
    @GetMapping("/incidents/{id}")
    public ResponseEntity<InfrastructureIncident> getIncident(@PathVariable UUID id) {
        return ResponseEntity.ok(infrastructureService.getIncidentById(id));
    }

    @Operation(summary = "Raportare incident nou")
    @PostMapping("/incidents")
    public ResponseEntity<InfrastructureIncident> createIncident(@RequestBody InfrastructureIncident incident) {
        return ResponseEntity.status(HttpStatus.CREATED).body(infrastructureService.createIncident(incident));
    }

    @Operation(summary = "Actualizare incident")
    @PutMapping("/incidents/{id}")
    public ResponseEntity<InfrastructureIncident> updateIncident(@PathVariable UUID id, @RequestBody InfrastructureIncident incident) {
        return ResponseEntity.ok(infrastructureService.updateIncident(id, incident));
    }

    @Operation(summary = "Stergere incident")
    @DeleteMapping("/incidents/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable UUID id) {
        infrastructureService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    // === Stats ===
    @Operation(summary = "Statistici infrastructura")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(infrastructureService.getStats());
    }
}
