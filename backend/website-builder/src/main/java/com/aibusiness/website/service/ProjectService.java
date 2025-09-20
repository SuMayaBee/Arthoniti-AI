package com.aibusiness.website.service;

import com.aibusiness.website.dto.ProjectCreateRequest;
import com.aibusiness.website.dto.ProjectResponse;
import com.aibusiness.website.dto.ProjectUpdateRequest;
import com.aibusiness.website.entity.Project;
import com.aibusiness.website.exception.ProjectNotFoundException;
import com.aibusiness.website.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest request) {
        Project project = Project.builder()
                .id("proj-" + UUID.randomUUID().toString().substring(0, 8))
                .userId(request.getUserId())
                .title(request.getTitle())
                .description(request.getDescription())
                .prompt(request.getPrompt())
                .files(request.getFiles())
                .messages(request.getMessages())
                .thumbnail(request.getThumbnail())
                .status(request.getStatus() != null ? request.getStatus() : "active")
                .createdAt(ZonedDateTime.now())
                .updatedAt(ZonedDateTime.now())
                .build();
        return mapToResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByUserId(String userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(String projectId) {
        return projectRepository.findById(projectId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));
    }

    @Transactional
    public ProjectResponse updateProject(String projectId, ProjectUpdateRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getFiles() != null) project.setFiles(request.getFiles());
        if (request.getMessages() != null) project.setMessages(request.getMessages());
        if (request.getDeployedUrl() != null) project.setDeployedUrl(request.getDeployedUrl());
        if (request.getDeployedAt() != null) project.setDeployedAt(request.getDeployedAt());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        project.setUpdatedAt(ZonedDateTime.now());

        return mapToResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(String projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException("Project not found");
        }
        projectRepository.deleteById(projectId);
    }
    
    private ProjectResponse mapToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        //... map all other fields
        response.setDescription(project.getDescription());
        response.setPrompt(project.getPrompt());
        response.setFiles(objectMapper.valueToTree(project.getFiles()));
        response.setMessages(objectMapper.valueToTree(project.getMessages()));
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        response.setThumbnail(project.getThumbnail());
        response.setDeployedUrl(project.getDeployedUrl());
        response.setDeployedAt(project.getDeployedAt());
        response.setUserId(project.getUserId());
        response.setStatus(project.getStatus());
        return response;
    }
}
