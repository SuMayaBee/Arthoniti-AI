package com.aibusiness.website.controller;

import com.aibusiness.website.dto.*;
import com.aibusiness.website.service.DeploymentService;
import com.aibusiness.website.service.ProjectService;
import com.aibusiness.website.service.WebsiteAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/website-builder")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final WebsiteAiService aiService;
    private final DeploymentService deploymentService;

    // --- Health & AI Endpoints ---
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "website-builder"));
    }

    @PostMapping("/ai-chat")
    public ResponseEntity<Map<String, String>> aiChat(@Valid @RequestBody AiChatRequest request) {
        String result = aiService.getChatResponse(request.getPrompt());
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/enhance-prompt")
    public ResponseEntity<Map<String, String>> enhancePrompt(@Valid @RequestBody EnhancePromptRequest request) {
        String enhancedPrompt = aiService.enhancePrompt(request.getPrompt());
        return ResponseEntity.ok(Map.of("enhancedPrompt", enhancedPrompt));
    }

    @PostMapping("/generate-code")
    public ResponseEntity<CodeGenerationResponse> generateCode(@Valid @RequestBody CodeGenerationRequest request) {
        return ResponseEntity.ok(aiService.generateCode(request.getPrompt()));
    }

    // --- Project CRUD Endpoints ---
    @PostMapping("/projects")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/projects/user/{userId}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(projectService.getProjectsByUserId(userId));
    }
    
    @GetMapping("/projects/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }
    
    @PutMapping("/projects/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable String projectId, @RequestBody ProjectUpdateRequest request) {
        return ResponseEntity.ok(projectService.updateProject(projectId, request));
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable String projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }

    // --- Deployment Endpoint (Simulated) ---
    @PostMapping("/deploy-sync")
    public ResponseEntity<Map<String, Object>> deploySync(@RequestBody Map<String, String> request) {
        String projectName = request.getOrDefault("project_name", "Untitled Project");
        String deployedUrl = deploymentService.simulateDeployment(projectName);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "deployed_url", deployedUrl,
            "deployment_id", "deploy-" + UUID.randomUUID().toString().substring(0, 8),
            "project_name", projectName,
            "message", "Deployment completed successfully"
        ));
    }
}
