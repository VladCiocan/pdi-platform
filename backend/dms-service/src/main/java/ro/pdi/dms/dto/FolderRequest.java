package ro.pdi.dms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolderRequest {
    private UUID parentId;
    
    @NotBlank(message = "Folder name is required")
    private String name;
    
    private String metadata;
}