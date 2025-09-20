package com.aibusiness.docs.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

// Base Request DTO
@Data
public class BaseDocumentRequest {
    @NotNull
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("logo_url")
    private String logoUrl;
}

// Specific Request DTOs
@Data
public class BusinessProposalRequest extends BaseDocumentRequest {
    @NotBlank
    @JsonProperty("company_name")
    private String companyName;
    @NotBlank
    @JsonProperty("client_name")
    private String clientName;
    @NotBlank
    @JsonProperty("project_title")
    private String projectTitle;
    @NotBlank
    @JsonProperty("project_description")
    private String projectDescription;
    @NotEmpty
    @JsonProperty("services_offered")
    private List<String> servicesOffered;
    @NotBlank
    private String timeline;
    @NotBlank
    @JsonProperty("budget_range")
    private String budgetRange;
    @NotBlank
    @JsonProperty("contact_person")
    private String contactPerson;
    @Email
    @JsonProperty("contact_email")
    private String contactEmail;
}

@Data
public class PartnershipAgreementRequest extends BaseDocumentRequest {
    @NotBlank @JsonProperty("party1_name") private String party1Name;
    @NotBlank @JsonProperty("party1_address") private String party1Address;
    @NotBlank @JsonProperty("party2_name") private String party2Name;
    @NotBlank @JsonProperty("party2_address") private String party2Address;
    @NotBlank @JsonProperty("partnership_purpose") private String partnershipPurpose;
    @NotBlank @JsonProperty("partnership_duration") private String partnershipDuration;
    @NotBlank @JsonProperty("profit_sharing_ratio") private String profitSharingRatio;
    @NotEmpty @JsonProperty("responsibilities_party1") private List<String> responsibilitiesParty1;
    @NotEmpty @JsonProperty("responsibilities_party2") private List<String> responsibilitiesParty2;
    @NotBlank @JsonProperty("effective_date") private String effectiveDate;
}

@Data
public class NdaRequest extends BaseDocumentRequest {
    @NotBlank @JsonProperty("disclosing_party") private String disclosingParty;
    @NotBlank @JsonProperty("receiving_party") private String receivingParty;
    @NotBlank private String purpose;
    @NotBlank @JsonProperty("confidential_info_description") private String confidentialInfoDescription;
    @NotBlank private String duration;
    @NotBlank @JsonProperty("governing_law") private String governingLaw;
    @NotBlank @JsonProperty("effective_date") private String effectiveDate;
}

// ... other request DTOs (Contract, ToS, PrivacyPolicy) would follow the same pattern ...

@Data
public class UpdateContentRequest {
    @NotBlank
    @JsonProperty("ai_generated_content")
    private String aiGeneratedContent;
}


// Response DTOs
@Data
public class DocumentResponse {
    private Long id;
    @JsonProperty("user_id")
    private Long userId;
    @JsonProperty("ai_generated_content")
    private String aiGeneratedContent;
    @JsonProperty("input_data")
    @JsonRawValue
    private String inputData; // Return as raw JSON string
    @JsonProperty("docs_url")
    private String docsUrl;
    @JsonProperty("created_at")
    private ZonedDateTime createdAt;
    @JsonProperty("updated_at")
    private ZonedDateTime updatedAt;
}

@Data
public class UploadResponse {
    private boolean success;
    @JsonProperty("document_id")
    private Long documentId;
    @JsonProperty("docs_url")
    private String docsUrl;
    private String error;
}

@Data
public class DeleteResponse {
    private String message;
    @JsonProperty("deleted_id")
    private Long deletedId;
}

@Data
public class BulkDeleteResponse {
    private String message;
    @JsonProperty("user_id")
    private Long userId;
    @JsonProperty("deleted_counts")
    private Map<String, Long> deletedCounts;
    @JsonProperty("total_deleted")
    private long totalDeleted;
}
