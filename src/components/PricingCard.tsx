import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/animate-ui/components/buttons/button";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  buttonText: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean | false;
  href?: string;
}

export default function PricingCard({
  title,
  price,
  buttonText,
  onButtonClick,
  buttonDisabled,
  href,
}: PricingCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-4xl font-extrabold mb-4">{price}</p>
      </CardContent>
      <CardFooter className="text-center">
        {href ? (
          <Link href={href} className="w-full">
            <Button className="w-full" disabled={buttonDisabled}>
              {buttonText}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={onButtonClick}
            className="w-full"
            disabled={buttonDisabled}
          >
            {buttonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
