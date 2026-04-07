package ro.pdi.dms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.pdi.dms.dto.DocumentRequest;
import ro.pdi.dms.dto.FolderRequest;
import ro.pdi.dms.model.DmsDocument;
import ro.pdi.dms.model.DmsDocumentMetadata;
import ro.pdi.dms.model.DmsDocumentVersion;
import ro.pdi.dms.model.DmsFolder;
import ro.pdi.dms.service.DocumentService;
import ro.pdi.dms.service.FolderService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dms")
@RequiredArgsConstructor
@Tag(name = "Documente", description = "Management documente - foldere, documente, versiuni")
public class DmsController {

    private final FolderService folderService;
    private final DocumentService documentService;

    @Operation(summary = "Lista foldere root")
    @GetMapping("/folders")
    public ResponseEntity<List<DmsFolder>> getRootFolders() {
        return ResponseEntity.ok(folderService.getRootFolders());
    }

    @Operation(summary = "Lista subfoldere")
    @GetMapping("/folders/{parentId}/children")
    public ResponseEntity<List<DmsFolder>> getChildFolders(@PathVariable UUID parentId) {
        return ResponseEntity.ok(folderService.getChildFolders(parentId));
    }

    @Operation(summary = "Creare folder")
    @PostMapping("/folders")
    public ResponseEntity<DmsFolder> createFolder(
            @Valid @RequestBody FolderRequest request,
            @RequestHeader("X-User-Id") UUID ownerId) {
        return ResponseEntity.ok(folderService.createFolder(request, ownerId));
    }

    @Operation(summary = "Actualizare folder")
    @PutMapping("/folders/{id}")
    public ResponseEntity<DmsFolder> updateFolder(
            @PathVariable UUID id,
            @Valid @RequestBody FolderRequest request) {
        return ResponseEntity.ok(folderService.updateFolder(id, request));
    }

    @Operation(summary = "Stergere folder")
    @DeleteMapping("/folders/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable UUID id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Lista documente")
    @GetMapping("/documents")
    public ResponseEntity<List<DmsDocument>> getDocuments(
            @RequestParam(required = false) UUID folderId,
            @RequestParam(required = false) DmsDocument.DocumentStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String documentType) {
        
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(documentService.searchDocuments(search));
        }
        if (documentType != null && !documentType.isEmpty()) {
            return ResponseEntity.ok(documentService.getDocumentsByType(documentType));
        }
        if (status != null) {
            return ResponseEntity.ok(documentService.getDocumentsByStatus(status));
        }
        if (folderId != null) {
            return ResponseEntity.ok(documentService.getDocumentsByFolder(folderId));
        }
        return ResponseEntity.ok(documentService.getAllActiveDocuments());
    }

    @Operation(summary = "Detalii document")
    @GetMapping("/documents/{id}")
    public ResponseEntity<DmsDocument> getDocument(@PathVariable UUID id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @Operation(summary = "Creare document")
    @PostMapping("/documents")
    public ResponseEntity<DmsDocument> createDocument(
            @Valid @RequestBody DocumentRequest request,
            @RequestHeader("X-User-Id") UUID ownerId) {
        return ResponseEntity.ok(documentService.createDocument(request, ownerId));
    }

    @Operation(summary = "Actualizare document")
    @PutMapping("/documents/{id}")
    public ResponseEntity<DmsDocument> updateDocument(
            @PathVariable UUID id,
            @Valid @RequestBody DocumentRequest request) {
        return ResponseEntity.ok(documentService.updateDocument(id, request));
    }

    @Operation(summary = "Stergere document")
    @DeleteMapping("/documents/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Lista versiuni document")
    @GetMapping("/documents/{id}/versions")
    public ResponseEntity<List<DmsDocumentVersion>> getVersions(@PathVariable UUID id) {
        return ResponseEntity.ok(documentService.getDocumentVersions(id));
    }

    @Operation(summary = "Detalii versiune document")
    @GetMapping("/documents/{id}/versions/{version}")
    public ResponseEntity<DmsDocumentVersion> getVersion(
            @PathVariable UUID id,
            @PathVariable Integer version) {
        return ResponseEntity.ok(documentService.getVersion(id, version));
    }

    @Operation(summary = "Incarcare versiune fisier")
    @PostMapping("/documents/{id}/upload")
    public ResponseEntity<DmsDocument> uploadFileVersion(
            @PathVariable UUID id,
            @RequestParam String filePath,
            @RequestParam Long fileSize,
            @RequestParam String contentType,
            @RequestParam String checksum,
            @RequestParam(required = false) String changeDescription,
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(documentService.uploadFileVersion(
                id, filePath, fileSize, contentType, checksum, userId, changeDescription));
    }

    @Operation(summary = "Metadate document")
    @GetMapping("/documents/{id}/metadata")
    public ResponseEntity<List<DmsDocumentMetadata>> getMetadata(@PathVariable UUID id) {
        return ResponseEntity.ok(documentService.getDocumentMetadata(id));
    }

    @Operation(summary = "Adaugare metadate document")
    @PostMapping("/documents/{id}/metadata")
    public ResponseEntity<DmsDocument> addMetadata(
            @PathVariable UUID id,
            @RequestParam String key,
            @RequestParam String value,
            @RequestParam(defaultValue = "true") Boolean isIndexable) {
        return ResponseEntity.ok(documentService.addMetadata(id, key, value, isIndexable));
    }
}