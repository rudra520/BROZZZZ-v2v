import fs from 'fs';
import path from 'path';

// Define structures for our knowledge base
export interface KnowledgeChunk {
  id: string;
  title: string;
  tags: string[];
  content: string;
}

// -------------------------------------------------------------------------
// Part 2.1 - Local Vector / Semantic Similarity Search Engine (TF-IDF Space)
// -------------------------------------------------------------------------
export class LocalVectorIndex {
  private documents: KnowledgeChunk[] = [];
  private vocab: string[] = [];
  private idf: { [key: string]: number } = {};
  private docVectors: number[][] = [];

  constructor() {
    this.loadIndex();
  }

  /**
   * Loads the dataset from the local JSON file
   */
  private loadIndex() {
    try {
      const filePath = path.join(process.cwd(), 'src', 'rag', 'knowledge.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.documents = JSON.parse(fileContent);
        this.buildIndex();
      } else {
        console.warn("Knowledge base file not found. Initializing empty index.");
      }
    } catch (error) {
      console.error("Failed to load or build local vector index:", error);
    }
  }

  /**
   * Utility to clean and tokenize text
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2); // filter out short words
  }

  /**
   * Builds the TF-IDF vector index in-memory
   */
  private buildIndex() {
    const docTokens = this.documents.map(doc => {
      // Index title, content, and tags
      const combinedText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`;
      return this.tokenize(combinedText);
    });

    // Create unique vocabulary
    const allTokens = docTokens.flat();
    this.vocab = Array.from(new Set(allTokens));

    // Calculate IDF
    const numDocs = this.documents.length;
    this.vocab.forEach(term => {
      const docsWithTerm = docTokens.filter(tokens => tokens.includes(term)).length;
      // standard IDF formula with smoothing
      this.idf[term] = Math.log((1 + numDocs) / (1 + docsWithTerm)) + 1;
    });

    // Calculate document vectors
    this.docVectors = docTokens.map(tokens => {
      const tf: { [key: string]: number } = {};
      tokens.forEach(token => {
        tf[token] = (tf[token] || 0) + 1;
      });

      return this.vocab.map(term => {
        const termFreq = tf[term] || 0;
        return termFreq * (this.idf[term] || 0);
      });
    });
  }

  /**
   * Performs a cosine-similarity query search over indexed chunks
   */
  public search(query: string, topK: number = 2): KnowledgeChunk[] {
    if (this.documents.length === 0) return [];

    const queryTokens = this.tokenize(query);
    const queryTf: { [key: string]: number } = {};
    queryTokens.forEach(token => {
      queryTf[token] = (queryTf[token] || 0) + 1;
    });

    // Vectorize query
    const queryVector = this.vocab.map(term => {
      const termFreq = queryTf[term] || 0;
      return termFreq * (this.idf[term] || 0);
    });

    // Calculate magnitude of query vector
    const queryMag = Math.sqrt(queryVector.reduce((sum, val) => sum + val * val, 0));
    if (queryMag === 0) {
      // Fallback: match by tags directly if vector magnitude is zero
      return this.documents.slice(0, topK);
    }

    // Calculate cosine similarity for each document
    const scores = this.docVectors.map((docVec, idx) => {
      let dotProduct = 0;
      let docMagSq = 0;

      for (let i = 0; i < this.vocab.length; i++) {
        dotProduct += queryVector[i] * docVec[i];
        docMagSq += docVec[i] * docVec[i];
      }

      const docMag = Math.sqrt(docMagSq);
      const similarity = docMag === 0 ? 0 : dotProduct / (queryMag * docMag);

      return {
        chunk: this.documents[idx],
        score: similarity
      };
    });

    // Sort by descending similarity and take topK
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.chunk);
  }
}

// Global vector index instance
const index = new LocalVectorIndex();

export function queryLocalKnowledge(query: string, topK: number = 2): KnowledgeChunk[] {
  return index.search(query, topK);
}

// -------------------------------------------------------------------------
// Part 2.4 - Prompt Engineering & Hidden Routing Templates
// -------------------------------------------------------------------------
export function getRAGSystemPrompt(contextChunks: KnowledgeChunk[]): string {
  const contextString = contextChunks
    .map((chunk, idx) => `[Document ${idx + 1} - ${chunk.title}]:\n${chunk.content}`)
    .join('\n\n');

  return `You are 'Ask-Her-AI', an exceptionally warm, encouraging, strategic, and professional career advisor and technical mentor for women in STEM, FinTech, and higher education. 
You provide highly actionable and tactical advice on topics like salary negotiation, navigating corporate systems, breaking imposter syndrome, starting research projects, or choosing deep-tech focus sectors.

You have access to the following curated, offline-indexed corporate blueprints, compliance guidelines, and career advancement models:

---
${contextString}
---

Your interaction parameters:
1. Merge the provided context and corporate guidelines seamlessly and naturally into your responses.
2. ABSOLUTELY NEVER reference any technical retrieval phrases, such as "According to the retrieved context...", "Based on document 1...", "According to the database...", or "Based on my guidelines...". Speak with natural, direct authority as a senior human mentor who inherently holds this knowledge.
3. Keep your persona supportive, clear, and focused on empowering technical excellence, negotiation leverage, and strategic growth.
4. Format your response beautifully using structured Markdown, including bold key headers, clear bullets, and highly readable spacing.`;
}

// -------------------------------------------------------------------------
// ARCHITECTURAL NOTES FOR DEPLOYMENT (As Requested in Deliverables)
// These document how to port this to a larger, offline machine or cluster
// -------------------------------------------------------------------------
export const ARCHITECTURE_BLUEPRINT = {
  local_vector_indexing: {
    recommended_store: "LanceDB (npm: lancedb) or local FAISS index running via WASM/Node bindings.",
    scalability: "Allows local in-memory storage of up to 10M vectors with <2ms lookup latency, running entirely in the client Node/Rust runtime."
  },
  local_embeddings: {
    recommended_model: "Hugging Face 'all-MiniLM-L6-v2' exported to ONNX format.",
    execution_engine: "ONNX Runtime Web (@xenova/transformers or @huggingface/jinja) running on server CPU/GPU locally.",
    zero_cost_metrics: "0ms external latency, 100% free offline execution, keeps text fully private within local server memory."
  },
  lightweight_llm_orchestration: {
    recommended_engine: "Ollama (running locally via 'ollama run phi3' or 'ollama run llama3:8b-instruct-q4_K_M').",
    quantization_level: "4-bit integer quantization (GGUF format) which fits comfortably within 8GB of local RAM while retaining 98% of baseline technical reasoning.",
    middleware: "Connect to the local endpoint (http://localhost:11434/api/generate) from Express using standard REST/fetch requests."
  }
};
