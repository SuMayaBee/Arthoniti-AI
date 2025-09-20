package com.aibusiness.logo.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Base64;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${gcs.bucket-name}")
    private String bucketName;
    private final Storage storage;

    public StorageService(@Value("${gcs.credentials-path}") Resource gcsCredentials) throws IOException {
        try (InputStream credentialsStream = gcsCredentials.getInputStream()) {
            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
            this.storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        }
    }

    public String uploadFromBase64(String base64Data, String originalFileName) throws IOException {
        byte[] fileData = Base64.getDecoder().decode(base64Data);
        return upload(fileData, originalFileName, "image/png");
    }
    
    public String uploadFromUrl(URL url, String originalFileName) throws IOException {
         try (InputStream in = url.openStream()) {
            byte[] fileData = in.readAllBytes();
            return upload(fileData, originalFileName, "image/png");
        }
    }
    
    private String upload(byte[] fileData, String originalFileName, String contentType) throws IOException {
        String fileName = "logos/" + originalFileName + "_" + UUID.randomUUID().toString().substring(0, 8) + ".png";
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();

        storage.create(blobInfo, fileData);
        
        // Return public URL
        return "https://storage.googleapis.com/" + bucketName + "/" + fileName;
    }
}
