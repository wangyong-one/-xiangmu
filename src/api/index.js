import { get } from './helpers'

const getSeller = get('/api/seller')
const getGoods = get('/api/goods')
// 商家评价是一个单独一个接口
const getRatings = get('/api/ratings')

export {
    getSeller,
    getGoods,
    getRatings
}
