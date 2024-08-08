import { getAccount, getAccountByCategory, getAccountCashAble, getAccountKlasifikasi, getAccountMaster, getAccountOption, getAccountSubKlasifikasi, getAccountTransaction } from './service';

export default defineEventHandler(async (event) => {
    try {
        const query: any = await getQuery(event)
        let data;
        if (query.type === 'option') {            
            data = await getAccountOption(query);
        }
        else if (query.category) {
            const { category } = query
            
            const arr = category.toString().split(",").map(Number);
            data = await getAccountByCategory(arr);
        }
        // else if (query.type === 'cashable') {
        //     data = await getAccountCashAble();
        // }
        // else if (query.type === 'transaction') {
        //     data = await getAccountTransaction();
        // }
        // else if (query.type === 'klasifikasi') {
        //     data = await getAccountKlasifikasi();
        // }
        // else if (query.type === 'subklasifikasi') {
        //     data = await getAccountSubKlasifikasi(query);
        // }
        // else if (query.type === 'master') {
        //     data = await getAccountMaster(query);
        // }
        else{
            data = await getAccount();
        }
        return {
            message: 'Success Get Account',
            data,
        };
        
    } catch (error) {
        return handleError(event, error);
    }
});
