module.exports = function getMarketItemUID() {

    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let nums = `${Math.floor(Math.random() * Date.now())}`
    let randIndexes = [
        Math.floor(Math.random() * chars.length),
        Math.floor(Math.random() * chars.length),
        Math.floor(Math.random() * chars.length)
    ]

    let uid = '';
    randIndexes.forEach(i => uid+= chars[i])
    uid += nums.substring(0, 3);

    return uid

}