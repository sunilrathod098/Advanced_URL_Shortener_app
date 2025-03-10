import axios from "axios";
import { useEffect, useState } from "react";

export default function UrlList() {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const response = await axios.get("/api/url/urls");
                setUrls(response.data.allUserUrls);
            } catch (error) {
                console.error("Failed to fetch URLs: ", error);
            }
        };
        fetchUrls();
    }, []);

    return (
        <div className="mt-10">
            <h2 className="text-xl font-bold md-4">Your URLs</h2>
            <ul className="space-y-2">
                {urls.map((url) => (
                    <li key={url._id} className="border p-2 rounded">
                        <a href={url.shortUrl} className="text-blue-500">
                            {url.shortUrl}
                        </a>
                        <p>{url.longUrl}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
