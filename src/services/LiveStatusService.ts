import Papa from 'papaparse';

export interface LiveStatus {
    id: string;
    status: 'Open' | 'Closed' | 'Low Stock' | 'Busy' | 'Full';
    urgency: 'None' | 'Low' | 'Normal' | 'High' | 'Critical';
    message: string;
    lastUpdated: string;
}

// 這就是你剛剛提供的 Google Sheet CSV 匯出連結
const LIVE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1GQ1A8zwuViV0_s-UGtYUX0olW2ktZFnGRCfv9bpm5K8/export?format=csv&gid=1864437155";

export const fetchLiveStatus = async (): Promise<Record<string, LiveStatus>> => {
    try {
        // 1. 發送真實的網路請求去抓取 CSV
        const response = await fetch(LIVE_SHEET_URL);
        
        if (!response.ok) {
            throw new Error(`無法讀取表格，HTTP 狀態碼: ${response.status}`);
        }

        // 2. 取得文字內容
        const csvText = await response.text();

        // 3. 使用 PapaParse 解析 CSV
        return new Promise((resolve) => {
            Papa.parse(csvText, {
                header: true, // 告訴解析器第一行是標題 (ID, Status, ...)
                skipEmptyLines: true, // 跳過空行
                complete: (results: any) => {
                    const statusMap: Record<string, LiveStatus> = {};
                    
                    // 4. 將每一列資料轉換成 App 看得懂的格式
                    results.data.forEach((row: any) => {
                        if (row.ID) { // 確保 ID 存在才處理
                            statusMap[row.ID] = {
                                id: row.ID,
                                // 強制轉型為我們定義的狀態字串，若表格沒填則給預設值
                                status: (row.Status as LiveStatus['status']) || 'Open',
                                urgency: (row.Urgency as LiveStatus['urgency']) || 'Normal',
                                message: row.Message || '',
                                lastUpdated: row.LastUpdated || ''
                            };
                        }
                    });
                    
                    // 成功解析，回傳資料
                    console.log("成功載入即時狀態:", Object.keys(statusMap).length + " 筆資料");
                    resolve(statusMap);
                },
                error: (err: any) => {
                    console.error("CSV 解析失敗:", err);
                    resolve({}); // 解析失敗時，回傳空物件，讓 App 繼續運作
                }
            });
        });

    } catch (error) {
        console.error("連線 Google Sheet 失敗:", error);
        // 發生任何網路錯誤時，優雅地回傳空物件，避免 App 當機
        return {}; 
    }
};