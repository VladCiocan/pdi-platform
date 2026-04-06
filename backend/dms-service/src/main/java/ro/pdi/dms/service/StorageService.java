package ro.pdi.dms.service;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.GetObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket:dms-files}")
    private String bucket;

    @Value("${minio.endpoint:http://localhost:9000}")
    private String endpoint;

    public void ensureBucketExists() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucket).build());
                log.info("Created bucket: {}", bucket);
            }
        } catch (Exception e) {
            log.error("Error ensuring bucket exists", e);
        }
    }

    public String uploadFile(MultipartFile file, UUID ownerId) {
        try {
            ensureBucketExists();
            
            String objectName = String.format("%s/%s/%s", 
                    ownerId.toString(),
                    System.currentTimeMillis(),
                    file.getOriginalFilename());
            
            String checksum = calculateChecksum(file.getBytes());
            
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());
            
            log.info("Uploaded file: {} to bucket: {}", objectName, bucket);
            return objectName;
        } catch (Exception e) {
            log.error("Error uploading file", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public InputStream downloadFile(String objectName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build());
        } catch (Exception e) {
            log.error("Error downloading file: {}", objectName, e);
            throw new RuntimeException("Failed to download file", e);
        }
    }

    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build());
            log.info("Deleted file: {}", objectName);
        } catch (Exception e) {
            log.error("Error deleting file: {}", objectName, e);
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    public String getFileUrl(String objectName) {
        return String.format("%s/%s/%s", endpoint, bucket, objectName);
    }

    private String calculateChecksum(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            log.error("Error calculating checksum", e);
            return "";
        }
    }

    public String calculateMultipartChecksum(MultipartFile file) {
        try {
            return calculateChecksum(file.getBytes());
        } catch (Exception e) {
            log.error("Error calculating checksum", e);
            return "";
        }
    }
}