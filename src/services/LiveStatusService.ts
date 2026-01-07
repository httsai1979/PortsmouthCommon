
import Papa from 'papaparse';

// Mock Data for "Live Status" until user connects real sheet
// In production, this would be fetched from the Published Sheet CSV URL
const MOCK_LIVE_DATA_CSV = `
ID,Status,Urgency,Message,LastUpdated
fb1,Low Stock,High,Urgent need for canned meat and long-life milk.,10:30 AM
sh1,Open,Normal,3 emergency beds available for tonight.,09:15 AM
sh3,Open,Normal,Breakfast service ending soon. Lunch packing starts at 12.,11:00 AM
w1,Busy,Low,Library is warm but seating is limited right now.,10:45 AM
p_pfc,Closed,None,Closed for staff training today.,08:00 AM
`;

export interface LiveStatus {
    id: string;
    status: 'Open' | 'Closed' | 'Low Stock' | 'Busy' | 'Full';
    urgency: 'None' | 'Low' | 'Normal' | 'High' | 'Critical';
    message: string;
    lastUpdated: string;
}

// Configuration: Replace this with the user's published Google Sheet CSV link
// Example: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT..../pub?output=csv"
const LIVE_SHEET_URL = "";

export const fetchLiveStatus = async (): Promise<Record<string, LiveStatus>> => {
    return new Promise((resolve) => {
        // Simulation of network request
        setTimeout(() => {
            // In real implementation: 
            // const response = await fetch(LIVE_SHEET_URL);
            // const csvText = await response.text();

            // For now, use mock string
            const csvText = MOCK_LIVE_DATA_CSV.trim();

            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const statusMap: Record<string, LiveStatus> = {};
                    results.data.forEach((row: any) => {
                        if (row.ID) {
                            statusMap[row.ID] = {
                                id: row.ID,
                                status: row.Status,
                                urgency: row.Urgency,
                                message: row.Message,
                                lastUpdated: row.LastUpdated
                            };
                        }
                    });
                    resolve(statusMap);
                }
            });
        }, 1000); // Simulate network delay
    });
};
