import { getPenggunaById } from "../service";

export default defineEventHandler(async (event) => {
    const id = parseInt(event.context.params!.id);
    return await getPenggunaById(id);
})