import axios from "axios";
import { useState } from "react";

export default function ShortenForm() {
    const [longUrl, setLongUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/url/short-url", { longUrl });
            setShortUrl(response.data.shortUrl);
            setError("");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to shorten URL");
        }
    };

    return (
        <div className="max-w-md max-auto mt-10">
            <form onSubmit={handleSubmit} className="space-4-y">
                <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="Enter a long URL"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Shorten
                </button>
            </form>
            {shortUrl && (
                <div className="mt-4">
                    <p>
                        Short URL:{" "}
                        <a href={shortUrl} className="text-blue-500">
                            {shortUrl}
                        </a>
                    </p>
                </div>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
