import type { Workspace, Paper, Gap, Direction, AgentStep, Experiment, TaskItem, DocumentItem } from '../types/research';

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Autonomous Multi-Agent LLM Reasoning Systems',
    question: 'How can dynamic agent role specialization reduce hallucination rates in multi-hop mathematical and causal reasoning chains?',
    field: 'Artificial Intelligence / Multi-Agent Systems',
    objectives: [
      'Evaluate latency vs accuracy trade-offs in hierarchical agent structures',
      'Formulate real-time self-correction verification protocols',
      'Demonstrate low-resource deployment on edge consumer hardware'
    ],
    keywords: ['Multi-Agent Systems', 'LLM Self-Correction', 'Hallucination Mitigation', 'Causal Reasoning', 'Graph Verification'],
    description: 'Investigating collaborative agent interaction topologies to eliminate cascading logical errors in multi-step planning tasks.',
    createdAt: '2026-08-15',
    progress: 68,
    papersCount: 14,
    gapsCount: 4,
    directionsCount: 3,
    activeExperimentsCount: 2,
  },
  {
    id: 'ws-2',
    name: 'Climate-Resilient Microgrid AI Optimization',
    question: 'Can reinforcement learning with physics-informed neural networks prevent grid collapse during extreme weather anomalies?',
    field: 'Renewable Energy & ML',
    objectives: [
      'Build real-time solar/wind generation prediction models',
      'Develop decentralized battery storage allocation policy',
      'Test grid resilience under simulated Category 5 hurricane conditions'
    ],
    keywords: ['PINNs', 'Microgrids', 'Grid Stability', 'Reinforcement Learning', 'Extreme Weather'],
    description: 'Zero-downtime microgrid load balancing leveraging hybrid deep neural networks and thermodynamic physics constraints.',
    createdAt: '2026-08-28',
    progress: 42,
    papersCount: 9,
    gapsCount: 3,
    directionsCount: 2,
    activeExperimentsCount: 1,
  },
  {
    id: 'ws-3',
    name: 'Transformer-Based RNA Secondary Structure Folding',
    question: 'How do 3D equivariant spatial embeddings improve zero-shot predicting of viral RNA pseudoknots?',
    field: 'Computational Biology / Genomics',
    objectives: [
      'Benchmark SE(3)-equivariant networks against Cryo-EM experimental structures',
      'Predict secondary loop interactions without homologous alignment templates'
    ],
    keywords: ['RNA Folding', 'Equivariant Neural Networks', 'Structural Biology', 'Zero-shot Learning'],
    description: 'High-throughput structural prediction of novel viral genome regions using geometric deep learning.',
    createdAt: '2026-09-02',
    progress: 25,
    papersCount: 6,
    gapsCount: 2,
    directionsCount: 1,
    activeExperimentsCount: 1,
  }
];

export const INITIAL_PAPERS: Paper[] = [
  {
    id: 'paper-101',
    title: 'Reflexion: Language Agents with Verbal Reinforcement Learning',
    authors: ['Noah Shinn', 'Federico Cassano', 'Edward Berman', 'Ashwin Gopinath'],
    year: 2024,
    journalOrConf: 'NeurIPS 2024',
    abstract: 'We present Reflexion, a framework that reinforces language agents not by updating weights, but through verbal feedback. Reflexion agents reflect on task feedback signals, then maintain their own reflective text in an episodic memory buffer to induce better decision-making in subsequent trials.',
    citations: 842,
    tags: ['Agent Reflection', 'Reinforcement Learning', 'Episodic Memory', 'LLM Agents'],
    doi: '10.48550/arXiv.2303.11366',
    url: 'https://arxiv.org/abs/2303.11366',
    isSaved: true,
    isAddedToWorkspace: true,
    isAnalyzed: true,
    objective: 'Eliminate weight update overhead by replacing gradient descent with natural language reflection buffers for iterative error correction.',
    methodology: 'Iterative trial-and-error environment loops coupled with an Evaluator model and a Self-Reflection agent that appends targeted post-mortems into an episodic context window.',
    dataset: 'HumanEval, MBPP, HotpotQA, and AlfWorld decision-making environments.',
    limitations: 'High context token consumption; susceptible to infinite reflection loops when evaluator signal is noisy or miscalibrated.',
    resultsSummary: 'Achieved 91.0% pass@1 on HumanEval (improving over GPT-4 baseline by 11%) and reduced execution loop failures by 47%.',
    keyFindings: [
      'Verbal feedback acts as a strong surrogate for value functions in environment-grounded LLM loops.',
      'Memory reflection buffer size degrades past 5 iterations without aggressive summarization.',
      'Hierarchical agent verification prevents erroneous self-corrections.'
    ],
    evidenceQuotes: [
      { text: 'Verbal self-reflection allows agents to learn from failure without computationally expensive gradient updates.', location: 'Section 3.2, Page 4' },
      { text: 'When the evaluation heuristic yields false positives, the agent amplifies incorrect reasoning in memory.', location: 'Section 5.1, Page 8' }
    ]
  },
  {
    id: 'paper-102',
    title: 'Communicative Agents for Software Development: Multi-Agent Collaboration Framework',
    authors: ['Chen Qian', 'Xin Cong', 'Cheng Yang', 'Weize Chen', 'Yusheng Su'],
    year: 2024,
    journalOrConf: 'ACL 2024',
    abstract: 'Software engineering involves intricate multi-stage tasks. We present ChatDev, a virtual software company operated by multiple intelligent agents playing roles such as CEO, CPO, CTO, and Programmer to automate software creation with custom communication protocols.',
    citations: 615,
    tags: ['Software Engineering', 'Multi-Agent Interaction', 'Role Playing', 'LLM Workflow'],
    doi: '10.48550/arXiv.2307.07924',
    url: 'https://arxiv.org/abs/2307.07924',
    isSaved: true,
    isAddedToWorkspace: true,
    isAnalyzed: true,
    objective: 'Automate end-to-end software development through role-oriented collaborative agent dialogues.',
    methodology: 'Communicative de-noising dialogue chain breaking software production into design, coding, testing, and documentation phases with specialized agent personas.',
    dataset: 'ChatChain-Benchmark comprising 70 diverse software creation prompts.',
    limitations: 'Limited scalability on codebases exceeding 2,000 LOC; agent communication redundancy adds significant operational latency.',
    resultsSummary: 'Completed full software projects in under 7 minutes average time at an average cost of $0.29 per application.',
    keyFindings: [
      'De-noising sub-chats significantly reduce context hallucination compared to single continuous prompt threads.',
      'Role assignment improves prompt focus and modular output quality.'
    ],
    evidenceQuotes: [
      { text: 'De-noising interaction mechanisms prevent role-play agents from deviating into endless chit-chat.', location: 'Section 4.1, Page 6' }
    ]
  },
  {
    id: 'paper-103',
    title: 'Graph-Guided Agent Verification Protocols for Complex Causal Planning',
    authors: ['Aris Thorne', 'Elena Rostova', 'Marcus Vance', 'Lin Wei'],
    year: 2025,
    journalOrConf: 'ICLR 2025',
    abstract: 'We introduce GraphVerify, an explicit Directed Acyclic Graph (DAG) constraint layer built into multi-agent orchestrators. GraphVerify forces every sub-agent claim to be validated against a formal causal dependency tree before state transition.',
    citations: 189,
    tags: ['Causal Graph', 'Formal Verification', 'Orchestration', 'Hallucination Bounds'],
    doi: '10.48550/arXiv.2501.04982',
    url: 'https://arxiv.org/abs/2501.04982',
    isSaved: false,
    isAddedToWorkspace: true,
    isAnalyzed: true,
    objective: 'Provide mathematical error bounds for multi-agent reasoning chains via formal DAG causality checks.',
    methodology: 'Integrates an automated SMT solver and a Graph Neural Network verifier directly into the multi-agent token stream dispatch cycle.',
    dataset: 'GSM8K, MATH, StrategyQA, and CausalBench-2025.',
    limitations: 'Requires explicit causal domain specification; struggles with ambiguous natural language predicates.',
    resultsSummary: 'Reduced cumulative multi-hop hallucination rate from 34.2% down to 3.8% across 1,000 multi-step benchmark tests.',
    keyFindings: [
      'Formal DAG constraint checking catches 92% of logic jumps before downstream propagation.',
      'Latency overhead is minimal (+85ms per agent turn) due to optimized graph search.'
    ],
    evidenceQuotes: [
      { text: 'A claim without an explicit prerequisite edge in the verification DAG is automatically flagged as unverified hypothesis.', location: 'Section 2.4, Page 3' }
    ]
  },
  {
    id: 'paper-104',
    title: 'Low-Resource Multi-Agent Synergy via Quantized Knowledge Distillation',
    authors: ['Siddharth Mehta', 'Maya Lin', 'David K. Miller'],
    year: 2025,
    journalOrConf: 'EMNLP 2025',
    abstract: 'Deploying multi-agent systems often demands clusters of high-memory GPUs. We explore 4-bit quantized small language models (3B parameters) operating under a decentralized peer-to-peer gossip protocol for collaborative reasoning.',
    citations: 94,
    tags: ['Edge AI', 'Quantization', 'Decentralized Agents', 'P2P Gossip'],
    doi: '10.48550/arXiv.2503.01192',
    url: 'https://arxiv.org/abs/2503.01192',
    isSaved: false,
    isAddedToWorkspace: false,
    isAnalyzed: false,
    objective: 'Enable high-fidelity multi-agent collaboration on low-power consumer devices without cloud API dependencies.',
    methodology: 'Combines NF4 quantization, dynamic KV-cache swapping, and lightweight consensus voting algorithms over local P2P channels.',
    dataset: 'EdgeBench-2025, MMLU-Lite, HumanEval-Mini.',
    limitations: 'Higher agent-to-agent bandwidth requirements; consensus slows down when network latency spikes.',
    resultsSummary: 'Matches 70B monolithic model reasoning performance using four 3B models while using 78% less VRAM.',
    keyFindings: [
      'Ensemble consensus among quantized small models overcomes individual quantization precision loss.'
    ]
  },
  {
    id: 'paper-105',
    title: 'Retrieval Augmented Verification in Autonomous Scientific Discovery',
    authors: ['Hanna Berg', 'Victor Hugo-Santos', 'Sarah Jenkins'],
    year: 2026,
    journalOrConf: 'AAAI 2026',
    abstract: 'Autonomous scientific research agents often synthesize novel hypotheses that contradict established physical laws. We present RAG-Verify, a dual-loop retrieval architecture that cross-references generated scientific claims against indexed PubMed and arXiv citation graphs in real time.',
    citations: 42,
    tags: ['Scientific Discovery', 'RAG Verification', 'Citation Graphs', 'Hypothesis Generation'],
    doi: '10.48550/arXiv.2602.09114',
    url: 'https://arxiv.org/abs/2602.09114',
    isSaved: true,
    isAddedToWorkspace: false,
    isAnalyzed: false,
    objective: 'Prevent autonomous research agents from generating physically infeasible or literature-contradicting experiments.',
    methodology: 'Real-time vector search and knowledge graph traversal over 40M peer-reviewed open access papers embedded with hybrid dense-sparse vectors.',
    dataset: 'BioRead-2026, ArXiv-Science-Bench.',
    limitations: 'Dependent on database index fresh rate; fails on cutting-edge unpublished discoveries.',
    resultsSummary: 'Filtered out 99.1% of physically contradictory hypotheses during automated molecular synthesis planning.',
    keyFindings: [
      'Real-time literature grounding increases researcher trust score by 3.4x in double-blind evaluations.'
    ]
  }
];

export const INITIAL_GAPS: Gap[] = [
  {
    id: 'gap-1',
    title: 'Real-time dynamic verification for low-resource multi-agent edge deployments',
    description: 'Current agent verification methods (e.g. GraphVerify, SMT checkers) assume cloud-level memory and centralized control. There is an unaddressed gap in light-weight, asynchronous formal verification algorithms suitable for 3B-parameter quantized models running on edge nodes under intermittent connectivity.',
    confidenceScore: 94,
    supportingPaperTitles: [
      'Graph-Guided Agent Verification Protocols for Complex Causal Planning (2025)',
      'Low-Resource Multi-Agent Synergy via Quantized Knowledge Distillation (2025)'
    ],
    evidence: [
      'GraphVerify (ICLR 2025) explicitly notes a compute overhead of 85ms per turn on A100 GPUs, which scales exponentially on quantized edge hardware.',
      'Quantized small model synergy frameworks lack explicit formal error-bounding mechanisms during gossip protocols.'
    ],
    whyItMatters: 'Resolving this gap enables resilient autonomous AI research assistants and field robotics operating offline in remote or privacy-restricted environments.',
    workspaceId: 'ws-1',
    impactLevel: 'Critical'
  },
  {
    id: 'gap-2',
    title: 'Lack of automated self-pruning memory buffers in multi-stage reflection loops',
    description: 'Reflexion agents accumulate natural language reflections monotonically in context windows. As iteration count grows beyond 5 steps, token attention gets diluted by stale or redundant post-mortems, causing performance degradation and cost spikes.',
    confidenceScore: 89,
    supportingPaperTitles: [
      'Reflexion: Language Agents with Verbal Reinforcement Learning (2024)',
      'Communicative Agents for Software Development (2024)'
    ],
    evidence: [
      'Reflexion authors highlight a sharp decrease in pass rate efficiency after step 5 due to context degradation.',
      'ChatDev relies on rigid chat clearing heuristics rather than semantic relevance scoring for memory decay.'
    ],
    whyItMatters: 'A self-pruning semantic memory model will reduce token costs by ~60% while sustaining long-horizon multi-day research campaigns.',
    workspaceId: 'ws-1',
    impactLevel: 'High'
  },
  {
    id: 'gap-3',
    title: 'Absence of cross-domain causal transfer protocols in multi-agent orchestrators',
    description: 'Current multi-agent topologies are rigid to a single domain (e.g., code generation or QA). When faced with interdisciplinary research questions (e.g. AI + Materials Science), agents fail to transfer causal verification rules across disparate knowledge bases.',
    confidenceScore: 86,
    supportingPaperTitles: [
      'Communicative Agents for Software Development (2024)',
      'Retrieval Augmented Verification in Autonomous Scientific Discovery (2026)'
    ],
    evidence: [
      'RAG-Verify handles static citation lookup but lacks dynamic agent role adaptation when crossing domain ontologies.',
      'ChatDev role prompts fail when code requires bio-chemical domain constraint equations.'
    ],
    whyItMatters: 'Interdisciplinary science is where breakthrough discoveries happen; agents must dynamically compose cross-domain causal graphs.',
    workspaceId: 'ws-1',
    impactLevel: 'High'
  }
];

export const INITIAL_DIRECTIONS: Direction[] = [
  {
    id: 'dir-1',
    title: 'Asynchronous Gossip-Graph Verification (AGGV) for Quantized Agent Ensembles',
    description: 'Formulate a decentralized, low-bit verification protocol where each 3B quantized agent independently checks partial causal subgraphs and broadcasts compressed cryptographic proof tokens across a P2P local network.',
    targetGapTitle: 'Real-time dynamic verification for low-resource multi-agent edge deployments',
    supportingEvidence: [
      'GraphVerify SMT solver components can be converted into binary lookup tables for quantized nodes.',
      'P2P consensus algorithms (Raft/Gossip) demonstrate <10ms message latency on local Wi-Fi/mesh setups.'
    ],
    expectedImpact: 'Ultra High',
    difficulty: 'High',
    noveltyScore: 96,
    workspaceId: 'ws-1',
    isAddedToPlan: true,
    potentialVenue: 'NeurIPS / ICLR 2027'
  },
  {
    id: 'dir-2',
    title: 'Hierarchical Information-Bottleneck Memory Pruning (HIB-MP) for Language Agents',
    description: 'Implement a continuous Information-Bottleneck (IB) encoder that compresses agent reflection logs into dense, high-utility semantic vectors, dropping stale post-mortems while preserving causal error preconditions.',
    targetGapTitle: 'Lack of automated self-pruning memory buffers in multi-stage reflection loops',
    supportingEvidence: [
      'Information Bottleneck principles successfully reduce context footprint in long-context summarization.',
      'Episodic memory buffers in Reflexion show 40% redundant semantic tokens across consecutive iterations.'
    ],
    expectedImpact: 'High',
    difficulty: 'Medium',
    noveltyScore: 91,
    workspaceId: 'ws-1',
    isAddedToPlan: true,
    potentialVenue: 'ACL / EMNLP 2026'
  },
  {
    id: 'dir-3',
    title: 'Cross-Ontology Metagraph Bridge for Interdisciplinary Scientific Workflows',
    description: 'Design an adaptive metagraph mapper that dynamically translates entity predicates between biomedical (PubMed), computer science (arXiv), and physics (INSPIRE) taxonomies during multi-agent consensus rounds.',
    targetGapTitle: 'Absence of cross-domain causal transfer protocols in multi-agent orchestrators',
    supportingEvidence: [
      'Cross-domain ontology alignment models have achieved 88% precision in static pairwise mapping.',
      'Multi-agent role-playing benefits from explicit semantic translation layers when switching domain personas.'
    ],
    expectedImpact: 'High',
    difficulty: 'High',
    noveltyScore: 88,
    workspaceId: 'ws-1',
    isAddedToPlan: false,
    potentialVenue: 'AAAI 2027'
  }
];

export const INITIAL_AGENTS: AgentStep[] = [
  {
    id: 'agent-1',
    name: 'Orchestrator Agent',
    role: 'Workflow Planner & Controller',
    description: 'Parses overall research question, sets sub-agent objectives, monitors progress, and manages goal dependencies.',
    status: 'completed',
    toolsUsed: ['DAG Planner', 'Goal Decomposer', 'Dependency Graph Builder'],
    lastLog: 'Decomposed research question into 4 sequential sub-goals and dispatched to Discovery Agent.',
    outputSummary: 'Workspace plan generated with 4 sub-targets & priority queues.',
    progress: 100
  },
  {
    id: 'agent-2',
    name: 'Discovery Agent',
    role: 'Academic Literature Search & Retrieval',
    description: 'Queries arXiv, PubMed, and Semantic Scholar APIs to collect candidate papers matching domain criteria.',
    status: 'completed',
    toolsUsed: ['Semantic Scholar API', 'arXiv Search Tool', 'Dense Vector Index'],
    lastLog: 'Indexed 18 relevant papers. Filtered top 5 peer-reviewed studies with >80 citations.',
    outputSummary: 'Discovered 18 relevant papers; 5 deep-analyzed.',
    progress: 100
  },
  {
    id: 'agent-3',
    name: 'Analysis Agent',
    role: 'Structural Paper Parser & Methodology Extractor',
    description: 'Extracts methodology, datasets, mathematical proofs, experimental results, and stated limitations from PDF texts.',
    status: 'completed',
    toolsUsed: ['PDF Parser', 'Methodology Extractor', 'Limitation Scraper'],
    lastLog: 'Extracted key objectives, datasets, and benchmark limitations across all 5 workspace papers.',
    outputSummary: 'Structured schemas extracted for Reflexion, ChatDev, and GraphVerify.',
    progress: 100
  },
  {
    id: 'agent-4',
    name: 'Relationship Agent',
    role: 'Citation Topology & Comparative Mapper',
    description: 'Builds comparative matrices between methodologies, identifying agreements, contradictions, and data overlaps.',
    status: 'completed',
    toolsUsed: ['Matrix Builder', 'Contradiction Detector', 'Citation Topology Mapper'],
    lastLog: 'Generated 7-dimensional comparative matrix highlighting performance vs resource trade-offs.',
    outputSummary: 'Methodology comparison matrix generated with 0 contradictions flagged.',
    progress: 100
  },
  {
    id: 'agent-5',
    name: 'Gap Agent',
    role: 'Literature Gap & Bottleneck Finder',
    description: 'Cross-references methodology limitations against unsolved user objectives to pinpoint novelty opportunities.',
    status: 'running',
    toolsUsed: ['Gap Synthesizer', 'Confidence Scorer', 'Evidence Triangulator'],
    lastLog: 'Identified 3 high-confidence research gaps with >85% statistical novelty confidence.',
    outputSummary: '3 research gaps validated with supporting literature evidence quotes.',
    progress: 85
  },
  {
    id: 'agent-6',
    name: 'Direction Agent',
    role: 'Novel Hypothesis & Research Direction Generator',
    description: 'Formulates concrete technical directions, estimating expected impact, novelty score, and implementation difficulty.',
    status: 'waiting',
    toolsUsed: ['Hypothesis Synthesizer', 'Novelty Scorer', 'Impact Predictor'],
    lastLog: 'Waiting for Gap Agent final confidence verification round...',
    outputSummary: 'Pending gap execution phase.',
    progress: 0
  },
  {
    id: 'agent-7',
    name: 'Task Planner Agent',
    role: 'Experiment & Kanban Task Architect',
    description: 'Translates selected research direction into actionable milestone steps, dataset collection tasks, and baseline models.',
    status: 'waiting',
    toolsUsed: ['Kanban Generator', 'Milestone Scheduler', 'Resource Estimator'],
    lastLog: 'Awaiting research direction selection.',
    outputSummary: 'Pending direction confirmation.',
    progress: 0
  },
  {
    id: 'agent-8',
    name: 'Validation Agent',
    role: 'Report Integrity & Fact Checker',
    description: 'Ensures all generated claims, citations, and metrics have valid trace links before final report compile.',
    status: 'waiting',
    toolsUsed: ['Fact Checker', 'Citation Verifier', 'Report Compiler'],
    lastLog: 'Awaiting execution completion of task planner.',
    outputSummary: 'Pending execution of task planner.',
    progress: 0
  }
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-1',
    title: 'Benchmark AGGV Latency on 4x Edge GPU Nodes',
    directionTitle: 'Asynchronous Gossip-Graph Verification (AGGV) for Quantized Agent Ensembles',
    hypothesis: 'Quantized binary lookup verification tables will maintain <15ms verification latency per turn across 4 distributed edge nodes.',
    dataset: 'GSM8K-Edge, Synthetic Multi-Hop Logic Suite (1,000 samples)',
    method: 'Deploy 4x Llama-3.2-3B 4-bit nodes over local zero-tier mesh network using AGGV verification gossip layer.',
    metrics: ['Verification Latency (ms)', 'Causal Hallucination Rate (%)', 'VRAM Usage (GB)', 'Pass@1 Accuracy'],
    expectedOutcome: '<15ms latency, <4% hallucination rate, VRAM < 3.2 GB per node.',
    status: 'In Progress',
    workspaceId: 'ws-1',
    milestones: [
      { id: 'm1', title: 'Implement binary lookup table compiler for DAG constraints', completed: true },
      { id: 'm2', title: 'Configure P2P Gossip protocol testbed on local mesh network', completed: true },
      { id: 'm3', title: 'Run baseline benchmark on GSM8K-Edge test suite', completed: false },
      { id: 'm4', title: 'Analyze cross-node synchronization bottlenecks', completed: false }
    ]
  },
  {
    id: 'exp-2',
    title: 'Information-Bottleneck Token Reduction Evaluation',
    directionTitle: 'Hierarchical Information-Bottleneck Memory Pruning (HIB-MP) for Language Agents',
    hypothesis: 'HIB-MP will reduce memory context window token footprint by >55% while preserving pass@1 score.',
    dataset: 'HumanEval (164 coding tasks), AlfWorld sequential decision tasks',
    method: 'Compare monotonic memory buffer baseline against HIB-MP compressed vector memory across 10-iteration loops.',
    metrics: ['Context Token Count', 'Token Cost Savings ($)', 'Task Pass Rate (%)'],
    expectedOutcome: '55-65% reduction in token count without drop in benchmark accuracy.',
    status: 'Planning',
    workspaceId: 'ws-1',
    milestones: [
      { id: 'm21', title: 'Train lightweight Information Bottleneck projection layer', completed: true },
      { id: 'm22', title: 'Integrate compression callback into Reflexion agent loop', completed: false },
      { id: 'm23', title: 'Run 10-step pass rate comparative trials', completed: false }
    ]
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Extract methodology & limitations from 5 top papers',
    description: 'Perform deep AI structural extraction on Reflexion, ChatDev, and GraphVerify papers.',
    priority: 'High',
    status: 'completed',
    assignee: 'Analysis Agent',
    deadline: '2026-09-08',
    workspaceId: 'ws-1',
    tag: 'Literature'
  },
  {
    id: 'task-2',
    title: 'Validate low-resource verification gap hypothesis',
    description: 'Cross-reference GraphVerify compute constraints against quantized small model hardware budgets.',
    priority: 'High',
    status: 'completed',
    assignee: 'Gap Agent',
    deadline: '2026-09-09',
    workspaceId: 'ws-1',
    tag: 'Gap Detection'
  },
  {
    id: 'task-3',
    title: 'Implement AGGV gossip protocol simulator in Python',
    description: 'Create prototype P2P socket communication script with mock binary verification tokens.',
    priority: 'High',
    status: 'in_progress',
    assignee: 'Dr. Alex Rivera (Lead)',
    deadline: '2026-09-14',
    workspaceId: 'ws-1',
    tag: 'Implementation'
  },
  {
    id: 'task-4',
    title: 'Collect 1,000 sample GSM8K multi-hop test set',
    description: 'Prepare benchmark dataset formatted specifically for edge multi-agent reasoning trials.',
    priority: 'Medium',
    status: 'todo',
    assignee: 'Sarah Chen (Data Scientist)',
    deadline: '2026-09-16',
    workspaceId: 'ws-1',
    tag: 'Data Prep'
  },
  {
    id: 'task-5',
    title: 'Draft NeurIPS 2027 short paper outline',
    description: 'Synthesize research intelligence report into camera-ready LaTeX conference template.',
    priority: 'Medium',
    status: 'todo',
    assignee: 'Dr. Alex Rivera (Lead)',
    deadline: '2026-09-25',
    workspaceId: 'ws-1',
    tag: 'Writing'
  },
  {
    id: 'task-6',
    title: 'Peer review Information-Bottleneck memory loss function',
    description: 'Verify mathematical convergence bounds for continuous IB encoder layer.',
    priority: 'Low',
    status: 'review',
    assignee: 'Prof. Marcus Vance',
    deadline: '2026-09-12',
    workspaceId: 'ws-1',
    tag: 'Theory'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Reflexion_Verbal_Reinforcement_Learning.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-01',
    author: 'Shinn et al.',
    status: 'Analyzed',
    paperId: 'paper-101'
  },
  {
    id: 'doc-2',
    name: 'Communicative_Agents_Software_Development.pdf',
    fileSize: '3.1 MB',
    uploadDate: '2026-09-02',
    author: 'Qian et al.',
    status: 'Analyzed',
    paperId: 'paper-102'
  },
  {
    id: 'doc-3',
    name: 'GraphVerify_Causal_Planning_Protocols.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-09-05',
    author: 'Thorne et al.',
    status: 'Analyzed',
    paperId: 'paper-103'
  },
  {
    id: 'doc-4',
    name: 'Quantized_Small_Models_Gossip_Decentralized.pdf',
    fileSize: '4.2 MB',
    uploadDate: '2026-09-08',
    author: 'Mehta et al.',
    status: 'Processing',
    paperId: 'paper-104'
  },
  {
    id: 'doc-5',
    name: 'Draft_Proposal_Edge_Agent_Verification_2026.pdf',
    fileSize: '1.1 MB',
    uploadDate: '2026-09-10',
    author: 'Rivera et al.',
    status: 'Analyzed'
  }
];

export const COMPARISON_MATRIX_DATA = [
  {
    feature: 'Research Objective',
    paper1: 'Replace weight updates with verbal memory feedback loops',
    paper2: 'Automate software engineering via multi-agent company roles',
    paper3: 'Provide mathematical error bounds using formal DAG graph checks'
  },
  {
    feature: 'Methodology',
    paper1: 'Trial-and-error environment loops + verbal self-reflection buffer',
    paper2: 'De-noising multi-chat dialogue chain (CEO, CPO, CTO, Programmer)',
    paper3: 'Automated SMT graph verifier embedded in token dispatch cycle'
  },
  {
    feature: 'Dataset / Benchmark',
    paper1: 'HumanEval, MBPP, HotpotQA, AlfWorld',
    paper2: 'ChatChain-Benchmark (70 software prompts)',
    paper3: 'GSM8K, MATH, StrategyQA, CausalBench-2025'
  },
  {
    feature: 'Model Architecture',
    paper1: 'Monolithic LLM (GPT-4 / PaLM 2) + natural language context window',
    paper2: 'Monolithic LLM with prompt persona templates',
    paper3: 'LLM Orchestrator + SMT Solver + Graph Neural Network verifier'
  },
  {
    feature: 'Key Results',
    paper1: '91.0% pass@1 on HumanEval (+11% over base GPT-4)',
    paper2: 'Full software apps delivered in <7 minutes at $0.29 cost',
    paper3: 'Hallucination rate reduced from 34.2% to 3.8%'
  },
  {
    feature: 'Primary Strengths',
    paper1: 'Zero weight fine-tuning required; human-interpretable reflection logs',
    paper2: 'Highly scalable role separation; low development cost',
    paper3: 'Hard causal guarantees; eliminates logical jumps in multi-step proofs'
  },
  {
    feature: 'Stated Limitations',
    paper1: 'Token context window bloat; risk of infinite reflection loops',
    paper2: 'Struggles on large codebases (>2k LOC); chat redundancy latency',
    paper3: 'Requires pre-defined causal graph; struggles with fuzzy natural language'
  }
];
