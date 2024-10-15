import { Publisher, Subjects, TicketUpdatedEvent } from "@khoatruong/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
}
