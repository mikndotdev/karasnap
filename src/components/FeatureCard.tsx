import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
    const Icon = icon;
    return (
        <Card className="w-full">
            <CardHeader className="flex items-center space-x-4">
                <Icon className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-bold">{title}</h2>
            </CardHeader>
            <CardContent>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}
