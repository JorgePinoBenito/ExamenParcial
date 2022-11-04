import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsSchema } from "../db/schemas.ts";
import { Slots } from "../types.ts";
import { SlotsCollection } from "../db/database.ts";
import { dirname } from "https://deno.land/std@0.152.0/path/win32.ts";

type BookSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const releaseSlot = async (ctx: BookSlotContext) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;

    if (
      !value.day ||
      !value.month ||
      !value.year ||
      !value.hour ||
      !value.dni
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Please enter a day, month, year, hour, dni",
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

    const slot = await SlotsCollection.findOne({
      day: value.day,
      month: value.month,
      year: value.year,
      hour: value.hour,
    });
    if (!slot) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Slot not found" };
      return;
    }
    if (!slot.avaiable) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Slot is not free" };
      return;
    } else {
      await SlotsCollection.updateOne(
        { value },
        { $set: { dni: value.dni, avaiable: false } }
      );

      ctx.response.body = { message: "Slot released" };
      ctx.response.status = 200;
    }
    ctx.response.body = { message: "Slot released" };
    ctx.response.status = 200;
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};
