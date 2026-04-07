package ro.pdi.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pdi.project.model.*;
import ro.pdi.project.service.ProjectService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Proiecte", description = "Management proiecte - taskuri, milestones, documente, timp")
public class ProjectController {

    private final ProjectService projectService;

    // === Projects ===
    @Operation(summary = "Lista proiecte")
    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID managerId) {
        return ResponseEntity.ok(projectService.getProjects(status, managerId));
    }

    @Operation(summary = "Detalii proiect")
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @Operation(summary = "Creare proiect")
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(project));
    }

    @Operation(summary = "Actualizare proiect")
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable UUID id, @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @Operation(summary = "Stergere proiect")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // === Tasks ===
    @Operation(summary = "Lista taskuri proiect")
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<ProjectTask>> getProjectTasks(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getTasks(projectId));
    }

    @Operation(summary = "Detalii task")
    @GetMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<ProjectTask> getTask(@PathVariable UUID projectId, @PathVariable UUID taskId) {
        return ResponseEntity.ok(projectService.getTaskById(taskId));
    }

    @Operation(summary = "Creare task")
    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<ProjectTask> createTask(@PathVariable UUID projectId, @RequestBody ProjectTask task) {
        task.setProjectId(projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createTask(task));
    }

    @Operation(summary = "Actualizare task")
    @PutMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<ProjectTask> updateTask(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @RequestBody ProjectTask task) {
        return ResponseEntity.ok(projectService.updateTask(taskId, task));
    }

    @Operation(summary = "Stergere task")
    @DeleteMapping("/{projectId}/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID projectId, @PathVariable UUID taskId) {
        projectService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    // === Milestones ===
    @Operation(summary = "Lista milestones")
    @GetMapping("/{projectId}/milestones")
    public ResponseEntity<List<Milestone>> getMilestones(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getMilestones(projectId));
    }

    @Operation(summary = "Detalii milestone")
    @GetMapping("/{projectId}/milestones/{milestoneId}")
    public ResponseEntity<Milestone> getMilestone(@PathVariable UUID projectId, @PathVariable UUID milestoneId) {
        return ResponseEntity.ok(projectService.getMilestoneById(milestoneId));
    }

    @Operation(summary = "Creare milestone")
    @PostMapping("/{projectId}/milestones")
    public ResponseEntity<Milestone> createMilestone(@PathVariable UUID projectId, @RequestBody Milestone milestone) {
        milestone.setProjectId(projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createMilestone(milestone));
    }

    @Operation(summary = "Actualizare milestone")
    @PutMapping("/{projectId}/milestones/{milestoneId}")
    public ResponseEntity<Milestone> updateMilestone(
            @PathVariable UUID projectId,
            @PathVariable UUID milestoneId,
            @RequestBody Milestone milestone) {
        return ResponseEntity.ok(projectService.updateMilestone(milestoneId, milestone));
    }

    @Operation(summary = "Stergere milestone")
    @DeleteMapping("/{projectId}/milestones/{milestoneId}")
    public ResponseEntity<Void> deleteMilestone(@PathVariable UUID projectId, @PathVariable UUID milestoneId) {
        projectService.deleteMilestone(milestoneId);
        return ResponseEntity.noContent().build();
    }

    // === Time Entries ===
    @Operation(summary = "Lista inregistrari timp")
    @GetMapping("/{projectId}/time-entries")
    public ResponseEntity<List<TimeEntry>> getTimeEntries(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getTimeEntries(projectId));
    }

    @Operation(summary = "Inregistrare timp lucrat")
    @PostMapping("/{projectId}/time-entries")
    public ResponseEntity<TimeEntry> createTimeEntry(@PathVariable UUID projectId, @RequestBody TimeEntry timeEntry) {
        timeEntry.setProjectId(projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createTimeEntry(timeEntry));
    }

    @Operation(summary = "Stergere inregistrare timp")
    @DeleteMapping("/{projectId}/time-entries/{timeEntryId}")
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable UUID projectId, @PathVariable UUID timeEntryId) {
        projectService.deleteTimeEntry(timeEntryId);
        return ResponseEntity.noContent().build();
    }

    // === Documents ===
    @Operation(summary = "Documente proiect")
    @GetMapping("/{projectId}/documents")
    public ResponseEntity<List<ProjectDocument>> getDocuments(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getDocuments(projectId));
    }

    @Operation(summary = "Detalii document")
    @GetMapping("/{projectId}/documents/{documentId}")
    public ResponseEntity<ProjectDocument> getDocument(@PathVariable UUID projectId, @PathVariable UUID documentId) {
        return ResponseEntity.ok(projectService.getDocumentById(documentId));
    }

    @Operation(summary = "Adaugare document")
    @PostMapping("/{projectId}/documents")
    public ResponseEntity<ProjectDocument> createDocument(@PathVariable UUID projectId, @RequestBody ProjectDocument document) {
        document.setProjectId(projectId);
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createDocument(document));
    }

    @Operation(summary = "Actualizare document")
    @PutMapping("/{projectId}/documents/{documentId}")
    public ResponseEntity<ProjectDocument> updateDocument(
            @PathVariable UUID projectId,
            @PathVariable UUID documentId,
            @RequestBody ProjectDocument document) {
        return ResponseEntity.ok(projectService.updateDocument(documentId, document));
    }

    @Operation(summary = "Stergere document")
    @DeleteMapping("/{projectId}/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID projectId, @PathVariable UUID documentId) {
        projectService.deleteDocument(documentId);
        return ResponseEntity.noContent().build();
    }

    // === Stats ===
    @Operation(summary = "Statistici proiecte")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(projectService.getStats());
    }
}
