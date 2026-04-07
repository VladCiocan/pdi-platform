package ro.pdi.agriculture.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pdi.agriculture.model.*;
import ro.pdi.agriculture.service.AgricultureService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/agriculture")
@Tag(name = "Agricultura", description = "Registrul agricol - gospodarii, parcele, animale, utilaje")
@RequiredArgsConstructor
public class AgricultureController {

    private final AgricultureService agricultureService;

    // === Households ===
    @Operation(summary = "Lista gospodarii")
    @GetMapping("/households")
    public ResponseEntity<List<AgricultureHousehold>> getHouseholds(
            @RequestParam(required = false) UUID ownerId) {
        return ResponseEntity.ok(agricultureService.getHouseholds(ownerId));
    }

    @Operation(summary = "Detalii gospodarie")
    @GetMapping("/households/{id}")
    public ResponseEntity<AgricultureHousehold> getHousehold(@PathVariable UUID id) {
        return ResponseEntity.ok(agricultureService.getHouseholdById(id));
    }

    @Operation(summary = "Inregistrare gospodarie noua")
    @PostMapping("/households")
    public ResponseEntity<AgricultureHousehold> createHousehold(@RequestBody AgricultureHousehold household) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agricultureService.createHousehold(household));
    }

    @Operation(summary = "Actualizare gospodarie")
    @PutMapping("/households/{id}")
    public ResponseEntity<AgricultureHousehold> updateHousehold(@PathVariable UUID id, @RequestBody AgricultureHousehold household) {
        return ResponseEntity.ok(agricultureService.updateHousehold(id, household));
    }

    @Operation(summary = "Stergere gospodarie")
    @DeleteMapping("/households/{id}")
    public ResponseEntity<Void> deleteHousehold(@PathVariable UUID id) {
        agricultureService.deleteHousehold(id);
        return ResponseEntity.noContent().build();
    }

    // === Parcels ===
    @Operation(summary = "Lista parcele agricole")
    @GetMapping("/parcels")
    public ResponseEntity<List<AgricultureParcel>> getParcels(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(agricultureService.getParcels(householdId));
    }

    @Operation(summary = "Detalii parcela")
    @GetMapping("/parcels/{id}")
    public ResponseEntity<AgricultureParcel> getParcel(@PathVariable UUID id) {
        return ResponseEntity.ok(agricultureService.getParcelById(id));
    }

    @Operation(summary = "Inregistrare parcela noua")
    @PostMapping("/parcels")
    public ResponseEntity<AgricultureParcel> createParcel(@RequestBody AgricultureParcel parcel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agricultureService.createParcel(parcel));
    }

    @Operation(summary = "Actualizare parcela")
    @PutMapping("/parcels/{id}")
    public ResponseEntity<AgricultureParcel> updateParcel(@PathVariable UUID id, @RequestBody AgricultureParcel parcel) {
        return ResponseEntity.ok(agricultureService.updateParcel(id, parcel));
    }

    @Operation(summary = "Stergere parcela")
    @DeleteMapping("/parcels/{id}")
    public ResponseEntity<Void> deleteParcel(@PathVariable UUID id) {
        agricultureService.deleteParcel(id);
        return ResponseEntity.noContent().build();
    }

    // === Members ===
    @Operation(summary = "Lista membri gospodarie")
    @GetMapping("/members")
    public ResponseEntity<List<AgricultureMember>> getMembers(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(agricultureService.getMembers(householdId));
    }

    @Operation(summary = "Detalii membru")
    @GetMapping("/members/{id}")
    public ResponseEntity<AgricultureMember> getMember(@PathVariable UUID id) {
        return ResponseEntity.ok(agricultureService.getMemberById(id));
    }

    @Operation(summary = "Adaugare membru gospodarie")
    @PostMapping("/members")
    public ResponseEntity<AgricultureMember> createMember(@RequestBody AgricultureMember member) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agricultureService.createMember(member));
    }

    @Operation(summary = "Actualizare membru")
    @PutMapping("/members/{id}")
    public ResponseEntity<AgricultureMember> updateMember(@PathVariable UUID id, @RequestBody AgricultureMember member) {
        return ResponseEntity.ok(agricultureService.updateMember(id, member));
    }

    @Operation(summary = "Stergere membru")
    @DeleteMapping("/members/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable UUID id) {
        agricultureService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }

    // === Animals ===
    @Operation(summary = "Lista animale inregistrate")
    @GetMapping("/animals")
    public ResponseEntity<List<AgricultureAnimal>> getAnimals(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(agricultureService.getAnimals(householdId));
    }

    @Operation(summary = "Detalii animal")
    @GetMapping("/animals/{id}")
    public ResponseEntity<AgricultureAnimal> getAnimal(@PathVariable UUID id) {
        return ResponseEntity.ok(agricultureService.getAnimalById(id));
    }

    @Operation(summary = "Inregistrare animal nou")
    @PostMapping("/animals")
    public ResponseEntity<AgricultureAnimal> createAnimal(@RequestBody AgricultureAnimal animal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agricultureService.createAnimal(animal));
    }

    @Operation(summary = "Actualizare animal")
    @PutMapping("/animals/{id}")
    public ResponseEntity<AgricultureAnimal> updateAnimal(@PathVariable UUID id, @RequestBody AgricultureAnimal animal) {
        return ResponseEntity.ok(agricultureService.updateAnimal(id, animal));
    }

    @Operation(summary = "Stergere animal")
    @DeleteMapping("/animals/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable UUID id) {
        agricultureService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }

    // === Machines ===
    @Operation(summary = "Lista utilaje agricole")
    @GetMapping("/machines")
    public ResponseEntity<List<AgricultureMachine>> getMachines(
            @RequestParam(required = false) UUID householdId) {
        return ResponseEntity.ok(agricultureService.getMachines(householdId));
    }

    @Operation(summary = "Detalii utilaj")
    @GetMapping("/machines/{id}")
    public ResponseEntity<AgricultureMachine> getMachine(@PathVariable UUID id) {
        return ResponseEntity.ok(agricultureService.getMachineById(id));
    }

    @Operation(summary = "Inregistrare utilaj nou")
    @PostMapping("/machines")
    public ResponseEntity<AgricultureMachine> createMachine(@RequestBody AgricultureMachine machine) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agricultureService.createMachine(machine));
    }

    @Operation(summary = "Actualizare utilaj")
    @PutMapping("/machines/{id}")
    public ResponseEntity<AgricultureMachine> updateMachine(@PathVariable UUID id, @RequestBody AgricultureMachine machine) {
        return ResponseEntity.ok(agricultureService.updateMachine(id, machine));
    }

    @Operation(summary = "Stergere utilaj")
    @DeleteMapping("/machines/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable UUID id) {
        agricultureService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }

    // === Stats ===
    @Operation(summary = "Statistici agricultura")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(agricultureService.getStats());
    }
}
