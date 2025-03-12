import ShortenForm from "../Components/ShortenForm.jsx";
import Analytics from "../Components/Analytics.jsx";
import UrlList from "../Components/UrlList.jsx";

export default function Dashboard() {
    return (
        <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
        <ShortenForm />
        <div className="mt-10">
            <UrlList />
            <Analytics />
        </div>
        </div>
    );
}
