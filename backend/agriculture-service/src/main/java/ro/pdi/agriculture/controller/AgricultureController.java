package ro.pdi.agriculture.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ro.pdi.agriculture.model.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/agriculture")
public class AgricultureController {

    @GetMapping("/households")
    public ResponseEntity<List<AgricultureHousehold>> getHouseholds(
            @RequestParam(required = false) UUID ownerId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/households")
    public ResponseEntity<AgricultureHousehold> createHousehold(@RequestBody AgricultureHousehold household) {
        return ResponseEntity.ok(household);
    }

    @GetMapping("/parcels")
    public ResponseEntity<List<AgricultureParcel>> getParcels(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/members")
    public ResponseEntity<List<AgricultureMember>> getMembers(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/animals")
    public ResponseEntity<List<AgricultureAnimal>> getAnimals(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/machines")
    public ResponseEntity<List<AgricultureMachine>> getMachines(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(List.of());
    }
}