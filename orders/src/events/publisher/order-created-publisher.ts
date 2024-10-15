import { OrderCreatedEvent, Publisher, Subjects } from "@khoatruong/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
}
