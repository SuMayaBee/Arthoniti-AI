package com.aibusiness.docs.service;

import com.aibusiness.docs.client.LogoServiceClient;
import com.aibusiness.docs.dto.DocGenerationRequest;
import com.aibusiness.docs.dto.LogoGenerationRequest;
import com.aibusiness.docs.dto.LogoGenerationResponse;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocService {

    private static final Logger log = LoggerFactory.getLogger(DocService.class);
    private final LogoServiceClient logoServiceClient;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String generateDocument(DocGenerationRequest request) throws IOException {
        // 1. Call Logo Generation Service
        log.info("Requesting logo from logo-generator with prompt: {}", request.getLogoPrompt());
        LogoGenerationResponse logoResponse = logoServiceClient.generateLogo(
                new LogoGenerationRequest(request.getLogoPrompt(), request.getLogoStyle()));
        String logoUrl = logoResponse.getImageUrl();
        log.info("Received logo URL: {}", logoUrl);

        // --- AI Integration Point: Text Generation ---
        // Here you would call a generative AI model to create content for the business plan
        // based on the request.businessName and request.businessType.
        // For example:
        // String prompt = "Create a one-page business plan for a " + request.getBusinessType() + " called '" + request.getBusinessName() + "'.";
        // String documentText = textGenerationClient.generate(prompt);
        // ---------------------------------------------

        // For now, we'll use mock text.
        String documentText = "This is a sample business plan for " + request.getBusinessName() + ". Our mission is to provide the best " + request.getBusinessType() + " services in the region.";

        // 2. Create the PDF
        String docId = UUID.randomUUID().toString() + ".pdf";
        Path docPath = Paths.get(uploadDir, docId);
        Files.createDirectories(docPath.getParent());

        PdfWriter writer = new PdfWriter(docPath.toString());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // 3. Add Logo to PDF
        try (InputStream logoStream = new URL(logoUrl).openStream()) {
            byte[] logoBytes = logoStream.readAllBytes();
            Image logo = new Image(ImageDataFactory.create(logoBytes));
            logo.scaleToFit(100, 100);
            logo.setTextAlignment(TextAlignment.CENTER);
            document.add(logo);
        } catch (IOException e) {
            log.error("Failed to download or embed logo: {}", e.getMessage());
            // Continue without the logo if it fails
        }

        // 4. Add Content to PDF
        document.add(new Paragraph("\n"));
        document.add(new Paragraph(request.getBusinessName()).setBold().setFontSize(20).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("\n\n"));
        document.add(new Paragraph(documentText));

        document.close();
        log.info("Successfully created document: {}", docId);

        return docId;
    }
}
