// convex/seed.ts
import { internal } from "./_generated/api"; // Add this import
import { internalMutation, type MutationCtx } from "./_generated/server";

// Industries
export const seedIndustries = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const industries = [
      // Technology & Software
      {
        name: "Software Development",
        description: "Custom software solutions, web and mobile applications",
      },
      {
        name: "Cybersecurity",
        description:
          "Information security, threat detection, and data protection",
      },
      {
        name: "Artificial Intelligence & Machine Learning",
        description: "AI research, ML models, and intelligent automation",
      },
      {
        name: "Cloud Computing",
        description:
          "Cloud infrastructure, SaaS, PaaS, and distributed systems",
      },
      {
        name: "DevOps & Infrastructure",
        description: "CI/CD, containerization, and infrastructure automation",
      },

      // Finance & Business
      {
        name: "Investment Banking",
        description:
          "Corporate finance, mergers & acquisitions, capital markets",
      },
      {
        name: "Fintech",
        description:
          "Digital payments, cryptocurrency, and financial technology",
      },
      {
        name: "Insurance",
        description: "Risk assessment, underwriting, and insurance products",
      },
      {
        name: "Accounting & Auditing",
        description: "Financial reporting, tax services, and compliance",
      },
      {
        name: "Management Consulting",
        description:
          "Strategy consulting, business transformation, and advisory",
      },

      // Healthcare & Life Sciences
      {
        name: "Pharmaceuticals",
        description: "Drug development, clinical research, and medical devices",
      },
      {
        name: "Biotechnology",
        description: "Genetic engineering, bioinformatics, and life sciences",
      },
      {
        name: "Healthcare Technology",
        description: "Electronic health records, telemedicine, and health apps",
      },
      {
        name: "Medical Devices",
        description: "Diagnostic equipment, surgical instruments, and implants",
      },

      // Manufacturing & Engineering
      {
        name: "Automotive",
        description:
          "Vehicle manufacturing, electric vehicles, and autonomous driving",
      },
      {
        name: "Aerospace & Defense",
        description:
          "Aircraft manufacturing, space technology, and defense systems",
      },
      {
        name: "Renewable Energy",
        description: "Solar, wind, and sustainable energy solutions",
      },
      {
        name: "Manufacturing",
        description: "Industrial production, supply chain, and quality control",
      },

      // Media & Communications
      {
        name: "Digital Marketing",
        description: "Online advertising, social media, and content marketing",
      },
      {
        name: "Entertainment & Gaming",
        description:
          "Video games, streaming platforms, and digital entertainment",
      },
      {
        name: "Telecommunications",
        description:
          "Network infrastructure, mobile services, and connectivity",
      },

      // Retail & E-commerce
      {
        name: "E-commerce",
        description:
          "Online retail, marketplace platforms, and digital commerce",
      },
      {
        name: "Retail",
        description:
          "Traditional retail, omnichannel commerce, and customer experience",
      },
      {
        name: "Supply Chain & Logistics",
        description: "Warehousing, distribution, and transportation management",
      },

      // Education & Non-profit
      {
        name: "Education Technology",
        description:
          "Online learning platforms, educational software, and e-learning",
      },
      {
        name: "Non-profit",
        description:
          "Social impact, charitable organizations, and community services",
      },

      // Real Estate & Construction
      {
        name: "Real Estate",
        description:
          "Property development, real estate technology, and investment",
      },
      {
        name: "Construction",
        description:
          "Building construction, infrastructure, and project management",
      },

      // Food & Agriculture
      {
        name: "Food & Beverage",
        description: "Food production, restaurants, and beverage manufacturing",
      },
      {
        name: "Agriculture Technology",
        description: "Precision farming, agricultural software, and food tech",
      },
    ];

    const industryIds = [];
    for (const industry of industries) {
      const id = await ctx.db.insert("industries", industry);
      industryIds.push(id);
    }

    return {
      message: "Industries seeded successfully",
      count: industryIds.length,
    };
  },
});

// Skills
export const seedSkills = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const skills = [
      // Programming Languages
      {
        name: "JavaScript",
        description: "Dynamic programming language for web development",
      },
      { name: "TypeScript", description: "Typed superset of JavaScript" },
      {
        name: "Python",
        description: "High-level programming language for various applications",
      },
      { name: "Java", description: "Object-oriented programming language" },
      {
        name: "C#",
        description: "Microsoft's object-oriented programming language",
      },
      {
        name: "C++",
        description: "Low-level programming language for system programming",
      },
      {
        name: "Go",
        description: "Google's programming language for concurrent programming",
      },
      {
        name: "Rust",
        description: "Systems programming language focused on safety",
      },
      {
        name: "Swift",
        description: "Apple's programming language for iOS development",
      },
      {
        name: "Kotlin",
        description: "Modern programming language for Android development",
      },
      {
        name: "PHP",
        description: "Server-side scripting language for web development",
      },
      {
        name: "Ruby",
        description: "Dynamic programming language with elegant syntax",
      },

      // Frontend Technologies
      {
        name: "React",
        description: "JavaScript library for building user interfaces",
      },
      { name: "Vue.js", description: "Progressive JavaScript framework" },
      {
        name: "Angular",
        description: "TypeScript-based web application framework",
      },
      {
        name: "HTML5",
        description: "Latest version of HyperText Markup Language",
      },
      { name: "CSS3", description: "Latest version of Cascading Style Sheets" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Bootstrap", description: "CSS framework for responsive design" },

      // Backend Technologies
      {
        name: "Node.js",
        description: "JavaScript runtime for server-side development",
      },
      { name: "Express.js", description: "Web framework for Node.js" },
      { name: "Django", description: "High-level Python web framework" },
      { name: "Flask", description: "Lightweight Python web framework" },
      {
        name: "Spring Boot",
        description: "Java framework for building applications",
      },
      {
        name: "ASP.NET Core",
        description: "Cross-platform web framework by Microsoft",
      },

      // Databases
      {
        name: "PostgreSQL",
        description: "Advanced open-source relational database",
      },
      { name: "MySQL", description: "Popular open-source relational database" },
      { name: "MongoDB", description: "NoSQL document database" },
      { name: "Redis", description: "In-memory data structure store" },
      {
        name: "SQL",
        description: "Language for managing relational databases",
      },

      // Cloud Platforms
      {
        name: "Amazon Web Services (AWS)",
        description: "Cloud computing platform by Amazon",
      },
      {
        name: "Google Cloud Platform (GCP)",
        description: "Cloud computing services by Google",
      },
      {
        name: "Microsoft Azure",
        description: "Cloud computing platform by Microsoft",
      },
      { name: "Docker", description: "Containerization platform" },
      { name: "Kubernetes", description: "Container orchestration platform" },

      // Data Science & Analytics
      {
        name: "Machine Learning",
        description: "Algorithms that learn from data",
      },
      {
        name: "Deep Learning",
        description: "Neural networks with multiple layers",
      },
      {
        name: "TensorFlow",
        description: "Open-source machine learning framework",
      },
      { name: "PyTorch", description: "Machine learning library for Python" },
      { name: "Pandas", description: "Data manipulation library for Python" },
      {
        name: "Tableau",
        description: "Data visualization and business intelligence",
      },
      { name: "Power BI", description: "Business analytics tool by Microsoft" },

      // Finance & Accounting
      {
        name: "Financial Modeling",
        description:
          "Creating mathematical models for financial decision making",
      },
      {
        name: "Financial Analysis",
        description: "Evaluating financial data and investment opportunities",
      },
      {
        name: "Risk Management",
        description:
          "Identifying and mitigating financial and operational risks",
      },
      {
        name: "Budgeting & Forecasting",
        description: "Planning and predicting financial performance",
      },
      {
        name: "Tax Preparation",
        description: "Preparing and filing tax returns and compliance",
      },
      {
        name: "QuickBooks",
        description: "Accounting software for small businesses",
      },
      {
        name: "Excel Advanced",
        description: "Advanced spreadsheet analysis and modeling",
      },

      // Sales & Marketing
      {
        name: "Lead Generation",
        description: "Identifying and attracting potential customers",
      },
      {
        name: "CRM Management",
        description: "Customer relationship management systems",
      },
      { name: "Salesforce", description: "Cloud-based CRM platform" },
      {
        name: "Social Media Marketing",
        description: "Marketing through social media platforms",
      },
      {
        name: "Email Marketing",
        description: "Direct marketing via email campaigns",
      },
      {
        name: "SEO/SEM",
        description: "Search engine optimization and marketing",
      },
      { name: "Google Ads", description: "Pay-per-click advertising platform" },
      {
        name: "Content Marketing",
        description: "Creating valuable content to attract customers",
      },

      // Human Resources
      {
        name: "Talent Acquisition",
        description: "Recruiting and hiring top talent",
      },
      {
        name: "Employee Relations",
        description: "Managing workplace relationships and conflicts",
      },
      {
        name: "Performance Management",
        description: "Evaluating and improving employee performance",
      },
      {
        name: "Training & Development",
        description: "Employee skill building and career growth",
      },

      // Design & UX
      {
        name: "UI/UX Design",
        description: "User interface and experience design",
      },
      {
        name: "Figma",
        description: "Collaborative design and prototyping tool",
      },
      {
        name: "Adobe Creative Suite",
        description: "Collection of design and multimedia software",
      },
      {
        name: "Prototyping",
        description: "Creating interactive design mockups",
      },
      {
        name: "User Research",
        description: "Understanding user needs and behaviors",
      },

      // Business & Soft Skills
      {
        name: "Project Management",
        description: "Planning and executing projects effectively",
      },
      {
        name: "Agile Methodology",
        description: "Iterative approach to software development",
      },
      { name: "Leadership", description: "Guiding and motivating teams" },
      {
        name: "Communication",
        description: "Effective verbal and written communication",
      },
      {
        name: "Problem Solving",
        description: "Analytical thinking and solution finding",
      },
      {
        name: "Team Collaboration",
        description: "Working effectively with others",
      },
      {
        name: "Customer Service",
        description: "Supporting and assisting customers",
      },
      {
        name: "Public Speaking",
        description: "Presenting to audiences effectively",
      },

      // Healthcare & Medical
      {
        name: "Patient Care",
        description: "Providing medical care and support to patients",
      },
      {
        name: "Medical Coding",
        description: "Assigning codes to medical diagnoses and procedures",
      },
      {
        name: "Electronic Health Records (EHR)",
        description: "Digital patient record management",
      },
      {
        name: "Clinical Research",
        description: "Conducting medical studies and trials",
      },

      // Legal
      {
        name: "Legal Research",
        description: "Researching laws, regulations, and case precedents",
      },
      {
        name: "Contract Negotiation",
        description: "Drafting and negotiating legal agreements",
      },
      {
        name: "Regulatory Compliance",
        description: "Ensuring adherence to laws and regulations",
      },

      // Operations & Supply Chain
      {
        name: "Supply Chain Management",
        description: "Coordinating production and distribution networks",
      },
      {
        name: "Inventory Management",
        description: "Optimizing stock levels and warehouse operations",
      },
      {
        name: "Quality Assurance",
        description: "Ensuring products meet quality standards",
      },
      {
        name: "Process Improvement",
        description: "Optimizing business processes for efficiency",
      },
    ];

    const skillIds = [];
    for (const skill of skills) {
      const id = await ctx.db.insert("skills", skill);
      skillIds.push(id);
    }

    return { message: "Skills seeded successfully", count: skillIds.length };
  },
});

// Companies
export const seedCompanies = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    // Get industries first
    const industries = await ctx.db.query("industries").collect();
    if (industries.length === 0) {
      throw new Error("No industries found. Please seed industries first.");
    }

    const techIndustry = industries.find(
      (i) => i.name === "Software Development"
    )?._id;
    const financeIndustry = industries.find((i) => i.name === "Fintech")?._id;
    const healthcareIndustry = industries.find(
      (i) => i.name === "Healthcare Technology"
    )?._id;
    const ecommerceIndustry = industries.find(
      (i) => i.name === "E-commerce"
    )?._id;

    const companies = [
      {
        name: "TechCorp Solutions",
        description:
          "Leading software development company specializing in enterprise solutions",
        logo: "https://example.com/techcorp-logo.png",
        website: "https://techcorp.com",
        industryId: techIndustry,
        size: "201-500",
        location: "San Francisco, CA",
        foundedYear: 2015,
      },
      {
        name: "FinanceFlow",
        description: "Modern fintech company revolutionizing digital payments",
        logo: "https://example.com/financeflow-logo.png",
        website: "https://financeflow.com",
        industryId: financeIndustry,
        size: "51-200",
        location: "New York, NY",
        foundedYear: 2018,
      },
      {
        name: "HealthTech Innovations",
        description:
          "Healthcare technology solutions for modern medical practices",
        logo: "https://example.com/healthtech-logo.png",
        website: "https://healthtech-innovations.com",
        industryId: healthcareIndustry,
        size: "11-50",
        location: "Boston, MA",
        foundedYear: 2020,
      },
      {
        name: "ShopSmart",
        description: "AI-powered e-commerce platform for small businesses",
        logo: "https://example.com/shopsmart-logo.png",
        website: "https://shopsmart.com",
        industryId: ecommerceIndustry,
        size: "101-200",
        location: "Austin, TX",
        foundedYear: 2017,
      },
      {
        name: "DataDrive Analytics",
        description: "Big data analytics and machine learning solutions",
        logo: "https://example.com/datadrive-logo.png",
        website: "https://datadrive.com",
        industryId: techIndustry,
        size: "51-200",
        location: "Seattle, WA",
        foundedYear: 2019,
      },
    ];

    const companyIds = [];
    for (const company of companies) {
      const id = await ctx.db.insert("companies", company);
      companyIds.push(id);
    }

    return {
      message: "Companies seeded successfully",
      count: companyIds.length,
    };
  },
});

// Jobs
export const seedJobs = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    // Get companies and users
    const companies = await ctx.db.query("companies").collect();
    const users = await ctx.db.query("users").collect();

    if (companies.length === 0) {
      throw new Error("No companies found. Please seed companies first.");
    }
    if (users.length === 0) {
      throw new Error("No users found. Please create at least one user first.");
    }

    const posterUserId = users[0]._id; // Use first user as job poster

    const jobs = [
      {
        title: "Senior Full Stack Developer",
        description:
          "We're looking for an experienced full stack developer to join our growing team. You'll work on cutting-edge web applications using React, Node.js, and modern cloud technologies.",
        companyId: companies[0]._id,
        location: "San Francisco, CA",
        type: "full-time",
        salary: {
          min: 120000,
          max: 180000,
          currency: "USD",
        },
        requirements: [
          "5+ years of experience with React and Node.js",
          "Experience with cloud platforms (AWS, GCP, or Azure)",
          "Strong understanding of database design",
          "Experience with CI/CD pipelines",
        ],
        benefits: [
          "Health insurance",
          "401k matching",
          "Flexible PTO",
          "Remote work options",
        ],
        postedBy: posterUserId,
        isActive: true,
        createdAt: Date.now(),
        applicationDeadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
      },
      {
        title: "Product Manager",
        description:
          "Join our product team to drive the development of innovative fintech solutions.",
        companyId: companies[1]._id,
        location: "New York, NY",
        type: "full-time",
        salary: {
          min: 110000,
          max: 160000,
          currency: "USD",
        },
        requirements: [
          "3+ years of product management experience",
          "Experience in fintech or financial services",
          "Strong analytical and communication skills",
        ],
        benefits: [
          "Comprehensive health coverage",
          "Stock options",
          "Professional development budget",
        ],
        postedBy: posterUserId,
        isActive: true,
        createdAt: Date.now(),
      },
      {
        title: "UX/UI Designer",
        description:
          "Create beautiful and intuitive user experiences for our healthcare platform.",
        companyId: companies[2]._id,
        location: "Boston, MA",
        type: "full-time",
        salary: {
          min: 80000,
          max: 120000,
          currency: "USD",
        },
        requirements: [
          "3+ years of UX/UI design experience",
          "Proficiency in Figma, Sketch, or similar tools",
          "Experience with user research and testing",
        ],
        benefits: [
          "Health insurance",
          "Flexible hours",
          "Design conference budget",
        ],
        postedBy: posterUserId,
        isActive: true,
        createdAt: Date.now(),
      },
    ];

    const jobIds = [];
    for (const job of jobs) {
      const id = await ctx.db.insert("jobs", job);
      jobIds.push(id);
    }

    return { message: "Jobs seeded successfully", count: jobIds.length };
  },
});

// User Skills (Junction table)
export const seedUserSkills = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const users = await ctx.db.query("users").collect();
    const skills = await ctx.db.query("skills").collect();

    if (users.length === 0 || skills.length === 0) {
      throw new Error(
        "Users and skills must exist before seeding user skills."
      );
    }

    const userSkills = [];

    // Add some skills to each user
    for (const user of users.slice(0, 3)) {
      // Only first 3 users
      const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 5);

      for (const skill of randomSkills) {
        userSkills.push({
          userId: user._id,
          skillId: skill._id,
        });
      }
    }

    const userSkillIds = [];
    for (const userSkill of userSkills) {
      const id = await ctx.db.insert("userSkills", userSkill);
      userSkillIds.push(id);
    }

    return {
      message: "User skills seeded successfully",
      count: userSkillIds.length,
    };
  },
});

// Job Skills (Junction table)
export const seedJobSkills = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const jobs = await ctx.db.query("jobs").collect();
    const skills = await ctx.db.query("skills").collect();

    if (jobs.length === 0 || skills.length === 0) {
      throw new Error("Jobs and skills must exist before seeding job skills.");
    }

    const jobSkills = [];

    // Add relevant skills to each job
    for (const job of jobs) {
      let relevantSkills: typeof skills = [];

      if (job.title.includes("Developer")) {
        relevantSkills = skills.filter((s) =>
          ["JavaScript", "React", "Node.js", "Python", "SQL"].includes(s.name)
        );
      } else if (job.title.includes("Designer")) {
        relevantSkills = skills.filter((s) =>
          [
            "UI/UX Design",
            "Figma",
            "Adobe Creative Suite",
            "Prototyping",
          ].includes(s.name)
        );
      } else if (job.title.includes("Product Manager")) {
        relevantSkills = skills.filter((s) =>
          [
            "Project Management",
            "Agile Methodology",
            "Communication",
            "Leadership",
          ].includes(s.name)
        );
      }

      for (const skill of relevantSkills) {
        jobSkills.push({
          jobId: job._id,
          skillId: skill._id,
        });
      }
    }

    const jobSkillIds = [];
    for (const jobSkill of jobSkills) {
      const id = await ctx.db.insert("jobSkills", jobSkill);
      jobSkillIds.push(id);
    }

    return {
      message: "Job skills seeded successfully",
      count: jobSkillIds.length,
    };
  },
});

// Experiences
export const seedExperiences = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const users = await ctx.db.query("users").collect();
    const companies = await ctx.db.query("companies").collect();

    if (users.length === 0) {
      throw new Error("Users must exist before seeding experiences.");
    }

    const experiences = [];

    // Add work experiences to first few users
    for (const user of users.slice(0, 3)) {
      experiences.push(
        {
          userId: user._id,
          companyId: companies.length > 0 ? companies[0]._id : undefined,
          title: "Software Engineer",
          companyName:
            companies.length > 0 ? companies[0].name : "Tech Company Inc",
          description: "Developed web applications using modern technologies",
          startDate: "2022-01",
          endDate: "2024-01",
          location: "San Francisco, CA",
          isCurrent: false,
        },
        {
          userId: user._id,
          companyId: companies.length > 1 ? companies[1]._id : undefined,
          title: "Senior Software Engineer",
          companyName:
            companies.length > 1 ? companies[1].name : "Current Company",
          description: "Leading development of fintech solutions",
          startDate: "2024-02",
          endDate: undefined,
          location: "New York, NY",
          isCurrent: true,
        }
      );
    }

    const experienceIds = [];
    for (const experience of experiences) {
      const id = await ctx.db.insert("experiences", experience);
      experienceIds.push(id);
    }

    return {
      message: "Experiences seeded successfully",
      count: experienceIds.length,
    };
  },
});

export const clearAllTables = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    // Clear in reverse dependency order
    const experiences = await ctx.db.query("experiences").collect();
    for (const exp of experiences) {
      await ctx.db.delete(exp._id);
    }

    const jobSkills = await ctx.db.query("jobSkills").collect();
    for (const js of jobSkills) {
      await ctx.db.delete(js._id);
    }

    const userSkills = await ctx.db.query("userSkills").collect();
    for (const us of userSkills) {
      await ctx.db.delete(us._id);
    }

    const jobApplications = await ctx.db.query("jobApplications").collect();
    for (const ja of jobApplications) {
      await ctx.db.delete(ja._id);
    }

    const jobs = await ctx.db.query("jobs").collect();
    for (const job of jobs) {
      await ctx.db.delete(job._id);
    }

    const companies = await ctx.db.query("companies").collect();
    for (const company of companies) {
      await ctx.db.delete(company._id);
    }

    const skills = await ctx.db.query("skills").collect();
    for (const skill of skills) {
      await ctx.db.delete(skill._id);
    }

    const industries = await ctx.db.query("industries").collect();
    for (const industry of industries) {
      await ctx.db.delete(industry._id);
    }

    const complaints = await ctx.db.query("complaints").collect();
    for (const complaint of complaints) {
      await ctx.db.delete(complaint._id);
    }

    return { message: "All tables cleared successfully" };
  },
});

// // Run in order due to dependencies
// await ctx.runMutation(internal.seed.seedIndustries, {});
// await ctx.runMutation(internal.seed.seedSkills, {});
// await ctx.runMutation(internal.seed.seedCompanies, {});
// await ctx.runMutation(internal.seed.seedJobs, {});
// await ctx.runMutation(internal.seed.seedUserSkills, {});
// await ctx.runMutation(internal.seed.seedJobSkills, {});
// await ctx.runMutation(internal.seed.seedExperiences, {});
export const runAll = internalMutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    await ctx.runMutation(internal.seed.clearAllTables, {});

    await ctx.runMutation(internal.seed.seedIndustries, {});
    await ctx.runMutation(internal.seed.seedSkills, {});
    await ctx.runMutation(internal.seed.seedCompanies, {});
    await ctx.runMutation(internal.seed.seedJobs, {});
    await ctx.runMutation(internal.seed.seedUserSkills, {});
    await ctx.runMutation(internal.seed.seedJobSkills, {});
    await ctx.runMutation(internal.seed.seedExperiences, {});

    return { message: "All seed data created successfully!" };
  },
});
