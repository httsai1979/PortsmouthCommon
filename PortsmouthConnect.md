# Product Requirement Document (PRD): Portsmouth Connect

**Version:** 1.0 | **Date:** 13th January 2026 | **Status:** Draft
**Region:** Portsmouth & South East Hampshire | **Target Fiscal Year:** 2026/2027

---

## 1. Executive Summary

### 1.1 Vision

To construct a "destigmatised" digital ecosystem that empowers "Hidden Poverty" households in Portsmouth. As we face the 2026 landscape of reduced government aid and rising living costs, this platform will utilize information transparency and resource optimisation to build financial resilience and restore dignity.

### 1.2 Core Value Proposition

* **From "Handouts" to "Empowerment":** We do not just provide fish; we teach users how to locate 'hidden' resources (unclaimed benefits) and facilitate community exchange.
* **From "Reactive" to "Proactive":** Instead of waiting for debt collectors, our algorithms predict "Benefits Cliffs" and offer optimisation advice before a crisis hits.
* **Privacy First:** A Zero-Knowledge architecture ensures core features are accessible without account registration, eliminating the "shame barrier" associated with means-tested applications.

### 1.3 Problem Statement

In 2026, with the real-term reduction of the Household Support Fund (HSF) and the freezing of Local Housing Allowance (LHA), approximately 25% of working households in Portsmouth face a "Benefits Cliff." These families earn slightly above the threshold for support, but after paying high private rents, their actual disposable income falls below the poverty line. Existing government channels are fragmented, administratively burdensome, and carry a heavy social stigma.

---

## 2. Target User Personas

| Attribute | Persona A: The Squeezed Renter | Persona B: The Prideful Senior |
| --- | --- | --- |
| **Representative** | **Sarah (34, Nurse, Single Mother)** | **Arthur (72, Retired, Living Alone)** |
| **Location** | Fratton (PO1), Private Rental | Drayton (PO6), Owned Home (Asset Rich, Cash Poor) |
| **Pain Points** | Salary of £24k—just too high for Universal Credit. Rent is £1,100, consuming 50%+ of net pay. Too proud to use a food bank. | Owns home but struggles with cash flow. Intimidated by complex online forms. Afraid to turn on the heating. |
| **Needs** | Quick wins to save cash (Water tariffs/Uniforms). Anonymous access to food resources. | Simple, large-button interface. Automated checks for Pension Credit eligibility. |
| **App Behaviour** | High-frequency use of the Map for "Yellow Sticker" deals and swaps. | Relies on family/volunteers for setup, then receives automated "Smart Alerts." |

---

## 3. Strategic Context: The 2026/2027 Policy Landscape

The App's backend **Rules Engine** must be hard-coded with the following critical UK/Portsmouth parameters:

1. **LHA Freeze:** Portsmouth Broad Rental Market Area (BRMA) rates remaining at 2024 levels, creating a shortfall against market rents.
2. **Council Tax Support (PCC Scheme):** Portsmouth City Council's specific **Banded Income Scheme** (crucial for accurate calculations).
3. **The Cliff Edges:**
* **Free School Meals (FSM):** The net earnings threshold (excluding benefits) sits at approximately **£7,400**.
* **High Income Child Benefit Charge:** The threshold at £60,000.


4. **Non-Government Support (The "Hidden" Layer):**
* **Southern Water Essentials Tariff:** 20%-90% discounts for low-income households.
* **Portsmouth Water Social Tariff:** Capped bills for larger families.
* **LEAP (Local Energy Advice Partnership):** Eligibility criteria for boiler replacements and insulation grants.



---

## 4. Functional Specifications

### 4.1 Core Feature: The Benefits Cliff Calculator

#### 4.1.1 User Input (Input Flow) - "The 3-Minute Check"

* **Residency:** Postcode Sector (e.g., PO1, PO6 - determines Council Tax Band), Tenure (Private Rent/Social Rent/Owner), Rent/Mortgage amount.
* **Household:** Number of Adults, Number of Children (and ages), Disability Status (affects Premiums).
* **Finance:** Net Monthly Income (Slider or approx. value), Current Benefits (Tick box: UC / Child Benefit).
* **Smart Tags:** "Southern Water Customer?", "Energy Debt?", "Pregnant?"

#### 4.1.2 The Logic Engine

The system performs a three-tier calculation:

1. **Tier 1: Universal Check**
* Calculates estimated **Universal Credit** (based on the 2026 Taper Rate of 55%).
* Calculates the **Housing Element** vs. **Actual Rent** Shortfall.


2. **Tier 2: Local Overlay (Portsmouth Specific)**
* **Council Tax:** Applies the specific PO postcode band + PCC Income Banded Scheme reduction.
* **Utilities:** IF `Income < £21,000` AND `Tag = Southern Water` -> Trigger `Essentials Tariff` calculation (Est. saving £200+/year).


3. **Tier 3: Cliff Warning System**
* `IF` (Net Income) is within £100 range of the (FSM Threshold)
* `THEN` Trigger Alert: *"Warning: Your current income is close to the Free School Meals threshold. A small increase in earnings could result in a total household value loss of £900/year (School meals + Holiday Activities)."*



#### 4.1.3 Actionable Output

* **Dashboard:** Displays "Monthly Shortfall" vs. "Potential Unclaimed Value."
* **Action Cards:**
* [High Priority] **Apply for Southern Water Discount** (Direct link to PDF/Form).
* [Medium Priority] **Apply for Discretionary Housing Payment (DHP)** (Reason: Rent exceeds LHA by £150).
* [Strategic Advice] **Increase Pension Contributions** (To reduce net income and retain FSM eligibility).



### 4.2 Core Feature: Hyper-local Survival Map

* **Data Layer:** Integration of Google Maps API with HIVE Portsmouth resource databases.
* **Filters:**
* 🔴 **Warm Spaces:** Venues currently open offering free heat/hot drinks.
* 🟡 **Eco-Food / Food Rescue:** Community Fridges, "Yellow Sticker" hours at local supermarkets.
* 🔵 **Digital Inclusion:** Libraries offering free Wi-Fi and device loans.


* **Privacy:** Navigation does not store route history or "frequent locations."

### 4.3 Core Feature: The Pompey Loop (Community Exchange)

* **Mechanism:** Non-monetary exchange market.
* **Categories:**
* **Skill Swap:** "I can fix a leaking tap" <-> "I can tutor maths."
* **Item Flow:** School Uniforms, Baby Equipment, Textbooks.


* **Trust Mechanism:** Reputation built via "Community Points" or "Thank Yous" rather than real-name verification to preserve dignity.

---

## 5. Technical Architecture

### 5.1 Tech Stack

* **Frontend:** **Flutter** (Single codebase for iOS/Android, high performance).
* **Backend:** **Firebase** (Google Cloud Platform).
* *Auth:* Anonymous Authentication.
* *Firestore:* Storing POI data for maps and anonymised community posts.
* *Cloud Functions:* Executing the complex benefits logic (Secure, server-side execution prevents client-side tampering).


* **Rules Engine:** Independent JSON configuration hosted on the cloud, fetched at app launch (allows for instant policy updates without app store resubmission).

### 5.2 Data & Privacy (GDPR Compliance)

* **Zero-Knowledge Architecture:** Financial data entered by the user is processed **locally on the device** (RAM) for the calculator and is **NOT** uploaded to a server database.
* **Analytics:** Only aggregated, anonymised data (e.g., "High search volume for Water Support in PO4") is collected to assist Council policy-making.

---

## 6. Data Strategy & Maintenance

### 6.1 Policy Database Sources

* **Automated Scrapers:** Weekly monitoring of `gov.uk` and `portsmouth.gov.uk` benefit pages for text changes.
* **API Integration:** Attempt to connect with `Open Data Communities` (UK Gov) for LHA rates.

### 6.2 Content Partners

* **HIVE Portsmouth:** Providing the "single source of truth" for community aid locations (CSV/API feed).
* **Citizens Advice Portsmouth:** Acting as "Knowledge Auditors," reviewing the calculator logic quarterly to ensure compliance with the latest legislation.

---

## 7. Go-to-Market Roadmap

### Phase 1: MVP Development & Validation (Month 1-3)

* **Objective:** Finalise the "Benefits Cliff Calculator" core logic.
* **Key Actions:**
* Build the Portsmouth 2026 Policy Parameter JSON.
* Closed-door logic testing with Citizens Advice welfare rights advisors.
* User Acceptance Testing (UAT) at Fratton Community Centre (50 users).



### Phase 2: Map Integration & Soft Launch (Month 4-6)

* **Objective:** Launch the "Survival Map" to address information asymmetry.
* **Key Actions:**
* Ingest HIVE Portsmouth location data.
* Negotiate with Southern Water for an "App-exclusive fast-track link."
* **Soft Launch:** Promotion via local School Gateways / ParentMail systems.



### Phase 3: Full Rollout & Community Loop (Month 7-12)

* **Objective:** Establish network effects.
* **Key Actions:**
* Launch the "Pompey Loop" exchange feature.
* **B2B Strategy:** Partner with major employers (BAE Systems, QA Hospital) to offer the app as an "Employee Financial Wellbeing" tool.
* Apply for **Innovate UK** follow-on funding.



---

## 8. Success Metrics (KPIs)

1. **User Acquisition:** 5,000 Monthly Active Households (approx. 10% of target demographic in Portsmouth).
2. **Economic Impact:** **£500,000** in "Unclaimed Benefits/Grants" identified.
* *Measurement:* Aggregate value of "Apply" clicks inside the calculator.


3. **Social Impact:** Partner organisations (e.g., Food Banks) report a 15% reduction in referrals caused purely by "lack of awareness" of other support.

---

## 9. Next Steps for the Development Team

To move from Strategy to Execution, the immediate priority is the **Data Task Force**:

1. **Week 1:** Download the latest **"Portsmouth City Council Tax Reduction Scheme"** (PDF) and transcribe the Income Band tables into a structured format (JSON/Excel).
2. **Week 2:** Contact **Southern Water** to confirm the 2026 thresholds for the *Essentials Tariff*.
3. **Week 3:** Map the **School Uniform Grant** availability across the city's secondary schools.

---

*This document serves as the master blueprint for the Portsmouth Connect project.*