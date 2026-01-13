export interface ConnectInput {
    postcode: string;
    tenure: 'rent_private' | 'rent_social' | 'owner' | 'mortgage';
    rentAmount: number;
    adults: number;
    children: number;
    childAges: number[];
    isDisabled: boolean;
    netMonthlyIncome: number;
    hasUC: boolean;
    hasChildBenefit: boolean;
    isSouthernWater: boolean;
    isEnergyDebt: boolean;
    isPregnant: boolean;
}

export interface Recommendation {
    id: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    desc: string;
    longDesc: string;
    steps: string[];
    link?: string;
    authority: string;
}

export interface ConnectResult {
    monthlyShortfall: number;
    unclaimedValue: number;
    alerts: Array<{
        type: 'warning' | 'opportunity' | 'info';
        title: string;
        message: string;
        actionLabel?: string;
        actionType?: string;
        detailedInfo?: string;
    }>;
    recommendations: Recommendation[];
}

export const calculateConnectBenefits = (input: ConnectInput): ConnectResult => {
    const results: ConnectResult = {
        monthlyShortfall: 0,
        unclaimedValue: 0,
        alerts: [],
        recommendations: []
    };

    const annualIncome = input.netMonthlyIncome * 12;

    // --- TIER 1: UNIVERSAL CREDIT ESTIMATION ---
    // Using 2026/27 projected rates
    let ucAllowance = input.adults > 1 ? 615 : 410;
    ucAllowance += input.children * 290;

    let housingAllowance = 0;
    if (input.tenure.startsWith('rent')) {
        // Portsmouth BRMA LHA rates (Approx 2026/27)
        const lhaCap = input.children > 1 ? 1100 : (input.children === 1 ? 875 : 720);
        housingAllowance = Math.min(input.rentAmount, lhaCap);
        const shortfall = input.rentAmount - housingAllowance;
        if (shortfall > 0) {
            results.monthlyShortfall += shortfall;
            results.recommendations.push({
                id: 'dhp',
                priority: 'high',
                title: 'Discretionary Housing Payment (DHP)',
                desc: `You have a housing shortfall of £${Math.round(shortfall)}/mo.`,
                longDesc: 'DHP is a top-up payment from Portsmouth City Council for people whose benefits don\'t cover their full rent.',
                steps: [
                    'Gather your latest bank statements (last 2 months)',
                    'Prepare your tenancy agreement',
                    'Explain why your current housing is essential for your family',
                    'Submit via the PCC online portal'
                ],
                link: 'https://www.portsmouth.gov.uk/services/benefits/discretionary-housing-payments/',
                authority: 'Portsmouth City Council'
            });
        }
    }

    const totalUCMax = ucAllowance + housingAllowance;
    const taperRate = 0.55;
    const earningsDisregard = input.children > 0 || input.isDisabled ? 420 : 0;
    const countableEarnings = Math.max(0, input.netMonthlyIncome - earningsDisregard);
    const estimatedUC = Math.max(0, totalUCMax - (countableEarnings * taperRate));

    if (!input.hasUC && estimatedUC > 20) {
        results.unclaimedValue += estimatedUC;
        results.recommendations.push({
            id: 'uc_apply',
            priority: 'high',
            title: 'Universal Credit Eligibility',
            desc: `You might be missing out on £${Math.round(estimatedUC)} every month.`,
            longDesc: 'Universal Credit is an all-in-one payment to help with your living costs if you\'re on a low income or out of work.',
            steps: [
                'Create a Government Gateway account',
                'Verify your identity (using an ID or Post Office check)',
                'Input your income and housing details accurately',
                'Attend a meeting at the Portsmouth Jobcentre (Arundel St or Cosham)'
            ],
            link: 'https://www.gov.uk/universal-credit/how-to-claim',
            authority: 'DWP'
        });
    }

    // --- TIER 2: LOCAL OVERLAY ---

    // Council Tax banded income scheme (PCC 2026/27)
    if (annualIncome < 26000) {
        results.alerts.push({
            type: 'opportunity',
            title: 'Portsmouth Council Tax Support',
            message: 'Portsmouth uses a "Banded Scheme." Your income level suggests an 80-100% reduction.',
            detailedInfo: 'Portsmouth City Council allows low-income households to pay significantly less Council Tax. This is local, not part of Universal Credit.'
        });
        results.unclaimedValue += 95;
        results.recommendations.push({
            id: 'ctax_reduction',
            priority: 'medium',
            title: 'Council Tax Banded Scheme',
            desc: 'Potential saving of approx. £1,100 per year.',
            longDesc: 'PCC provides a simpler way to get support based on which income "band" you fall into.',
            steps: [
                'Find your latest Council Tax bill number',
                'Have your income proof or UC award letter ready',
                'Fill in the Banded Scheme application form'
            ],
            link: 'https://www.portsmouth.gov.uk/services/benefits/council-tax-support/',
            authority: 'Portsmouth City Council'
        });
    }

    // Southern Water Essentials
    if (input.isSouthernWater && annualIncome < 22000) {
        results.unclaimedValue += 25;
        results.recommendations.push({
            id: 'southern_water',
            priority: 'high',
            title: 'Southern Water Essentials Tariff',
            desc: 'Save up to 90% on your water bill.',
            longDesc: 'Southern Water offers huge discounts for households with combined income below £21-22k.',
            steps: [
                'Download the Essentials Tariff application form',
                'Ask a local support worker (CAB or HIVE) to verify your income if possible',
                'Submit via email or post'
            ],
            link: 'https://www.southernwater.co.uk/account/help-with-paying-your-bill',
            authority: 'Southern Water'
        });
    }

    // Energy Debt LEAP Support
    if (input.isEnergyDebt || annualIncome < 21000) {
        results.recommendations.push({
            id: 'leap_energy',
            priority: 'high',
            title: 'LEAP Energy Support',
            desc: 'Free boiler repairs or insulation grants.',
            longDesc: 'The Local Energy Advice Partnership (LEAP) provides free home energy visits and can help clear energy debts for Portsmouth residents.',
            steps: [
                'Book a free home visit via LEAP online',
                'Check eligibility for a free boiler replacement',
                'Get free "easy measures" like draught-proofing installed'
            ],
            link: 'https://applyforleap.org.uk/',
            authority: 'LEAP Portsmouth'
        });
    }

    // Pregnancy / New Baby Healthy Start
    if (input.isPregnant || (input.children > 0 && input.childAges.some(a => a < 4))) {
        results.recommendations.push({
            id: 'healthy_start',
            priority: 'medium',
            title: 'NHS Healthy Start Card',
            desc: 'Free milk, fruit, and vegetables.',
            longDesc: 'If you’re more than 10 weeks pregnant or have a child under 4, you may be entitled to help to buy healthy food and milk.',
            steps: [
                'Check your Benefit Award letter (UC or Child Tax Credit)',
                'Apply for the Healthy Start prepaid mastercard',
                'Use at any grocer or pharmacy in the city'
            ],
            link: 'https://www.healthystart.nhs.uk/',
            authority: 'NHS'
        });
    }

    // --- TIER 3: CLIFF WARNINGS ---
    const fsmThreshold = 7400 / 12;
    if (input.netMonthlyIncome > fsmThreshold && input.netMonthlyIncome < fsmThreshold + 150) {
        results.alerts.push({
            type: 'warning',
            title: 'FSM "Benefits Cliff" Risk',
            message: 'A minor pay rise could cost you £900/year in Free School Meals value.',
            detailedInfo: 'The eligibility for Free School Meals is linked to a hard earnings cap of £7,400. If you earn £7,401, you lose all school meals. This is the most dangerous "cliff" in the UK system.'
        });
        results.recommendations.push({
            id: 'pension_shield',
            priority: 'medium',
            title: 'The Pension Contribution Shield',
            desc: 'Strategy to retain Free School Meals eligibility.',
            longDesc: 'Net earnings are calculated AFTER pension contributions. By increasing your pension by £10-20/mo, you can keep your school meals worth £900/yr.',
            steps: [
                'Check your payslip for "Net Earnings for UC"',
                'If close to £616/mo, ask your employer to increase your voluntary pension contribution',
                'Notify UC of the change in net pay'
            ],
            authority: 'Connect Intelligence'
        });
    }

    return results;
};
