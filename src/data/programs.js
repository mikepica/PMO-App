export const programs = {
  meta: {
    schemaVersion: "1.0",
    lastUpdated: "2025-05-16"
  },
  projects: [
    {
      "projectId": "PRJ-001",
      "name": "AI-Driven Trial Design Optimizer",
      "purpose": "Reduce Phase II protocol amendments by using machine-learning simulations to pre-validate eligibility and endpoints.",
      "status": {
        "overall": "On-track",
        "phase": "Execution",
        "percentComplete": 62
      },
      "timeline": {
        "start": "2024-10-01",
        "end": "2025-12-31"
      },
      "owner": {
        "programManager": "Elena Ruiz",
        "sponsor": "Head of Clinical Ops",
        "steeringCommittee": ["CDO", "VP Biometrics"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Regulatory acceptance of simulated arms may lag.",
          "impact": 4,
          "likelihood": 3,
          "rating": 12,
          "mitigation": "Early FDA/EMA consultation; publish validation white paper.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Insufficient historical trial data to train robust simulation models.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "License external datasets; use data-augmentation techniques.",
          "status": "Active"
        },
        {
          "id": "R3",
          "description": "Key SME attrition during critical algorithm-tuning sprint.",
          "impact": 3,
          "likelihood": 2,
          "rating": 6,
          "mitigation": "Implement knowledge-transfer sessions; engage backup consultants.",
          "status": "Watch"
        }
      ],
      "achievements": [
        {
          "date": "2025-03-20",
          "summary": "Prototype cut protocol-cycle time by 18 days in lymphoma use-case."
        },
        {
          "date": "2025-04-22",
          "summary": "Achieved 0.91 AUC predicting amendment likelihood on 220 legacy trials."
        },
        {
          "date": "2025-05-10",
          "summary": "Secured cross-functional endorsement from Biostats and Clin Dev at steering-committee review."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "MVP software package and user guide",
          "due": "2025-06-30",
          "status": "In Progress",
          "owner": "Data Science Lead",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Validation study report (three therapeutic areas)",
          "due": "2025-09-15",
          "status": "Planned",
          "owner": "Clinical Innovation Team",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Integration APIs for EDC / protocol-authoring tools",
          "due": "2025-11-30",
          "status": "Not Started",
          "owner": "Platform Engineering",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 1.4,
        "ytdActuals": 1.32,
        "prevMonthForecast": 0.18,
        "prevMonthActuals": 0.16
      },
      "keyMetrics": {
        "resourceFTE": 6,
        "milestoneVarianceDays": -5
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-002",
      "name": "Digital Biomarker Capture Platform",
      "purpose": "Enable at-home collection of continuous mobility and sleep data for neurology studies.",
      "status": {
        "overall": "At-risk",
        "phase": "Execution",
        "percentComplete": 47
      },
      "timeline": {
        "start": "2024-07-15",
        "end": "2025-11-30"
      },
      "owner": {
        "programManager": "Miles Chen",
        "sponsor": "Translational Medicine Lead",
        "steeringCommittee": ["Head of Neuroscience", "IT CTO"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Wearable battery life below 7 days affects adherence.",
          "impact": 3,
          "likelihood": 4,
          "rating": 12,
          "mitigation": "Pilot alternate sensors; add wired charging kit.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Data privacy concerns around continuous geolocation tracking.",
          "impact": 2,
          "likelihood": 4,
          "rating": 8,
          "mitigation": "Implement on-device aggregation; anonymize location traces.",
          "status": "Active"
        },
        {
          "id": "R3",
          "description": "Delayed procurement of CE-marked hardware for EU sites.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Dual-source suppliers; expedite certification testing.",
          "status": "Watch"
        }
      ],
      "achievements": [
        {
          "date": "2025-02-10",
          "summary": "Completed first 50-patient usability test; 92 % device uptime."
        },
        {
          "date": "2025-03-28",
          "summary": "Secured ethics approval for continuous sleep monitoring arm."
        },
        {
          "date": "2025-04-30",
          "summary": "Mobile app achieved 4.6★ rating in internal beta with 120 participants."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Regulatory usability report",
          "due": "2025-08-15",
          "status": "Not Started",
          "owner": "Human Factors SME",
          "dependencies": ["D2"]
        },
        {
          "id": "D2",
          "description": "Firmware v2.0 with power-optimization patch",
          "due": "2025-06-30",
          "status": "In Progress",
          "owner": "Device Engineering",
          "dependencies": []
        },
        {
          "id": "D3",
          "description": "Data-ingestion pipeline validated in GxP cloud",
          "due": "2025-09-30",
          "status": "Planned",
          "owner": "Data Engineering",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 2.1,
        "ytdActuals": 2.35,
        "prevMonthForecast": 0.22,
        "prevMonthActuals": 0.31
      },
      "keyMetrics": {
        "resourceFTE": 9,
        "milestoneVarianceDays": 14
      },
      "notes": "Overspend driven by additional hardware procurement."
    },

    {
      "projectId": "PRJ-003",
      "name": "Automated Source-Data Verification (SDV)",
      "purpose": "Use NLP to compare EHR-export PDFs against EDC entries, cutting CRA effort by 50 %.",
      "status": {
        "overall": "On-track",
        "phase": "Planning",
        "percentComplete": 18
      },
      "timeline": {
        "start": "2025-02-01",
        "end": "2026-03-31"
      },
      "owner": {
        "programManager": "Priya Patel",
        "sponsor": "VP Site Monitoring",
        "steeringCommittee": ["QA Director"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Site EHR export formats highly variable.",
          "impact": 4,
          "likelihood": 2,
          "rating": 8,
          "mitigation": "Develop format-agnostic OCR layer; recruit 3 pilot sites for testing.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Limited GPU capacity in on-prem cluster may slow model inference.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Migrate inference to cloud burst; reserve compute credits ahead.",
          "status": "Watch"
        },
        {
          "id": "R3",
          "description": "Change-management resistance from CRAs unwilling to trust automated SDV.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Run side-by-side validation; provide training & incentives.",
          "status": "Active"
        }
      ],
      "achievements": [
        {
          "date": "2025-03-12",
          "summary": "Completed user-journey workshops with 18 CRAs across three regions."
        },
        {
          "date": "2025-04-25",
          "summary": "Mapped 14 common EHR layouts covering 65 % of pilot sites."
        },
        {
          "date": "2025-05-14",
          "summary": "Drafted detailed functional-requirements specification (90 % complete)."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Functional requirements spec",
          "due": "2025-05-31",
          "status": "In Progress",
          "owner": "Business Analyst",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Prototype OCR + NLP micro-service",
          "due": "2025-09-15",
          "status": "Planned",
          "owner": "ML Engineering",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Pilot study with 5 investigative sites",
          "due": "2025-12-31",
          "status": "Not Started",
          "owner": "Site Monitoring",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 0.55,
        "ytdActuals": 0.47,
        "prevMonthForecast": 0.06,
        "prevMonthActuals": 0.05
      },
      "keyMetrics": {
        "resourceFTE": 3,
        "milestoneVarianceDays": -2
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-004",
      "name": "Decentralized Trial Logistics Platform",
      "purpose": "Streamline direct-to-patient drug shipping with temperature tracking.",
      "status": {
        "overall": "Delayed",
        "phase": "Execution",
        "percentComplete": 41
      },
      "timeline": {
        "start": "2024-05-01",
        "end": "2025-09-30"
      },
      "owner": {
        "programManager": "Anders Hoff",
        "sponsor": "Head of Supply Chain",
        "steeringCommittee": ["QA GxP", "Digital Health"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "3PL partner unable to integrate real-time IoT feeds.",
          "impact": 3,
          "likelihood": 4,
          "rating": 12,
          "mitigation": "Escalate contract renegotiation; explore alternate 3PL.",
          "status": "Escalated"
        },
        {
          "id": "R2",
          "description": "Cold-chain excursions due to device sensor drift.",
          "impact": 4,
          "likelihood": 2,
          "rating": 8,
          "mitigation": "Increase calibration frequency; add drift-alert thresholds.",
          "status": "Active"
        },
        {
          "id": "R3",
          "description": "GDPR compliance risk for patient address storage.",
          "impact": 2,
          "likelihood": 4,
          "rating": 8,
          "mitigation": "Implement tokenized address service; perform DPIA.",
          "status": "Active"
        }
      ],
      "achievements": [
        {
          "date": "2025-01-12",
          "summary": "Completed validation of temp-logger REST API."
        },
        {
          "date": "2025-03-05",
          "summary": "Executed first live shipment to rural patient with zero deviations."
        },
        {
          "date": "2025-04-19",
          "summary": "Achieved SOC2 Type I certification for logistics platform."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Live shipment dashboard",
          "due": "2025-07-15",
          "status": "Not Started",
          "owner": "UX Lead",
          "dependencies": ["D2"]
        },
        {
          "id": "D2",
          "description": "3PL API connectivity",
          "due": "2025-05-31",
          "status": "Delayed",
          "owner": "Integration Team",
          "dependencies": []
        },
        {
          "id": "D3",
          "description": "Cold-chain excursion alerting engine",
          "due": "2025-08-31",
          "status": "Planned",
          "owner": "IoT Engineering",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 1.8,
        "ytdActuals": 1.67,
        "prevMonthForecast": 0.15,
        "prevMonthActuals": 0.09
      },
      "keyMetrics": {
        "resourceFTE": 7,
        "milestoneVarianceDays": 31
      },
      "notes": "Timeline shift under review; may extend end date 3 months."
    },

    {
      "projectId": "PRJ-005",
      "name": "Predictive Toxicology Knowledge Graph",
      "purpose": "Fuse historical tox findings with omics data to flag candidates likely to fail GLP studies.",
      "status": {
        "overall": "On-track",
        "phase": "Execution",
        "percentComplete": 53
      },
      "timeline": {
        "start": "2023-11-01",
        "end": "2025-02-28"
      },
      "owner": {
        "programManager": "Jia Liu",
        "sponsor": "SVP Preclinical Safety",
        "steeringCommittee": ["Chief Data Officer"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Data privacy constraints for third-party in-license compounds.",
          "impact": 2,
          "likelihood": 3,
          "rating": 6,
          "mitigation": "Limit node exposure; anonymize compound IDs.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Ontology misalignment between legacy tox terms and omics vocabularies.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Introduce mapping layer; consult domain ontologists.",
          "status": "Watch"
        },
        {
          "id": "R3",
          "description": "Graph query latency exceeds analyst expectations.",
          "impact": 2,
          "likelihood": 3,
          "rating": 6,
          "mitigation": "Add in-memory cache; optimize indexes.",
          "status": "Active"
        }
      ],
      "achievements": [
        {
          "date": "2024-12-18",
          "summary": "Graph predicted hepatotox outliers with 78 % precision in retrospective test."
        },
        {
          "date": "2025-02-03",
          "summary": "Integrated RNA-seq dataset for 4 000 compounds into graph schema."
        },
        {
          "date": "2025-04-21",
          "summary": "Knowledge-graph UI won internal innovation award (top 5 projects)."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Alpha release of query interface",
          "due": "2025-01-15",
          "status": "In Progress",
          "owner": "Graph Engineer",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Machine-learning model integration with graph",
          "due": "2025-05-31",
          "status": "Planned",
          "owner": "ML Scientist",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "User training workshop series",
          "due": "2025-06-30",
          "status": "Not Started",
          "owner": "Change Management",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 0.9,
        "ytdActuals": 0.88,
        "prevMonthForecast": 0.08,
        "prevMonthActuals": 0.07
      },
      "keyMetrics": {
        "resourceFTE": 5,
        "milestoneVarianceDays": -3
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-006",
      "name": "Clinical Supply Demand AI Forecaster",
      "purpose": "Cut drug wastage by 25 % via rolling demand algorithms per site enrolment curve.",
      "status": {
        "overall": "On-track",
        "phase": "Execution",
        "percentComplete": 67
      },
      "timeline": {
        "start": "2024-02-14",
        "end": "2025-08-31"
      },
      "owner": {
        "programManager": "Grace Kim",
        "sponsor": "Head of Clinical Supply",
        "steeringCommittee": ["Finance BP", "Stat Leadership"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Slow enrolment causes sparse data for model training.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Use Bayesian priors; blend global averages until steady state.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "API downtime between IRT and forecasting engine.",
          "impact": 3,
          "likelihood": 2,
          "rating": 6,
          "mitigation": "Set up retry buffer; implement fallback rule-based forecast.",
          "status": "Watch"
        },
        {
          "id": "R3",
          "description": "Unexpected manufacturing delays for comparator drug.",
          "impact": 4,
          "likelihood": 2,
          "rating": 8,
          "mitigation": "Include stochastic supply side-constraints in model.",
          "status": "Active"
        }
      ],
      "achievements": [
        {
          "date": "2025-04-05",
          "summary": "Draft model reduced supply overage by 19 % in Phase Ib roll-out."
        },
        {
          "date": "2025-04-30",
          "summary": "Integrated live IRT feed covering 80 % of active studies."
        },
        {
          "date": "2025-05-12",
          "summary": "Ran first what-if scenario for supply shock, endorsed by Ops LT."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Forecasting micro-service live in production",
          "due": "2025-08-01",
          "status": "In Progress",
          "owner": "DevOps Lead",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Self-service dashboard for supply planners",
          "due": "2025-07-15",
          "status": "Planned",
          "owner": "Analytics",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Model validation dossier (GxP)",
          "due": "2025-08-15",
          "status": "Not Started",
          "owner": "Quality Assurance",
          "dependencies": ["D1"]
        }
      ],
      "budget": {
        "ytdForecast": 1.15,
        "ytdActuals": 1.10,
        "prevMonthForecast": 0.11,
        "prevMonthActuals": 0.12
      },
      "keyMetrics": {
        "resourceFTE": 6,
        "milestoneVarianceDays": -1
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-007",
      "name": "Next-Gen eTMF Auto-Classification",
      "purpose": "Use vision-transformers to tag and file study documents in real time to improve inspection readiness.",
      "status": {
        "overall": "On-track",
        "phase": "Execution",
        "percentComplete": 73
      },
      "timeline": {
        "start": "2023-09-30",
        "end": "2025-06-30"
      },
      "owner": {
        "programManager": "Liam O'Connor",
        "sponsor": "QA Operations Head",
        "steeringCommittee": ["GCP Compliance"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "OCR accuracy on scanned handwritten notes low.",
          "impact": 2,
          "likelihood": 4,
          "rating": 8,
          "mitigation": "Expand training set, fallback to manual QC threshold.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Document taxonomy changes during rollout.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Modularize classifier; align on change-control process.",
          "status": "Watch"
        },
        {
          "id": "R3",
          "description": "Latency in real-time API exceeds 2 seconds target.",
          "impact": 2,
          "likelihood": 3,
          "rating": 6,
          "mitigation": "Optimize model size; enable batch inference.",
          "status": "Active"
        }
      ],
      "achievements": [
        {
          "date": "2025-03-15",
          "summary": "Achieved 93 % correct classification vs. baseline 72 %."
        },
        {
          "date": "2025-04-02",
          "summary": "Completed GxP code review with zero major findings."
        },
        {
          "date": "2025-05-06",
          "summary": "Integrated audit-trail logging to support inspection readiness."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "GxP validation report",
          "due": "2025-05-31",
          "status": "In Progress",
          "owner": "CSV Lead",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Production deployment in eTMF",
          "due": "2025-06-15",
          "status": "Planned",
          "owner": "Platform Ops",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Inspector-training playbook",
          "due": "2025-06-30",
          "status": "Not Started",
          "owner": "QA Training",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 0.78,
        "ytdActuals": 0.74,
        "prevMonthForecast": 0.07,
        "prevMonthActuals": 0.06
      },
      "keyMetrics": {
        "resourceFTE": 4,
        "milestoneVarianceDays": -4
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-008",
      "name": "Real-Time Safety Signal Detection",
      "purpose": "Deploy NLP on patient narratives to flag emerging AEs within 48 hours.",
      "status": {
        "overall": "On-track",
        "phase": "Initiation",
        "percentComplete": 9
      },
      "timeline": {
        "start": "2025-04-01",
        "end": "2026-07-31"
      },
      "owner": {
        "programManager": "Fatima Al-Hashemi",
        "sponsor": "Head of Patient Safety",
        "steeringCommittee": ["Epidemiology Lead", "IT Security"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Latency in EDC data feed exceeds 24 hours.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Negotiate near-real-time feed with vendor; design async polling.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "False-positive rate triggers alert fatigue.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Tune threshold; include human-in-the-loop review.",
          "status": "Active"
        },
        {
          "id": "R3",
          "description": "GDPR/PHI compliance for free-text narrative storage.",
          "impact": 2,
          "likelihood": 4,
          "rating": 8,
          "mitigation": "Implement de-identification pipeline; secure legal opinion.",
          "status": "Watch"
        }
      ],
      "achievements": [
        {
          "date": "2025-04-18",
          "summary": "Formed cross-functional PoC squad; kicked off data-source mapping."
        },
        {
          "date": "2025-05-08",
          "summary": "Completed threat-model workshop with IT security."
        },
        {
          "date": "2025-05-15",
          "summary": "Drafted DSAR for external vendor data transfer."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Project charter and data-sharing agreement",
          "due": "2025-05-15",
          "status": "In Progress",
          "owner": "Legal & DSAR",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Prototype NLP model on historical narratives",
          "due": "2025-08-31",
          "status": "Planned",
          "owner": "ML Engineer",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Live alert dashboard MVP",
          "due": "2025-11-30",
          "status": "Not Started",
          "owner": "Safety Analytics",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 0.22,
        "ytdActuals": 0.18,
        "prevMonthForecast": 0.03,
        "prevMonthActuals": 0.02
      },
      "keyMetrics": {
        "resourceFTE": 2,
        "milestoneVarianceDays": 0
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-009",
      "name": "Cloud-Native PK/PD Modeling Suite",
      "purpose": "Shorten model turnaround from 2 weeks to 2 days by containerizing NONMEM workflows.",
      "status": {
        "overall": "On-track",
        "phase": "Execution",
        "percentComplete": 58
      },
      "timeline": {
        "start": "2024-03-20",
        "end": "2025-10-31"
      },
      "owner": {
        "programManager": "Sofia Gomez",
        "sponsor": "Early Clinical Development Head",
        "steeringCommittee": ["IT Dev Ops", "Statistics Fellow"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Legacy script compatibility issues.",
          "impact": 2,
          "likelihood": 4,
          "rating": 8,
          "mitigation": "Maintain dual-runtime; phased migration.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Cloud cost overrun due to large-scale Monte Carlo sims.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Implement cost-caps and auto-scaling limits.",
          "status": "Active"
        },
        {
          "id": "R3",
          "description": "User reluctance to adopt containerized workflow.",
          "impact": 2,
          "likelihood": 3,
          "rating": 6,
          "mitigation": "Offer training and fallback to legacy until v1.0 stable.",
          "status": "Watch"
        }
      ],
      "achievements": [
        {
          "date": "2025-02-28",
          "summary": "Dockerized 60 % of historical models with zero regression failures."
        },
        {
          "date": "2025-04-11",
          "summary": "Pilot users reported 73 % reduction in end-to-end execution time."
        },
        {
          "date": "2025-05-05",
          "summary": "Achieved reproducible builds pipeline certified by QA."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Self-service UI for modellers",
          "due": "2025-09-15",
          "status": "In Progress",
          "owner": "UX/Product",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "Cost-monitoring & alerting module",
          "due": "2025-07-31",
          "status": "Planned",
          "owner": "Cloud Engineering",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Complete migration of remaining models",
          "due": "2025-10-15",
          "status": "Not Started",
          "owner": "Modeling Team",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 1.05,
        "ytdActuals": 1.01,
        "prevMonthForecast": 0.09,
        "prevMonthActuals": 0.08
      },
      "keyMetrics": {
        "resourceFTE": 5,
        "milestoneVarianceDays": -6
      },
      "notes": ""
    },

    {
      "projectId": "PRJ-010",
      "name": "Adaptive Randomization Engine",
      "purpose": "Implement real-time Bayesian updating for dose-escalation trials to improve patient allocation.",
      "status": {
        "overall": "On-track",
        "phase": "Planning",
        "percentComplete": 22
      },
      "timeline": {
        "start": "2025-01-05",
        "end": "2026-06-30"
      },
      "owner": {
        "programManager": "Daniela Rossi",
        "sponsor": "Chief Medical Statistician",
        "steeringCommittee": ["Clinical Pharmacology", "Data Science"]
      },
      "risks": [
        {
          "id": "R1",
          "description": "Complex design may delay IRB approvals.",
          "impact": 3,
          "likelihood": 3,
          "rating": 9,
          "mitigation": "Publish methodological brief; host investigator webinar.",
          "status": "Active"
        },
        {
          "id": "R2",
          "description": "Real-time EDC integration may exceed latency tolerance.",
          "impact": 3,
          "likelihood": 2,
          "rating": 6,
          "mitigation": "Implement local cache; async update strategy.",
          "status": "Watch"
        },
        {
          "id": "R3",
          "description": "Clinical teams unfamiliar with adaptive dose-escalation.",
          "impact": 2,
          "likelihood": 3,
          "rating": 6,
          "mitigation": "Develop training modules; include adaptive cohorts in SOP.",
          "status": "Active"
        }
      ],
      "achievements": [
        {
          "date": "2025-03-18",
          "summary": "Completed statistical simulation demonstrating 22 % fewer DLTs in silico."
        },
        {
          "date": "2025-04-27",
          "summary": "Secured endorsement from Oncology TA Head for pilot use."
        },
        {
          "date": "2025-05-14",
          "summary": "Drafted protocol template incorporating adaptive algorithm hooks."
        }
      ],
      "deliverables": [
        {
          "id": "D1",
          "description": "Phase I adaptive algorithm spec",
          "due": "2025-07-31",
          "status": "Not Started",
          "owner": "Statistical Scientist",
          "dependencies": []
        },
        {
          "id": "D2",
          "description": "R-package implementation with unit tests",
          "due": "2025-10-31",
          "status": "Planned",
          "owner": "Biostatistics",
          "dependencies": ["D1"]
        },
        {
          "id": "D3",
          "description": "Pilot trial design ready for IRB submission",
          "due": "2026-02-28",
          "status": "Not Started",
          "owner": "Clinical Team",
          "dependencies": ["D2"]
        }
      ],
      "budget": {
        "ytdForecast": 0.48,
        "ytdActuals": 0.45,
        "prevMonthForecast": 0.05,
        "prevMonthActuals": 0.04
      },
      "keyMetrics": {
        "resourceFTE": 3,
        "milestoneVarianceDays": 0
      },
      "notes": ""
    }
  ]
};