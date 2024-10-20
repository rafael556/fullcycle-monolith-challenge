import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";


describe('product repository tests', () => {
    let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should find all products', async () => {
    await ProductModel.create({
        id: '1',
        name: 'product 1',
        description: 'product 1 description',
        salesPrice: 100,
    })

    await ProductModel.create({
        id: '2',
        name: 'product 2',
        description: 'product 2 description',
        salesPrice: 200,
    })

    const productRepository = new ProductRepository()
    const result = await productRepository.findAll();

    expect(result.length).toBe(2);

    const result1 = result[0];
    const result2 = result[1];

    expect(result1.id.id).toBe('1');
    expect(result1.name).toBe('product 1');
    expect(result1.description).toBe('product 1 description');
    expect(result1.salesPrice).toBe(100);

    expect(result2.id.id).toBe('2');
    expect(result2.name).toBe('product 2');
    expect(result2.description).toBe('product 2 description');
    expect(result2.salesPrice).toBe(200);
  })

  it('should find a product', async() => {
    await ProductModel.create({
        id: '1',
        name: 'product 1',
        description: 'product 1 description',
        salesPrice: 100,
    })

    const productRepository = new ProductRepository()
    const result = await productRepository.find('1');

    expect(result.id.id).toBe('1');
    expect(result.name).toBe('product 1');
    expect(result.description).toBe('product 1 description');
    expect(result.salesPrice).toBe(100);
  })
})