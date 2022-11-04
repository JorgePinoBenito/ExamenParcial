import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsSchema } from "../db/schemas.ts";
import { Slots } from "../types.ts";
import { SlotsCollection } from "../db/database.ts";

type PostSlotsContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postSlots = async (ctx: PostSlotsContext) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;

    if (!value.day || !value.month || !value.year || !value.hour) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Please enter a day, month, year, hour",
      };
      return;
    } else if (
      value.day < 1 ||
      value.day > 31 ||
      value.month < 1 ||
      value.month > 12 ||
      value.year < 0 ||
      value.hour > 24 ||
      value.hour < 0
    ) {
      ctx.response.status = 406;
      return;
    }

    const found = await SlotsCollection.findOne({
      day: value.day,
      month: value.month,
      year: value.year,
      hour: value.hour,
    });
    if (found && !found.avaiable) {
      ctx.response.status = 409;
      ctx.response.body = { message: "Slot already exists and is not free" };
      return;
    } else if (found && found.avaiable) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Slot already exists and is free" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Slot not found" };
      return;
    }
    await SlotsCollection.insertOne({
      ...value,
      avaiable: true,
    });
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};
