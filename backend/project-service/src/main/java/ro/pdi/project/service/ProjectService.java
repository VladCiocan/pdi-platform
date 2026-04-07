package ro.pdi.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.project.model.*;
import ro.pdi.project.repository.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;
    private final TimeEntryRepository timeEntryRepository;
    private final ProjectDocumentRepository documentRepository;

    // === Projects ===
    public List<Project> getProjects(String status, UUID managerId) {
        if (status != null && !status.isEmpty()) {
            return projectRepository.findByStatusAndIsActiveTrue(status);
        }
        if (managerId != null) {
            return projectRepository.findByManagerIdAndIsActiveTrue(managerId);
        }
        return projectRepository.findByIsActiveTrue();
    }

    public Project getProjectById(UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
    }

    @Transactional
    public Project createProject(Project project) {
        log.info("Creating project: {}", project.getName());
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(UUID id, Project updated) {
        log.info("Updating project: {}", id);
        Project existing = getProjectById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setProgress(updated.getProgress());
        existing.setManagerId(updated.getManagerId());
        existing.setManagerName(updated.getManagerName());
        existing.setBudget(updated.getBudget());
        return projectRepository.save(existing);
    }

    @Transactional
    public void deleteProject(UUID id) {
        log.info("Soft-deleting project: {}", id);
        Project project = getProjectById(id);
        project.setIsActive(false);
        projectRepository.save(project);
    }

    // === Tasks ===
    public List<ProjectTask> getTasks(UUID projectId) {
        return taskRepository.findByProjectIdAndIsActiveTrue(projectId);
    }

    public ProjectTask getTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found: " + id));
    }

    @Transactional
    public ProjectTask createTask(ProjectTask task) {
        log.info("Creating task: {}", task.getTitle());
        return taskRepository.save(task);
    }

    @Transactional
    public ProjectTask updateTask(UUID id, ProjectTask updated) {
        log.info("Updating task: {}", id);
        ProjectTask existing = getTaskById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setAssigneeId(updated.getAssigneeId());
        existing.setAssigneeName(updated.getAssigneeName());
        existing.setStartDate(updated.getStartDate());
        existing.setDueDate(updated.getDueDate());
        existing.setEstimatedHours(updated.getEstimatedHours());
        existing.setActualHours(updated.getActualHours());
        existing.setProgress(updated.getProgress());
        return taskRepository.save(existing);
    }

    @Transactional
    public void deleteTask(UUID id) {
        log.info("Soft-deleting task: {}", id);
        ProjectTask task = getTaskById(id);
        task.setIsActive(false);
        taskRepository.save(task);
    }

    // === Milestones ===
    public List<Milestone> getMilestones(UUID projectId) {
        return milestoneRepository.findByProjectIdAndIsActiveTrue(projectId);
    }

    public Milestone getMilestoneById(UUID id) {
        return milestoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Milestone not found: " + id));
    }

    @Transactional
    public Milestone createMilestone(Milestone milestone) {
        log.info("Creating milestone: {}", milestone.getName());
        return milestoneRepository.save(milestone);
    }

    @Transactional
    public Milestone updateMilestone(UUID id, Milestone updated) {
        log.info("Updating milestone: {}", id);
        Milestone existing = getMilestoneById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setDueDate(updated.getDueDate());
        existing.setStatus(updated.getStatus());
        return milestoneRepository.save(existing);
    }

    @Transactional
    public void deleteMilestone(UUID id) {
        log.info("Soft-deleting milestone: {}", id);
        Milestone milestone = getMilestoneById(id);
        milestone.setIsActive(false);
        milestoneRepository.save(milestone);
    }

    // === Time Entries ===
    public List<TimeEntry> getTimeEntries(UUID projectId) {
        return timeEntryRepository.findByProjectIdAndIsActiveTrue(projectId);
    }

    public List<TimeEntry> getTimeEntriesByTask(UUID taskId) {
        return timeEntryRepository.findByTaskIdAndIsActiveTrue(taskId);
    }

    public TimeEntry getTimeEntryById(UUID id) {
        return timeEntryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Time entry not found: " + id));
    }

    @Transactional
    public TimeEntry createTimeEntry(TimeEntry timeEntry) {
        log.info("Creating time entry for project: {}", timeEntry.getProjectId());
        return timeEntryRepository.save(timeEntry);
    }

    @Transactional
    public void deleteTimeEntry(UUID id) {
        log.info("Soft-deleting time entry: {}", id);
        TimeEntry timeEntry = getTimeEntryById(id);
        timeEntry.setIsActive(false);
        timeEntryRepository.save(timeEntry);
    }

    // === Documents ===
    public List<ProjectDocument> getDocuments(UUID projectId) {
        return documentRepository.findByProjectIdAndIsActiveTrue(projectId);
    }

    public ProjectDocument getDocumentById(UUID id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found: " + id));
    }

    @Transactional
    public ProjectDocument createDocument(ProjectDocument document) {
        log.info("Creating document: {}", document.getTitle());
        return documentRepository.save(document);
    }

    @Transactional
    public ProjectDocument updateDocument(UUID id, ProjectDocument updated) {
        log.info("Updating document: {}", id);
        ProjectDocument existing = getDocumentById(id);
        existing.setTitle(updated.getTitle());
        existing.setFileName(updated.getFileName());
        existing.setFileSize(updated.getFileSize());
        existing.setStatus(updated.getStatus());
        existing.setUploadedAt(updated.getUploadedAt());
        return documentRepository.save(existing);
    }

    @Transactional
    public void deleteDocument(UUID id) {
        log.info("Soft-deleting document: {}", id);
        ProjectDocument document = getDocumentById(id);
        document.setIsActive(false);
        documentRepository.save(document);
    }

    // === Stats ===
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", projectRepository.countByIsActiveTrue());
        stats.put("totalTasks", taskRepository.count());
        stats.put("totalMilestones", milestoneRepository.count());
        stats.put("totalTimeEntries", timeEntryRepository.count());
        stats.put("totalDocuments", documentRepository.count());
        return stats;
    }
}
