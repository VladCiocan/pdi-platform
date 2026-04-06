package ro.pdi.dms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.dms.dto.DocumentRequest;
import ro.pdi.dms.model.DmsDocument;
import ro.pdi.dms.model.DmsDocumentMetadata;
import ro.pdi.dms.model.DmsDocumentVersion;
import ro.pdi.dms.repository.DmsDocumentMetadataRepository;
import ro.pdi.dms.repository.DmsDocumentRepository;
import ro.pdi.dms.repository.DmsDocumentVersionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DmsDocumentRepository documentRepository;
    private final DmsDocumentVersionRepository versionRepository;
    private final DmsDocumentMetadataRepository metadataRepository;
    private final FolderService folderService;

    public List<DmsDocument> getDocumentsByFolder(UUID folderId) {
        return documentRepository.findByFolderIdAndIsActiveTrue(folderId);
    }

    public List<DmsDocument> getAllActiveDocuments() {
        return documentRepository.findByIsActiveTrue();
    }

    public List<DmsDocument> getDocumentsByStatus(DmsDocument.DocumentStatus status) {
        return documentRepository.findByStatusAndIsActiveTrue(status);
    }

    public List<DmsDocument> searchDocuments(String query) {
        return documentRepository.searchDocuments(query);
    }

    public List<DmsDocument> getDocumentsByType(String documentType) {
        return documentRepository.findByDocumentTypeAndIsActiveTrue(documentType);
    }

    @Transactional
    public DmsDocument createDocument(DocumentRequest request, UUID ownerId) {
        if (request.getFolderId() != null) {
            folderService.getFolderById(request.getFolderId());
        }

        DmsDocument document = DmsDocument.builder()
                .folderId(request.getFolderId())
                .title(request.getTitle())
                .documentType(request.getDocumentType())
                .description(request.getDescription())
                .tags(request.getTags())
                .status(request.getStatus() != null ? request.getStatus() : DmsDocument.DocumentStatus.DRAFT)
                .retentionPolicy(request.getRetentionPolicy())
                .ownerId(ownerId)
                .version(1)
                .fileSize(0L)
                .build();

        if (request.getRetentionYears() != null && request.getRetentionYears() > 0) {
            document.setRetentionDate(LocalDateTime.now().plusYears(request.getRetentionYears()));
        }

        return documentRepository.save(document);
    }

    @Transactional
    public DmsDocument updateDocument(UUID documentId, DocumentRequest request) {
        DmsDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (request.getTitle() != null) {
            document.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            document.setDescription(request.getDescription());
        }
        if (request.getTags() != null) {
            document.setTags(request.getTags());
        }
        if (request.getStatus() != null) {
            document.setStatus(request.getStatus());
        }
        if (request.getRetentionPolicy() != null) {
            document.setRetentionPolicy(request.getRetentionPolicy());
        }

        return documentRepository.save(document);
    }

    @Transactional
    public DmsDocument uploadFileVersion(UUID documentId, String filePath, Long fileSize, 
            String contentType, String checksum, UUID userId, String changeDescription) {
        DmsDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Integer currentMaxVersion = versionRepository.findMaxVersionByDocumentId(documentId)
                .orElse(0);
        int newVersion = currentMaxVersion + 1;

        DmsDocumentVersion version = DmsDocumentVersion.builder()
                .documentId(documentId)
                .version(newVersion)
                .filePath(filePath)
                .fileSize(fileSize)
                .createdBy(userId)
                .changeDescription(changeDescription)
                .checksum(checksum)
                .build();
        versionRepository.save(version);

        document.setFilePath(filePath);
        document.setFileSize(fileSize);
        document.setContentType(contentType);
        document.setChecksum(checksum);
        document.setVersion(newVersion);

        return documentRepository.save(document);
    }

    public List<DmsDocumentVersion> getDocumentVersions(UUID documentId) {
        return versionRepository.findByDocumentIdOrderByVersionDesc(documentId);
    }

    public DmsDocumentVersion getVersion(UUID documentId, Integer version) {
        return versionRepository.findByDocumentIdAndVersion(documentId, version)
                .orElseThrow(() -> new RuntimeException("Version not found"));
    }

    @Transactional
    public void deleteDocument(UUID documentId) {
        DmsDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setIsActive(false);
        document.setStatus(DmsDocument.DocumentStatus.DELETED);
        documentRepository.save(document);
    }

    public DmsDocument getDocumentById(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public List<DmsDocumentMetadata> getDocumentMetadata(UUID documentId) {
        return metadataRepository.findByDocumentId(documentId);
    }

    @Transactional
    public DmsDocument addMetadata(UUID documentId, String key, String value, boolean isIndexable) {
        DmsDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        DmsDocumentMetadata metadata = DmsDocumentMetadata.builder()
                .documentId(documentId)
                .key(key)
                .value(value)
                .isIndexable(isIndexable)
                .build();
        metadataRepository.save(metadata);

        return document;
    }
}