import { getTopById } from "../service";

export default defineEventHandler(async (event) => {
    const id = parseInt(event.context.params!.id);
    return await getTopById(id);
})
