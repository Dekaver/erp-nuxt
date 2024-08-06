import { getOptionPegawai, getPegawai } from "./service";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    if (query.type == 'option') {
        const data = await getOptionPegawai(query);
        return {
            message: 'Success Get Option Pegawai',
            data
        }
    }
    const data = await getPegawai();
    return {
        message: 'Success Get Pegawai',
        data
    };
})