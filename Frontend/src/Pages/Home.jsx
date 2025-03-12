import { useState } from "react";

export default function Home() {
    const [title] = useState("Welcome to the URL Shortener App!");
    const [message] = useState(
        "Hi! Do you have an account? If yes, log in with your credentials. If not, sign up to get started!"
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">🎉 {title} 🚀</h1>
            <p className="text-lg text-center mt-10">👋 {message}</p>
        </div>
    );
}
