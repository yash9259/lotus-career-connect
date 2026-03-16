import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Zap, Star, CreditCard, CheckCircle2 } from "lucide-react";

const plans = [
  {
    id: "priority",
    name: "Priority Application",
    price: "₹199",
    period: "per application",
    icon: Zap,
    features: [
      "Your application appears on top",
      "Employer sees 'Priority' badge",
      "2x more likely to get shortlisted",
    ],
  },
  {
    id: "highlighted",
    name: "Highlighted Profile",
    price: "₹499",
    period: "per month",
    icon: Star,
    features: [
      "Profile highlighted in search results",
      "Featured candidate badge",
      "Direct employer visibility",
      "Priority in job matching",
    ],
    popular: true,
  },
];

const DashboardPayment = () => {
  const handlePay = (planName: string) => {
    toast.info(`${planName} payment integration coming soon. Supports UPI & Razorpay.`);
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-foreground mb-1">Premium Features</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Boost your visibility and get hired faster
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-card rounded-xl shadow-card p-6 relative ${
              plan.popular ? "ring-2 ring-primary" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2.5 right-4 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <plan.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
              </div>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-foreground tabular-nums">{plan.price}</span>
              <span className="text-sm text-muted-foreground ml-1">/{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handlePay(plan.name)}
            >
              Get {plan.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div className="bg-card rounded-xl shadow-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4" /> Supported Payment Methods
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">
              UPI
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">UPI Payment</p>
              <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">
              RP
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Razorpay</p>
              <p className="text-xs text-muted-foreground">Cards, Net Banking, Wallets</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPayment;
