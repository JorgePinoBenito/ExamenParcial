import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import { getAvailableSlots } from "./resolvers/get.ts";
import { removeSlot } from "./resolvers/delete.ts";
import { releaseSlot } from "./resolvers/put.ts";
import { postSlots } from "./resolvers/post.ts";

const router = new Router();

router
  .get("/availableSlots", getAvailableSlots)
  .delete("/removeSlot", removeSlot)
  .post("/addSlot", postSlots)
  .put("/bookSlot", releaseSlot);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
