package ro.pdi.dms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pdi.dms.dto.FolderRequest;
import ro.pdi.dms.model.DmsFolder;
import ro.pdi.dms.repository.DmsFolderRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final DmsFolderRepository folderRepository;

    public List<DmsFolder> getRootFolders() {
        return folderRepository.findByIsActiveTrue().stream()
                .filter(f -> f.getParentId() == null)
                .toList();
    }

    public List<DmsFolder> getChildFolders(UUID parentId) {
        return folderRepository.findByParentIdAndIsActiveTrue(parentId);
    }

    @Transactional
    public DmsFolder createFolder(FolderRequest request, UUID ownerId) {
        String path = "/";
        if (request.getParentId() != null) {
            DmsFolder parent = folderRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            path = parent.getPath() + parent.getId() + "/";
        }

        DmsFolder folder = DmsFolder.builder()
                .parentId(request.getParentId())
                .name(request.getName())
                .path(path)
                .ownerId(ownerId)
                .metadata(request.getMetadata())
                .build();

        return folderRepository.save(folder);
    }

    @Transactional
    public DmsFolder updateFolder(UUID folderId, FolderRequest request) {
        DmsFolder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (request.getName() != null) {
            folder.setName(request.getName());
        }
        if (request.getMetadata() != null) {
            folder.setMetadata(request.getMetadata());
        }

        return folderRepository.save(folder);
    }

    @Transactional
    public void deleteFolder(UUID folderId) {
        DmsFolder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.setIsActive(false);
        folderRepository.save(folder);
    }

    public DmsFolder getFolderById(UUID folderId) {
        return folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
    }
}