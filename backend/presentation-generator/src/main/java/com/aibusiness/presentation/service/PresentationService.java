package com.aibusiness.presentation.service;

import com.aibusiness.presentation.dto.PresentationGenerationRequest;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.VerticalAlignment;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PresentationService {

    private static final Logger log = LoggerFactory.getLogger(PresentationService.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String generatePresentation(PresentationGenerationRequest request) throws IOException {
        String presId = UUID.randomUUID().toString() + ".pdf";
        Path presPath = Paths.get(uploadDir, presId);
        Files.createDirectories(presPath.getParent());

        PdfWriter writer = new PdfWriter(presPath.toString());
        PdfDocument pdf = new PdfDocument(writer);
        // Use a landscape page size for a presentation feel
        Document document = new Document(pdf, PageSize.A4.rotate());
        document.setMargins(20, 20, 20, 20);

        // --- Slide 1: Title Slide ---
        addTitleSlide(document, request.getTitle(), request.getAuthor());

        // --- AI Integration Point ---
        // For each content slide, you would call a generative AI model.
        // The prompt would be something like: "Generate a slide content about [topic derived from title] for a presentation. This is slide X of Y."
        // You would then get back a title and a few bullet points for each slide.
        // For example:
        // for (int i = 1; i <= request.getNumberOfSlides(); i++) {
        //   SlideContent content = aiClient.generateSlide(request.getTitle(), i, request.getNumberOfSlides());
        //   addContentSlide(document, content.getTitle(), content.getPoints());
        // }
        // -----------------------------

        // --- Mock Content Slides ---
        for (int i = 1; i <= request.getNumberOfSlides(); i++) {
            document.add(new AreaBreak()); // Create a new page
            String slideTitle = "Topic " + i;
            String slideContent = "This is the main content for topic " + i + ". It discusses key points and provides valuable insights.";
            addContentSlide(document, slideTitle, slideContent);
        }

        // --- Final Slide: Conclusion ---
        document.add(new AreaBreak());
        addConclusionSlide(document);

        document.close();
        log.info("Successfully created presentation: {}", presId);
        return presId;
    }

    private void addTitleSlide(Document document, String title, String author) {
        document.add(
                new Paragraph(title)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setBold()
                        .setFontSize(40)
                        .setMarginTop(document.getPdfDocument().getDefaultPageSize().getHeight() / 2 - 80)
        );
        document.add(
                new Paragraph("By " + author)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setFontSize(20)
        );
    }

    private void addContentSlide(Document document, String title, String content) {
        document.add(
                new Paragraph(title)
                        .setTextAlignment(TextAlignment.LEFT)
                        .setBold()
                        .setFontSize(28)
                        .setMarginBottom(20)
        );
        document.add(
                new Paragraph(content)
                        .setTextAlignment(TextAlignment.LEFT)
                        .setFontSize(16)
                        .setMultipliedLeading(1.5f)
        );
    }

    private void addConclusionSlide(Document document) {
        document.add(
                new Paragraph("Thank You")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setBold()
                        .setFontSize(40)
                        .setMarginTop(document.getPdfDocument().getDefaultPageSize().getHeight() / 2 - 80)
        );
        document.add(
                new Paragraph("Q&A Session")
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE)
                        .setFontSize(20)
        );
    }
}
