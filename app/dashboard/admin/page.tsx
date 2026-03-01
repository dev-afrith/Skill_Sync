import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import AdminOverview from "@/components/AdminOverview";
import "../styles.css";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    const role = (session.user as any)?.role;
    if (role !== "ADMIN") redirect("/dashboard");

    return (
        <div className="dashboard-content">
            <AdminOverview adminName={session.user?.name || "Admin"} />
        </div>
    );
}
