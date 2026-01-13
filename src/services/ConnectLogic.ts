import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

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

/**
 * Portsmouth Connect Logic Engine - Serverless Proxy
 * Moves sensitive benefit calculations to secure Firebase Cloud Functions.
 */
export const calculateConnectBenefits = async (input: ConnectInput): Promise<ConnectResult> => {
    try {
        const calculateBenefits = httpsCallable<ConnectInput, ConnectResult>(functions, 'calculateBenefits');
        const result = await calculateBenefits(input);
        return result.data;
    } catch (error) {
        console.error("Cloud Function 'calculateBenefits' failed:", error);
        throw new Error("We encountered a problem calculating your benefits. Please try again later.");
    }
};
