import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }
    );
  }
}
