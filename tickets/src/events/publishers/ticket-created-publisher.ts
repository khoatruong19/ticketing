import { Publisher, Subjects, TicketCreatedEvent } from "@khoatruong/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
}
