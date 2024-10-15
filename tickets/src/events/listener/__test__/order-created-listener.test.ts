import { OrderCreatedEvent, OrderStatus, Subjects } from "@khoatruong/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "asd",
    price: 99,
    userId: "asdhjlkasd",
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "dsnfjlkdshf",
    version: 0,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, ticket, listener, msg };
};

it("reserves a ticket when order created", async () => {
  const { data, ticket, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { data, ticket, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(
    JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  ).toEqual({
    id: updatedTicket!.id,
    price: updatedTicket!.price,
    title: updatedTicket!.title,
    userId: updatedTicket!.userId,
    orderId: updatedTicket!.orderId,
    version: updatedTicket!.version,
  });
});
