import { ReactElement } from "react";
import DashboardCard from "~/components/dashboard/dashboard-card";

const RecentRecords = (): ReactElement => (
    <DashboardCard className="hidden lg:flex w-70">
        Recent Records
    </DashboardCard>
);
export default RecentRecords;
