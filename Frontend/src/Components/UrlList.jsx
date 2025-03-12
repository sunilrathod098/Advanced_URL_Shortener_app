import axios from "axios";
import { useEffect, useState } from "react";

export default function UrlList() {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const fetchUrls = async () => {
        try {
            const response = await axios.get("/api/url/urls");
            setUrls(response.data.allUserUrls || []);
        } catch (error) {
            console.error("Failed to fetch URLs: ", error);
            setUrls([]);
        }
        };
        fetchUrls();
    }, []);

    return (
        <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Your URLs</h2>
        {urls.length > 0 ? (
            <ul className="space-y-2">
            {urls.map((url) => (
                <li key={url._id} className="border p-2 rounded">
                <a
                    href={url.shortUrl}
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {url.shortUrl}
                </a>
                <p>{url.longUrl}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-500">No URLs found.</p>
        )}
        </div>
    );
}