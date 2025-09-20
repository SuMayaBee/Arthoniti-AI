package com.aibusiness.marketanalysis.service;

import com.aibusiness.marketanalysis.dto.MarketAnalysisDtos.*;
import com.aibusiness.marketanalysis.service.tools.WebSearchTool;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketAiAgentService {

    private final ChatClient.Builder chatClientBuilder;
    private final WebSearchTool webSearchTool;

    public AnalysisReport generateFullAnalysis(String sector, String idea, String location) {
        // Create an in-memory vector store for this session's context
        SimpleVectorStore vectorStore = new SimpleVectorStore(null);

        ChatClient chatClient = chatClientBuilder.build();

        // --- Data Gathering Phase ---
        String marketQuery = String.format("General market overview for %s in %s.", sector, location);
        String competitorQuery = String.format("Key competitors for '%s' in the %s sector.", idea, sector);

        String marketData = webSearchTool.apply(new WebSearchTool.Request(marketQuery)).result();
        String competitorData = webSearchTool.apply(new WebSearchTool.Request(competitorQuery)).result();
        
        vectorStore.add(List.of(new Document(marketData), new Document(competitorData)));
        
        QuestionAnswerAdvisor advisor = new QuestionAnswerAdvisor(vectorStore);

        // --- Analysis Phase ---
        // Each of these calls is like asking the AI to use a specific "tool" or "skill",
        // grounded by the data we just gathered.
        MarketSummary summary = generateComponent("Generate a brief market summary and key findings.", advisor, MarketSummary.class);
        MarketSize size = generateComponent("Estimate the TAM, SAM, and SOM.", advisor, MarketSize.class);
        List<CompetitorProfile> competitors = List.of(generateComponent("Profile the top 3 competitors.", advisor, CompetitorProfile[].class));
        SwotAnalysis swot = generateComponent("Perform a SWOT analysis.", advisor, SwotAnalysis.class);
        PestleAnalysis pestle = generateComponent("Perform a PESTLE analysis.", advisor, PestleAnalysis.class);
        PortersFiveForces porters = generateComponent("Analyze using Porter's Five Forces.", advisor, PortersFiveForces.class);

        // --- Synthesis Phase ---
        return AnalysisReport.builder()
                .marketSummary(summary)
                .marketSize(size)
                .competitors(competitors)
                .swot(swot)
                .pestle(pestle)
                .porters(porters)
                .marketTrends(List.of("Trend 1: AI Integration", "Trend 2: Sustainability Focus")) // These could also be AI-generated
                .marketGaps(List.of("Gap 1: Underserved SMB market", "Gap 2: Lack of mobile-first solutions"))
                .strategicRecommendations(List.of("Recommendation 1: Focus on a niche SMB vertical", "Recommendation 2: Develop a strong content marketing strategy"))
                .build();
    }

    private <T> T generateComponent(String goal, QuestionAnswerAdvisor advisor, Class<T> type) {
        System.out.println("--- Generating component: " + goal + " ---");
        return chatClientBuilder.defaultAdvisors(advisor).build()
                .prompt()
                .user(goal)
                .call()
                .entity(type);
    }
}
