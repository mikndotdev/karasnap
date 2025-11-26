import NumberTicker from "@/components/NumberTicker";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Props {
    title: string;
    value: number;
}

export default function AnimatedStatCard({ title, value }: Props) {
    return (
        <Card className={"flex flex-col items-center justify-center"}>
            <CardContent>
            <NumberTicker
                from={0}
                target={value}
                transition={{ duration: 1 }}
                className="text-4xl font-bold"
            />
            </CardContent>
            <CardFooter>
            <p className="text-lg">{title}</p>
            </CardFooter>
        </Card>
    );
}