import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
    tableName: "products",
    timestamps: false,
  })
export class ProductModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;

    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    description: string;

    @Column({allowNull: true})
    salesPrice: number;

    @Column({allowNull: true})
    stock: number;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: true })
    orderId: string;

    @Column({allowNull: false})
    createdAt: Date;

    @Column({allowNull: false})
    updatedAt: Date;
}