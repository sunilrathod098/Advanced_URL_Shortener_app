import Analytics from "../Components/Analytics.jsx";
import UrlList from "../Components/UrlList.jsx";

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">Dashboard</h1>
            <UrlList />
            <Analytics />
        </div>
    );
}
