import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  getCurrencies,
  getExchangeRates,
} from "./currencies.controller.js";

const currenciesRouter = Router();
currenciesRouter.use(authenticate);
currenciesRouter.get("/", getCurrencies);

const exchangeRatesRouter = Router();
exchangeRatesRouter.use(authenticate);
exchangeRatesRouter.get("/:currency", getExchangeRates);

export { currenciesRouter, exchangeRatesRouter };
