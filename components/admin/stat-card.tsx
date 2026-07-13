import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-slate-900",
}: Props) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-xl ${color} text-white flex items-center justify-center`}
        >
          <Icon size={28} />
        </div>
      </CardContent>
    </Card>
  );
}