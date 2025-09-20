<h1 align="center">Arthoniti AI 🚀</h2>
<h2 align="center">Empowering young entrepreneurs with AI-driven tools for faster, affordable, and smarter business launches.</h3>


The purpose of **Arthoniti AI** is to **empower young entrepreneurs in Bangladesh** by removing the traditional barriers of **high costs, limited access to expertise, and complicated business setup processes**.  

It provides an **all-in-one AI-powered platform** where anyone can:  
- Conduct market analysis  
- Generate pitch decks  
- Design logos  
- Build websites  
- Create legal documents  
- Launch businesses quickly and affordably  

By democratizing entrepreneurship, Arthoniti AI aims to **create jobs, boost the SME sector, and drive sustainable economic growth** in Bangladesh, while ensuring opportunities are accessible not only to urban elites but also to **rural youth and women entrepreneurs**. 

---


## 📋 Table of Contents
- [✨ Core Features](#-core-features-in-depth)
- [🏛️ System Architecture](#-system-architecture)
	- [Architectural Philosophy](#architectural-philosophy-why-microservices)
	- [Foundational Pillars](#foundational-pillars)
	- [Inter-Service Communication](#inter-service-communication)
	- [Service Directory](#service-directory)
- [🛠️ Technology Stack](#-technology-stack)
- [🏁 Getting Started](#-getting-started)
- [🛣️ Future Roadmap](#-future-roadmap)
- [👥 Our Team](#-our-team)

---

## ✨ Core Features In-Depth

Our platform is composed of ten specialized microservices, each providing a distinct business capability.

### 📈 Market Analysis Service
- **AI-Powered Agents:** Utilizes an advanced AI agent built with Spring AI's function-calling capabilities to perform complex market research.
- **Comprehensive Reporting:** Generates detailed reports including SWOT, PESTLE, Porter's Five Forces, and TAM/SAM/SOM analysis.
- **Real-time Data:** Employs web search tools to ground all analysis in current, relevant data.
- **Streaming Responses:** Delivers analysis in real-time to the user via Server-Sent Events (SSE).

### 🏢 Business Name Generator
- **AI-Powered Ideation:** Generates creative and relevant business names based on industry, tone, and prompts.
- **Persistent History:** Saves all generation sessions to a dedicated PostgreSQL database for user review.

### 🎨 Logo Generation Service
- **Advanced Design Specification:** Creates detailed, professional logo design briefs covering typography, color theory, and visual elements.
- **AI Image Generation:** Utilizes Spring AI with DALL-E 3 to generate high-quality logo images.
- **Cloud Storage:** Automatically uploads and stores all generated assets to Google Cloud Storage.

### 📄 Document Generation Service
- **Versatile Document Creation:** Generates a wide range of legal and business documents, including NDAs, Contracts, Business Proposals, and Privacy Policies.
- **Dynamic Content Population:** AI intelligently populates templates based on structured user input.
- **Cloud Integration:** Manages and stores final documents securely in Google Cloud Storage.

### 🧠 Retrieval-Augmented Generation (RAG) Service
- **The Intelligence Core:** Acts as the central knowledge engine for the entire suite.
- **Multi-Source Ingestion:** Processes and vectorizes data from documents (PDF, DOCX) and live website URLs.
- **Vector Database:** Uses PostgreSQL with the pgvector extension for efficient similarity searches.
- **Contextual Grounding:** Provides accurate, verifiable context to other services, significantly reducing AI hallucinations.

### 💬 Conversational Chat Service
- **Persistent Conversations:** A full-featured chat system with session management and message history stored in PostgreSQL.
- **RAG-Integrated Intelligence:** Seamlessly queries the RAG Service to provide contextually-aware, factual answers.
- **Real-time Streaming:** Delivers AI responses word-by-word using Server-Sent Events (SSE) for a superior user experience.

### 📊 Presentation Generation Service
- **End-to-End Creation:** Generates complete, multi-slide presentations from a simple prompt.
- **RAG-Powered Content:** Leverages the RAG Service to enrich slides with data from user-provided documents and URLs.
- **AI-Generated Imagery:** Creates relevant, high-quality images for slides using DALL-E 3.

### 🎬 Short Video Generation Service
- **Text-to-Video:** Utilizes Spring AI with Google's Gemini/Veo models to generate short, high-quality video clips from text prompts.
- **Automated Asset Management:** Stores generated videos in Google Cloud Storage and persists metadata in a dedicated PostgreSQL database.

### 🌐 Website Builder Service
- **AI-Powered Code Generation:** Creates complete, multi-file React projects from a high-level description using Google Gemini.
- **Full Project Management:** Provides a complete CRUD API for managing website projects, including all source files and chat history.
- **Simulated Deployment Pipeline:** Includes logic for simulating a full build-and-deploy process to AWS S3 and CloudFront.

### 🔐 Authentication Service
- **Secure & Modern:** Provides robust user authentication and authorization using JWTs.
- **Full User Lifecycle Management:** Includes user registration, profile management (with image uploads to GCS), and a secure password reset flow.

---

## 🏛️ System Architecture

### Architectural Philosophy: Why Microservices?

We deliberately chose a microservices architecture to build a system that mirrors the structure of a modern, agile engineering organization. This approach provides immense benefits that are critical for an enterprise-grade platform:

- **Scalability:** Each service can be scaled independently. If video generation becomes popular, we can scale up the short-video-generator service without touching the auth-service.
- **Resilience:** A failure in one service (e.g., the logo-generator is temporarily down) does not bring down the entire application. Other services like Chat and Market Analysis remain fully functional.
- **Technology Autonomy:** Each service uses the best tools for its job. The rag-service uses a specialized vector database, while other services use standard relational models.
- **Maintainability:** Smaller, focused codebases are easier to understand, maintain, and update, enabling rapid iteration and development.

### Foundational Pillars

Two non-negotiable components form the backbone of our distributed system.

- **API Gateway (Spring Cloud Gateway):** The single entry point for all client requests. It acts as a reverse proxy, routing traffic to the appropriate internal service. This provides a crucial security layer (internal services are not publicly exposed) and a central place to manage cross-cutting concerns like authentication, rate limiting, and logging.
- **Service Registry (Netflix Eureka):** The "phonebook" of our system. Every microservice registers itself with Eureka upon startup. When one service needs to communicate with another, it asks Eureka for the target service's current network location. This enables dynamic scaling and resilience, as service instances can be added or removed without any manual reconfiguration.

### Inter-Service Communication

Our architecture employs two distinct patterns for communication, chosen based on the specific needs of the interaction.

- **Synchronous Communication (REST via OpenFeign):** Used when a service requires an immediate, blocking response from another to complete its task.
	- *Prime Example:* The chat-service must get context from the rag-service before generating a final answer. It uses a declarative Spring Cloud OpenFeign client to make a simple, type-safe REST call. OpenFeign automatically integrates with Eureka for service discovery.
- **Asynchronous Communication (Server-Sent Events):** Used for pushing real-time updates from the server to the client.
	- *Prime Example:* The market-analysis-service performs a long-running, multi-step analysis. Instead of making the user wait, it streams status updates and results via SSE, providing a live, transparent view of the AI's progress.

### 🗺️ Service Directory

| Service            | Purpose                        | Key Technologies                | Database                | AI Model           |
|--------------------|--------------------------------|----------------------------------|-------------------------|--------------------|
| Service Registry   | Service discovery              | Netflix Eureka                  | N/A                     | N/A                |
| API Gateway        | Request routing & security     | Spring Cloud Gateway             | N/A                     | N/A                |
| Auth Service       | User identity & security       | Spring Security, JWT            | PostgreSQL, GCS         | N/A                |
| Market Analysis    | AI agent for market research   | Spring AI (Functions)            | PostgreSQL (JSONB)      | OpenAI GPT-4o      |
| Business Name Gen  | AI-powered name ideation       | Spring AI                        | PostgreSQL              | OpenAI GPT-4o      |
| Logo Generator     | Logo design & image creation   | Spring AI                        | PostgreSQL (JSONB), GCS | OpenAI DALL-E 3    |
| Docs Generator     | Legal & business documents     | Spring AI                        | PostgreSQL (JSONB), GCS | OpenAI GPT-4o      |
| RAG Service        | Central knowledge engine       | Spring AI, pgvector, Tika        | PostgreSQL (pgvector)   | Google Gemini      |
| Chat Service       | Conversational interface       | Spring AI, OpenFeign, SSE        | PostgreSQL              | OpenAI GPT-4o      |
| Presentation Gen   | AI slide deck creation         | Spring AI, RAG                   | PostgreSQL (JSONB), GCS | OpenAI DALL-E 3    |
| Short Video Gen    | Text-to-video creation         | Spring AI                        | PostgreSQL, GCS         | Google Gemini (Veo)|
| Website Builder    | AI React code generation       | Spring AI                        | PostgreSQL (JSONB)      | Google Gemini      |

---

## 🛠️ Technology Stack

| Category             | Technologies                                                      |
|----------------------|-------------------------------------------------------------------|
| Backend Framework    | Spring Boot 3, Spring Cloud, Spring Web                           |
| AI/ML Orchestration  | Spring AI                                                         |
| AI Models            | OpenAI (GPT-4o, DALL-E 3), Google Gemini (Pro, Veo)              |
| Database             | PostgreSQL, pgvector extension                                   |
| Infrastructure       | Service Registry (Eureka), API Gateway                           |
| Security             | Spring Security, JSON Web Tokens (JWT)                           |
| Data Handling        | Spring Data JPA, Hibernate, Jackson                              |
| Cloud Storage        | Google Cloud Storage (GCS)                                       |
| Build & Dependencies | Apache Maven                                                      |

---

## 🏁 Getting Started

### Prerequisites
- Java 17+
- Apache Maven 3.8+
- Docker & Docker Compose
- PostgreSQL Server
- Access to OpenAI and Google AI Platform APIs

### How to Run

1. **Clone the repository:**
	 ```bash
	 git clone https://github.com/SuMayaBee/Therap-JavaFest-2025.git
	 cd arthoniti-ai
	 ```
2. **Configure Environment Variables:**
	 - Each service contains an `application.yml` file. Update the database credentials and API keys (OpenAI, Google) as marked (`# CHANGE ME`).
3. **Set up Databases:**
	 - For each service, create its corresponding PostgreSQL database (e.g., `auth_db`, `chat_db`, `rag_db`, etc.).
	 - For `rag_db` and `presentation_db`, ensure you enable the vector extension:
		 ```sql
		 CREATE EXTENSION IF NOT EXISTS vector;
		 ```
4. **Build All Modules:**
	 ```bash
	 mvn clean install
	 ```
5. **Run the Services (in order):**
	 - **Step 1: Start Core Infrastructure**
		 - Start the service-registry first, then the api-gateway.
		 ```bash
		 # In /service-registry
		 mvn spring-boot:run

		 # In a new terminal, for /api-gateway
		 mvn spring-boot:run
		 ```
	 - **Step 2: Start Application Services**
		 - Open a new terminal for each of the 10 application microservices (auth-service, market-analysis-service, etc.) and run the following command in each directory:
		 ```bash
		 mvn spring-boot:run
		 ```
		 - It is recommended to start services with fewer dependencies first (like rag-service) before starting services that depend on them (like chat-service).

---

## 🛣️ Future Roadmap

- [ ] **Containerization:** Fully containerize each service with Docker for simplified deployment.
- [ ] **Kubernetes Deployment:** Create Helm charts to deploy the entire stack to a Kubernetes cluster.
- [ ] **Distributed Tracing:** Integrate Micrometer Tracing and Zipkin for end-to-end request tracing.
- [ ] **CI/CD Pipeline:** Implement a full CI/CD pipeline using GitHub Actions to automate builds, tests, and deployments.
- [ ] **Asynchronous Messaging:** Introduce a message broker like RabbitMQ or Kafka for event-driven communication between select services to further enhance decoupling.

---

## 👥 Our Team

The Arthoniti AI suite was proudly developed by:

- [Sumaiya Islam](https://github.com/SuMayaBee)
- [Munshi Md Arafat Hussain](https://github.com/arafatDU)


