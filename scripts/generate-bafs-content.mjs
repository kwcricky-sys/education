/**
 * Generates src/data/dse/bafs-lessons.json and bafs-drills.json for the BAFS learn path.
 * Run: node scripts/generate-bafs-content.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../src/data/dse");

const UNITS = [
  {
    id: 1,
    topic: "business-environment",
    abbr: "BENV",
    lessons: [
      {
        id: "L1.1",
        title: "Business Environment & Stakeholders",
        concept:
          "The business environment includes all external and internal factors that affect how a firm operates and performs. External factors are often grouped into economic, social, technological, legal and political forces (commonly remembered as PEST or PESTEL when environmental concerns are added). Internal factors include resources, culture, leadership and systems inside the firm. Stakeholders are individuals or groups that have an interest in, or are affected by, business decisions — for example owners, employees, customers, suppliers, lenders, government and the community. In HKDSE BAFS, you must distinguish between stakeholders and shareholders: shareholders own shares and focus on returns, while stakeholders is the wider group. Conflicts among stakeholders arise when one group's benefit reduces another's (e.g. higher wages vs. lower profit). Sustainable businesses balance profit with social and environmental responsibilities. When analysing a case, list stakeholders, state their objectives, and explain how a decision helps or harms each group.",
        example: {
          scenario:
            "A Hong Kong café chain plans to replace disposable cups with a deposit-return reusable cup scheme, raising drink prices by $2.",
          walkthrough:
            "Customers face higher prices but less waste; employees may need training on the new system; suppliers of disposable cups lose sales while reusable cup suppliers gain; owners worry about short-run profit but may gain brand image; the community benefits from less landfill. In an exam answer, identify at least four stakeholder groups, link the policy to each group's interest, and note one trade-off (e.g. profit vs. environment).",
        },
        traps: [
          "Treating 'shareholders' and 'stakeholders' as identical — shareholders are only one stakeholder group.",
          "Listing only external PEST factors and ignoring internal resources or culture.",
          "Claiming all stakeholders always want the same outcome from a business decision.",
        ],
        terms: [
          { term: "Stakeholder", definition: "Any person or group affected by or interested in the activities of a business." },
          { term: "Shareholder", definition: "An owner of shares in a company, entitled to dividends and voting rights." },
          { term: "Business environment", definition: "All internal and external factors influencing business operations and performance." },
        ],
      },
      {
        id: "L1.2",
        title: "PEST Analysis in Hong Kong Context",
        concept:
          "PEST analysis structures external forces into Political, Economic, Social and Technological categories. Political factors include government policy, taxation, labour law and regulation — in Hong Kong, examples include minimum wage, food safety licensing and competition policy. Economic factors include inflation, interest rates, exchange rates (linked exchange rate system), unemployment and consumer spending. Social factors cover demographics, lifestyle trends, education levels and attitudes to work. Technological factors include e-commerce platforms, mobile payment, automation and data analytics. In exams, do not merely list factors; explain the mechanism: how does the factor change costs, demand or risk for the firm? Link to a specific industry (retail, tourism, F&B) when possible. PEST is descriptive; it does not by itself recommend a strategy — it supports SWOT's opportunities and threats.",
        example: {
          scenario: "Interest rates in Hong Kong rise because US rates rise under the currency board arrangement.",
          walkthrough:
            "Higher rates increase loan repayments for mortgage holders, reducing disposable income — F&B and retail may see softer demand. Firms with heavy bank borrowing face higher finance costs, squeezing net profit. Property-related businesses may slow. A complete answer names the economic factor, traces the effect on customers and the firm, and states one management implication (e.g. postpone expansion).",
        },
        traps: [
          "Putting 'high rent' only under political — rent is usually economic/market, unless linked to a specific government land policy.",
          "Listing factors without explaining impact on the business in the case.",
          "Confusing PEST with SWOT — PEST is external macro scanning only.",
        ],
        terms: [
          { term: "PEST analysis", definition: "A framework classifying Political, Economic, Social and Technological external factors." },
          { term: "Linked exchange rate", definition: "HKD pegged to USD within a band; US rate changes often pass through to HK rates." },
        ],
      },
      {
        id: "L1.3",
        title: "CSR, Ethics & Sustainability",
        concept:
          "Corporate social responsibility (CSR) means businesses voluntarily taking responsibility for impacts on society and the environment beyond legal minimums. Ethical behaviour follows moral principles such as honesty, fairness and respect for rights. Sustainability balances economic growth with environmental protection and social well-being so resources remain available for future generations. HKDSE cases often ask whether a firm should adopt a CSR project when short-run profit falls. Strong answers compare short-run cost with long-run benefits: brand loyalty, employee motivation, lower regulatory risk and access to ethical investors. Greenwashing — claiming environmental benefits without real action — damages reputation if exposed. Codes of ethics and whistle-blowing policies help internal compliance. Remember: legal compliance is mandatory; CSR is often strategic choice, though some reporting is increasingly required.",
        example: {
          scenario:
            "A local fashion retailer is caught using a supplier that violates labour standards overseas.",
          walkthrough:
            "Customers and media stakeholders punish the brand; employees feel demoralised; regulators may investigate. Ethical sourcing and supplier audits are preventive CSR. The firm should disclose remediation steps. Exam marks come from linking ethics to stakeholder trust and long-run revenue, not only saying 'it is wrong'.",
        },
        traps: [
          "Assuming CSR always reduces profit — long-run effects can be positive.",
          "Equating legality with ethics — legal actions can still be unethical.",
          "Ignoring reputational damage as a quantifiable business risk.",
        ],
        terms: [
          { term: "CSR", definition: "Corporate social responsibility — voluntary actions to address social and environmental impacts." },
          { term: "Greenwashing", definition: "Misleading promotion that exaggerates environmental friendliness." },
        ],
      },
    ],
  },
  {
    id: 2,
    topic: "forms-of-business",
    abbr: "FORM",
    lessons: [
      {
        id: "L2.1",
        title: "Sole Proprietorship & Partnership",
        concept:
          "A sole proprietorship is owned by one person who receives all profit and bears unlimited liability — personal assets can settle business debts. It is easy to set up and has simple tax treatment, but capital raising is limited and continuity ends if the owner retires or dies. A partnership involves two or more owners sharing profit according to an agreement; partners often face unlimited liability unless a limited partnership structure applies to silent partners. Partnerships pool skills and capital but may suffer from disagreements and joint liability for another partner's wrongful acts in a general partnership. Registration with the Business Registration Office is required in Hong Kong for carrying on business. In comparisons, always state liability, continuity, control, capital and privacy of financial information.",
        example: {
          scenario: "Two friends open a tutorial centre as a general partnership without a written agreement.",
          walkthrough:
            "Both have unlimited liability if the centre cannot pay rent. If one partner signs a bad lease, the other may still be liable. Profit sharing defaults to equal shares unless agreed. Advice: partnership deed covering capital, profit share, dispute resolution and exit. Exam answers should recommend written agreements and compare with incorporation for growth.",
        },
        traps: [
          "Thinking limited liability applies to general partners — it does not.",
          "Forgetting that sole proprietors and partners pay profits tax on individuals, not profits tax on companies.",
          "Assuming partnerships must have equal shares — depends on agreement.",
        ],
        terms: [
          { term: "Unlimited liability", definition: "Owners are personally responsible for all business debts beyond invested capital." },
          { term: "Partnership deed", definition: "A written agreement setting out partners' rights, duties and profit sharing." },
        ],
      },
      {
        id: "L2.2",
        title: "Private & Public Companies",
        concept:
          "A company is a separate legal entity from its owners; shareholders enjoy limited liability (generally only the amount unpaid on shares). A private company restricts share transfer and cannot offer shares to the public; a public company may list on the stock exchange and raise capital from the public but faces heavier disclosure and governance rules. Companies pay profits tax on assessable profits; dividends are then received by shareholders. Continuity is strong because ownership can change without stopping operations. Agency problems may arise when managers (agents) pursue their own goals instead of maximising shareholder wealth — boards and audits monitor this. When choosing a form of business, link to size, risk, need for capital and desire for limited liability.",
        example: {
          scenario: "A successful HK restaurant group wants to expand to 20 outlets and raise $50 million.",
          walkthrough:
            "Sole proprietorship cannot easily raise that capital. A private company can issue shares to investors while keeping control if shares are closely held; listing as a public company opens the equity market but increases reporting costs. Answer should mention separate legal personality, limited liability and IPO disclosure.",
        },
        traps: [
          "Saying shareholders always run daily operations — often professional managers do.",
          "Confusing private company with sole proprietorship — both can be 'small' but liability differs.",
          "Ignoring ongoing compliance costs of a listed company.",
        ],
        terms: [
          { term: "Separate legal entity", definition: "A company can own property, sue and be sued in its own name." },
          { term: "Limited liability", definition: "Shareholders' loss is generally limited to their investment in shares." },
        ],
      },
    ],
  },
  {
    id: 3,
    topic: "management",
    abbr: "MGMT",
    lessons: [
      {
        id: "L3.1",
        title: "Planning & Organising",
        concept:
          "Management functions are commonly planning, organising, leading and controlling (POLC). Planning sets objectives and decides how to achieve them — strategic planning is long-term and firm-wide; operational planning is short-term and departmental. SWOT supports planning by matching internal strengths and weaknesses with external opportunities and threats. Organising arranges resources: designing jobs, grouping tasks into departments, delegating authority and establishing reporting lines. An organisation chart shows hierarchy and span of control. Centralisation keeps decisions at the top; decentralisation pushes decisions closer to front-line staff, improving responsiveness but requiring training. In HKDSE, relate POLC to a scenario: after a plan is set, organising allocates people and budget; leading motivates; controlling checks KPIs against plan.",
        example: {
          scenario: "A logistics firm sets a goal to cut delivery time by 15% within one year.",
          walkthrough:
            "Planning: analyse routes and warehouse layout. Organising: create a route optimisation team, delegate authority to regional managers. Leading: incentivise drivers. Controlling: monthly KPI on average delivery time vs. target. Weak answers list POLC definitions without applying to the 15% goal.",
        },
        traps: [
          "Treating SWOT as a strategy by itself — it is an analysis tool.",
          "Confusing organising with leading — organising is structure; leading is people motivation.",
          "Ignoring feedback loop — controlling should lead to revised planning.",
        ],
        terms: [
          { term: "Span of control", definition: "The number of subordinates directly supervised by one manager." },
          { term: "Delegation", definition: "Assigning authority and responsibility to subordinates to carry out tasks." },
        ],
      },
      {
        id: "L3.2",
        title: "Leading & Motivation Theories",
        concept:
          "Leading influences people to work towards objectives through communication, example and motivation. Motivation theories help explain what drives effort. Maslow's hierarchy suggests needs from physiological to self-actualisation — lower needs must be reasonably satisfied before higher ones dominate. Herzberg's two-factor theory separates hygiene factors (prevent dissatisfaction, e.g. pay, conditions) from motivators (achievement, recognition). McGregor's Theory X assumes workers dislike work and need control; Theory Y assumes workers can be self-directed. In practice, HK firms combine financial incentives (commission, bonus) with non-financial (flexible hours, training). Leadership styles include autocratic, democratic and laissez-faire — effective style depends on urgency, team skill and culture.",
        example: {
          scenario: "Retail staff morale is low after mandatory weekend shifts without extra pay.",
          walkthrough:
            "Hygiene factor (fair pay/scheduling) is violated, causing dissatisfaction. Motivators like employee-of-the-month may fail until hygiene is fixed. Democratic discussion of rosters and occasional shift premiums address both. Link theory name to action in the case.",
        },
        traps: [
          "Stating Maslow levels in order without linking to the firm's policy.",
          "Calling pay a motivator in Herzberg's terms — basic pay is usually hygiene.",
          "Assuming one leadership style is always best.",
        ],
        terms: [
          { term: "Hygiene factors", definition: "Herzberg factors that prevent dissatisfaction but do not strongly motivate." },
          { term: "Theory Y", definition: "Assumes employees can be committed and self-controlled under the right conditions." },
        ],
      },
      {
        id: "L3.3",
        title: "Controlling & Quality Management",
        concept:
          "Controlling measures performance against standards and corrects deviations. Steps: set standards, measure actual performance, compare, take corrective action. Standards may be financial (budgets) or non-financial (defect rate, customer complaints). Total quality management (TQM) embeds quality in every process, emphasising continuous improvement and customer focus. ISO certification signals systematic quality management. Control is not only punishment — it includes training and process redesign. Over-tight control can demotivate; too loose control risks fraud or inconsistency. In BAFS exams, controlling often appears after expansion or new product launch — suggest KPIs and review frequency.",
        example: {
          scenario: "A bakery's monthly food cost exceeds budget by 8%.",
          walkthrough:
            "Compare actual vs. standard food cost percentage, investigate waste, theft or recipe changes, adjust purchasing or training. If only blaming staff without measurement, controlling is incomplete. Mention feedback to planning (revise recipes or prices).",
        },
        traps: [
          "Equating controlling with firing staff — corrective action has many forms.",
          "Using only financial measures when quality is the issue.",
          "Skipping the comparison step — measuring alone is not controlling.",
        ],
        terms: [
          { term: "TQM", definition: "Total quality management — organisation-wide pursuit of quality and continuous improvement." },
          { term: "KPI", definition: "Key performance indicator — a measurable value showing how effectively objectives are met." },
        ],
      },
    ],
  },
  {
    id: 4,
    topic: "marketing",
    abbr: "MKTG",
    lessons: [
      {
        id: "L4.1",
        title: "Marketing Mix (4Ps)",
        concept:
          "Marketing identifies customer needs and satisfies them profitably. The marketing mix (4Ps) is product, price, place and promotion. Product decisions cover features, branding, packaging, warranty and product life cycle stage. Price includes list price, discounts, psychological pricing and response to elasticity. Place (distribution) covers channels — shops, online, wholesalers — and logistics. Promotion covers advertising, sales promotion, public relations and personal selling. Extended mixes add people, process and physical evidence for services. In Hong Kong, digital promotion and e-commerce platforms are central for many SMEs. A coherent mix means elements support each other: premium product with high price and selective distribution, not discount stores.",
        example: {
          scenario: "A HK skincare brand launches a premium anti-ageing line targeting office workers.",
          walkthrough:
            "Product: differentiated formula and elegant packaging. Price: skimming strategy. Place: department stores and official website. Promotion: social media influencers and sampling. Explain why discount hypermarkets would harm positioning.",
        },
        traps: [
          "Listing 4Ps without linking to target market.",
          "Confusing place with promotion — place is where/how customers buy.",
          "Ignoring product life cycle when choosing promotion intensity.",
        ],
        terms: [
          { term: "Marketing mix", definition: "Controllable tactical tools — product, price, place, promotion — to reach target customers." },
          { term: "Skimming pricing", definition: "Setting a high initial price for a new product to target less price-sensitive buyers." },
        ],
      },
      {
        id: "L4.2",
        title: "Segmentation, Targeting & Positioning",
        concept:
          "Market segmentation divides a market into groups with similar needs or characteristics (demographic, geographic, psychographic, behavioural). Targeting selects which segment(s) to serve — undifferentiated, differentiated or concentrated (niche) strategies. Positioning is how customers perceive the brand relative to competitors — unique selling proposition (USP) and brand image matter. In exams, segment → target → positioning should be a logical chain. Data from surveys and sales analytics supports segmentation. Mass customisation uses technology to tailor offers while keeping scale. Re-positioning is costly; inconsistent messages confuse consumers.",
        example: {
          scenario: "A gym chain sees young professionals and retirees using facilities differently.",
          walkthrough:
            "Segment by age and goals (fitness vs. rehabilitation). Target two segments with differentiated classes and pricing packages. Position one outlet as 'performance training' and another as 'wellness for seniors'. Weak answers stop at 'segment the market' without naming segments.",
        },
        traps: [
          "Using segmentation and targeting as synonyms.",
          "Choosing a niche without checking if it is large enough to be profitable.",
          "Positioning statement with no competitor comparison.",
        ],
        terms: [
          { term: "USP", definition: "Unique selling proposition — feature that distinguishes a product from competitors." },
          { term: "Niche marketing", definition: "Concentrating on a small, well-defined segment of the market." },
        ],
      },
      {
        id: "L4.3",
        title: "Branding & Customer Relationship",
        concept:
          "A brand is a name, symbol or design that identifies a seller's products and differentiates them. Brand equity is the value of a brand name beyond physical assets — built through quality, consistency and emotional connection. Customer relationship management (CRM) uses data to personalise service, increase retention and cross-sell. Loyalty programmes reward repeat purchases; complaints handling affects word-of-mouth in social media-heavy HK markets. Product life cycle stages (introduction, growth, maturity, decline) guide marketing spend — heavy promotion at introduction, defending share at maturity, harvesting or exiting at decline. Extension strategies include new markets or product variants.",
        example: {
          scenario: "A bubble tea brand faces many copycats in Mong Kok.",
          walkthrough:
            "Strengthen brand equity via consistent taste, store experience and trademark protection. CRM app tracks orders and offers rewards. At maturity, innovate flavours or overseas franchise (extension). Mention legal protection of brand.",
        },
        traps: [
          "Thinking branding is only a logo — it includes experience and trust.",
          "Increasing promotion in decline without a revival strategy wastes cash.",
          "Ignoring online reviews as part of CRM.",
        ],
        terms: [
          { term: "Brand equity", definition: "Commercial value derived from consumer perception of the brand name." },
          { term: "Product life cycle", definition: "Stages a product passes through from launch to withdrawal." },
        ],
      },
    ],
  },
  {
    id: 5,
    topic: "human-resources",
    abbr: "HR",
    lessons: [
      {
        id: "L5.1",
        title: "Recruitment & Selection",
        concept:
          "Human resource management acquires, develops and retains staff to meet business objectives. Recruitment generates applicants (internal vs. external; job ads, agencies, referrals). Selection chooses the best fit using interviews, tests, group exercises and reference checks. A job description states duties and reporting; a person specification lists qualifications, skills and attributes. In Hong Kong, discrimination ordinances prohibit bias on gender, disability, family status, race and more — fair procedures protect the firm legally and reputationally. Cost of bad hire includes training waste and customer harm. Employer branding on social media affects applicant quality.",
        example: {
          scenario: "A bank needs compliance officers with legal knowledge and English fluency.",
          walkthrough:
            "Person spec: law degree, professional certification, communication skills. External recruitment via LinkedIn and graduate programmes. Selection: structured interview plus case test on regulations. Document scores to show fairness.",
        },
        traps: [
          "Using only interviews without validating skills — prone to bias.",
          "Confusing job description with person specification.",
          "Ignoring internal recruitment when suitable staff exist.",
        ],
        terms: [
          { term: "Person specification", definition: "Profile of the ideal candidate's qualifications, skills and qualities." },
          { term: "Structured interview", definition: "Interview using predetermined questions scored consistently for all candidates." },
        ],
      },
      {
        id: "L5.2",
        title: "Training & Development",
        concept:
          "Training improves skills for current roles; development prepares employees for future roles and career growth. On-the-job training (coaching, job rotation) happens at the workplace; off-the-job training uses courses and workshops. Induction orientates new hires to culture and procedures. Training needs analysis identifies gaps between required and actual performance. Evaluation measures reaction, learning, behaviour change and business results (Kirkpatrick levels). Investment in training can reduce turnover and raise productivity, but poaching risk exists if rivals hire trained staff. Apprenticeships combine paid work and study.",
        example: {
          scenario: "A hotel introduces a new property management system.",
          walkthrough:
            "Needs analysis: staff cannot process online bookings. Off-the-job vendor training plus on-the-job supervisors. Evaluate by error rate on bookings before/after. Link training cost to reduced customer complaints.",
        },
        traps: [
          "Assuming training always fixes performance — may be poor systems or motivation.",
          "No evaluation — cannot prove ROI.",
          "Development confused with disciplinary action.",
        ],
        terms: [
          { term: "Induction training", definition: "Initial training introducing new employees to the organisation." },
          { term: "On-the-job training", definition: "Learning while performing actual work tasks under guidance." },
        ],
      },
      {
        id: "L5.3",
        title: "Compensation, Labour Relations & Safety",
        concept:
          "Compensation includes wages, salaries, commissions, benefits and MPF employer contributions in Hong Kong. Piece rate pays per unit; time rate pays per hour; profit sharing aligns interests with firm performance. Labour relations cover communication with unions (less common in HK private sector but relevant in some industries), collective bargaining and dispute handling. Occupational safety and health laws require safe workplaces, training and equipment. Disciplinary and grievance procedures should be documented. Minimum wage and statutory holidays set legal floors. Fair pay and safety reduce turnover and legal penalties.",
        example: {
          scenario: "Warehouse workers request hazard pay for lifting heavy goods without equipment.",
          walkthrough:
            "Assess OSH risks, provide trolleys and training (employer duty). Review pay structure — may add allowance tied to role risk. Grievance meeting documented. Exam link: legal compliance plus motivation hygiene factors.",
        },
        traps: [
          "Forgetting MPF mandatory employer contribution in cost of employment.",
          "Ignoring documented procedures in dismissal cases.",
          "Treating safety as only common sense — legal duties apply.",
        ],
        terms: [
          { term: "MPF", definition: "Mandatory Provident Fund — compulsory retirement savings scheme in Hong Kong." },
          { term: "Grievance procedure", definition: "Formal process for employees to raise workplace concerns." },
        ],
      },
    ],
  },
  {
    id: 6,
    topic: "accounting-equation",
    abbr: "AEQN",
    lessons: [
      {
        id: "L6.1",
        title: "The Accounting Equation",
        concept:
          "The accounting equation is Assets = Liabilities + Capital (A = L + C). Assets are resources controlled by the entity with future economic benefits (cash, inventory, equipment). Liabilities are present obligations to outsiders (loans, trade payables). Capital (owner's equity) is the residual interest of owners after liabilities. Every transaction keeps the equation balanced: if assets rise, liabilities and/or capital must rise, or another asset falls. Drawings reduce capital when owners withdraw cash or goods for personal use. Revenue increases capital (via profit); expenses decrease capital. In HKDSE, rearrange to find missing figures and explain which side of the equation changes.",
        example: {
          scenario: "A owner injects $100,000 cash and buys inventory $40,000 on credit.",
          walkthrough:
            "After injection: Cash +100,000 and Capital +100,000 (A = L + C: 100,000 = 0 + 100,000). Credit purchase of inventory: Inventory +40,000 and Trade payables +40,000 — cash is not affected because no payment is made yet (140,000 = 40,000 + 100,000). If the firm later pays the supplier in cash, that separate transaction is Cash -40,000 and Trade payables -40,000. Show each transaction step-by-step so the equation stays balanced.",
        },
        traps: [
          "Treating revenue as an asset — revenue increases equity through profit.",
          "Forgetting credit purchases increase both assets and liabilities.",
          "Reducing cash when buying on credit — only inventory and trade payables change until payment is made.",
          "Confusing capital with cash — capital is a claim, not necessarily cash balance.",
        ],
        terms: [
          { term: "Asset", definition: "A resource controlled by the entity from which future economic benefits are expected." },
          { term: "Capital", definition: "Owner's equity — residual interest in assets after deducting liabilities." },
        ],
      },
      {
        id: "L6.2",
        title: "Double Entry & Ledger Accounts",
        concept:
          "Double entry records each transaction with equal debit and credit entries. Debit and credit rules: assets and expenses increase on debit; liabilities, capital and revenue increase on credit. Ledger accounts (T-accounts) summarise entries by category. The trial balance lists account balances at a date — total debits should equal total credits if entries are correct, but errors like omission or wrong amount may still occur. Source documents include invoices, receipts and cheques. Bank reconciliation matches cash book with bank statement. In exams, post entries from transactions and balance accounts clearly.",
        example: {
          scenario: "Sold goods $5,000 cash; cost of goods sold was $3,000.",
          walkthrough:
            "Debit Cash 5,000; Credit Sales 5,000. For inventory reduction under periodic or perpetual system as syllabus expects: Debit Cost of goods sold 3,000; Credit Inventory 3,000. Net effect on equity: profit $2,000 increases capital.",
        },
        traps: [
          "Debiting sales when cash is received — sales is credited on revenue recognition.",
          "Thinking debit always means increase — depends on account type.",
          "Trial balance proves arithmetic only, not that all transactions are recorded.",
        ],
        terms: [
          { term: "Double entry", definition: "Recording each transaction with at least one debit and one equal credit." },
          { term: "Trial balance", definition: "List of ledger balances to check debit-credit equality." },
        ],
      },
      {
        id: "L6.3",
        title: "Adjustments & Accrual Concept",
        concept:
          "Accrual accounting records revenue when earned and expenses when incurred, not only when cash moves. Period-end adjustments include accrued expenses (used but not yet paid), prepaid expenses (paid in advance), accrued revenue and prepaid income. Depreciation allocates cost of non-current assets over useful life. Bad debt provision estimates uncollectible receivables. Adjustments ensure profit reflects the period fairly. Matching concept pairs related revenues and expenses. Going concern assumes the business continues unless stated otherwise.",
        example: {
          scenario: "Year-end 31 Dec: wages $20,000 for December will be paid on 5 January; annual insurance $12,000 paid in July covers 12 months.",
          walkthrough:
            "Accrued wages expense $20,000 with wages payable liability. Prepaid insurance: 6 months used, 6 months prepaid asset $6,000. Adjustments affect profit and balance sheet items, not just cash.",
        },
        traps: [
          "Recording only cash transactions in profit calculation.",
          "Depreciating land — land is usually not depreciated.",
          "Forgetting to adjust prepayments at year-end.",
        ],
        terms: [
          { term: "Accrual concept", definition: "Recognise revenue and expenses when earned/incurred, not only when cash is received/paid." },
          { term: "Depreciation", definition: "Systematic allocation of depreciable amount of an asset over its useful life." },
        ],
      },
    ],
  },
  {
    id: 7,
    topic: "financial-statements",
    abbr: "FSTM",
    lessons: [
      {
        id: "L7.1",
        title: "Income Statement Essentials",
        concept:
          "The income statement (profit and loss account) shows financial performance over a period: revenues, cost of sales, gross profit, other income, expenses and net profit. Gross profit = sales - cost of sales. Operating profit excludes non-operating items; net profit is after finance costs and tax. For trading businesses, mark-up and margin calculations frequently appear: mark-up on cost = gross profit / cost of sales; gross profit margin = gross profit / sales. Non-current asset disposal gains/losses appear below operating items. Appropriation of profit (dividends, transfers to reserves) may be shown for companies. Read headings carefully in exam statements.",
        example: {
          scenario: "Sales $500,000; opening inventory $30,000; purchases $280,000; closing inventory $50,000; operating expenses $120,000.",
          walkthrough:
            "COGS = 30,000 + 280,000 - 50,000 = 260,000. Gross profit = 240,000. Operating profit = 240,000 - 120,000 = 120,000 before tax. Show formula lines — markers reward workings.",
        },
        traps: [
          "Using purchases instead of cost of sales in gross profit.",
          "Confusing mark-up with margin — different denominators.",
          "Treating drawings as an expense on income statement.",
        ],
        terms: [
          { term: "Cost of sales", definition: "Cost of inventory sold during the period." },
          { term: "Gross profit margin", definition: "Gross profit divided by sales revenue." },
        ],
      },
      {
        id: "L7.2",
        title: "Balance Sheet & Cash Flow Basics",
        concept:
          "The balance sheet (statement of financial position) shows assets, liabilities and equity at a date. Non-current assets, current assets, current liabilities, non-current liabilities and capital components are classified by liquidity and maturity. Working capital = current assets - current liabilities. Cash flow statement explains cash inflows and outflows from operating, investing and financing activities — profit does not equal cash because of credit sales, depreciation and timing. A firm can be profitable yet illiquid if receivables pile up. HKDSE may ask interpretive questions on why cash dropped despite profit rise.",
        example: {
          scenario: "Net profit increased but bank balance fell sharply.",
          walkthrough:
            "Possible causes: credit sales increased trade receivables, inventory built up, loan repayments (financing outflow), bought equipment (investing outflow). Refer to cash flow categories, not only income statement.",
        },
        traps: [
          "Classifying bank overdraft always as non-current — usually current liability.",
          "Equating net profit with cash increase.",
          "Putting accumulated depreciation as a liability — it is contra-asset.",
        ],
        terms: [
          { term: "Working capital", definition: "Current assets minus current liabilities." },
          { term: "Liquidity", definition: "Ability to meet short-term obligations with available cash or near-cash assets." },
        ],
      },
    ],
  },
  {
    id: 8,
    topic: "financial-ratios",
    abbr: "RATI",
    lessons: [
      {
        id: "L8.1",
        title: "Profitability Ratios",
        concept:
          "Profitability ratios measure how effectively a firm generates profit from sales or assets. Gross profit margin = gross profit / sales. Net profit margin = net profit / sales. Return on capital employed (ROCE) = profit before interest and tax / capital employed, where capital employed = equity + long-term liabilities (or total assets - current liabilities). Higher margins suggest pricing power or cost control; ROCE links profit to funding used. Compare with prior years and industry averages. One ratio alone is inconclusive — trend and context matter.",
        example: {
          scenario: "Gross margin fell from 40% to 32% while sales rose 20%.",
          walkthrough:
            "Revenue grew but each dollar of sales retains less profit — possible discounting, higher purchase costs or mix shift to low-margin products. Recommend investigating supplier prices and pricing policy, not celebrating sales growth alone.",
        },
        traps: [
          "Using net profit in gross margin formula.",
          "ROCE denominator using only share capital — include long-term funding as syllabus defines.",
          "Ignoring that higher margin with collapsing sales may still harm profit.",
        ],
        terms: [
          { term: "ROCE", definition: "Return on capital employed — PBIT divided by capital employed." },
          { term: "Net profit margin", definition: "Net profit as a percentage of sales revenue." },
        ],
      },
      {
        id: "L8.2",
        title: "Liquidity & Efficiency Ratios",
        concept:
          "Liquidity ratios assess short-term solvency. Current ratio = current assets / current liabilities; quick ratio excludes inventory from numerator. Efficiency ratios include inventory turnover (cost of sales / average inventory), receivables collection period (trade receivables / credit sales × days) and payables period. Low current ratio may signal cash stress; very high ratio may mean idle assets. Long receivables period ties up cash; extending payables improves cash but may damage supplier relations.",
        example: {
          scenario: "Current ratio 1.1:1; receivables days increased from 45 to 70.",
          walkthrough:
            "Liquidity is tight. Slow collections may cause overdraft reliance. Suggest credit control, early payment discounts, or factoring. Link ratio movement to cash flow risk.",
        },
        traps: [
          "Quick ratio including prepaid expenses as highly liquid without justification.",
          "Inventory turnover using sales instead of cost of sales.",
          "Assuming high current ratio is always good.",
        ],
        terms: [
          { term: "Current ratio", definition: "Current assets divided by current liabilities." },
          { term: "Receivables collection period", definition: "Average number of days to collect cash from credit customers." },
        ],
      },
      {
        id: "L8.3",
        title: "Gearing & Investment Ratios",
        concept:
          "Gearing (leverage) measures reliance on debt. Debt ratio = total liabilities / total assets; debt-to-equity = total debt / equity. Higher gearing magnifies return to equity in good years but increases financial risk and interest burden in bad years. Interest cover = PBIT / interest expense — low cover signals difficulty servicing debt. Earnings per share (EPS) = profit attributable to ordinary shareholders / weighted average shares. Price-earnings ratio (P/E) = market price per share / EPS — market valuation indicator. Interpret ratios together: a profitable but highly geared firm may be vulnerable to rate rises.",
        example: {
          scenario: "Company doubles bank loan to fund expansion; interest cover falls from 6× to 2×.",
          walkthrough:
            "Gearing rose; less buffer before interest cannot be paid. If US/HK rates rise, risk increases. Shareholders may want faster ROCE growth to justify risk. Recommend sensitivity analysis on interest.",
        },
        traps: [
          "Treating all liabilities as debt in gearing — some syllabi use interest-bearing debt only; follow question definition.",
          "EPS using total profit instead of attributable to ordinary shareholders.",
          "High P/E always meaning 'cheap' — often means high growth expectations.",
        ],
        terms: [
          { term: "Interest cover", definition: "Profit before interest and tax divided by interest expense." },
          { term: "Gearing", definition: "Extent to which a firm is financed by debt rather than equity." },
        ],
      },
    ],
  },
  {
    id: 9,
    topic: "personal-finance-ethics",
    abbr: "PFIN",
    lessons: [
      {
        id: "L9.1",
        title: "Personal Financial Planning",
        concept:
          "Personal financial management covers budgeting, saving, insurance, investment and retirement planning (including MPF choices). A budget compares expected income and expenditure; emergency funds cover 3–6 months of expenses. Time value of money: earlier cash flows can be invested; compound interest grows savings. Risk and return trade-off: deposits are safer; equities higher potential return with volatility. Insurance transfers insurable risk (life, medical, property). In HK, students should relate MPF fund choice to risk tolerance and fees. Consumer credit (cards, instalments) has high implicit rates if misused.",
        example: {
          scenario: "A graduate earns $18,000/month and wants to save for a flat deposit in five years.",
          walkthrough:
            "Budget essentials and discretionary spending, set monthly savings target, choose instruments matching five-year horizon (mixed deposits and conservative funds), avoid high-interest card debt. Mention inflation eroding purchasing power.",
        },
        traps: [
          "Ignoring inflation when planning long-term goals.",
          "Choosing MPF funds without considering age and risk tolerance.",
          "Treating insurance as investment — primary purpose is risk transfer.",
        ],
        terms: [
          { term: "Compound interest", definition: "Interest calculated on principal plus accumulated interest." },
          { term: "Emergency fund", definition: "Readily accessible savings for unexpected expenses or income loss." },
        ],
      },
      {
        id: "L9.2",
        title: "Business Ethics & Governance",
        concept:
          "Business ethics guides acceptable conduct beyond law — conflicts of interest, bribery, data privacy and fair advertising. Corporate governance structures (board of directors, audit committee, independent non-executive directors) monitor management on behalf of shareholders. Whistle-blowing policies protect reporters of misconduct. Insider trading and market manipulation are illegal in securities markets. Personal finance ethics include responsible borrowing and truthful loan applications. In BAFS, tie ethics to long-run trust, legal penalties and stakeholder harm.",
        example: {
          scenario: "A sales manager offers kickbacks to a buyer to secure a contract.",
          walkthrough:
            "Bribery violates law and ethics; distorts competition; if exposed, contracts void, fines and reputation loss. Internal controls and code of conduct plus audit trails deter bribery. Answer should mention criminal liability and stakeholder impact.",
        },
        traps: [
          "Saying 'everyone does it' as ethical justification.",
          "Confusing NED role with daily management.",
          "Ignoring data privacy when using customer CRM data.",
        ],
        terms: [
          { term: "Conflict of interest", definition: "Situation where personal interest could improperly influence professional decisions." },
          { term: "Corporate governance", definition: "System of rules and practices by which a company is directed and controlled." },
        ],
      },
    ],
  },
];

const lessonsOut = {};
for (const unit of UNITS) {
  for (const lesson of unit.lessons) {
    lessonsOut[lesson.id] = {
      ...lesson,
      unit: unit.id,
      practice: unit.topic,
      passThreshold: 7,
      reviewed: true,
    };
  }
}

const DRILL_BANK = [
  // business-environment
  ["What is a stakeholder?", "Anyone affected by or interested in a business", "Only shareholders", "Only employees", "Only government"],
  ["PEST 'E' stands for", "Economic factors", "Environmental ethics", "Employee relations", "Export policy only"],
  ["Shareholders are", "Owners of company shares", "Always customers", "Always managers", "Government regulators"],
  ["CSR mainly refers to", "Voluntary social and environmental responsibility", "Paying minimum tax only", "Maximising short-run profit only", "Avoiding all regulation"],
  ["Greenwashing means", "False or exaggerated green claims", "Recycling office paper", "Using solar power", "Publishing annual reports"],
  ["Unlimited liability applies to typical", "Sole proprietor", "Listed company shareholder", "Bond investor", "MPF member"],
  ["A private company", "Cannot offer shares to the general public", "Must list on HKEX", "Has no separate legal entity", "Never pays tax"],
  ["SWOT 'O' represents", "Opportunities", "Operations", "Ownership", "Output"],
  ["Linked exchange rate ties HKD to", "USD", "CNY", "EUR", "Gold"],
  ["Ethics differs from law because", "Legal acts can still be unethical", "They are identical", "Ethics is always stricter than every law", "Law never applies to business"],
  ["Sustainability focuses on", "Long-term economic, social and environmental balance", "Profit this quarter only", "Zero growth", "Avoiding technology"],
  ["Stakeholder conflict example", "Higher wages vs higher profit", "Two identical products", "Same tax rate for all", "Equal inflation for all firms"],
  // forms-of-business
  ["Separate legal entity means", "Company can sue and be sued in its own name", "Owner and business are always the same person", "No registration needed", "No tax filing"],
  ["General partnership liability is", "Unlimited for general partners", "Always limited", "Only for silent partners", "Zero"],
  ["Main advantage of limited company", "Limited liability for shareholders", "Unlimited profit with no tax", "No disclosure ever", "No directors needed"],
  ["Partnership deed should cover", "Profit sharing and dispute resolution", "Only office colour", "Competitors' prices", "Customer birthdays"],
  ["Public company can", "Offer shares to the public", "Never publish accounts", "Avoid the Companies Ordinance", "Have unlimited partners"],
  ["Agency problem arises when", "Managers' goals differ from shareholders'", "Customers buy more", "Tax falls", "Interest rate is zero"],
  ["Sole proprietorship weakness", "Difficulty raising large capital", "Double taxation on company profits", "Mandatory audit always", "Cannot operate in HK"],
  ["Continuity is strongest in", "Company", "Sole proprietorship when owner retires", "Informal verbal partnership", "Temporary stall"],
  ["Limited liability means", "Loss limited to investment in shares (generally)", "Never any business loss", "Government pays debts", "Unlimited upside only"],
  ["Business Registration in HK is required for", "Carrying on business", "Only listed firms", "Only foreign firms", "Students only"],
  ["Franchisee pays for", "Right to use brand and system", "Government MPF", "Competitor's assets", "Free unlimited stock"],
  ["Co-operative is owned by", "Members who use its services", "The government only", "One sole owner always", "Banks only"],
  // management
  ["POLC 'P' is", "Planning", "Pricing", "Promotion", "Production only"],
  ["Span of control refers to", "Subordinates per manager", "Factory floor size", "Product width", "Interest rate spread"],
  ["Delegation involves", "Assigning authority to subordinates", "Firing all staff", "Ignoring standards", "Eliminating planning"],
  ["Hygiene factors in Herzberg", "Prevent dissatisfaction e.g. pay conditions", "Always motivate strongly", "Are only promotion", "Replace leadership"],
  ["Theory Y assumes", "Workers can be self-directed", "Workers always lazy", "Money never matters", "No goals needed"],
  ["TQM emphasises", "Continuous quality improvement", "One-off inspection only", "No customer focus", "Zero training"],
  ["Controlling step includes", "Compare actual to standard", "Only advertising", "Only hiring", "Skip measurement"],
  ["Strategic planning horizon is", "Long-term and organisation-wide", "Daily cash count only", "Only tax filing", "One shift roster"],
  ["Decentralisation", "Pushes decisions closer to front line", "Removes all local authority", "Ends delegation", "Is illegal"],
  ["SWOT internal factors are", "Strengths and weaknesses", "Political and legal", "Tax and interest", "Imports only"],
  ["Autocratic leadership", "Manager decides with little consultation", "Always best", "No clear direction", "Only for volunteers"],
  ["KPI is", "Measurable performance indicator", "A tax form", "Inventory only", "Brand logo"],
  // marketing
  ["4Ps include", "Product, price, place, promotion", "Profit, plan, people, process only", "Tax, tariff, trade, trust", "Cash, credit, cost, capital"],
  ["Place in marketing mix is", "Distribution channels", "Factory location only", "HR placement", "Price setting"],
  ["Market segmentation divides", "Market into similar need groups", "Company departments", "Ledger accounts", "Shares only"],
  ["Positioning is about", "Perception vs competitors", "Factory layout", "Bank reconciliation", "Depreciation method"],
  ["Skimming pricing sets", "High initial price", "Always lowest price", "Zero price forever", "Only cost-plus always"],
  ["Product life cycle decline stage", "Sales fall; harvest or exit", "Always highest promotion", "No competition", "Guaranteed profit"],
  ["USP means", "Unique selling proposition", "Universal sales price", "Unlimited stock policy", "Union standard pay"],
  ["CRM aims to", "Build customer relationships and retention", "Close the business", "Avoid all data", "Eliminate promotion"],
  ["Niche marketing targets", "A small defined segment", "Everyone equally", "Only government", "Only suppliers"],
  ["Brand equity is", "Value of brand beyond physical assets", "Only warehouse stock", "Only cash", "Tax refund"],
  ["Penetration pricing uses", "Low price to gain share", "Always skimming", "No promotion", "Only luxury goods"],
  ["Extended marketing mix for services adds", "People, process, physical evidence", "Only product", "Only patents", "Only tariffs"],
  // human-resources
  ["Person specification describes", "Ideal candidate profile", "Only office hours", "Share price", "COGS"],
  ["Structured interview uses", "Predetermined scored questions", "Random chat only", "No records", "Only handwriting test"],
  ["On-the-job training occurs", "At the workplace", "Only overseas", "Never with supervision", "Only online always"],
  ["MPF in HK is", "Mandatory retirement savings scheme", "Optional tip jar", "Sales tax", "Inventory method"],
  ["Induction training is for", "New employees", "Retired directors only", "Customers only", "Competitors"],
  ["Grievance procedure lets staff", "Raise workplace concerns formally", "Avoid all contracts", "Set share price", "Skip safety rules"],
  ["Piece-rate pay is based on", "Output per unit", "Hours only always", "Age only", "Random lottery"],
  ["Job description states", "Duties and reporting relationships", "Shareholder dividends", "Competitor strategy", "Macro GDP"],
  ["Off-the-job training is", "Away from workplace e.g. courses", "Only shadowing forever", "No assessment", "Illegal"],
  ["Discrimination ordinances in HK protect", "Fair treatment in employment", "Only employers", "Only imports", "Only marketing"],
  ["Labour turnover cost includes", "Recruitment and training waste", "Only paper clips", "Only rent", "Zero always"],
  ["OSH responsibility lies with", "Employer to provide safe workplace", "Only employees", "Only customers", "Only banks"],
  // accounting-equation
  ["Accounting equation is", "Assets = Liabilities + Capital", "Assets = Sales only", "Cash = Profit", "Inventory = Revenue"],
  ["Debit increases", "Assets and expenses", "Liabilities only", "Capital only always", "Revenue only"],
  ["Credit increases", "Liabilities, capital and revenue", "Assets only", "Drawings only", "Cash only"],
  ["Trial balance checks", "Debit-credit equality", "Profit accuracy guaranteed", "Bank balance match always", "Tax paid"],
  ["Accrual concept records", "Revenue when earned", "Only cash received", "Only drawings", "Only dividends"],
  ["Depreciation allocates", "Asset cost over useful life", "Land always", "Cash immediately", "Sales revenue"],
  ["Drawings reduce", "Owner's capital", "Sales revenue", "Trade payables automatically", "Tax"],
  ["Prepaid expense is", "Asset paid in advance", "Liability for past due wages", "Revenue", "Share capital"],
  ["Accrued expense is", "Incurred but not yet paid", "Already paid in advance", "Always cash", "Never in accounts"],
  ["COGS formula trading", "Opening inventory + purchases - closing inventory", "Sales - gross profit only", "Cash - bank", "Assets - liabilities"],
  ["Double entry requires", "Equal debit and credit", "Single sided only", "No ledger", "Only bank statement"],
  ["Going concern assumes", "Business continues operating", "Immediate liquidation", "No liabilities", "No owners"],
  // financial-statements
  ["Gross profit equals", "Sales minus cost of sales", "Sales minus all expenses", "Cash minus bank", "Assets minus liabilities"],
  ["Current assets include", "Inventory and receivables typically", "Land and buildings usually", "Share capital", "Retained profit only line"],
  ["Working capital is", "Current assets minus current liabilities", "Total assets", "Sales only", "Bank loan only"],
  ["Accumulated depreciation is", "Contra non-current asset", "Current liability", "Revenue", "Cash inflow"],
  ["Income statement covers", "A period of time", "A single date only", "Only balance sheet items", "Only cash"],
  ["Balance sheet shows", "Position at a date", "Only expenses", "Only dividends", "Only marketing mix"],
  ["Credit sales increase", "Trade receivables", "Cash immediately always", "Payables only", "Share premium always"],
  ["Net profit increases", "Equity via retained earnings", "Always cash same amount", "Only liabilities", "Inventory only"],
  ["Cash flow statement explains", "Cash movements by activity", "Only gross profit", "Only tax", "Only HR"],
  ["Mark-up on cost uses denominator", "Cost of sales", "Sales revenue", "Total assets", "Equity"],
  ["Operating expenses are", "Costs other than COGS to run business", "Always finance cost", "Always tax", "Always drawings"],
  ["Closing inventory appears", "Balance sheet and affects COGS", "Only income statement revenue line", "Only cash flow investing", "Nowhere"],
  // financial-ratios
  ["Current ratio formula", "Current assets / current liabilities", "Sales / inventory", "Profit / sales only", "Debt / cash only"],
  ["Quick ratio excludes", "Inventory from numerator typically", "All receivables", "All cash", "All payables"],
  ["ROCE uses", "PBIT / capital employed", "Gross profit / inventory", "Sales / assets only", "Dividends / shares"],
  ["Higher gearing implies", "More debt finance relative to equity", "No interest", "Zero risk", "Always higher liquidity"],
  ["Interest cover is", "PBIT / interest", "Sales / COGS", "Cash / inventory", "EPS × P/E"],
  ["Receivables days measures", "Collection speed", "Inventory age only", "Payroll", "Tax delay only"],
  ["Gross margin uses", "Gross profit / sales", "Net profit / assets", "COGS / equity", "Cash / liabilities"],
  ["Inventory turnover uses", "COGS / average inventory", "Sales / payables", "Profit / cash", "Assets / tax"],
  ["Low current ratio may signal", "Liquidity stress", "Always excellent health", "Too much cash always", "Zero liabilities"],
  ["EPS equals", "Profit to ordinary shareholders / shares", "Sales / shares", "Assets / shares", "COGS / shares"],
  ["P/E ratio combines", "Price per share and EPS", "Only book value", "Only dividends", "Only COGS"],
  ["Efficiency ratios focus on", "How well assets/working capital are used", "Only tax rate", "Only branding", "Only CSR"],
  // personal-finance-ethics
  ["Emergency fund typically covers", "Several months of essential expenses", "Only luxury travel", "Stock options only", "Zero savings"],
  ["Compound interest grows on", "Principal plus accumulated interest", "Only principal once", "Only fees", "Only tax"],
  ["Insurance primary purpose", "Risk transfer", "Guaranteed investment return", "Avoid all loss without premium", "Replace MPF"],
  ["MPF choice should consider", "Risk tolerance and fees", "Only employer logo", "Random pick", "Daily stock tips"],
  ["Budgeting compares", "Expected income and expenditure", "Only assets", "Only ratios", "Only market share"],
  ["Bribery in business is", "Unethical and often illegal", "Always acceptable", "Only marketing", "Required by CSR"],
  ["Conflict of interest occurs when", "Personal interest may bias decisions", "Two products identical", "Tax is flat", "Inflation zero"],
  ["Corporate governance includes", "Board oversight of management", "Only daily cashier work", "Only advertising", "Only warehouse"],
  ["Whistle-blowing policy should", "Protect good-faith reporters", "Punish all reporters", "Eliminate audits", "Hide fraud"],
  ["Responsible borrowing means", "Repay on time and truthful applications", "Max all cards always", "Ignore interest", "Hide income"],
  ["Time value of money implies", "Earlier cash can earn returns", "Money never changes value", "Only inflation irrelevant", "Only for banks"],
  ["Data privacy in CRM requires", "Lawful use of customer data", "Sell all data always", "No consent ever needed", "Ignore PDPO"],
];

function shuffleOptions(correctText, distractors, targetIndex) {
  const letters = ["A", "B", "C", "D"];
  const target = targetIndex % 4;
  const wrong = [...distractors];
  let s = targetIndex * 9973;
  for (let i = wrong.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  const opts = ["", "", "", ""];
  opts[target] = correctText;
  let wi = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== target) opts[i] = wrong[wi++];
  }
  return {
    options: opts.map((t, i) => `${letters[i]}. ${t}`),
    answer: letters[target],
  };
}

const topicOrder = UNITS.map((u) => u.topic);
const abbrMap = Object.fromEntries(UNITS.map((u) => [u.topic, u.abbr]));

const questions = [];
let globalQ = 0;

for (const topic of topicOrder) {
  const topicIndex = topicOrder.indexOf(topic);
  const start = topicIndex * 12;
  const pool = DRILL_BANK.slice(start, start + 12);
  const abbr = abbrMap[topic];
  let seq = 1;
  for (const [q, correct, d1, d2, d3] of pool) {
    const { options, answer } = shuffleOptions(correct, [d1, d2, d3], globalQ);
    globalQ++;
    questions.push({
      id: `BAFS-${abbr}-${String(seq).padStart(3, "0")}`,
      topic,
      difficulty: "medium",
      question: q,
      options,
      answer,
      explanation: `The correct option is ${answer}. ${correct} is the best answer; the other options are common misconceptions in HKDSE BAFS.`,
      tags: [topic],
      subject: "bafs",
    });
    seq++;
  }
}

const drillsOut = {
  meta: {
    title: "DSE BAFS Drill Bank",
    subject: "DSE bafs",
    language: "en",
    total: questions.length,
    version: "1.0",
    reviewed: true,
  },
  questions,
};

writeFileSync(join(dataDir, "bafs-lessons.json"), JSON.stringify(lessonsOut, null, 1));
writeFileSync(join(dataDir, "bafs-drills.json"), JSON.stringify(drillsOut, null, 1));

const ansDist = questions.reduce((a, q) => {
  a[q.answer] = (a[q.answer] || 0) + 1;
  return a;
}, {});
console.log("Lessons:", Object.keys(lessonsOut).length);
console.log("Drills:", questions.length, "answers:", ansDist);
console.log("Per topic:", topicOrder.map((t) => questions.filter((q) => q.topic === t).length));
