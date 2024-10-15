import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@khoatruong/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: ExpirationCompleteEvent["subject"] = Subjects.ExpirationComplete;
}
