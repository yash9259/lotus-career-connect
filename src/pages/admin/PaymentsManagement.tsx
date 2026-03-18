import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PaymentRow {
  id: string;
  candidateId: string;
  candidateName: string;
  planName: string;
  amount: number;
  createdAt: string;
  status: string;
}

const formatAmount = (amount: number) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-IN");
};

const statusBadge = (status: string) => {
  if (status === "verified") return "secondary" as const;
  if (status === "rejected") return "destructive" as const;
  return "outline" as const;
};

const PaymentsManagement = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const { data: paymentRows, error: paymentError } = await supabase
          .from("candidate_payments")
          .select("id, candidate_id, plan_id, amount, status, created_at")
          .order("created_at", { ascending: false });

        if (paymentError) throw paymentError;

        const candidateIds = Array.from(new Set((paymentRows || []).map((row) => row.candidate_id)));
        const planIds = Array.from(new Set((paymentRows || []).map((row) => row.plan_id)));

        const [{ data: profiles, error: profileError }, { data: plans, error: planError }] = await Promise.all([
          candidateIds.length > 0
            ? supabase.from("profiles").select("id, full_name").in("id", candidateIds)
            : Promise.resolve({ data: [], error: null }),
          planIds.length > 0
            ? supabase.from("subscription_plans").select("id, name").in("id", planIds)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (profileError) throw profileError;
        if (planError) throw planError;

        const profileById = new Map((profiles || []).map((row) => [row.id, row.full_name || "Unknown"]));
        const planById = new Map((plans || []).map((row) => [row.id, row.name || "Plan"]));

        setPayments(
          (paymentRows || []).map((row) => ({
            id: row.id,
            candidateId: row.candidate_id,
            candidateName: profileById.get(row.candidate_id) || "Unknown",
            planName: planById.get(row.plan_id) || "Plan",
            amount: Number(row.amount || 0),
            createdAt: row.created_at,
            status: row.status,
          })),
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };

    loadPayments();
  }, []);

  const invoices = useMemo(
    () =>
      payments.map((row) => ({
        invoiceNo: `INV-${row.id.slice(0, 8).toUpperCase()}`,
        amount: formatAmount(row.amount),
        generatedAt: formatDate(row.createdAt),
        paymentId: row.id,
      })),
    [payments],
  );

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payments Management</h1>
          <p className="text-sm text-muted-foreground">Payment history and invoices for candidate plans</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[320px] rounded-xl" />
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments Management</h1>
        <p className="text-sm text-muted-foreground">Payment history and invoices for candidate plans</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments yet.</p> : payments.map((row) => (
              <div key={row.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{row.candidateName}</p>
                  <Badge variant={statusBadge(row.status)}>{row.status}</Badge>
                </div>
                <p className="text-muted-foreground">{row.planName} • {formatAmount(row.amount)}</p>
                <p className="text-xs text-muted-foreground mt-1">Payment ID: {row.id} • {formatDate(row.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.length === 0 ? <p className="text-sm text-muted-foreground">No invoices available.</p> : invoices.map((row) => (
              <div key={row.invoiceNo} className="rounded-lg border border-border p-3 text-sm">
                <p className="font-medium">{row.invoiceNo}</p>
                <p className="text-muted-foreground">Amount: {row.amount}</p>
                <p className="text-xs text-muted-foreground mt-1">Generated: {row.generatedAt} • Ref: {row.paymentId}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PaymentsManagement;
