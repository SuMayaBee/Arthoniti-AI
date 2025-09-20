package com.aibusiness.auth.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;

@Service
public class StorageService {

    @Value("${gcs.bucket-name}")
    private String bucketName;

    @Value("${gcs.credentials-path}")
    private Resource gcsCredentials;

    private Storage storage;

    public StorageService(@Value("${gcs.credentials-path}") Resource gcsCredentials) throws IOException {
        try (InputStream credentialsStream = gcsCredentials.getInputStream()) {
            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
            this.storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        }
    }

    public String uploadFile(String fileName, MultipartFile file) throws IOException {
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

        storage.create(blobInfo, file.getBytes());

        // Return the public URL of the uploaded file
        return "https://storage.googleapis.com/" + bucketName + "/" + fileName;
    }
}

