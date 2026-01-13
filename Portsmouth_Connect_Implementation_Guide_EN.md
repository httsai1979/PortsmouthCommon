# **Portsmouth Connect App: 2026 Implementation Guide (Google Antigravity Edition)**

Version: 2.0 (Implementation Ready) | Date: 13th January 2026  
Objective: To guide developers in using AI assistance to transform the static prototype into a production-ready application with real logic and database connectivity, strictly following the 2026 Portsmouth policy framework.

## **1\. Core Development Strategy: Layered Implementation**

We will break down the development process into four independent but interdependent layers. Please issue the prompts to the AI in the following order.

### **Phase 1: Logic Layer (The Brain) \- Policy Engine Core**

**Goal:** Replace the mock logic in ConnectLogic.ts with real 2026 policy parameters.

* **Key Input:** Portsmouth 生活成本補助研究.md (Policy source)  
* **Key Output:** src/services/ConnectLogic.ts  
* **Verification Focus:** Does it include the frozen LHA rates, the Council Tax Banded Scheme, and the £7,400 FSM threshold?

### **Phase 2: Data Layer (The Backbone) \- Firebase & Security**

**Goal:** Establish secure database rules and implement the data migration tool.

* **Key Input:** firestore.rules, src/components/DataMigration.tsx  
* **Key Output:**  
  1. firestore.rules (Add permissions for community\_posts)  
  2. src/components/DataMigration.tsx (Fix undefined errors during upload)  
* **Verification Focus:** Can anonymous users read posts but not modify others' data?

### **Phase 3: Feature Layer (The Muscles) \- Community Loop & Calculator UI**

**Goal:** Make the user interface truly functional and interactive.

* **Key Input:** src/components/PompeyLoop.tsx, src/components/ConnectCalculator.tsx  
* **Key Output:**  
  1. PompeyLoop.tsx (Integrate onSnapshot listener)  
  2. ConnectCalculator.tsx (Integrate new input fields and result display)  
* **Verification Focus:** Do posts appear instantly in the list? Does the calculator trigger the "Benefits Cliff" warning?

### **Phase 4: Integration Layer (The Skin) \- Global Connection**

**Goal:** Ensure navigation, state management, and dependencies are correctly linked.

* **Key Input:** src/App.tsx, src/contexts/AuthContext.tsx  
* **Key Output:** src/App.tsx (Routing and Auth Guards)

## **2\. Specific Prompt Set for AI (Copy & Paste)**

These prompts are optimized for your GitHub codebase structure. Please copy and paste them directly.

### **Prompt 1: Upgrade Core Algorithm (Update Logic)**

Please read the attached file \`Portsmouth 生活成本補助研究.md\` and \`src/services/ConnectLogic.ts\`.

Task: Rewrite the \`calculateConnectBenefits\` function based on the policy document.  
1\. Update the Housing Benefit calculation to use the 2026 Portsmouth LHA Rate (Freeze data: Shared, 1-Bed, etc.).  
2\. Implement the 2026 Banded Scheme for Portsmouth Council Tax Support (Band 1: 90% discount, etc.).  
3\. Add a "Cliff Edge" detection for Free School Meals (Threshold £7,400).  
4\. Add a check for the Southern Water Essentials Tariff (Income \< £21,000).

Please output the complete TypeScript code for \`ConnectLogic.ts\`.

### **Prompt 2: Implement Pompey Loop (Implement Feature)**

Please read \`src/components/PompeyLoop.tsx\`, \`src/lib/firebase.ts\`, and \`src/types/schema.ts\`.

Task: Convert the Pompey Loop from static Mock Data to real-time Firebase data.  
1\. Remove the \`MOCK\_LOOP\` constant.  
2\. Use \`onSnapshot\` to listen to the \`community\_posts\` collection, ordered by \`timestamp\` descending.  
3\. Implement a "Post Item/Skill" Modal form.  
4\. When writing data, include: title, description, category (skill/item), contact, timestamp (serverTimestamp), and userId (from useAuth).  
5\. Maintain the existing Tailwind CSS styling.

Please output the complete component code.

### **Prompt 3: Configure Database Rules (Secure Database)**

Please read \`firestore.rules\`.

Task: Update the security rules to support the new features.  
1\. Allow the \`community\_posts\` collection: Everyone can read (allow read: if true), only authenticated users can write (allow create: if request.auth \!= null).  
2\. Ensure the \`services\` collection remains: Everyone can read, only Partners can write.  
3\. Ensure the \`reports\` collection: Only allow create, no read/update.

Please output the complete content of the \`firestore.rules\` file.

### **Prompt 4: Enhance Data Migration Script (Fix Data Issues)**

Please read \`src/components/DataMigration.tsx\`.

Task: Enhance the \`migrateData\` function to prevent errors during upload.  
1\. Ensure every field in \`ALL\_DATA\` (especially optional ones like \`trustScore\`, \`capacityLevel\`) has a default value (e.g., \`?? null\` or \`?? 0\`) when writing to Firestore.  
2\. Add error handling to log which specific record failed if the batch upload encounters an issue.

Please output the corrected \`DataMigration.tsx\` code.

## **3\. 2026 Portsmouth Key Policy Parameters Cheatsheet**

Use these figures for verification during testing:

| Item | Key Value/Rule | Source |
| :---- | :---- | :---- |
| **LHA (Housing Benefit)** | Frozen at 2024 levels (e.g., 1-Bed approx. £625/month) | Policy Report |
| **Council Tax** | Band 1 (\<£100/week): 90% discount Band 2 (\<£180/week): 65% discount | PCC 2026 Scheme |
| **Free School Meals** | Net earnings threshold £7,400 (excluding benefits) | National Policy |
| **Water Tariff** | Household income \< £21,000 qualifies for discount | Southern Water |
| **HSF (Household Fund)** | Shifted to "Exceptional Hardship" criteria, not general distribution | PCC Strategy |

## **4\. Immediate Next Steps**

1. **Execute Prompts 1 & 2**: Get the logic and features in place first.  
2. **Local Testing**: Run npm run dev and test if the calculator triggers the expected "Benefits Cliff" warning.  
3. **Deploy Database Rules**: Copy the new firestore.rules content into your Firebase Console.  
4. **Final Build**: Run npm run build and deploy.

This guide ensures your app is not just a shell, but a practical tool embedded with "2026 Portsmouth Survival Intelligence."