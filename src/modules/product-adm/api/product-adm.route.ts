import express, { Request, Response } from "express";
import ProductAdmFactory from "../factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const facade = ProductAdmFactory.create();

  try {
    await facade.addProduct(req.body);
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});
