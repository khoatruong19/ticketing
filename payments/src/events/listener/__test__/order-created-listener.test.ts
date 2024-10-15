import { OrderCreatedEvent, OrderStatus } from "@khoatruong/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "dsfdf",
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
    userId: "asdsd",
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("should save an order", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const savedOrder = await Order.findById(data.id);

  expect(savedOrder).toBeDefined();
  expect(savedOrder!.id).toEqual(data.id);
  expect(msg.ack).toHaveBeenCalled();
});
