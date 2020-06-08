import storage from 'good-storage'

const SELLER_KEY = '__seller__'

// 进行存储键 id key val
export function saveToLocal(id, key, val) {
  // 在这里面 seller 可能是一个空数组2
  const seller = storage.get(SELLER_KEY, {})
  if (!seller[id]) {
    seller[id] = {}
  }
  seller[id][key] = val
  storage.set(SELLER_KEY, seller)
}

// 取也是对应上面的键 如果取不到的话 就用默认值 def
export function loadFromLocal(id, key, def) {
  const seller = storage.get(SELLER_KEY, {})
  if (!seller[id]) {
    return def
  }
  return seller[id][key] || def
}
