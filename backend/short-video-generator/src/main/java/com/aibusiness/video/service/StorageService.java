package com.aibusiness.video.service;

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

    public String uploadVideoFromBase64(String base64Data, String baseFileName) {
        byte[] videoData = Base64.getDecoder().decode(base64Data);
        String fileName = "short-videos/" + baseFileName + "_" + UUID.randomUUID().toString().substring(0, 8) + ".mp4";

        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("video/mp4").build();

        storage.create(blobInfo, videoData);

        return "https://storage.googleapis.com/" + bucketName + "/" + fileName;
    }
}
