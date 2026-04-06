package ro.pdi.project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID managerId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

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

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProject(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProject(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Map<String, Object>>> getProjectTasks(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Map<String, Object>> createTask(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        response.put("projectId", projectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}/milestones")
    public ResponseEntity<List<Map<String, Object>>> getMilestones(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

    @PostMapping("/{projectId}/milestones")
    public ResponseEntity<Map<String, Object>> createMilestone(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}/gantt")
    public ResponseEntity<Map<String, Object>> getGanttData(@PathVariable UUID projectId) {
        Map<String, Object> response = new HashMap<>();
        response.put("projectId", projectId);
        response.put("tasks", new ArrayList<>());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}/burndown")
    public ResponseEntity<Map<String, Object>> getBurndownChart(@PathVariable UUID projectId) {
        Map<String, Object> response = new HashMap<>();
        response.put("projectId", projectId);
        response.put("ideal", new ArrayList<>());
        response.put("actual", new ArrayList<>());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{projectId}/time-entries")
    public ResponseEntity<Map<String, Object>> logTime(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>(request);
        response.put("id", UUID.randomUUID());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}/time-report")
    public ResponseEntity<Map<String, Object>> getTimeReport(@PathVariable UUID projectId) {
        Map<String, Object> response = new HashMap<>();
        response.put("projectId", projectId);
        response.put("totalHours", 0);
        response.put("byUser", new HashMap<>());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}/documents")
    public ResponseEntity<List<Map<String, Object>>> getProjectDocuments(@PathVariable UUID projectId) {
        return ResponseEntity.ok(new ArrayList<>());
    }

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