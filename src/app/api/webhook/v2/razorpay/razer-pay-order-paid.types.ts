export type PaymentEntity = {
  id: string;
  entity: "payment";
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  invoice_id: string | null;
  international: boolean;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string;
  contact: string;
  notes: any;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  created_at: number;
};

export type OrderEntity = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: any;
  created_at: number;
};

export type OrderPaidEventPayload = {
  payment: {
    entity: PaymentEntity;
  };
  order: {
    entity: OrderEntity;
  };
};

export type OrderPaidWebhookEvent = {
  entity: "event";
  account_id: string;
  event: "order.paid";
  contains: ["payment", "order"];
  payload: OrderPaidEventPayload;
  created_at: number;
};
