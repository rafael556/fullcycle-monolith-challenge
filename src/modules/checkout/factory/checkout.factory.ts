import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.factory";
import ProductAdmFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutRepository from "../repository/checkout.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create() {
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFactory.create();
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const checkoutRepository = new CheckoutRepository();

    const addOrderUseCase = new PlaceOrderUseCase(
      clientAdmFacade,
      productAdmFacade,
      storeCatalogFacade,
      checkoutRepository,
      invoiceFacade,
      paymentFacade
    );

    return new CheckoutFacade({
      addOrder: addOrderUseCase,
    });
  }
}
