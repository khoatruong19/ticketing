import { OrderCancelledEvent, Publisher, Subjects } from "@khoatruong/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
}
