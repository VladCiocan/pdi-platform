package ro.pdi.infrastructure.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.pdi.infrastructure.model.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/infrastructure")
public class InfrastructureController {

    @GetMapping("/networks")
    public ResponseEntity<List<InfrastructureNetwork>> getNetworks(
            @RequestParam(required = false) InfrastructureNetwork.NetworkType type) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/assets")
    public ResponseEntity<List<InfrastructureAsset>> getAssets(
            @RequestParam(required = false) UUID networkId,
            @RequestParam(required = false) InfrastructureAsset.AssetType type) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<InfrastructureIncident>> getIncidents(
            @RequestParam(required = false) InfrastructureIncident.IncidentStatus status,
            @RequestParam(required = false) InfrastructureIncident.Severity severity) {
        return ResponseEntity.ok(List.of());
    }
}