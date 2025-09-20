package com.aibusiness.docs.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class DocumentAiService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public DocumentAiService(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String generateDocumentContent(String promptTemplateString, Object requestDto) {
        try {
            Map<String, Object> variables = objectMapper.convertValue(requestDto, Map.class);
            PromptTemplate promptTemplate = new PromptTemplate(promptTemplateString, variables);
            return chatClient.prompt(promptTemplate.create()).call().content();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate content from AI model", e);
        }
    }

    public static String getBusinessProposalPrompt() {
        return """
                You are a professional business consultant. Generate a comprehensive business proposal in Markdown format based on the following details.
                Structure the document with clear headings, bullet points, and professional language.

                - **Company Name:** {company_name}
                - **Client Name:** {client_name}
                - **Project Title:** {project_title}
                - **Project Description:** {project_description}
                - **Services Offered:** {services_offered}
                - **Timeline:** {timeline}
                - **Budget:** {budget_range}
                - **Contact Person:** {contact_person}
                - **Contact Email:** {contact_email}

                The proposal should include sections for: Executive Summary, Project Understanding, Scope of Work, Deliverables, Timeline, Budget, and Next Steps.
                """;
    }
    
    public static String getPartnershipAgreementPrompt() {
        return """
            You are a legal document assistant. Generate a formal partnership agreement in Markdown format.
            This is a template and not legal advice. Ensure you include standard clauses for a partnership agreement.

            - **Party 1 Name:** {party1_name}
            - **Party 1 Address:** {party1_address}
            - **Party 2 Name:** {party2_name}
            - **Party 2 Address:** {party2_address}
            - **Purpose:** {partnership_purpose}
            - **Duration:** {partnership_duration}
            - **Profit Sharing:** {profit_sharing_ratio}
            - **Party 1 Responsibilities:** {responsibilities_party1}
            - **Party 2 Responsibilities:** {responsibilities_party2}
            - **Effective Date:** {effective_date}

            The agreement should include sections for: Parties, Purpose, Term, Capital Contributions, Profit and Loss Distribution, Management and Responsibilities, Dispute Resolution, and Signatures.
            """;
    }

    // ... Prompts for NDA, Contract, etc., would be defined here in a similar fashion ...
}
