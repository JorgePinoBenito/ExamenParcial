import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsSchema } from "../db/schemas.ts";
import { Slots } from "../types.ts";
import { SlotsCollection } from "../db/database.ts";

type RemoveSlotContext = RouterContext<
  "/removeSlot",
  {
    day: number;
    month: number;
    year: number;
    hour: number;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeSlot = async (ctx: RemoveSlotContext) => {
  try {
    const day = ctx.params?.day;
    const month = ctx.params?.month;
    const year = ctx.params?.year;
    const hour = ctx.params?.hour;
    const slot = await SlotsCollection.findOne({
      day: day,
      month: month,
      year: year,
      hour: hour,
    });
    if (!slot) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Slot not found" };
      return;
    } else if (slot && !slot.avaiable) {
      ctx.response.status = 403;
      ctx.response.body = { message: "Slot is not free" };
      return;
    } else if (slot && slot.avaiable) {
      await SlotsCollection.deleteOne({
        day: day,
        month: month,
        year: year,
        hour: hour,
      });
      ctx.response.body = { message: "Slots removed" };
      ctx.response.status = 200;
    }
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};
