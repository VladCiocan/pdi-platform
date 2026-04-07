package ro.pdi.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Proiecte", description = "Management proiecte - taskuri, milestones, rapoarte")
public class ProjectController {

    @Operation(summary = "Lista proiecte")
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID managerId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @Operation(summary = "Detalii proiect")
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProject(@PathVariable UUID id) {
        Map<String, Object> project = new HashMap<>();
        project.put("id", id);
        project.put("name", "Proiect Exemplu");
        project.put("description", "Descriere proiect");
        project.put("status", "IN_PROGRESS");
        project.put("startDate", LocalDate.now());
        project.put("endDate", LocalDate.now().plusMonths(6));
        return ResponseEntity.ok(project);
    }

    @Operation(summary = "Creare proiect")
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProject(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Actualizare proiect")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProject(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Stergere proiect")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Lista taskuri proiect")
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Map<String, Object>>> getProjectTasks(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @Operation(summary = "Creare task")
    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Map<String, Object>> createTask(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        response.put("projectId", projectId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Lista milestones")
    @GetMapping("/{projectId}/milestones")
    public ResponseEntity<List<Map<String, Object>>> getMilestones(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @Operation(summary = "Creare milestone")
    @PostMapping("/{projectId}/milestones")
    public ResponseEntity<Map<String, Object>> createMilestone(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Date diagrama Gantt")
    @GetMapping("/{projectId}/gantt")
    public ResponseEntity<Map<String, Object>> getGanttData(@PathVariable UUID projectId) {
        Map<String, Object> response = new HashMap<>();
        response.put("projectId", projectId);
        response.put("tasks", new ArrayList<>());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Date grafic burndown")
    @GetMapping("/{projectId}/burndown")
    public ResponseEntity<Map<String, Object>> getBurndownChart(@PathVariable UUID projectId) {
        Map<String, Object> response = new HashMap<>();
        response.put("projectId", projectId);
        response.put("ideal", new ArrayList<>());
        response.put("actual", new ArrayList<>());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Inregistrare timp lucrat")
    @PostMapping("/{projectId}/time-entries")
    public ResponseEntity<Map<String, Object>> logTime(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Raport timp")
    @GetMapping("/{projectId}/time-report")
    public ResponseEntity<Map<String, Object>> getTimeReport(@PathVariable UUID projectId) {
        Map<String, Object> response = new HashMap<>();
        response.put("projectId", projectId);
        response.put("totalHours", 0);
        response.put("byUser", new HashMap<>());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Documente proiect")
    @GetMapping("/{projectId}/documents")
    public ResponseEntity<List<Map<String, Object>>> getProjectDocuments(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @Operation(summary = "Buget proiect")
    @GetMapping("/{projectId}/budget")
    public ResponseEntity<Map<String, Object>> getProjectBudget(@PathVariable UUID projectId) {
        Map<String, Object> budget = new HashMap<>();
        budget.put("projectId", projectId);
        budget.put("allocated", 0.0);
        budget.put("spent", 0.0);
        budget.put("remaining", 0.0);
        return ResponseEntity.ok(budget);
    }
}