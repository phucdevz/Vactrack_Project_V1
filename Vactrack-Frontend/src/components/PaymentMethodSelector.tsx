
import * as React from "react";
import { Check, CreditCard, Landmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodProps extends React.HTMLAttributes<HTMLDivElement> {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PaymentMethodItem = React.forwardRef<HTMLDivElement, PaymentMethodProps>(
  ({ selected, icon, title, description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start space-x-4 rounded-md border p-4 cursor-pointer transition-all",
          selected ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-brand-200 hover:bg-gray-50",
          className
        )}
        {...props}
      >
        <div className={cn("shrink-0 rounded-full p-2", selected ? "bg-brand-100" : "bg-gray-100")}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{title}</h3>
            {selected && <Check className="h-4 w-4 text-brand-500" />}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    );
  }
);

PaymentMethodItem.displayName = "PaymentMethodItem";

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const paymentMethods = [
    {
      id: "direct",
      title: "Thanh toán trực tiếp",
      description: "Thanh toán tại cơ sở khi đến tiêm",
      icon: <Wallet className="h-4 w-4 text-green-600" />
    },
    {
      id: "banking",
      title: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản qua tài khoản ngân hàng",
      icon: <Landmark className="h-4 w-4 text-blue-600" />
    },
    {
      id: "online",
      title: "Thanh toán online",
      description: "Thanh toán qua QR code",
      icon: <CreditCard className="h-4 w-4 text-purple-600" />
    }
  ];

  return (
    <div className="grid gap-3">
      {paymentMethods.map((method) => (
        <PaymentMethodItem
          key={method.id}
          icon={method.icon}
          title={method.title}
          description={method.description}
          selected={value === method.id}
          onClick={() => onChange(method.id)}
        />
      ))}
    </div>
  );
}
