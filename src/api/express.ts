import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { checkoutRoute } from "../modules/checkout/api/checkout.route";
import { Umzug } from "umzug";
import OrderModel from "../modules/checkout/repository/order.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../modules/invoice/repository/invoice-items.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { migrator } from "../migrations/config-migrations/migrator";
import { ClientModel as CheckoutClientModel } from "../modules/checkout/repository/client.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { ProductModel as ProductAdmProductModel } from "../modules/product-adm/repository/product.model";
import { ProductModel as CheckoutProductModel } from "../modules/checkout/repository/product.model";
import ProductModel from "../modules/store-catalog/repository/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/checkout", checkoutRoute);

let sequelize: Sequelize;
let migration: Umzug<any>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    OrderModel,
    CheckoutClientModel,
    CheckoutProductModel,
    ClientModel,
    ProductAdmProductModel,
    ProductModel,
    InvoiceModel,
    InvoiceItemsModel,
    TransactionModel,
  ]);
  migration = migrator(sequelize);
  await migration.up();
}
setupDb();
