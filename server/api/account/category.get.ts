import { getAccountByCategory } from "./service"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let data;
  if (query.category){
    const { category } = query
    const arr = category.toString().split(",").map(Number);
    console.log(arr)
    data = getAccountByCategory(arr)
  }
  return {
    message: 'Success Get Account',
    data,
  };
})
