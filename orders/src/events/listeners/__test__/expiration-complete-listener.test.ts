import {
  ExpirationCompleteEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "@khoatruong/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "nice",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: "dasfdf",
    status: OrderStatus.Created,
    ticket: ticket,
    expiresAt: new Date(),
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

it("should cancelled the order", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order);
  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(
    JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]).id
  ).toEqual(updatedOrder!.id);

  expect(msg.ack).toHaveBeenCalled();
});
