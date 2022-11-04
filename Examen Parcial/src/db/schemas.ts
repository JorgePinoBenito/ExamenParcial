import { Slots } from "../types.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export type SlotsSchema = Slots & { _id: ObjectId };
