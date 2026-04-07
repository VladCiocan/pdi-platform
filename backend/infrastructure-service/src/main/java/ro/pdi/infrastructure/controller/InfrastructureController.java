package ro.pdi.infrastructure.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.pdi.infrastructure.model.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/infrastructure")
@Tag(name = "Infrastructura", description = "Retele de utilitati, active si incidente")
public class InfrastructureController {

    @Operation(summary = "Lista retele de utilitati")
    @GetMapping("/networks")
    public ResponseEntity<List<InfrastructureNetwork>> getNetworks(
            @RequestParam(required = false) InfrastructureNetwork.NetworkType type) {
        return ResponseEntity.ok(List.of());
    }

    @Operation(summary = "Lista active de infrastructura")
    @GetMapping("/assets")
    public ResponseEntity<List<InfrastructureAsset>> getAssets(
            @RequestParam(required = false) UUID networkId,
            @RequestParam(required = false) InfrastructureAsset.AssetType type) {
        return ResponseEntity.ok(List.of());
    }

    @Operation(summary = "Lista incidente raportate")
    @GetMapping("/incidents")
    public ResponseEntity<List<InfrastructureIncident>> getIncidents(
            @RequestParam(required = false) InfrastructureIncident.IncidentStatus status,
            @RequestParam(required = false) InfrastructureIncident.Severity severity) {
        return ResponseEntity.ok(List.of());
    }
}