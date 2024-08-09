import { indexProvinsi } from "./indo/service"
export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    return;
  }
  const url = event.context.params.endpoint
  const query = getQuery(event)
  if (url[0] === 'provinsi') {
    return indexProvinsi()
  }
  return url
})
