import { OrderCancelledEvent, OrderStatus } from "@khoatruong/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "asd",
    price: 99,
    userId: "asdhjlkasd",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, ticket, orderId, listener, msg };
};

it("unreserves a ticket when order cancelled", async () => {
  const { data, ticket, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
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
