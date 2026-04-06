package ro.pdi.dms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import ro.pdi.dms.model.DmsDocument;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentRequest {
    private UUID folderId;
    
    @NotBlank(message = "Document title is required")
    private String title;
    
    private String documentType;
    private String description;
    private String tags;
    private DmsDocument.DocumentStatus status;
    private DmsDocument.RetentionPolicy retentionPolicy;
    private Integer retentionYears;
}