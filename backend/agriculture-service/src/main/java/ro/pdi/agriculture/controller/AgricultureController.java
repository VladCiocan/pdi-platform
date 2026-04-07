package ro.pdi.agriculture.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.pdi.agriculture.model.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/agriculture")
@Tag(name = "Agricultura", description = "Registrul agricol - gospodarii, parcele, animale, utilaje")
public class AgricultureController {

    @Operation(summary = "Lista gospodarii")
    @GetMapping("/households")
    public ResponseEntity<List<AgricultureHousehold>> getHouseholds(
            @RequestParam(required = false) UUID ownerId) {
        return ResponseEntity.ok(List.of());
    }

    @Operation(summary = "Inregistrare gospodarie noua")
    @PostMapping("/households")
    public ResponseEntity<AgricultureHousehold> createHousehold(@RequestBody AgricultureHousehold household) {
        return ResponseEntity.ok(household);
    }

    @Operation(summary = "Lista parcele agricole")
    @GetMapping("/parcels")
    public ResponseEntity<List<AgricultureParcel>> getParcels(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }

    @Operation(summary = "Lista membri gospodarie")
    @GetMapping("/members")
    public ResponseEntity<List<AgricultureMember>> getMembers(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }

    @Operation(summary = "Lista animale inregistrate")
    @GetMapping("/animals")
    public ResponseEntity<List<AgricultureAnimal>> getAnimals(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }

    @Operation(summary = "Lista utilaje agricole")
    @GetMapping("/machines")
    public ResponseEntity<List<AgricultureMachine>> getMachines(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }
}