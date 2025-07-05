"use client";
import { useParams } from "next/navigation";

import TransactionForm from "@/components/TransactionForm";

export default function TransactionUpdatePage() {
  const params = useParams();
  const transactionId = params.id as string;

  return <TransactionForm mode="update" transactionId={transactionId} />;
}
