import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const getGeminiModel = (modelName = 'gemini-2.0-flash') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn(`⚠️ GEMINI_API_KEY is not defined in environment variables. Using mock services for ${modelName}.`);
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: modelName });
  } catch (error) {
    console.error(`❌ Failed to initialize Gemini API for model ${modelName}:`, error);
    return null;
  }
};

/**
 * Clean markdown code fences and other noise from JSON responses.
 */
const parseCleanJson = (text) => {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  } catch (e) {
    console.error('❌ Error parsing JSON from Gemini response:', e, '\nRaw text:', text);
    // Find the first [ or { and last ] or } to try to extract valid JSON
    try {
      const firstBracket = Math.min(
        text.indexOf('{') === -1 ? Infinity : text.indexOf('{'),
        text.indexOf('[') === -1 ? Infinity : text.indexOf('[')
      );
      const lastBracket = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
      if (firstBracket !== Infinity && lastBracket !== -1 && lastBracket > firstBracket) {
        const jsonSubstring = text.substring(firstBracket, lastBracket + 1);
        return JSON.parse(jsonSubstring);
      }
    } catch (nestedErr) {
      console.error('❌ Failed recovery parse:', nestedErr);
    }
    throw new Error('Failed to parse clean JSON from model response');
  }
};

/**
 * Generate role-specific interview questions using Gemini
 */
export const generateQuestions = async (role, difficulty, interviewType, skills = []) => {
  const model = getGeminiModel('gemini-2.0-flash'); // fast model for questions
  
  if (!model) {
    return getMockQuestions(role, difficulty, interviewType, skills);
  }

  const skillsText = skills.length > 0 ? `specifically targeting skills: ${skills.join(', ')}` : '';
  
  const prompt = `
    You are an expert technical recruiter and interviewer.
    Generate a list of 5 realistic, challenging, and unique interview questions for a candidate applying for the role:
    Role: ${role}
    Difficulty Level: ${difficulty}
    Interview Type: ${interviewType}
    ${skillsText}

    Return EXACTLY a JSON array of strings, containing exactly 5 questions.
    Do not add any conversational text, formatting, or introduction. Return ONLY the valid JSON array.
    
    Example response format:
    [
      "Question 1 description here?",
      "Question 2 description here?",
      "Question 3 description here?",
      "Question 4 description here?",
      "Question 5 description here?"
    ]
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: { type: "string" },
          description: "An array of exactly 5 realistic, challenging, and unique interview questions."
        }
      }
    });
    const response = await result.response;
    const text = response.text();
    return parseCleanJson(text);
  } catch (error) {
    console.warn('⚠️ Structured Questions Generation failed, falling back to standard text extraction:', error);
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return parseCleanJson(text);
    } catch (fallbackError) {
      console.error('❌ Gemini Question Generation failed, falling back to mock data:', fallbackError);
      return getMockQuestions(role, difficulty, interviewType, skills);
    }
  }
};

/**
 * Evaluate submitted candidate answers using Gemini
 */
export const evaluateInterviewAnswers = async (role, difficulty, type, questions, answers) => {
  const model = getGeminiModel('gemini-2.0-flash'); // fast model for evaluation
  
  if (!model) {
    return getMockEvaluation(role, difficulty, type, questions, answers);
  }

  // Construct a readable Q&A transcript for the prompt
  const qaTranscript = questions.map((q, idx) => {
    return `Question ${idx + 1}: ${q}\nCandidate Answer: ${answers[idx] || 'No answer provided.'}\n---`;
  }).join('\n');

  const prompt = `
    You are an expert interview coach and senior manager.
    Evaluate the following interview performance for a candidate applying for the role:
    Role: ${role}
    Difficulty Level: ${difficulty}
    Interview Type: ${type}

    Here is the interview transcript (Questions and Candidate Answers):
    ${qaTranscript}

    Provide a highly comprehensive evaluation in EXACTLY the following JSON format.
    Ensure all scores are integers between 0 and 100.
    Provide realistic, professional, and actionable feedback based on their specific answers.
    Do not write any introductory or explanatory text. Return ONLY the JSON object.

    Required JSON schema:
    {
      "technicalScore": 85,
      "communicationScore": 78,
      "confidenceScore": 80,
      "problemSolvingScore": 88,
      "overallScore": 83,
      "feedback": "A summary of their performance, explaining how they did and highlighting general impressions.",
      "strengths": [
        "First major strength shown in responses",
        "Second major strength shown in responses"
      ],
      "weaknesses": [
        "First area of improvement",
        "Second area of improvement"
      ],
      "recommendations": [
        "Specific actionable tip #1 (e.g. read up on X, describe using STAR method)",
        "Specific actionable tip #2"
      ],
      "gradedAnswers": [
        {
          "questionIndex": 0,
          "questionText": "Question 1 text...",
          "answerText": "Candidate Answer 1...",
          "score": 85,
          "feedback": "Individual question assessment: what was good, what was missing."
        }
      ]
    }

    Note: The "gradedAnswers" array MUST contain exactly ${questions.length} items corresponding to each question and answer.
  `;

  const evaluationSchema = {
    type: "object",
    properties: {
      technicalScore: { type: "integer", description: "Assessment of candidates technical level, score between 0 and 100." },
      communicationScore: { type: "integer", description: "Assessment of communication skill, score between 0 and 100." },
      confidenceScore: { type: "integer", description: "Assessment of self-assurance and delivery, score between 0 and 100." },
      problemSolvingScore: { type: "integer", description: "Assessment of analytical breakdown and structural logic, score between 0 and 100." },
      overallScore: { type: "integer", description: "Unified overall evaluation rating, score between 0 and 100." },
      feedback: { type: "string", description: "Comprehensive, encouraging feedback detailing strengths, overall impression and potential." },
      strengths: {
        type: "array",
        items: { type: "string" },
        description: "List of 2-3 specific major strengths demonstrated during the interview."
      },
      weaknesses: {
        type: "array",
        items: { type: "string" },
        description: "List of 2-3 technical or professional areas requiring improvement."
      },
      recommendations: {
        type: "array",
        items: { type: "string" },
        description: "List of 2-3 specific and actionable improvement steps (e.g., resources, structural mock targets)."
      },
      gradedAnswers: {
        type: "array",
        items: {
          type: "object",
          properties: {
            questionIndex: { type: "integer" },
            questionText: { type: "string" },
            answerText: { type: "string" },
            score: { type: "integer", description: "Score between 0 and 100 for this answer." },
            feedback: { type: "string", description: "Constructive breakdown of what was great and what could be optimized." }
          },
          required: ["questionIndex", "questionText", "answerText", "score", "feedback"]
        },
        description: "Evaluations matching every single question in the interview transcript."
      }
    },
    required: [
      "technicalScore", "communicationScore", "confidenceScore", "problemSolvingScore",
      "overallScore", "feedback", "strengths", "weaknesses", "recommendations", "gradedAnswers"
    ]
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema
      }
    });
    const response = await result.response;
    const text = response.text();
    return parseCleanJson(text);
  } catch (error) {
    console.warn('⚠️ Structured Evaluation failed, falling back to standard text extraction:', error);
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return parseCleanJson(text);
    } catch (fallbackError) {
      console.error('❌ Gemini Evaluation failed, falling back to mock evaluation:', fallbackError);
      return getMockEvaluation(role, difficulty, type, questions, answers);
    }
  }
};

/**
 * Extract skills, projects, and details from parsed Resume text
 */
export const analyzeResumeText = async (resumeText) => {
  const model = getGeminiModel('gemini-2.0-flash'); // flash model for fast extraction accuracy
  
  if (!model) {
    return getMockResumeAnalysis(resumeText);
  }

  const prompt = `
    You are an elite talent intelligence parser and advanced recruiting processor.
    Your goal is to extract ALL technical skills, project logs, professional work history, and educational credentials from the candidate's resume with 100% accuracy and ZERO omission.

    === RESUME TEXT START ===
    ${resumeText}
    === RESUME TEXT END ===

    Strict Extraction & Formatting Rules:
    1. **extractedSkills**: Scan every sentence and extract all technical skills, programming languages, databases, libraries, frameworks, cloud services, deployment platforms, methodologies, and core tools mentioned. Do NOT generalize or truncate list items. List every technology individually.
    2. **extractedProjects**: Extract every project detailed. For each project, extract the title, the primary technologies used, and a concise 1-sentence description detailing what was built and its measured impact or outcomes. Format as: "Project Title (Technologies Used) - Key achievements and impact".
    3. **extractedExperience**: Extract all professional work experiences chronologically. Highlight the exact Job Title, the Company/Organization name, the timeline (Start Date - End Date), and a summary of key achievements. Format each role as: "Job Title at Company Name (Timeline) - Key achievements and responsibilities".
    4. **extractedEducation**: Extract all educational credentials, certifications, degrees, and institutions. Format each entry as: "Degree/Certificate in Major - Institution Name (Graduation/Completion Year)".
    5. **aiSummary**: Generate a premium 2-3 sentence executive profile of the candidate. Assess their technical seniority (Junior, Mid, Senior, Lead, or Principal), highlight their primary engineering domains, and recommend their ideal target job tracks.
  `;

  const resumeSchema = {
    type: "object",
    properties: {
      extractedSkills: {
        type: "array",
        items: { type: "string" },
        description: "A complete list of technologies, programming languages, platforms, and tools."
      },
      extractedProjects: {
        type: "array",
        items: { type: "string" },
        description: "Projects listed, format: 'Title (Tech) - Description'."
      },
      extractedExperience: {
        type: "array",
        items: { type: "string" },
        description: "Roles listed chronologically, format: 'Title at Company (Timeline) - Details'."
      },
      extractedEducation: {
        type: "array",
        items: { type: "string" },
        description: "Credentials, format: 'Degree in Major - School Name (Graduation Year)'."
      },
      aiSummary: {
        type: "string",
        description: "A highly premium 2-3 sentence executive candidate profile."
      }
    },
    required: ["extractedSkills", "extractedProjects", "extractedExperience", "extractedEducation", "aiSummary"]
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema
      }
    });
    const response = await result.response;
    const text = response.text();
    return parseCleanJson(text);
  } catch (error) {
    console.warn('⚠️ Structured Resume Analysis failed, falling back to standard text extraction:', error);
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return parseCleanJson(text);
    } catch (fallbackError) {
      console.error('❌ Gemini Resume Analysis failed, falling back to mock analysis:', fallbackError);
      return getMockResumeAnalysis(resumeText);
    }
  }
};

// ==========================================
// MOCK FALLBACK SERVICES
// ==========================================

const categoryQuestionsMap = {
  'Behavioral Interviews': [
    "Describe a complex project roadblock you faced as a ${role}. Walk me through your Situation, Task, Action, and specific quantitative Result.",
    "How do you handle a scenario as a ${role} where team members refuse to compromise on a technical or strategic decision?",
    "What is your strategy for delivering constructive, difficult feedback to an underperforming teammate or vendor?",
    "How do you balance achieving strict project goals with maintaining high team morale and preventing burnout?",
    "Give an example of a successful consensus you built among divergent cross-functional product stakeholders."
  ],
  'Advertising and Marketing': [
    "How do you develop multi-channel marketing or ad funnels for a role like ${role}, and what key performance metrics do you prioritize?",
    "Describe a successful brand awareness or conversion campaign you led. What was the measured ROI?",
    "How do you run A/B testing on ad copy, copy headlines, or user search landing pages to optimize conversion rates?",
    "Describe a time when you had to manage a major brand crisis or sudden negative public feedback. How did you respond?",
    "What tools and technologies (such as SEO tools, analytics dashboards, PPC consoles) do you consider vital for a ${role}?"
  ],
  'Agriculture': [
    "How do you advise farms or clients on modern agricultural practices, crop rotations, and soil yield optimization as a ${role}?",
    "What is your process for designing crop or livestock production plans that balance commercial yields with environmental sustainability?",
    "How do you implement innovative irrigation, soil nutrition, or pest-management systems in your daily work?",
    "Describe a time when a harvest or agricultural program faced an unexpected environmental threat (drought, frost, blight). How did you salvage it?",
    "What technologies (such as GPS mapping, soil sensors, automated irrigation) do you leverage to streamline operations?"
  ],
  'Animal Ethology': [
    "What scientific methodologies do you rely on as a ${role} to observe and record animal behavioral patterns under natural or controlled conditions?",
    "How do you design habitat enrichment plans that effectively mitigate animal stress levels and promote cognitive development?",
    "Describe a time when you had to diagnose or manage a severe behavioral disorder in a domestic or wild animal.",
    "What safety protocols and ethological principles do you prioritize when leading training sessions or handling aggressive animals?",
    "How do you translate complex behavioral research findings into actionable animal conservation or husbandry guidelines?"
  ],
  'Architecture and Design': [
    "How do you approach a new design or architectural concept as a ${role}? Walk me through your spatial planning and drafting workflow.",
    "How do you balance client aesthetic preferences with structural integrity, local building codes, and safety compliance?",
    "Describe a project where you successfully integrated green building materials or sustainable design concepts.",
    "What is your process for coordinating designs across cross-functional engineering teams, contractors, and BIM databases?",
    "What software suites (such as Revit, AutoCad, Rhino, or 3D rendering engines) do you consider essential for a ${role}?"
  ],
  'Art': [
    "How do you establish cohesive visual concepts and style guides as a ${role} for a major publication, set, or digital product?",
    "What is your creative process when working under tight commercial deadlines? How do you prevent creative blocks?",
    "Describe a project where you had to reconcile your own artistic vision with strict client requirements or corporate branding rules.",
    "How do you decide on color palettes, visual composition, and media formats to evoke a specific emotional response from the audience?",
    "What digital tools (such as Adobe Creative Cloud, Figma, physical mediums) are central to your artwork as a ${role}?"
  ],
  'Audio and Video Technology': [
    "How do you handle audio signal routing, levels, or phase cancellation challenges when setting up live or recorded sound as a ${role}?",
    "Describe your workflow for editing multi-track audio or raw video footage to create a compelling story or audio mix.",
    "What tools, plug-ins, or hardware consoles do you consider indispensable for compression, color grading, or motion graphics?",
    "How do you troubleshoot sudden equipment failures, latency issues, or sound distortions in the middle of a live broadcast or recording?",
    "What video/audio codecs and export settings do you recommend for high-end web streaming versus theatrical releases?"
  ],
  'Aviation': [
    "How do you organize flight schedules, crew rosters, and terminal gate allocations to ensure safe and efficient airport operations as a ${role}?",
    "What is your checklist-driven approach to safety audits, cockpit procedures, or aeronautical compliance in high-risk scenarios?",
    "Describe a critical emergency or air traffic anomaly you resolved under extreme time pressure.",
    "How do you manage crew resource management (CRM) and maintain open, clear communication channels with pilots and ground staff?",
    "What training methods do you use to prepare flight crews or students for complex aircraft checklists and weather challenges?"
  ],
  'Business Management': [
    "How do you orchestrate multi-team programs and track resource allocations to ensure corporate deliverables are met on budget as a ${role}?",
    "Describe a project where you successfully applied Agile methodologies, sprint planning, or critical-path scheduling.",
    "How do you approach mapping business requirements, identifying process bottlenecks, and designing scalable solutions?",
    "What strategies do you use as a ${role} to manage vendor contracts, negotiate pricing, and maintain key supplier relationships?",
    "Describe a major organizational shift (merger, software upgrade, layoffs) you managed. How did you coordinate change management?"
  ],
  'Communication': [
    "How do you draft executive talking points, corporate newsletters, or press statements as a ${role} to ensure absolute brand consistency?",
    "What is your strategy for pitching story leads to journalists and building long-term relations with media outlets?",
    "Describe how you managed a public relations crisis. What communication channels did you prioritize to control the narrative?",
    "How do you optimize internal communications to ensure global, remote engineering and business teams remain aligned?",
    "What is your process for translating complex technical parameters or API documentation into simple, readable user manuals?"
  ],
  'Construction': [
    "How do you supervise commercial building projects from initial earthworks through site handover and commissioning as a ${role}?",
    "What is your protocol for enforcing strict safety codes (like OSHA) and conducting daily site safety inductions?",
    "Describe your process for calculating materials pricing, subcontracting costs, and drafting competitive project bids.",
    "How do you handle delay claims, contract change orders, or disagreements with subcontractors on site?",
    "What scheduling tools (such as MS Project, Primavera) and critical-path methods do you use to keep projects on track?"
  ],
  'Cyber Security': [
    "How do you monitor network logs and identify zero-day intrusion vectors or server vulnerabilities as a ${role}?",
    "Describe a white-hat penetration test or ethical hacking experiment you conducted. What gaps did you discover and patch?",
    "How do you design a zero-trust enterprise security architecture, and how do you enforce strong identity management?",
    "Walk me through your incident response plan during an active ransomware or data exfiltration attack.",
    "How do you balance strict security controls with maintaining user convenience and system performance for the company?"
  ],
  'Data Science & Analytics': [
    "How do you address extreme class imbalance or missing values in a dataset when training predictive machine learning models as a ${role}?",
    "Explain the mathematical difference between L1 and L2 regularization, and how you decide which to apply to your models.",
    "Describe your time-series cross-validation workflow to ensure there is no data leakage from the future into your training sets.",
    "What is your process for deploying machine learning pipelines in production, and how do you monitor for model drift?",
    "How do you explain complex random forest feature importances or statistical outcomes to non-technical business stakeholders?"
  ],
  'Healthcare Operations': [
    "How do you direct clinical budgets and optimize patient flows to improve ER intake times and overall hospital efficiency as a ${role}?",
    "What compliance training and security protocols do you enforce to guarantee strict adherence to HIPAA guidelines?",
    "Describe a time when you resolved a severe patient experience complaint or family grievance. What guidelines did you revise?",
    "How do you coordinate doctor, nursing, and administrative schedules to prevent staff burnout and clinical shortages?",
    "What health informatics tools and electronic records systems (EHR) do you consider essential for a ${role}?"
  ],
  'Hospitality & Tourism': [
    "How do you supervise resort operations and coordinate event logistics to deliver a premium guest experience as a ${role}?",
    "What dynamic pricing strategies and seasonal marketing campaigns do you use to maximize hotel occupancy and revenue?",
    "Describe a hospitality crisis (sudden overbooking, facility fire, severe guest injury) you resolved under pressure.",
    "How do you train front-desk and service teams to maintain five-star guest relations and handle VIP arrivals?",
    "What tools and software (PMS, channel managers, CRM) are central to your daily scheduling and inventory management?"
  ],
  'FinTech Engineering': [
    "How do you design high-throughput, low-latency transaction processing engines or payment gateways as a ${role}?",
    "What security protocols (such as tokenization, cryptography, PCI-DSS compliance) do you implement to protect financial data?",
    "Describe your experience building financial APIs or smart contracts. How do you prevent reentrancy attacks or optimize gas fees?",
    "How do you leverage machine learning or rule engines to build real-time transaction fraud-detection systems?",
    "What distributed ledger or database architectures do you prefer to ensure absolute transaction consistency (ACID compliance)?"
  ],
  'Software Development': [
    "What is your process for designing a scalable, modular microservice architecture as a ${role}?",
    "How do you approach database performance tuning, indexing, and handling N+1 query bottlenecks in a production system?",
    "Describe your workflow for managing complex code reviews and ensuring code quality across distributed developer teams.",
    "Walk me through how you identify, isolate, and debug a severe memory leak or performance regression in a live system.",
    "How do you balance high technical debt, code refactoring projects, and aggressive feature shipping deadlines as a ${role}?"
  ],
  'Full-Stack Developer': [
    "How do you manage state consistency and data synchronization between client-side stores (like Redux or Zustand) and backend databases in high-concurrency environments?",
    "What are your preferred strategies for optimizing full-stack application load times, including SSR, code-splitting, database query indexing, and caching layers?",
    "Describe how you design and implement a secure end-to-end user authentication flow, including session storage, JWT handling, refresh tokens, and CSRF protection.",
    "How do you structure database schemas to accommodate both relational transaction processing (OLTP) and complex analytical reporting (OLAP) in a single application?",
    "Walk me through your process for deploying a full-stack containerized application, configuring reverse proxies, load balancers, and environment secrets."
  ],
  'Frontend Engineer': [
    "Explain the inner workings of React's fiber architecture, virtual DOM reconciliation, and how hooks like useMemo, useCallback, and useRef optimize render performance.",
    "How do you ensure web applications are fully accessible (WCAG 2.1 AA compliant), keyboard navigable, and optimized for screen readers?",
    "Describe your approach to implementing CSS layouts, responsive design, container queries, and animations that maintain 60 FPS performance.",
    "How do you handle client-side bundle size optimization, tree shaking, dynamic chunk imports, and font load strategies to boost Core Web Vitals?",
    "Describe your workflow for managing complex global state, async side effects, and state persistence without introducing performance bottlenecks."
  ],
  'Backend Developer': [
    "How do you design a thread-safe, non-blocking asynchronous REST or gRPC endpoint that handles thousands of requests per second?",
    "Compare relational (PostgreSQL) and non-relational (MongoDB/Redis) databases for a transactional financial system. How do you ensure ACID compliance?",
    "Explain how you implement distributed locking mechanisms and message queues (like RabbitMQ or Kafka) to ensure event consistency across microservices.",
    "What strategies do you use for backend caching, cache invalidation policies (LRU, TTL), and avoiding the cache stampede problem?",
    "Walk me through how you design rate limiters, request validators, and robust error-handling middleware for an enterprise gateway."
  ],
  'DevOps Engineer': [
    "How do you design an automated multi-stage CI/CD pipeline that builds, tests, runs security scans (SAST/DAST), and deploys containerized applications?",
    "Explain the difference between Kubernetes Deployments, StatefulSets, and DaemonSets, and how you manage pod scaling and horizontal auto-scalers.",
    "Describe your approach to managing infrastructure as code (IaC) using Terraform, ensuring state locks, modular layouts, and secure secret injection.",
    "How do you configure centralized monitoring, logging, and alerting systems using tools like Prometheus, Grafana, and the ELK stack?",
    "Describe a scenario where you resolved a severe container crash loop backoff or network routing failure in a production environment."
  ],
  'Mobile App Developer': [
    "How do you implement an offline-first storage and synchronization architecture in iOS/Android apps using SQLite, Realm, or local caching layers?",
    "Compare React Native/Flutter with native Swift/Kotlin. In what scenarios would you choose native development over hybrid, and why?",
    "How do you manage mobile app memory footprint, avoid memory leaks, and optimize image assets and background network sync cycles?",
    "Describe your process for securing local user credentials, biometric data, and securing network requests against man-in-the-middle (MITM) attacks.",
    "Explain your release pipelines, app store submission compliance procedures, and how you handle live OTA (Over-The-Air) updates."
  ],
  'QA Automation Engineer': [
    "How do you build a scalable page-object-model (POM) automated end-to-end testing suite using tools like Playwright, Cypress, or Selenium?",
    "Explain your strategy for managing, seeding, and tearing down dynamic database state and API mock data during test suite execution.",
    "How do you integrate regression automated testing pipelines into CI/CD workflows, handling flaky tests, parallel runs, and HTML report generation?",
    "What is the difference between unit, integration, visual regression, and system testing, and how do you distribute test coverage across them?",
    "How do you design test scripts for performance and stress testing under load using tools like JMeter or k6."
  ],
  'Cloud Solutions Architect': [
    "How do you architect a multi-region, highly available, and disaster-resilient system on AWS, Azure, or GCP using global load balancers and database replication?",
    "Explain how you secure cloud virtual private networks (VPCs), manage IAM roles, and implement zero-trust access controls across resources.",
    "What are your criteria for deciding between serverless computing (AWS Lambda), container orchestration (ECS/EKS), and virtual machines?",
    "How do you implement cloud cost-optimization strategies, auto-scaling thresholds, and resource reservation plans for enterprise-scale workloads?",
    "Describe how you design a secure, compliant data migration strategy from an on-premise physical datacenter to a public cloud provider."
  ],
  'Data Platform Engineer': [
    "How do you design a high-throughput, data-ingestion, and processing flow using Apache Spark, Flink, or DBT to process terabytes of structured data?",
    "Explain the architectural differences and use-cases between a Data Lake (e.g., S3/HDFS), a Data Warehouse (e.g., Snowflake/BigQuery), and a Lakehouse.",
    "How do you implement real-time streaming data ingestion pipelines using Apache Kafka or AWS Kinesis, handling out-of-order events and schema changes?",
    "Describe your approach to data partitioning, clustering, indexing, and tuning storage query formats like Parquet, ORC, or Avro.",
    "How do you manage data governance, lineage tracking, access control, and compliance with data privacy regulations (like GDPR)?"
  ],
  'Security Engineer': [
    "How do you conduct threat modeling on a new feature, and how do you prioritize remediation strategies for the OWASP Top 10 vulnerabilities?",
    "Explain the cryptographic differences between symmetric (AES) and asymmetric (RSA/ECC) encryption, and how you design secure key rotation processes.",
    "Describe your strategy for securing public APIs against DDoS, credential stuffing, SQL injections, and broken object-level authorization (BOLA).",
    "How do you configure secure automated static and dynamic code scanning (SAST/DAST) and manage container image vulnerability patching?",
    "Walk me through how you investigate a suspected production server intrusion and perform secure post-incident forensics."
  ],
  'Embedded Systems Engineer': [
    "How do you write highly optimized, memory-safe C/C++ firmware for resource-constrained microcontrollers with extremely limited RAM and flash memory?",
    "Explain the difference between polling and interrupt-driven execution in a real-time operating system (RTOS), and how you prevent interrupt latency.",
    "How do you troubleshoot hardware/software interfaces using logic analyzers, oscilloscopes, and debugging tools like JTAG/SWD?",
    "Explain low-power consumption design principles, deep sleep modes, and watchdog timers for battery-operated remote IoT sensor nodes.",
    "How do you design and implement custom serial communication protocols over UART, SPI, I2C, or CAN buses?"
  ],
  'Site Reliability Engineer (SRE)': [
    "Explain how you define Service Level Indicators (SLIs), Service Level Objectives (SLOs), and Error Budgets for a core payment system.",
    "What is your systematic troubleshooting process when a distributed microservice system experiences sudden cascading failures and thread pools exhaust?",
    "How do you write automated scripts to perform chaotic experiments (like Chaos Engineering) to proactively discover systemic infrastructure failures?",
    "Explain how you handle post-mortem incident reporting, root-cause analysis (RCA), and design preventative engineering roadmaps.",
    "How do you implement zero-downtime progressive deployment strategies, such as Canary or Blue-Green deployments, at scale?"
  ],
  'Machine Learning Engineer': [
    "How do you identify and mitigate training dataset bias, data leakage, and feature covariance during ML model preparation?",
    "Explain how you optimize neural network model architectures for edge deployment using techniques like quantization, pruning, and distillation.",
    "Describe your process for building scalable distributed training pipelines using PyTorch or TensorFlow across multi-node GPU clusters.",
    "How do you configure model monitoring dashboards to detect feature drift, concept drift, and performance degradation in production?",
    "Explain how you design a high-throughput, low-latency online inference service handling complex pre-processing and feature store lookups."
  ],
  'Engineering Manager': [
    "How do you balance managing developer technical growth, coaching underperforming team members, and driving high team velocity?",
    "Describe your approach to resolving deep technical disagreements between senior engineers without causing team division.",
    "How do you translate high-level business goals and product roadmaps into technical requirements and concrete sprint plans?",
    "How do you manage cross-functional stakeholder communication, handle scope creep, and renegotiate aggressive shipment deadlines?",
    "What metrics do you use to evaluate team health, code quality, deployment velocity, and overall development performance?"
  ],
  'Database Administrator': [
    "How do you analyze and optimize a query execution plan that has suddenly slowed down in a high-throughput transaction database?",
    "Explain database replication strategies (synchronous vs. asynchronous, master-slave vs. master-master) and how you handle replication lag.",
    "Describe your backup, disaster recovery, and point-in-time recovery (PITR) procedures for mission-critical relational databases.",
    "How do you manage database schema migrations, partitioning, table refactoring, and index rebuilds on live tables with zero downtime?",
    "How do you resolve concurrency conflicts, lock escalations, deadlocks, and choose isolation levels for transactional reliability?"
  ],
  'Game Developer': [
    "How do you optimize 3D graphics rendering loops, minimize draw calls, manage level-of-detail (LOD), and resolve frame rate spikes?",
    "Explain how you implement deterministic physics engines, collision detection, and spatial partitioning trees (like Octrees or BVH).",
    "Describe how you design a robust state machine for character AI and manage real-time game state synchronization in multiplayer setups.",
    "How do you manage game memory allocation, prevent garbage collection spikes in engines like Unity, and write cache-friendly code?",
    "Describe your workflow for building extensible asset pipelines, shader graphs, and dynamic level loading mechanisms."
  ],
  'Product Engineer': [
    "How do you translate complex, ambiguous user research and designer wireframes into scalable technical components with high-fidelity polish?",
    "Explain how you instrument, monitor, and analyze user engagement metrics, A/B test funnels, and performance impacts on business metrics.",
    "How do you optimize frontend user feedback loops, instant layout optimistic updates, and offline loading states to maximize perceived speed?",
    "Describe a scenario where you advocated for a UX improvement that required significant refactoring of existing system components.",
    "How do you balance writing modular, extensible code for experimental MVPs that may be rapidly modified or completely discarded?"
  ],
  'API Integrations Specialist': [
    "How do you design a robust, backward-compatible API integration gateway that handles varied payload formats and authentications?",
    "What strategies do you implement to handle external rate limits, dynamic backoff retries, circuit breakers, and network timeouts?",
    "Describe your process for building, documenting, and distributing secure multi-language developer SDKs and developer portals.",
    "How do you guarantee secure data transmission, payload integrity signatures (HMAC), and secure credential storage for third-party systems?",
    "How do you test and simulate external API failure modes, sandbox mocking, and perform integration testing under unstable network states?"
  ],
  'Systems Programmer': [
    "Explain memory management mechanics, virtual memory mapping, page tables, and how the operating system kernel coordinates page faults.",
    "How do you write memory-safe, high-concurrency systems code, and how do you prevent race conditions, deadlocks, and cache coherence issues?",
    "Describe your approach to designing a high-performance custom memory allocator (like jemalloc) or custom thread pool scheduler.",
    "How do you write compile-time optimizations, interface with hardware assemblies, and optimize cache locality (L1/L2/L3 cache misses)?",
    "Explain the difference between user space and kernel space context switching, system call overheads, and non-blocking I/O multiplexing."
  ]
};

const getMockQuestions = (role, difficulty, interviewType, skills = []) => {
  console.log(`🤖 Generating mock questions for: ${role} (${difficulty}) - ${interviewType}`);
  
  // 0. Direct match on specific position if available
  if (categoryQuestionsMap[role]) {
    return categoryQuestionsMap[role];
  }
  
  // 1. Clean the skill parameter to lookup categoryQuestionsMap
  const matchedSkill = skills.find(s => categoryQuestionsMap[s]);
  if (matchedSkill) {
    return categoryQuestionsMap[matchedSkill].map(q => q.replace(/\$\{role\}/g, role));
  }

  // 2. Perform soft scan mapping
  const allCategories = Object.keys(categoryQuestionsMap);
  const foundCategory = allCategories.find(cat => {
    const normCat = cat.toLowerCase();
    const hasInSkills = skills.some(s => s.toLowerCase().includes(normCat) || normCat.includes(s.toLowerCase()));
    const hasInRole = role.toLowerCase().includes(normCat) || normCat.includes(role.toLowerCase());
    return hasInSkills || hasInRole;
  });

  if (foundCategory) {
    return categoryQuestionsMap[foundCategory].map(q => q.replace(/\$\{role\}/g, role));
  }

  // 3. Fallback generic base questions
  const baseQuestions = {
    'Technical': [
      `Can you explain the core concepts of asynchronous programming in your stack, and how you handle concurrent operations as a ${role}?`,
      `Describe how you would design and optimize database queries or structures for a highly scalable app in your capacity as a ${role}.`,
      `What is the difference between architectural patterns you use daily, and how do you decide which one to apply?`,
      `How do you handle memory leaks, state management, or rendering bottlenecks in major web systems?`,
      `Can you walk me through your typical troubleshooting workflow when an application goes down in production?`
    ],
    'HR': [
      `Why do you want to join our company, and how does the ${role} position align with your long-term career goals?`,
      `Can you describe a situation where you had to work with a difficult coworker or stakeholder, and how you resolved it?`,
      `How do you manage stress, prioritize tight deadlines, and handle unexpected shifts in project requirements?`,
      `What is your greatest professional achievement, and what skills did you develop to accomplish it?`,
      `Where do you see yourself in five years, and how do you plan to grow your skills to get there?`
    ],
    'Behavioral': [
      `Tell me about a time you made a mistake on a project as a ${role}. How did you identify it, communicate it, and correct it?`,
      `Describe a time when you had to take lead on a critical initiative. What was your strategy and outcome?`,
      `Give an example of a time you successfully explained a complex technical topic to a non-technical audience.`,
      `Tell me about a conflict within your team. What did you do to de-escalate it and achieve a productive consensus?`,
      `Describe a project that failed. What went wrong, what did you learn, and how did you apply that to subsequent work?`
    ]
  };

  const typeKey = baseQuestions[interviewType] ? interviewType : 'Technical';
  return [...baseQuestions[typeKey]];
};

const getMockEvaluation = (role, difficulty, type, questions, answers) => {
  console.log(`🤖 Generating mock evaluation report...`);
  
  const scoreBase = 72 + Math.floor(Math.random() * 20); // 72-92
  
  const strengths = [
    `Strong clarity in expressing structural logic for the ${role} requirements.`,
    `Excellent articulation of team-centric values and professional accountability.`,
    `Demonstrated analytical thinking in problem breakdown workflows.`
  ];

  const weaknesses = [
    `Could provide more concrete quantitative metrics or performance numbers when describing project outcomes.`,
    `Some technical concepts could benefit from deeper theoretical depth rather than high-level summaries.`
  ];

  const recommendations = [
    `Utilize the STAR framework (Situation, Task, Action, Result) to format your responses for better readability and impact.`,
    `Deepen your understanding of edge-case error behaviors and recovery processes in complex web frameworks.`,
    `Practice timed coding or mock scenarios to improve rapid communication under pressure.`
  ];

  const gradedAnswers = questions.map((q, idx) => {
    const answer = answers[idx] || '';
    const wordCount = answer.split(' ').filter(Boolean).length;
    let score = 70 + Math.floor(Math.random() * 25);
    let feedback = '';

    if (wordCount === 0) {
      score = 0;
      feedback = 'No response was provided. A comprehensive response is necessary to receive scoring credits.';
    } else if (wordCount < 15) {
      score = 50;
      feedback = 'Your answer is very brief. Try expanding on the specific methodology, tools, and results to demonstrate expertise.';
    } else {
      feedback = 'Good initial structural layout. To maximize your scoring impact, describe a specific real-world example where you encountered and solved this exact issue.';
    }

    return {
      questionIndex: idx,
      questionText: q,
      answerText: answer,
      score,
      feedback
    };
  });

  return {
    technicalScore: scoreBase,
    communicationScore: scoreBase - 4 + Math.floor(Math.random() * 8),
    confidenceScore: scoreBase - 2 + Math.floor(Math.random() * 6),
    problemSolvingScore: scoreBase - 1 + Math.floor(Math.random() * 7),
    overallScore: scoreBase,
    feedback: `The candidate demonstrates substantial preparation and baseline capability for a ${difficulty}-level ${role} position. Their communication is generally professional and structured. By integrating more metrics and diving deeper into architectural trade-offs, they will strongly position themselves for elite standard evaluations.`,
    strengths,
    weaknesses,
    recommendations,
    gradedAnswers
  };
};

const getMockResumeAnalysis = (resumeText) => {
  console.log(`🤖 Generating mock resume analysis from text...`);
  
  // 1. Expand standard skills dictionary for fallback parsing
  const commonSkills = [
    // Technical
    'React', 'Node', 'Express', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'MongoDB', 
    'Python', 'SQL', 'Git', 'Docker', 'AWS', 'Java', 'C++', 'Rust', 'Golang', 
    'Kubernetes', 'Terraform', 'Next.js', 'Framer Motion', 'Tailwind', 'GraphQL',
    // Soft/Business
    'Leadership', 'Communication', 'Agile', 'Scrum', 'Management', 'SEO', 'Product Design'
  ];
  
  const extractedSkills = [];
  commonSkills.forEach(skill => {
    // Escape special characters (e.g. C++ -> C\+\+)
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Apply word boundary only if it starts or ends with an alphanumeric character
    const startBoundary = /^[a-zA-Z0-9_]/.test(skill) ? '\\b' : '';
    const endBoundary = /[a-zA-Z0-9_]$/.test(skill) ? '\\b' : '';
    
    const regex = new RegExp(`${startBoundary}${escaped}${endBoundary}`, 'i');
    if (regex.test(resumeText)) {
      extractedSkills.push(skill);
    }
  });

  if (extractedSkills.length === 0) {
    extractedSkills.push('JavaScript', 'Web Development', 'Software Engineering');
  }

  // 2. Intelligently scan lines for Education credentials
  const extractedEducation = [];
  const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
  
  const eduKeywords = ['university', 'college', 'institute', 'bachelor', 'master', 'degree', 'b.s.', 'b.tech', 'b.e.', 'm.s.', 'school'];
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (eduKeywords.some(keyword => lower.includes(keyword)) && line.length > 10 && line.length < 120) {
      if (!extractedEducation.includes(line)) {
        extractedEducation.push(line);
      }
    }
  });

  if (extractedEducation.length === 0) {
    extractedEducation.push('Degree in Computer Science or Equivalent');
  }

  // 3. Intelligently scan lines for Experience / Job Titles
  const extractedExperience = [];
  const expKeywords = ['developer', 'engineer', 'manager', 'intern', 'analyst', 'lead', 'architect', 'designer', 'specialist', 'executive'];
  const timelinePattern = /(20\d{2}|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;

  lines.forEach(line => {
    const lower = line.toLowerCase();
    const hasExpKeyword = expKeywords.some(keyword => lower.includes(keyword));
    const hasTimeline = timelinePattern.test(lower);
    
    if ((hasExpKeyword || hasTimeline) && line.length > 15 && line.length < 150 && !lower.includes('project')) {
      if (!extractedExperience.includes(line)) {
        extractedExperience.push(line);
      }
    }
  });

  if (extractedExperience.length === 0) {
    extractedExperience.push('Software Engineer (Contract/Independent) - Built responsive applications');
  }

  // 4. Intelligently scan lines for Projects
  const extractedProjects = [];
  lines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.startsWith('•') || lower.startsWith('-') || lower.includes('project') || lower.includes('developed') || lower.includes('implemented')) {
      if (line.length > 20 && line.length < 180 && !expKeywords.some(k => lower.includes(k)) && !eduKeywords.some(k => lower.includes(k))) {
        // Strip bullet symbols
        const cleanProj = line.replace(/^[\s•\-\*]+/, '');
        if (!extractedProjects.includes(cleanProj) && extractedProjects.length < 5) {
          extractedProjects.push(cleanProj);
        }
      }
    }
  });

  if (extractedProjects.length === 0) {
    extractedProjects.push(
      'Full-Stack Portfolio Project - Created scalable responsive client dashboard and endpoints',
      'Task Management App - Optimized stateful React components and user flows'
    );
  }

  // 5. Build dynamic professional executive summary
  const topSkills = extractedSkills.slice(0, 4).join(', ');
  const seniority = extractedExperience.some(e => /senior|lead|architect|manager/i.test(e)) ? 'Senior' : 'Mid-Level';
  const aiSummary = `An accomplished and highly motivated ${seniority} practitioner with specialized hands-on competence in ${topSkills || 'modern web technologies'}. Possesses a proven track record of designing modular systems and collaborating in high-velocity teams.`;

  return {
    extractedSkills: extractedSkills.slice(0, 12),
    extractedProjects: extractedProjects.slice(0, 5),
    extractedExperience: extractedExperience.slice(0, 5),
    extractedEducation: extractedEducation.slice(0, 3),
    aiSummary
  };
};
