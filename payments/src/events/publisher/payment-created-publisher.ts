import { PaymentCreatedEvent, Publisher, Subjects } from "@khoatruong/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: PaymentCreatedEvent["subject"] = Subjects.PaymentCreated;
}
