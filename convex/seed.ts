// convex/seed.ts
import { v } from "convex/values";
import { internal } from "./_generated/api"; // Add this import
import {
  action,
  internalMutation,
  type MutationCtx,
} from "./_generated/server";

const SVG_LOGOS = [
  `<svg width="49" height="40" viewBox="0 0 49 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.9727 0L29.687 3.92858L25.6129 7.32367C25.2421 7.63271 24.7034 7.63271 24.3325 7.32367L20.2585 3.92858L24.9727 0Z" fill="#00067F"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.3325 11.3545C24.7034 11.6635 25.2421 11.6635 25.6129 11.3545L32.1054 5.94397L35.8399 9.05606L27.5335 15.9782C26.0501 17.2143 23.8954 17.2143 22.412 15.9782L14.1055 9.05606L17.84 5.94397L24.3325 11.3545Z" fill="#00067F"></path>
<path d="M24.9727 40L20.2585 36.0714L24.3325 32.6763C24.7034 32.3673 25.2421 32.3673 25.6129 32.6763L29.687 36.0714L24.9727 40Z" fill="#00067F"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M25.6129 28.6455C25.2421 28.3365 24.7034 28.3365 24.3325 28.6455L17.84 34.056L14.1055 30.9439L22.412 24.0218C23.8954 22.7857 26.0501 22.7857 27.5335 24.0218L35.8399 30.9439L32.1054 34.056L25.6129 28.6455Z" fill="#00067F"></path>
<path d="M48.9727 20L44.2584 16.0714L40.466 19.2318C39.9862 19.6316 39.9862 20.3684 40.466 20.7682L44.2584 23.9286L48.9727 20Z" fill="#00067F"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M35.6291 20.7682C35.1493 20.3684 35.1493 19.6316 35.6291 19.2318L41.8399 14.056L38.1054 10.9439L30.9257 16.9271C29.0067 18.5263 29.0067 21.4737 30.9257 23.0729L38.1054 29.0561L41.8399 25.944L35.6291 20.7682Z" fill="#00067F"></path>
<path d="M0.972656 20.0001L5.68692 23.9287L9.47933 20.7683C9.95909 20.3685 9.95909 19.6317 9.47933 19.2319L5.68692 16.0715L0.972656 20.0001Z" fill="#00067F"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.3162 19.2319C14.796 19.6317 14.796 20.3685 14.3163 20.7683L8.10538 25.9441L11.8399 29.0562L19.0196 23.073C20.9386 21.4738 20.9386 18.5264 19.0196 16.9272L11.8399 10.944L8.10538 14.0561L14.3162 19.2319Z" fill="#00067F"></path>
</svg>`,
  `<svg width="51" height="40" viewBox="0 0 51 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.446 0L22.7801 8.82887C23.3936 9.35302 23.7473 10.1222 23.7473 10.9323V17.5862L13.4131 8.75734C12.7996 8.23319 12.446 7.464 12.446 6.65386V0Z" fill="#7B19D8"></path>
<path d="M12.446 40L22.7801 31.1711C23.3936 30.647 23.7473 29.8778 23.7473 29.0677V22.4138L13.4131 31.2427C12.7996 31.7668 12.446 32.536 12.446 33.3461V40Z" fill="#7B19D8"></path>
<path d="M0.117188 9.31034L10.3108 17.9705C10.805 18.3904 11.4308 18.6207 12.0775 18.6207H20.2982L10.1297 9.96253C9.63514 9.54141 9.00837 9.31034 8.36065 9.31034H0.117188Z" fill="#7B19D8"></path>
<path d="M0.117188 30.6897L10.2481 22.0345C10.7432 21.6115 11.3713 21.3793 12.0206 21.3793H20.3227L10.1291 30.0394C9.63487 30.4593 9.00904 30.6897 8.36236 30.6897H0.117188Z" fill="#7B19D8"></path>
<path d="M37.7884 0L27.4542 8.82887C26.8407 9.35302 26.4871 10.1222 26.4871 10.9323V17.5862L36.8212 8.75734C37.4347 8.23319 37.7884 7.464 37.7884 6.65386V0Z" fill="#7B19D8"></path>
<path d="M37.7884 40L27.4542 31.1711C26.8407 30.647 26.4871 29.8778 26.4871 29.0677V22.4138L36.8212 31.2427C37.4347 31.7668 37.7884 32.536 37.7884 33.3461V40Z" fill="#7B19D8"></path>
<path d="M50.1172 9.31034L39.9236 17.9705C39.4294 18.3904 38.8035 18.6207 38.1569 18.6207H29.9361L40.1047 9.96253C40.5992 9.54141 41.226 9.31034 41.8737 9.31034H50.1172Z" fill="#7B19D8"></path>
<path d="M50.1172 30.6897L39.9863 22.0345C39.4912 21.6115 38.863 21.3793 38.2137 21.3793H29.9117L40.1052 30.0394C40.5995 30.4593 41.2253 30.6897 41.872 30.6897H50.1172Z" fill="#7B19D8"></path>
</svg>`,
  `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.343 2.65705L20 0L40 20L20 40L17.3429 37.3429L34.6859 20L17.343 2.65705Z" fill="#D41C1C"></path>
<path d="M13.8744 6.12564L16.5314 3.46859L33.0628 20L16.5314 36.5314L13.8744 33.8744L27.7487 20L13.8744 6.12564Z" fill="#D41C1C"></path>
<path d="M0 20L13.0628 6.93718L26.1256 20L13.0628 33.0628L10.4058 30.4058L20.8115 20L13.0628 12.2513L2.65705 22.657L0 20Z" fill="#D41C1C"></path>
<path d="M13.0628 13.8744L10.4058 16.5314L13.8744 20L6.93718 26.9372L9.59422 29.5942L19.1885 20L13.0628 13.8744Z" fill="#D41C1C"></path>
<path d="M6.12564 26.1256L3.46859 23.4686L9.56643 17.3708L12.2235 20.0278L6.12564 26.1256Z" fill="#D41C1C"></path>
</svg>`,
  `<svg width="36" height="41" viewBox="0 0 36 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.88822 2.95639V0.521606H0.322998V2.95639V8.17378V17.2173V22.7825V22.9564C0.322998 32.6574 8.18721 40.5216 17.8882 40.5216C27.5892 40.5216 35.4534 32.6574 35.4534 22.9564V22.7825V17.2173V8.17378V2.95639V0.521606H29.8882V2.95639H20.4969V2.60856V0.521606H14.9317V2.60856V2.95639H5.88822ZM14.9317 34.5894C9.78296 33.2849 5.96086 28.652 5.88924 23.1147C6.48236 23.2584 7.06484 23.4481 7.63125 23.6827C9.06606 24.277 10.3698 25.1481 11.4679 26.2463C12.5661 27.3444 13.4372 28.6481 14.0315 30.0829C14.6234 31.5118 14.9292 33.0429 14.9317 34.5894ZM15.4031 22.3111C16.2746 23.1825 17.0488 24.142 17.7143 25.1723C18.3798 24.142 19.154 23.1825 20.0255 22.3111C20.8969 21.4396 21.8564 20.6654 22.8867 19.9999C21.8564 19.3344 20.8969 18.5601 20.0255 17.6887C19.154 16.8172 18.3798 15.8578 17.7143 14.8275C17.0488 15.8578 16.2746 16.8172 15.4031 17.6887C14.5317 18.5601 13.5722 19.3344 12.5419 19.9999C13.5722 20.6654 14.5317 21.4396 15.4031 22.3111ZM29.888 23.0359C29.851 28.7322 25.8451 33.4865 20.4969 34.672V34.6086C20.4969 33.0555 20.8028 31.5177 21.3971 30.0829C21.9914 28.6481 22.8625 27.3444 23.9607 26.2463C25.0588 25.1481 26.3625 24.277 27.7974 23.6827C28.4744 23.4023 29.1743 23.186 29.888 23.0359ZM14.5098 8.52161C14.3799 8.99519 14.2202 9.4612 14.0315 9.91682C13.4372 11.3516 12.5661 12.6553 11.4679 13.7535C10.3698 14.8516 9.06606 15.7227 7.63125 16.3171C7.06451 16.5518 6.48169 16.7416 5.88822 16.8852V8.52161H14.5098ZM29.8882 16.9639V8.52161H20.9188C21.0488 8.99519 21.2084 9.4612 21.3971 9.91682C21.9914 11.3516 22.8625 12.6553 23.9607 13.7535C25.0588 14.8516 26.3625 15.7227 27.7974 16.3171C28.4744 16.5975 29.1745 16.8137 29.8882 16.9639Z" fill="#09C382"></path>
</svg>`,
  `<svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.4554 2.43478V0H35V22.4348C35 32.1358 27.165 40 17.5 40C8.24271 40 0.664262 32.7853 0.0413736 23.6522H0V0H5.54455V2.43478L14.901 2.43478V0H20.4455V2.43478L29.4554 2.43478ZM29.4554 22.4348V19.0202C28.8318 19.6656 28.1633 20.2785 27.4539 20.8558C25.1121 22.7615 22.3612 24.2503 19.369 25.2589C16.3764 26.2677 13.1833 26.7826 9.96797 26.7826H6.35343C8.08848 31.2608 12.425 34.4348 17.5 34.4348C24.1028 34.4348 29.4554 29.0622 29.4554 22.4348ZM15.4269 18.2435C14.3706 19.3674 13.18 20.3419 11.8852 21.1425C13.8545 20.9882 15.7827 20.5971 17.6038 19.9833C20.013 19.1712 22.1698 17.9913 23.9621 16.5329C25.7535 15.075 27.136 13.3757 28.0645 11.5515C28.6507 10.3998 29.0518 9.20727 29.2674 8H20.2671C20.0641 9.47968 19.6891 10.9319 19.1475 12.3231C18.2893 14.5274 17.0275 16.5405 15.4269 18.2435ZM5.54455 17.8146V8H14.6483C14.4948 8.78546 14.2724 9.55482 13.9832 10.2975C13.3786 11.8506 12.4962 13.2517 11.3938 14.4246C10.2918 15.5971 8.99228 16.518 7.57404 17.143C6.91535 17.4333 6.23601 17.6576 5.54455 17.8146Z" fill="#1D3AA7"></path>
</svg>`,
];

// Helper function to create blob from SVG string
function createSVGBlob(svgString: string): Blob {
  return new Blob([svgString], { type: "image/svg+xml" });
}

function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

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
        website: "https://techcorp.com",
        industryId: techIndustry,
        size: "201-500",
        location: "San Francisco, CA",
        foundedYear: 2015,
      },
      {
        name: "FinanceFlow",
        description: "Modern fintech company revolutionizing digital payments",
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
        website: "https://healthtech-innovations.com",
        industryId: healthcareIndustry,
        size: "11-50",
        location: "Boston, MA",
        foundedYear: 2020,
      },
      {
        name: "ShopSmart",
        description: "AI-powered e-commerce platform for small businesses",
        website: "https://shopsmart.com",
        industryId: ecommerceIndustry,
        size: "101-200",
        location: "Austin, TX",
        foundedYear: 2017,
      },
      {
        name: "DataDrive Analytics",
        description: "Big data analytics and machine learning solutions",
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

export const uploadSVGLogos = action({
  args: {},
  handler: async (ctx) => {
    const storageIds: string[] = [];
    for (const svgString of SVG_LOGOS) {
      const svgBlob = createSVGBlob(svgString);
      const storageId = await ctx.storage.store(svgBlob);
      storageIds.push(storageId);
    }
    return { storageIds };
  },
});

export const assignRandomLogosToCompanies = internalMutation({
  args: {
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const companies = await ctx.db.query("companies").collect();
    for (const company of companies) {
      const randomLogoId =
        args.storageIds[Math.floor(Math.random() * args.storageIds.length)];
      await ctx.db.patch(company._id, {
        logo: randomLogoId,
      });
    }
    return { message: "Random logos assigned to companies." };
  },
});
