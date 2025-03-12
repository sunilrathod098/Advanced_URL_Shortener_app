import axios from "axios";
import { useEffect, useState } from "react";

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get("/api/user/analytics/overall");
                setAnalytics(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics: ", error);
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            {analytics && (
                <div>
                    <p>Total Clicks: {analytics.totalClicks}</p>
                    <p>Unique Users: {analytics.uniqueUsers}</p>
                    <p>Unique Clicks: {analytics.uniqueClicks}</p>
                </div>
            )}
        </div>
    );
}
