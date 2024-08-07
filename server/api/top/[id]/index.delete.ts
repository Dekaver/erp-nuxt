import { deleteTop } from "../service";

export default defineEventHandler(async (event) => {
    const id = parseInt(event.context.params!.id);
    return await deleteTop(id);
})
