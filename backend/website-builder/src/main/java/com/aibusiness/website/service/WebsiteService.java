package com.aibusiness.website.service;

import com.aibusiness.website.dto.WebsiteGenerationRequest;
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
public class WebsiteService {

    private static final Logger log = LoggerFactory.getLogger(WebsiteService.class);

    @Value("${file.publish-dir}")
    private String publishDir;

    public String generateWebsite(WebsiteGenerationRequest request) throws IOException {
        String siteId = UUID.randomUUID().toString() + ".html";
        Path sitePath = Paths.get(publishDir, siteId);
        Files.createDirectories(sitePath.getParent());

        // --- AI Integration Point (e.g., v0 API) ---
        // This is where you would make the most important API call.
        // You would send the businessName, description, and colorTheme to an AI model
        // and it would return a complete, professional HTML/CSS/JS string.
        // For example:
        // String prompt = "Create a single-page website for a business named '" + request.getBusinessName() + "'. It is a " + request.getBusinessDescription() + ". Use a " + request.getColorTheme() + " color theme.";
        // String generatedHtml = v0ApiClient.generate(prompt);
        // ---------------------------------------------

        // For now, we will generate the HTML using a simple template string.
        String generatedHtml = createHtmlTemplate(request);

        Files.writeString(sitePath, generatedHtml);
        log.info("Successfully generated website and saved to: {}", sitePath);

        return siteId;
    }

    private String createHtmlTemplate(WebsiteGenerationRequest request) {
        String[] colors = getThemeColors(request.getColorTheme());
        String bgColor = colors[0];
        String textColor = colors[1];
        String primaryColor = colors[2];

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>%s</title>
                    <style>
                        :root {
                            --bg-color: %s;
                            --text-color: %s;
                            --primary-color: %s;
                        }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                            background-color: var(--bg-color);
                            color: var(--text-color);
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            text-align: center;
                        }
                        .container {
                            max-width: 800px;
                            padding: 2rem;
                        }
                        h1 {
                            font-size: 3rem;
                            color: var(--primary-color);
                        }
                        p {
                            font-size: 1.2rem;
                            line-height: 1.6;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to %s</h1>
                        <p>%s</p>
                    </div>
                </body>
                </html>
                """.formatted(request.getBusinessName(), bgColor, textColor, primaryColor, request.getBusinessName(), request.getBusinessDescription());
    }

    private String[] getThemeColors(String theme) {
        return switch (theme.toLowerCase()) {
            case "dark" -> new String[]{"#1a1a1a", "#ffffff", "#007bff"};
            case "blue" -> new String[]{"#eef5ff", "#0a2540", "#0052cc"};
            default -> new String[]{"#ffffff", "#333333", "#007bff"}; // Light theme
        };
    }
}
