import Id from "../../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.usecase.dto";

const mockDate = new Date(2000, 1, 1);
describe("place order use case unit test", () => {
  describe("validateProducts method", () => {
    const mockClientFacade: ClientAdmFacadeInterface = {
      find: jest.fn().mockResolvedValue(true),
      add: jest.fn(),
    };

    const mockProductFacade: ProductAdmFacadeInterface = {
      checkStock: jest.fn(({ productId }: { productId: string }) =>
        Promise.resolve({
          productId,
          stock: productId === "1" ? 0 : 1,
        })
      ),
      addProduct: jest.fn(),
    };

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade,
      mockProductFacade,
      null,
      null,
      null,
      null
    );

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when produt not found", async () => {
      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(true),
        add: jest.fn(),
      };

      const mockCatalogFacade: StoreCatalogFacadeInterface = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        mockCatalogFacade,
        null,
        null,
        null
      );

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(true),
        add: jest.fn(),
      };

      const mockProductFacade: ProductAdmFacadeInterface = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        ),
        addProduct: jest.fn(),
      };

      const mockCatalogFacade: StoreCatalogFacadeInterface = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
        findAll: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        mockCatalogFacade,
        null,
        null,
        null
      );

      await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });
  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when client not found", async () => {
      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        null,
        null,
        null
      );

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(true),
        add: jest.fn(),
      };

      const mockProductFacade: ProductAdmFacadeInterface = {
        checkStock: jest.fn(),
        addProduct: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        mockProductFacade,
        null,
        null,
        null,
        null
      );

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1c",
        name: "client 0",
        document: "0000",
        email: "client@user.com",
        street: "some address",
        number: "1",
        complement: "",
        city: "some city",
        state: "RJ",
        zipCode: "000",
      };

      const mockClientFacade: ClientAdmFacadeInterface = {
        find: jest.fn().mockResolvedValue(clientProps),
        add: jest.fn(),
      };

      const mockPaymentFacade: PaymentFacadeInterface = {
        process: jest.fn(),
      };

      const mockCheckoutRepository: CheckoutGateway = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      };

      const mockInvoiceFacade: InvoiceFacadeInterface = {
        generate: jest.fn().mockResolvedValue({ id: "1i" }),
        find: jest.fn(),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockCheckoutRepository,
        mockInvoiceFacade,
        mockPaymentFacade
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "description",
          salesPrice: 40,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "description",
          salesPrice: 30,
        }),
      };

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - spy on private method
        .mockResolvedValue(null);

      const mockGetProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "getProduct")
        //@ts-expect-error - spy on private method
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it("should not be approved", async () => {
        mockPaymentFacade.process = jest.fn().mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          UpdatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenLastCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProducts).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
      });

      it("should be approved", async () => {
        mockPaymentFacade.process = jest.fn().mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          UpdatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenLastCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProducts).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode,
          items: [
            {
              id: products["1"].id.id,
              name: products["1"].name,
              price: products["1"].salesPrice,
            },
            {
              id: products["2"].id.id,
              name: products["2"].name,
              price: products["2"].salesPrice,
            },
          ],
        });
      });
    });
  });
});
