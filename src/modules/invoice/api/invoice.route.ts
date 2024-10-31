import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../factory/invoice.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  const facade = InvoiceFacadeFactory.create();

  try {
    const result = await facade.find({ id: req.params.id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
