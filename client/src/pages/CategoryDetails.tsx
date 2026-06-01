import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { 
  ArrowLeft,
  Clock,
  HelpCircle,
  Play,
  AlertCircle,
  Search,
  SlidersHorizontal,
  Home,
  Video,
  Plus,
  BarChart3,
  User as UserIcon,
  ChevronRight,
  ArrowRight,
  FileText
} from 'lucide-react';
import { renderCategorySvg } from './InterviewStudio';
import moxHappy from '../assets/Owl_with_laptop.png';

// Dynamic configurations matching InterviewStudio's tokens
const categoryMetadata: Record<string, {
  color: string;
  count: number;
  bannerBg: string;
  bannerBorder: string;
  bannerText: string;
}> = {
  'Behavioral Interviews': { 
    color: 'from-orange-400 to-orange-500', 
    count: 7,
    bannerBg: 'bg-orange-50/40',
    bannerBorder: 'border-orange-100/70',
    bannerText: 'text-orange-600'
  },
  'Advertising and Marketing': { 
    color: 'from-sky-500 to-blue-500', 
    count: 11,
    bannerBg: 'bg-sky-50/40',
    bannerBorder: 'border-sky-100/70',
    bannerText: 'text-sky-600'
  },
  'Agriculture': { 
    color: 'from-emerald-500 to-teal-500', 
    count: 5,
    bannerBg: 'bg-emerald-50/40',
    bannerBorder: 'border-emerald-100/70',
    bannerText: 'text-emerald-600'
  },
  'Animal Ethology': { 
    color: 'from-amber-500 to-orange-500', 
    count: 5,
    bannerBg: 'bg-amber-50/40',
    bannerBorder: 'border-amber-100/70',
    bannerText: 'text-amber-600'
  },
  'Architecture and Design': { 
    color: 'from-sky-500 to-indigo-500', 
    count: 6,
    bannerBg: 'bg-indigo-50/30',
    bannerBorder: 'border-indigo-100/50',
    bannerText: 'text-indigo-600'
  },
  'Art': { 
    color: 'from-rose-500 to-pink-500', 
    count: 5,
    bannerBg: 'bg-rose-50/40',
    bannerBorder: 'border-rose-100/70',
    bannerText: 'text-rose-600'
  },
  'Audio and Video Technology': { 
    color: 'from-violet-500 to-purple-500', 
    count: 8,
    bannerBg: 'bg-purple-50/40',
    bannerBorder: 'border-purple-100/70',
    bannerText: 'text-purple-600'
  },
  'Aviation': { 
    color: 'from-cyan-500 to-sky-500', 
    count: 6,
    bannerBg: 'bg-cyan-50/40',
    bannerBorder: 'border-cyan-100/70',
    bannerText: 'text-cyan-600'
  },
  'Business Management': { 
    color: 'from-red-500 to-rose-500', 
    count: 14,
    bannerBg: 'bg-rose-50/30',
    bannerBorder: 'border-rose-100/50',
    bannerText: 'text-rose-600'
  },
  'Communication': { 
    color: 'from-fuchsia-500 to-pink-500', 
    count: 6,
    bannerBg: 'bg-fuchsia-50/40',
    bannerBorder: 'border-fuchsia-100/70',
    bannerText: 'text-fuchsia-600'
  },
  'Construction': { 
    color: 'from-slate-500 to-slate-700', 
    count: 9,
    bannerBg: 'bg-slate-100/50',
    bannerBorder: 'border-slate-200/60',
    bannerText: 'text-slate-600'
  },
  'Cyber Security': { 
    color: 'from-red-600 to-red-800', 
    count: 4,
    bannerBg: 'bg-red-50/30',
    bannerBorder: 'border-red-100/50',
    bannerText: 'text-red-600'
  },
  'Data Science & Analytics': { 
    color: 'from-indigo-500 to-blue-600', 
    count: 8,
    bannerBg: 'bg-blue-50/30',
    bannerBorder: 'border-blue-100/50',
    bannerText: 'text-blue-600'
  },
  'Healthcare Operations': { 
    color: 'from-teal-400 to-emerald-500', 
    count: 6,
    bannerBg: 'bg-teal-50/40',
    bannerBorder: 'border-teal-100/70',
    bannerText: 'text-teal-600'
  },
  'Hospitality & Tourism': { 
    color: 'from-amber-400 to-orange-500', 
    count: 9,
    bannerBg: 'bg-amber-50/30',
    bannerBorder: 'border-amber-100/50',
    bannerText: 'text-amber-600'
  },
  'FinTech Engineering': { 
    color: 'from-rose-500 to-purple-600', 
    count: 12,
    bannerBg: 'bg-purple-50/30',
    bannerBorder: 'border-purple-100/50',
    bannerText: 'text-purple-600'
  },
  'Software Development': { 
    color: 'from-blue-500 to-indigo-600', 
    count: 18,
    bannerBg: 'bg-blue-50/30',
    bannerBorder: 'border-blue-100/50',
    bannerText: 'text-blue-600'
  }
};

const categoryPositionsMap: Record<string, Array<{
  title: string;
  description: string;
  duration: string;
  questions: number;
}>> = {
  'Behavioral Interviews': [
    { title: 'STAR Method Expert', description: 'Master the Situation, Task, Action, and Result technique for structuring concise, impactful answers.', duration: '15 min', questions: 5 },
    { title: 'Leadership & Conflict Resolver', description: 'Demonstrate high EQ, decisive team leadership, and proven capabilities in navigating team disputes.', duration: '15 min', questions: 5 },
    { title: 'Executive Presence Consultant', description: 'Present answers with authority, concise delivery, and strategic vision suitable for C-suite roles.', duration: '15 min', questions: 5 },
    { title: 'Team Collaboration Lead', description: 'Exemplify cross-functional alignment, open communication channels, and supportive peer mentoring.', duration: '15 min', questions: 5 },
    { title: 'Adaptability Specialist', description: 'Highlight how you successfully pivot during organizational changes, high pressure, and resource shifts.', duration: '15 min', questions: 5 },
    { title: 'Project Owner', description: 'Align stakeholder expectations, prioritize product backlogs, and drive project deadlines efficiently.', duration: '15 min', questions: 5 },
    { title: 'Client Relations Manager', description: 'Foster high client retention, resolve client grievances, and articulate clear success metrics.', duration: '15 min', questions: 5 }
  ],
  'Advertising and Marketing': [
    { title: 'Digital Marketing Manager', description: 'Develop multi-channel marketing funnels, optimize ad budgets, and measure key performance metrics.', duration: '15 min', questions: 5 },
    { title: 'SEO Specialist', description: 'Optimize organic search rankings, design backlink profiles, and conduct detailed keyword analysis.', duration: '15 min', questions: 5 },
    { title: 'Social Media Manager', description: 'Build organic community engagement, curate media calendars, and run successful brand awareness campaigns.', duration: '15 min', questions: 5 },
    { title: 'Brand Director', description: 'Establish a cohesive identity, govern global branding guidelines, and command corporate messaging.', duration: '15 min', questions: 5 },
    { title: 'Copywriter', description: 'Craft high-converting ad copy, landing pages, email copy, and compelling product headlines.', duration: '15 min', questions: 5 },
    { title: 'PPC Specialist', description: 'Manage high-yield Google/Meta paid search campaigns, run A/B testing, and maximize return on ad spend.', duration: '15 min', questions: 5 },
    { title: 'Content Marketing Manager', description: 'Design rich whitepapers, educational blog posts, and lifecycle customer nurturing content assets.', duration: '15 min', questions: 5 },
    { title: 'Product Marketing Manager', description: 'Design go-to-market launch plans, structure user persona sheets, and align product feature positioning.', duration: '15 min', questions: 5 },
    { title: 'Public Relations Lead', description: 'Draft press releases, build relationships with top journalists, and manage brand reputation crises.', duration: '15 min', questions: 5 },
    { title: 'Growth Hacker', description: 'Implement rapid conversion-rate optimization experiments and viral loops to scale acquisitions.', duration: '15 min', questions: 5 },
    { title: 'Email Marketing Coordinator', description: 'Design automated customer lifecycle campaigns, run list segmentations, and boost email open rates.', duration: '15 min', questions: 5 }
  ],
  'Agriculture': [
    { title: 'Agriculture Consultant', description: 'Advise farms on modern agricultural practices, business management, crop rotations, and soil yield optimization.', duration: '15 min', questions: 5 },
    { title: 'Farm Manager', description: 'Oversee day-to-day farm logistics, harvest cycles, equipment maintenance, and field worker coordination.', duration: '15 min', questions: 5 },
    { title: 'Agronomist', description: 'Study crop production and soil science to improve food quality, crop immunity, and farming sustainability.', duration: '15 min', questions: 5 },
    { title: 'Soil Scientist', description: 'Analyze soil chemical properties to devise custom fertilizers and prevent field erosion.', duration: '15 min', questions: 5 },
    { title: 'Crop Production Specialist', description: 'Implement innovative irrigation and pest-management systems to maximize crop yield.', duration: '15 min', questions: 5 }
  ],
  'Animal Ethology': [
    { title: 'Animal Ethology Researcher', description: 'Perform scientific research on animal behavioral patterns, cognitive skills, and habitats.', duration: '15 min', questions: 5 },
    { title: 'Wildlife Behaviorist', description: 'Consult zoos and natural reserves on managing wild animal stress levels and living conditions.', duration: '15 min', questions: 5 },
    { title: 'Veterinary Ethologist', description: 'Diagnose domestic animal behavioral disorders and construct rehabilitation training routines.', duration: '15 min', questions: 5 },
    { title: 'Zookeeper / Animal Trainer', description: 'Provide daily animal husbandry, design enrichment activities, and lead public educational sessions.', duration: '15 min', questions: 5 },
    { title: 'Conservation Biologist', description: 'Coordinate ecological initiatives to protect endangered animal species and preserve natural habitats.', duration: '15 min', questions: 5 }
  ],
  'Architecture and Design': [
    { title: 'Design Architect', description: 'Conceptualize residential and commercial building layouts, draft blueprints, and oversee construction alignment.', duration: '15 min', questions: 5 },
    { title: 'Interior Designer', description: 'Curate color schemes, premium lighting fixtures, spatial aesthetics, and layout acoustics for indoor areas.', duration: '15 min', questions: 5 },
    { title: 'Landscape Architect', description: 'Design dynamic outdoor spaces, parks, gardens, and botanical layouts balancing nature with urban structures.', duration: '15 min', questions: 5 },
    { title: 'Urban Planner', description: 'Formulate regional zoning policies, transport grids, and smart city infrastructure layouts.', duration: '15 min', questions: 5 },
    { title: 'BIM Manager', description: 'Oversee building information modeling workflows, cross-team design coordination, and technical drafting databases.', duration: '15 min', questions: 5 },
    { title: 'Architect Visualizer', description: 'Generate state-of-the-art 3D renders, walkthrough animations, and lighting simulations for clients.', duration: '15 min', questions: 5 }
  ],
  'Art': [
    { title: 'Creative Art Director', description: 'Establish high-end visual concepts for advertising, publications, set designs, and digital media.', duration: '15 min', questions: 5 },
    { title: 'Fine Artist', description: 'Create custom canvas paintings, sculptures, or multimedia masterpieces using a wide array of physical mediums.', duration: '15 min', questions: 5 },
    { title: 'Illustrator', description: 'Design engaging vector illustrations, storyboard drawings, book covers, and graphical characters.', duration: '15 min', questions: 5 },
    { title: 'Curator', description: 'Select, organize, and manage collection exhibitions in historical museums and modern galleries.', duration: '15 min', questions: 5 },
    { title: 'Art Instructor', description: 'Deliver studio art lessons in drawing, design theory, history of art, and various crafting media.', duration: '15 min', questions: 5 }
  ],
  'Audio and Video Technology': [
    { title: 'Audio Technician', description: 'An audio technician is a specialist who has total control of three things: complicated music equipment; the acoustic quality of recordings; and ambient live sound signals.', duration: '15 min', questions: 5 },
    { title: 'Film and Video Editor', description: 'A film and video editor collaborates closely with the director to produce the finest final film possible; with the right pacing, story arches, and color grading details.', duration: '15 min', questions: 5 },
    { title: 'Motion Designer', description: 'Motion design; often known as motion design; is a subset of graphic design that applies graphic design principles to filmmaking and video production.', duration: '15 min', questions: 5 },
    { title: 'Record Producer', description: 'A record producer is the creative and technical head of a recording production; commanding studio time, performance quality, and musical arrangements.', duration: '15 min', questions: 5 },
    { title: 'Sound Engineering Technician', description: 'Sound engineering technicians use machinery and equipment to record; synchronize; mix; or recreate music; voices; or sound effects in recording studios.', duration: '15 min', questions: 5 },
    { title: 'Sound Mixer', description: 'A sound mixer is someone who adjusts the volume and tone of sound picked up by microphones (like on a film set) to deliver pristine raw dialogue tapes.', duration: '15 min', questions: 5 },
    { title: 'Broadcast Engineer', description: 'Broadcast engineers manage live television or radio transmitter signals, satellite feeds, digital compression encoders, and streaming software logs.', duration: '15 min', questions: 5 },
    { title: 'Lighting Director', description: 'Lighting directors configure studio stage lighting grids, deploy dynamic filters, configure focus bounds, and coordinate color palettes for the camera.', duration: '15 min', questions: 5 }
  ],
  'Aviation': [
    { title: 'Aviation Operations Lead', description: 'Oversee flight schedules, terminal gate allocations, ground operations efficiency, and passenger loading pipelines.', duration: '15 min', questions: 5 },
    { title: 'Commercial Pilot Consultant', description: 'Prepare airline pilot candidates for advanced aircraft operations, checklists, flight management systems, and simulator trials.', duration: '15 min', questions: 5 },
    { title: 'Air Traffic Controller', description: 'Coordinate safe aircraft sequencing inside busy sectors, issuing absolute clearances for ground taxiing, takeoffs, and arrivals.', duration: '15 min', questions: 5 },
    { title: 'Flight Safety Inspector', description: 'Perform airworthiness inspections on airframe structures, checklist protocols, cockpit instruments, and legal compliance.', duration: '15 min', questions: 5 },
    { title: 'Airport Operations Manager', description: 'Supervise terminal infrastructure, emergency runway services, weather reporting equipment, and public airport safety.', duration: '15 min', questions: 5 },
    { title: 'Flight Instructor', description: 'Train student pilots in pre-flight checklists, engine configurations, basic aerodynamic maneuvering, and instrument navigation.', duration: '15 min', questions: 5 }
  ],
  'Business Management': [
    { title: 'Business Program Manager', description: 'Orchestrate multi-team corporate programs, track resource allocation, and report business outcomes.', duration: '15 min', questions: 5 },
    { title: 'Project Manager', description: 'Govern Agile sprints, manage project timelines, and ensure project deliverables are achieved on budget.', duration: '15 min', questions: 5 },
    { title: 'Business Analyst', description: 'Map system requirements, identify process bottlenecks, and design data-driven business solutions.', duration: '15 min', questions: 5 },
    { title: 'Operations Director', description: 'Drive company operational efficiency, optimize supply lines, and manage facility budgets.', duration: '15 min', questions: 5 },
    { title: 'Management Consultant', description: 'Advise enterprise executives on growth strategies, organizational redesigns, and cost efficiency.', duration: '15 min', questions: 5 },
    { title: 'Strategy Associate', description: 'Analyze market share trends, assess competitor profiles, and construct financial growth forecasts.', duration: '15 min', questions: 5 },
    { title: 'Risk Manager', description: 'Identify potential market, operational, or legal hazards and design risk mitigation programs.', duration: '15 min', questions: 5 },
    { title: 'Change Management Specialist', description: 'Facilitate seamless employee transition plans during corporate mergers or software upgrades.', duration: '15 min', questions: 5 },
    { title: 'Procurement Lead', description: 'Negotiate vendor contracts, manage supplier relationships, and source raw materials cost-effectively.', duration: '15 min', questions: 5 },
    { title: 'Supply Chain Manager', description: 'Optimize inventory turns, warehouse logistics, and global product distribution networks.', duration: '15 min', questions: 5 },
    { title: 'Product Owner', description: 'Bridge the engineering-business gap, prioritize backlogs, and write comprehensive user stories.', duration: '15 min', questions: 5 },
    { title: 'HR Director', description: 'Govern employee relations, design talent acquisition pipelines, and lead corporate culture campaigns.', duration: '15 min', questions: 5 },
    { title: 'Financial Controller', description: 'Supervise balance sheets, direct audit processes, and manage corporate tax compliance.', duration: '15 min', questions: 5 },
    { title: 'Business Development Manager', description: 'Source strategic corporate partnerships, drive B2B sales pipelines, and identify new markets.', duration: '15 min', questions: 5 }
  ],
  'Communication': [
    { title: 'Communication Specialist', description: 'Draft corporate communications, newsletter columns, and executive talking points.', duration: '15 min', questions: 5 },
    { title: 'PR Specialist', description: 'Coordinate public relations campaigns, organize interviews, and enhance media coverage.', duration: '15 min', questions: 5 },
    { title: 'Corporate Spokesperson', description: 'Deliver official press briefings, answer journalist queries, and project corporate values.', duration: '15 min', questions: 5 },
    { title: 'Internal Communications Manager', description: 'Ensure organizational alignment by distributing updates to globally distributed teams.', duration: '15 min', questions: 5 },
    { title: 'Media Relations Manager', description: 'Maintain strong press contacts, coordinate product review placements, and pitch story leads.', duration: '15 min', questions: 5 },
    { title: 'Technical Writer', description: 'Draft highly readable software manuals, API documentations, and structural knowledge bases.', duration: '15 min', questions: 5 }
  ],
  'Construction': [
    { title: 'Construction Manager', description: 'Supervise commercial building projects from ground-breaking through site handover and commissioning.', duration: '15 min', questions: 5 },
    { title: 'Project Superintendent', description: 'Lead active construction teams, enforce safety codes, and schedule day-to-day subcontractor work.', duration: '15 min', questions: 5 },
    { title: 'Estimator', description: 'Calculate construction materials pricing, labor requirements, and draft competitive bids.', duration: '15 min', questions: 5 },
    { title: 'Safety Coordinator', description: 'Conduct onsite safety inductions, investigate site incidents, and enforce OSHA guidelines.', duration: '15 min', questions: 5 },
    { title: 'Quantity Surveyor', description: 'Manage construction contract finances, measure work progress, and control budget expenditures.', duration: '15 min', questions: 5 },
    { title: 'Civil Site Engineer', description: 'Supervise layout surveying, structural concrete casting, and infrastructure earthworks.', duration: '15 min', questions: 5 },
    { title: 'Construction Inspector', description: 'Conduct quality audits on building structural components, foundations, and system installations.', duration: '15 min', questions: 5 },
    { title: 'Planning Engineer', description: 'Develop critical-path method (CPM) project schedules, monitor milestones, and allocate equipment resources.', duration: '15 min', questions: 5 },
    { title: 'Contract Administrator', description: 'Draft subcontractor agreements, manage change orders, and resolve construction claims.', duration: '15 min', questions: 5 }
  ],
  'Cyber Security': [
    { title: 'Cybersecurity Analyst', description: 'Monitor network traffic alerts, identify intrusion vectors, and patch server vulnerabilities.', duration: '15 min', questions: 5 },
    { title: 'Penetration Tester', description: 'Conduct white-hat ethical hacking experiments, crack authentications, and report application gaps.', duration: '15 min', questions: 5 },
    { title: 'Security Architect', description: 'Design zero-trust enterprise security systems, deploy VPN tunnels, and govern firewall policies.', duration: '15 min', questions: 5 },
    { title: 'Incident Responder', description: 'Lead emergency responses during active cyber attacks, isolate servers, and perform digital forensics.', duration: '15 min', questions: 5 }
  ],
  'Data Science & Analytics': [
    { title: 'Data Scientist', description: 'Train predictive machine learning models, run mathematical simulations, and design statistical experiments.', duration: '15 min', questions: 5 },
    { title: 'Data Analyst', description: 'Query SQL databases, build executive Tableau dashboards, and extract business insights.', duration: '15 min', questions: 5 },
    { title: 'Machine Learning Engineer', description: 'Deploy deep learning models, optimize inference times, and build scalable AI pipelines.', duration: '15 min', questions: 5 },
    { title: 'Data Engineer', description: 'Build ETL pipelines, manage distributed databases, and maintain data lake integrity.', duration: '15 min', questions: 5 },
    { title: 'BI Developer', description: 'Design corporate data warehouses, optimize cubes, and automate scheduled report distributions.', duration: '15 min', questions: 5 },
    { title: 'Quantitative Analyst', description: 'Formulate mathematical pricing algorithms and automated options trading models.', duration: '15 min', questions: 5 },
    { title: 'AI Researcher', description: 'Conduct research in large language models, neural network architectures, and natural language understanding.', duration: '15 min', questions: 5 },
    { title: 'Database Administrator', description: 'Manage database replication, set backup routines, and optimize slow-running SQL queries.', duration: '15 min', questions: 5 }
  ],
  'Healthcare Operations': [
    { title: 'Healthcare Administrator', description: 'Direct hospital operational budgets, govern medical compliance, and supervise administrative staff.', duration: '15 min', questions: 5 },
    { title: 'Clinical Coordinator', description: 'Manage clinical staff schedules, optimize patient flows, and coordinate resource allocation.', duration: '15 min', questions: 5 },
    { title: 'Medical Records Manager', description: 'Oversee electronic health record (EHR) systems and enforce strict HIPAA privacy guidelines.', duration: '15 min', questions: 5 },
    { title: 'Hospital Operations Manager', description: 'Optimize emergency room intake rates, manage outpatient facilities, and supervise maintenance.', duration: '15 min', questions: 5 },
    { title: 'Patient Experience Specialist', description: 'Audit patient care reviews, resolve patient complaints, and design caring service guidelines.', duration: '15 min', questions: 5 },
    { title: 'Health Informatics Analyst', description: 'Analyze healthcare outcome data, track readmissions, and optimize patient care programs.', duration: '15 min', questions: 5 }
  ],
  'Hospitality & Tourism': [
    { title: 'Hospitality Manager', description: 'Supervise resort operational facilities, coordinate guest operations, and manage event logistics.', duration: '15 min', questions: 5 },
    { title: 'Hotel General Manager', description: 'Direct guest relations, manage operational profit margins, and supervise departement heads.', duration: '15 min', questions: 5 },
    { title: 'Event Planner', description: 'Organize international business conferences, corporate retreats, wedding banquets, and stage layouts.', duration: '15 min', questions: 5 },
    { title: 'Travel Consultant', description: 'Curate custom adventure travel packages, handle flight schedules, and design tourism itineraries.', duration: '15 min', questions: 5 },
    { title: 'Food & Beverage Director', description: 'Oversee kitchen supply chains, curate premium menus, and manage restaurant services.', duration: '15 min', questions: 5 },
    { title: 'Guest Services Supervisor', description: 'Train front-desk staff, handle guest upgrades, and coordinate VIP experiences.', duration: '15 min', questions: 5 },
    { title: 'Tourism Marketing Specialist', description: 'Market travel destinations, run advertising campaigns, and collaborate with influencers.', duration: '15 min', questions: 5 },
    { title: 'Revenue Manager', description: 'Formulate dynamic seasonal pricing strategies to optimize hotel occupancy rates.', duration: '15 min', questions: 5 },
    { title: 'Resort Operations Manager', description: 'Oversee guest activities, manage spa facilities, and supervise beach safety teams.', duration: '15 min', questions: 5 }
  ],
  'FinTech Engineering': [
    { title: 'FinTech Software Engineer', description: 'Build ultra-secure payment gateways, transaction processing engines, and banking API integrations.', duration: '15 min', questions: 5 },
    { title: 'Blockchain Developer', description: 'Design decentralized financial protocols, manage nodes, and develop Web3 wallet platforms.', duration: '15 min', questions: 5 },
    { title: 'Quantitative Engineer', description: 'Implement high-frequency trading execution algorithms and real-time risk trackers.', duration: '15 min', questions: 5 },
    { title: 'Risk Analyst', description: 'Build credit-scoring engines, transaction fraud-detection algorithms, and credit exposure models.', duration: '15 min', questions: 5 },
    { title: 'Payment Systems Architect', description: 'Design high-throughput, low-latency credit card settlement and payment routing systems.', duration: '15 min', questions: 5 },
    { title: 'Financial APIs Developer', description: 'Develop secure REST/gRPC endpoints for sharing account and transaction details.', duration: '15 min', questions: 5 },
    { title: 'Algorithmic Trader', description: 'Code custom quantitative strategies, backtest transaction metrics, and manage order routers.', duration: '15 min', questions: 5 },
    { title: 'Smart Contract Auditor', description: 'Review Solidity codebase implementations, prevent security hacks, and optimize gas fees.', duration: '15 min', questions: 5 },
    { title: 'Compliance Officer', description: 'Ensure technological pipelines conform to strict anti-money laundering (AML) policies.', duration: '15 min', questions: 5 },
    { title: 'WealthTech Developer', description: 'Build automated robo-advisory engines, asset allocation models, and investment portals.', duration: '15 min', questions: 5 },
    { title: 'DeFi Protocol Engineer', description: 'Design liquidity pool smart contracts, yield-farming vault networks, and decentralized exchange routing.', duration: '15 min', questions: 5 },
    { title: 'Crypto Architect', description: 'Design institutional custody vaults, multi-signature transaction wallets, and secure key management systems.', duration: '15 min', questions: 5 }
  ],
  'Software Development': [
    { title: 'Full-Stack Developer', description: 'Bridge client-side interactive apps with scalable database models and secure server logic.', duration: '15 min', questions: 5 },
    { title: 'Frontend Engineer', description: 'Master pixel-perfect UI rendering, modern React state management, and optimized client performance.', duration: '15 min', questions: 5 },
    { title: 'Backend Developer', description: 'Design secure REST/gRPC APIs, microservice orchestration, and robust database architectures.', duration: '15 min', questions: 5 },
    { title: 'DevOps Engineer', description: 'Automate CI/CD pipelines, orchestrate containerized deployments, and monitor cloud infrastructure health.', duration: '15 min', questions: 5 },
    { title: 'Mobile App Developer', description: 'Build offline-first native or hybrid iOS and Android applications with smooth UI performance.', duration: '15 min', questions: 5 },
    { title: 'QA Automation Engineer', description: 'Develop end-to-end testing suites, regression workflows, and integration pipelines to guarantee quality.', duration: '15 min', questions: 5 },
    { title: 'Cloud Solutions Architect', description: 'Design scalable, secure, and resilient multi-region cloud infrastructures on AWS, Azure, or GCP.', duration: '15 min', questions: 5 },
    { title: 'Data Platform Engineer', description: 'Build reliable data pipelines, manage high-throughput streaming grids, and maintain data lake integrity.', duration: '15 min', questions: 5 },
    { title: 'Security Engineer', description: 'Implement static application security testing (SAST), threat models, and secure authentication standards.', duration: '15 min', questions: 5 },
    { title: 'Embedded Systems Engineer', description: 'Write low-level firmware, configure microcontrollers, and optimize device-to-cloud communications.', duration: '15 min', questions: 5 },
    { title: 'Site Reliability Engineer (SRE)', description: 'Maximize system uptime, manage incident response, and automate infrastructure scaling.', duration: '15 min', questions: 5 },
    { title: 'Machine Learning Engineer', description: 'Build and optimize machine learning model training workflows and high-performance inference APIs.', duration: '15 min', questions: 5 },
    { title: 'Engineering Manager', description: 'Direct cross-functional agile development squads, align technical roadmaps, and mentor developers.', duration: '15 min', questions: 5 },
    { title: 'Database Administrator', description: 'Optimize complex SQL querying speeds, execute secure replications, and design indexing schemes.', duration: '15 min', questions: 5 },
    { title: 'Game Developer', description: 'Craft performant 3D graphics rendering loops, physics engines, and interactive gameplay states.', duration: '15 min', questions: 5 },
    { title: 'Product Engineer', description: 'Translate user stories into polished web features with a high-fidelity visual and UX focus.', duration: '15 min', questions: 5 },
    { title: 'API Integrations Specialist', description: 'Connect complex enterprise third-party services, manage rate limits, and construct SDKs.', duration: '15 min', questions: 5 },
    { title: 'Systems Programmer', description: 'Build high-performance, memory-safe OS kernels, compilers, and low-level software utilities.', duration: '15 min', questions: 5 }
  ]
};

// Render cute high-fidelity custom inline vector workspace character avatars on the left of each card
const renderPositionAvatar = (title: string, index: number) => {
  const primaryColors = ['#4f3df5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
  const backdropColors = ['#f5f3ff', '#eff6ff', '#ecfdf5', '#fffbeb', '#fdf2f8', '#ecfeff'];
  
  const primaryColor = primaryColors[index % primaryColors.length];
  const backdropColor = backdropColors[index % backdropColors.length];
  
  if (title === 'Full-Stack Developer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#f5f3ff" />
        <rect x="18" y="20" width="28" height="20" rx="3" fill="#4f3df5" />
        <rect x="21" y="23" width="22" height="14" rx="1" fill="#ffffff" />
        <path d="M26,30 L23,32 L26,34" stroke="#4f3df5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38,30 L41,32 L38,34" stroke="#4f3df5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="33" y1="29" x2="31" y2="35" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28,40 L26,44 L38,44 L36,40 Z" fill="#cbd5e1" />
      </svg>
    );
  }
  
  if (title === 'Frontend Engineer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#eff6ff" />
        <rect x="18" y="20" width="28" height="20" rx="3" fill="#3b82f6" />
        <rect x="21" y="23" width="22" height="14" rx="1" fill="#1e1b4b" />
        <path d="M25,28 L22,30 L25,32" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M39,28 L42,30 L39,32" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="33" y1="27" x2="31" y2="33" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="26" y="40" width="12" height="4" rx="1" fill="#64748b" />
      </svg>
    );
  }
  
  if (title === 'Backend Developer' || title === 'Backend Architect') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#ecfdf5" />
        <rect x="20" y="18" width="24" height="8" rx="2" fill="#10b981" />
        <circle cx="25" cy="22" r="1.5" fill="#ffffff" />
        <circle cx="29" cy="22" r="1.5" fill="#a7f3d0" />
        <rect x="20" y="28" width="24" height="8" rx="2" fill="#10b981" />
        <circle cx="25" cy="32" r="1.5" fill="#ffffff" />
        <circle cx="29" cy="32" r="1.5" fill="#a7f3d0" />
        <rect x="20" y="38" width="24" height="8" rx="2" fill="#10b981" />
        <circle cx="25" cy="42" r="1.5" fill="#ffffff" />
        <circle cx="29" cy="42" r="1.5" fill="#a7f3d0" />
      </svg>
    );
  }
  
  if (title === 'DevOps Engineer' || title === 'DevOps & Cloud Engineer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#fffbeb" />
        <path d="M42,32 C45,32 46,29 44,27 C42,25 38,26 36,24 C34,22 35,18 31,18 C27,18 27,22 25,24 C23,26 19,25 17,27 C15,29 16,32 20,32" fill="#f59e0b" opacity="0.15" />
        <path d="M38,36 C42.5,36 46,32.5 46,28 C46,23.5 41,20 36,20 C36,19 32,16 28,18 C24,20 23,24 23,25 C20,25 18,27 18,30 C18,33.5 21,36 25,36 Z" fill="#f59e0b" />
        <circle cx="28" cy="27" r="3" fill="#ffffff" />
        <path d="M34,31 L32,33 M37,33 L35,35 M31.5,35.5 A4,4 0 0,1 36.5,31.5" stroke="#fffbeb" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  
  if (title === 'Mobile App Developer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#fdf2f8" />
        <rect x="22" y="16" width="20" height="32" rx="4" fill="#ec4899" />
        <rect x="24" y="20" width="16" height="24" rx="1" fill="#ffffff" />
        <circle cx="32" cy="46" r="1.5" fill="#fbcfe8" />
        <circle cx="32" cy="18" r="0.75" fill="#fbcfe8" />
        <rect x="27" y="23" width="10" height="4" rx="0.5" fill="#fbcfe8" />
        <rect x="27" y="29" width="10" height="2" rx="0.5" fill="#ec4899" opacity="0.3" />
        <rect x="27" y="33" width="6" height="2" rx="0.5" fill="#ec4899" opacity="0.3" />
      </svg>
    );
  }
  
  if (title === 'QA Automation Engineer' || title === 'QA & Test Automation Lead') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#ecfeff" />
        <rect x="20" y="16" width="24" height="32" rx="3" fill="#06b6d4" />
        <rect x="22" y="18" width="20" height="28" rx="1" fill="#ffffff" />
        <line x1="26" y1="24" x2="38" y2="24" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="30" x2="34" y2="30" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="36" x2="38" y2="36" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="38" r="7" fill="#10b981" />
        <path d="M35,38 L37,40 L41,36" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  if (title === 'Data Platform Engineer' || title === 'Database Administrator' || title === 'Data Engineer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#eff6ff" />
        <ellipse cx="32" cy="22" rx="12" ry="4" fill="#3b82f6" />
        <path d="M20,22 L20,30 A12,4 0 0,0 44,30 L44,22 Z" fill="#2563eb" />
        <ellipse cx="32" cy="30" rx="12" ry="4" fill="#3b82f6" />
        <path d="M20,30 L20,38 A12,4 0 0,0 44,38 L44,30 Z" fill="#1d4ed8" />
        <ellipse cx="32" cy="38" rx="12" ry="4" fill="#3b82f6" />
      </svg>
    );
  }
  
  if (title === 'Machine Learning Engineer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#f5f3ff" />
        <circle cx="32" cy="22" r="3" fill="#4f3df5" />
        <circle cx="22" cy="32" r="3" fill="#4f3df5" />
        <circle cx="42" cy="32" r="3" fill="#4f3df5" />
        <circle cx="27" cy="42" r="3" fill="#4f3df5" />
        <circle cx="37" cy="42" r="3" fill="#4f3df5" />
        <circle cx="32" cy="32" r="4.5" fill="#f43f5e" />
        <line x1="32" y1="22" x2="32" y2="32" stroke="#4f3df5" strokeWidth="1.5" />
        <line x1="22" y1="32" x2="32" y2="32" stroke="#4f3df5" strokeWidth="1.5" />
        <line x1="42" y1="32" x2="32" y2="32" stroke="#4f3df5" strokeWidth="1.5" />
        <line x1="27" y1="42" x2="32" y2="32" stroke="#4f3df5" strokeWidth="1.5" />
        <line x1="37" y1="42" x2="32" y2="32" stroke="#4f3df5" strokeWidth="1.5" />
      </svg>
    );
  }
  
  if (title === 'Security Engineer' || title === 'Cyber Security Engineer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#fff1f2" />
        <path d="M32,16 C32,16 44,20 44,28 C44,38 32,46 32,46 C32,46 20,38 20,28 C20,20 32,16 32,16 Z" fill="#f43f5e" />
        <rect x="27" y="27" width="10" height="8" rx="1.5" fill="#ffffff" />
        <path d="M29,27 L29,24 A3,3 0 0,1 35,24 L35,27" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    );
  }
  
  if (title === 'Cloud Solutions Architect' || title === 'Cloud Engineer') {
    return (
      <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#f0fdfa" />
        <path d="M24,34 C24,30.5 27,28 30.5,28 C31.5,28 32.5,28.2 33.3,28.7 C34.5,25.4 37.8,23 41.5,23 C46.2,23 50,26.8 50,31.5 C50,32 50,32.5 49.9,33 C52.3,33.5 54,35.5 54,38 C54,40.8 51.8,43 49,43 L25,43 C22.2,43 20,40.8 20,40 C20,38 21.7,36 24,34 Z" fill="#0d9488" opacity="0.2" />
        <path d="M22,36 C22,33 24.5,30.5 27.5,30.5 C28.5,30.5 29.5,30.7 30.3,31.2 C31.5,28 34.8,26 38.5,26 C43.2,26 47,29.8 47,34.5 C47,35 46.9,35.5 46.8,36 C48.8,36.5 50,38 50,40 C50,42.2 48.2,44 46,44 L25,44 C23.2,44 22,42.5 22,40 C22,38 22,36 22,36 Z" fill="#0d9488" />
        <path d="M36,37 L36,41 M36,37 L33,39 M36,37 L39,39" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className="w-12 h-12 flex-shrink-0 transition-all duration-500 group-hover:scale-110" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" fill={backdropColor} />
      <rect x="14" y="44" width="36" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="22" y="32" width="20" height="12" rx="2" fill="#475569" />
      <rect x="24" y="34" width="16" height="8" rx="0.5" fill="#f8fafc" />
      <rect x="30" y="42" width="4" height="3" fill="#64748b" />
      <line x1="28" y1="44" x2="36" y2="44" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22,50 C22,43 42,43 42,50 L40,56 L24,56 Z" fill={primaryColor} opacity="0.95" />
      <circle cx="32" cy="36" r="6" fill="#fbcfe8" />
      <path d="M26,34 C26,30 38,30 38,34 L32,32 Z" fill="#334155" />
      <circle cx="32" cy="38" r="1.5" fill={primaryColor} />
    </svg>
  );
};

const getIsometricIllustrationDetails = (category: string) => {
  const map: Record<string, { browserText: string; cubeText: string; gradient: string }> = {
    'Behavioral Interviews': { browserText: '💬', cubeText: 'EQ', gradient: 'from-orange-500 to-amber-600' },
    'Advertising and Marketing': { browserText: '📈', cubeText: 'ROI', gradient: 'from-sky-500 to-blue-600' },
    'Data Science & Analytics': { browserText: '📊', cubeText: 'AI', gradient: 'from-indigo-500 to-blue-600' },
    'Cyber Security': { browserText: '🛡️', cubeText: 'SSL', gradient: 'from-red-600 to-red-800' },
    'FinTech Engineering': { browserText: '💳', cubeText: '$', gradient: 'from-rose-500 to-purple-600' },
    'Business Management': { browserText: '💼', cubeText: 'PM', gradient: 'from-red-500 to-rose-600' },
    'Agriculture': { browserText: '🌱', cubeText: 'BIO', gradient: 'from-emerald-500 to-teal-600' },
    'Animal Ethology': { browserText: '🐾', cubeText: 'ZOO', gradient: 'from-amber-500 to-orange-600' },
    'Architecture and Design': { browserText: '📐', cubeText: 'CAD', gradient: 'from-sky-500 to-indigo-600' },
    'Art': { browserText: '🎨', cubeText: 'HEX', gradient: 'from-rose-500 to-pink-600' },
    'Audio and Video Technology': { browserText: '🎬', cubeText: 'FPS', gradient: 'from-violet-500 to-purple-600' },
    'Aviation': { browserText: '✈️', cubeText: 'ALT', gradient: 'from-cyan-500 to-sky-600' },
    'Communication': { browserText: '📢', cubeText: 'PR', gradient: 'from-fuchsia-500 to-pink-600' },
    'Construction': { browserText: '🏗️', cubeText: 'OSHA', gradient: 'from-slate-500 to-slate-700' },
    'Healthcare Operations': { browserText: '🏥', cubeText: 'EHR', gradient: 'from-teal-400 to-emerald-500' },
    'Hospitality & Tourism': { browserText: '🏨', cubeText: 'VIP', gradient: 'from-amber-400 to-orange-600' },
    'Software Development': { browserText: '</>', cubeText: '{...}', gradient: 'from-blue-500 to-indigo-600' }
  };
  return map[category] || { browserText: '🎯', cubeText: 'MOCK', gradient: 'from-brand-500 to-indigo-600' };
};

export const CategoryDetails: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  
  const [startingRole, setStartingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decodedName = decodeURIComponent(categoryName || '');
  const meta = categoryMetadata[decodedName] || { 
    color: 'from-brand-500 to-indigo-500', 
    count: 0,
    bannerBg: 'bg-brand-50/30',
    bannerBorder: 'border-brand-100/50',
    bannerText: 'text-brand-600'
  };
  
  const positions = categoryPositionsMap[decodedName] || [];
  const isoDetails = getIsometricIllustrationDetails(decodedName);

  const handleStartInterview = async (roleName: string) => {
    setError(null);
    setStartingRole(roleName);

    try {
      const interview = await api.interviews.create({
        role: roleName,
        difficulty: 'Mid',
        interviewType: 'Technical',
        skills: decodedName
      });
      navigate(`/interviews/${interview._id}`);
    } catch (err: any) {
      setError(err.message || 'Unable to launch this mock interview session. Please try again.');
      setStartingRole(null);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPositions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return positions;
    return positions.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [searchTerm, positions]);

  // Get hero gradient style for mobile banner
  const getHeroGradient = () => {
    const c = meta.color;
    if (c.includes('orange')) return 'from-orange-500 to-amber-500';
    if (c.includes('sky') || c.includes('blue')) return 'from-sky-500 to-blue-600';
    if (c.includes('emerald') || c.includes('teal')) return 'from-emerald-500 to-teal-600';
    if (c.includes('amber')) return 'from-amber-400 to-orange-500';
    if (c.includes('violet') || c.includes('purple')) return 'from-violet-600 to-purple-700';
    if (c.includes('rose') || c.includes('pink')) return 'from-rose-500 to-pink-600';
    if (c.includes('cyan')) return 'from-cyan-500 to-sky-600';
    if (c.includes('red')) return 'from-red-600 to-red-800';
    if (c.includes('fuchsia')) return 'from-fuchsia-500 to-pink-600';
    if (c.includes('slate')) return 'from-slate-600 to-slate-800';
    if (c.includes('indigo')) return 'from-indigo-500 to-blue-600';
    return 'from-violet-600 to-indigo-700';
  };

  // ─── Mobile View ─────────────────────────────────────────────────────────────
  const renderMobileView = () => (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-screen bg-[#F8FAFC] pb-24 text-left">
      {/* Sticky Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 sticky top-0 z-30">
        <button
          type="button"
          onClick={() => navigate('/studio')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 mx-3 text-center">
          <p className="text-sm font-black text-slate-900 leading-none truncate">{decodedName}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Category Details</p>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Hero Banner */}
        <div className={`mx-4 mt-3 mb-3 bg-gradient-to-br ${getHeroGradient()} rounded-3xl p-5 relative overflow-hidden`}>
          {/* Sparkle decorations */}
          <div className="absolute top-4 right-28 text-white/30 text-xl">✦</div>
          <div className="absolute top-12 right-16 text-white/20 text-sm">✦</div>
          <div className="absolute bottom-6 right-32 text-white/20 text-xs">✦</div>

          <div className="flex items-start justify-between">
            <div className="flex-1 z-10">
              {/* Track badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 mb-3">
                <span className="text-[10px] font-black text-white">🎯 {meta.count} Tracks</span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight mb-2">{decodedName}</h2>
              <p className="text-[10px] text-white/80 font-medium leading-relaxed max-w-[180px]">
                Practice real-world {decodedName.toLowerCase()} interviews with AI-powered questions tailored to each role.
              </p>
              {/* Tags */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                  <Clock className="w-3 h-3 text-white" />
                  <span className="text-[9px] font-bold text-white">15 Min Avg</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                  <span className="text-[9px]">⭐</span>
                  <span className="text-[9px] font-bold text-white">AI Tailored</span>
                </div>
              </div>
            </div>
            {/* Owl image */}
            <img
              src={moxHappy}
              alt="MockMate Owl"
              className="w-28 object-contain drop-shadow-2xl flex-shrink-0 -mt-2 -mb-2"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-4 mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search + Filter */}
        <div className="mx-4 mb-3 flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search interview roles or skills..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm"
            />
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-md flex-shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Role Cards List */}
        <div className="px-4 pb-4 space-y-3">
          {filteredPositions.map((pos, idx) => {
            const isLaunching = startingRole === pos.title;
            return (
              <div
                key={pos.title}
                className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm"
              >
                {/* Top row: avatar + title + chevron */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <div className="scale-[0.5] origin-center w-24 h-24 flex items-center justify-center">
                      {renderPositionAvatar(pos.title, idx)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-black text-slate-900 leading-snug">{pos.title}</p>
                      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                    </div>
                    {/* Duration + Questions */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>15 Min</span>
                      </div>
                      <span className="text-slate-300 text-xs">•</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                        <HelpCircle className="w-3 h-3" />
                        <span>{pos.questions} Questions</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-2 line-clamp-3">
                  {pos.description}
                </p>

                {/* Start Interview Button */}
                <button
                  type="button"
                  disabled={startingRole !== null}
                  onClick={() => handleStartInterview(pos.title)}
                  className={`mt-3 w-full py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-extrabold text-white transition-all cursor-pointer ${
                    isLaunching
                      ? 'bg-slate-400 cursor-not-allowed'
                      : startingRole !== null
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-violet-600 hover:bg-violet-700 active:scale-[0.98] shadow-md shadow-violet-500/20'
                  }`}
                >
                  {isLaunching ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40 max-w-md mx-auto shadow-[0_-2px_16px_rgba(0,0,0,0.03)] rounded-t-3xl">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Home</span>
        </button>

        {/* Interview Tab - Selected */}
        <button
          type="button"
          onClick={() => navigate('/studio')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer"
        >
          <div className="w-12 h-8 rounded-xl bg-violet-50 text-[#625dfb] flex items-center justify-center mx-auto">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black text-[#625dfb]">Interview</span>
        </button>

        {/* Resume Tab */}
        <button
          type="button"
          onClick={() => navigate('/resume')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[9px] font-bold">Resume</span>
        </button>

        {/* Report Tab */}
        <button
          type="button"
          onClick={() => navigate('/results')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[9px] font-bold">Report</span>
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block flex-1 px-8 py-6 w-full max-w-none animate-fade-in space-y-6">
        {/* PREMIUM HEADER CONTROLS ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/studio')}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#64748B] shadow-sm transition-all duration-300 hover:bg-slate-50 hover:text-slate-900 hover:scale-[1.02] w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interview Studio
          </button>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PREMIUM HEADER BANNER */}
        <div className={`glass-card rounded-[32px] border ${meta.bannerBorder} ${meta.bannerBg} p-8 shadow-xl shadow-slate-200/5 relative overflow-hidden`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
              <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center rounded-3xl bg-white/70 border border-white p-4 shadow-sm">
                {renderCategorySvg(decodedName, false)}
              </div>
              <div className="text-center md:text-left space-y-2 flex-1">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {decodedName} Interviews
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
                  Choose from <span className={`font-extrabold ${meta.bannerText}`}>{meta.count} interview positions</span> to practice, each containing tailored questions dynamically structured by our AI.
                </p>
              </div>
            </div>
            <div className="hidden lg:block w-72 h-36 relative flex-shrink-0">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes float-iso { 0%, 100% { transform: translateY(0px) rotate(-8deg) skewX(12deg) skewY(-4deg); } 50% { transform: translateY(-8px) rotate(-8deg) skewX(12deg) skewY(-4deg); } }
                @keyframes float-cube { 0%, 100% { transform: translateY(0px) rotate(12deg); } 50% { transform: translateY(-10px) rotate(12deg); } }
                @keyframes float-sphere { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
                .animate-float-iso { animation: float-iso 4s ease-in-out infinite; }
                .animate-float-cube { animation: float-cube 4.5s ease-in-out infinite; }
                .animate-float-sphere { animation: float-sphere 5s ease-in-out infinite; }
              `}} />
              <div className="absolute top-0 right-10 w-44 h-44 bg-brand-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute top-2 left-6 w-52 h-28 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl animate-float-iso p-3 flex flex-col justify-between">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`font-sans text-2xl font-black bg-gradient-to-r ${isoDetails.gradient} bg-clip-text text-transparent tracking-widest`}>
                    {isoDetails.browserText}
                  </div>
                </div>
                <div className="w-2/3 h-1.5 rounded-full bg-slate-200/70"></div>
              </div>
              <div className={`absolute -right-2 top-4 w-12 h-12 bg-gradient-to-br ${isoDetails.gradient} rounded-xl border border-white/20 shadow-lg animate-float-cube flex items-center justify-center text-white font-sans text-xs font-bold`}>
                {isoDetails.cubeText}
              </div>
              <div className="absolute right-12 -bottom-2 w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 border border-white shadow-md animate-float-sphere"></div>
              <div className="absolute left-0 bottom-4 w-8 h-8 opacity-20 bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:5px_5px]"></div>
            </div>
          </div>
        </div>

        {/* SUB-ROLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {positions.map((pos, idx) => {
            const isLaunching = startingRole === pos.title;
            return (
              <GlassCard
                key={pos.title}
                className="p-5 flex flex-col justify-between min-h-[220px] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border-slate-200/80 group"
                hoverEffect={false}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {renderPositionAvatar(pos.title, idx)}
                    <div className="space-y-0.5 pt-0.5">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors duration-300 leading-tight">{pos.title}</h3>
                      <div className="flex flex-wrap gap-2.5 pt-0.5">
                        <div className="inline-flex items-center gap-1 text-[9px] font-extrabold text-slate-500 tracking-wide uppercase">
                          <Clock className="w-3 h-3 text-slate-400" />{pos.duration}
                        </div>
                        <div className="inline-flex items-center gap-1 text-[9px] font-extrabold text-slate-500 tracking-wide uppercase">
                          <HelpCircle className="w-3 h-3 text-slate-400" />{pos.questions} Questions
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{pos.description}</p>
                </div>
                <div className="pt-3.5 border-t border-slate-100/80 flex items-center justify-between mt-4">
                  <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase">Ready to practice</span>
                  <button
                    type="button"
                    disabled={startingRole !== null}
                    onClick={() => handleStartInterview(pos.title)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-extrabold tracking-wider uppercase text-white shadow-md transition-all duration-500 ${
                      isLaunching
                        ? 'bg-slate-400 cursor-not-allowed shadow-none'
                        : startingRole !== null
                          ? 'bg-slate-300 cursor-not-allowed shadow-none'
                          : `bg-gradient-to-r ${meta.color} hover:shadow-lg hover:scale-105 active:scale-[0.98]`
                    }`}
                  >
                    {isLaunching ? (
                      <><div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>Starting...</>
                    ) : (
                      <><Play className="w-2.5 h-2.5 fill-current" />Start Interview</>
                    )}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden min-h-screen w-full bg-[#f8fafc]">
        {renderMobileView()}
      </div>
    </>
  );
};
