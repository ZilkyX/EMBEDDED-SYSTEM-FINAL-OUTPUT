import { DashboardCharts } from "@/components/DashboardChart";
import DashboardHeader from "@/components/DashboardHeader";
import SensorReadingsPage, { SensorDataTable } from "@/components/DataTable";
import PHMeter from "@/components/PHMeter";
import RecommendationsCard from "@/components/RecommendationsCard";
import TDSHorizontalMeter from "@/components/TDSMeter";
import TemperatureMeter from "@/components/TemperatureCard";

export default function DashboardPage() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <RecommendationsCard />
          <TemperatureMeter />
        </div>

        <div className="flex flex-col gap-6">
          <PHMeter />
          <TDSHorizontalMeter />
        </div>
      </div>

      <div className="w-full">
        <DashboardCharts />
        <SensorReadingsPage />
      </div>
    </div>
  );
}
