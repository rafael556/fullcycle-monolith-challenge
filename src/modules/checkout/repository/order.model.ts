import { Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import Product from "../domain/product.entity";
import { ClientModel } from "./client.model";
import { ProductModel } from "./product.model";

@Table({
    tableName: 'orders',
    timestamps: false
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;

    @ForeignKey(() => ClientModel)
    @Column({allowNull: false})
    clientId: string;

    @HasMany(() => ProductModel)
    products: Product[];

    @Column({allowNull: false})
    status: string;

    @Column({allowNull: false})
    createdAt: Date;

    @Column({allowNull: false})
    updatedAt: Date;
}