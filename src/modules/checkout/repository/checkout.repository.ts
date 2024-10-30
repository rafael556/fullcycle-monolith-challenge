import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        products: order.products.map((p) => ({
          id: p.id.id,
          name: p.name,
          description: p.description,
          salesPrice: p.salesPrice,
          orderId: order.id.id,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      { include: [{ model: ProductModel }] }
    );
  }
}
