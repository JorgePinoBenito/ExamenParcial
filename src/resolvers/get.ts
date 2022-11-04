import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../db/database.ts";
import { SlotsSchema } from "../db/schemas.ts";

type GetAvailableSlotsContext = RouterContext<
  "/availableSlots",
  {
    day: number;
    month: number;
    year: number;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getAvailableSlots = async (ctx: GetAvailableSlotsContext) => {
  try {
    const day = ctx.params?.day;
    const month = ctx.params?.month;
    const year = ctx.params?.year;

    if (day == null || month == null || year == null) {
      ctx.response.status = 403;
      ctx.response.body = { message: "Bad request" };
      return;
    } else if (day < 1 || day > 31 || month < 1 || month > 12 || year < 0) {
      ctx.response.status = 500;
      return;
    } else {
      if (day === null) {
        const slots = await SlotsCollection.find({
          month: month,
          year: year,
          avaiable: true,
        }).toArray();
        ctx.response.body = slots;
      } else if (day !== null) {
        const slotswithday = await SlotsCollection.find({
          day: day,
          month: month,
          year: year,
          avaiable: true,
        }).toArray();
        ctx.response.body = slotswithday;
      } else {
        ctx.response.status = 404;
        const arr: SlotsSchema[] = [];
        ctx.response.body = arr;
        ctx.response.body = { message: "No slots available" };
        return;
      }
    }
  } catch (e) {
    console.log(e);
    ctx.response.status = 500;
  }
};
