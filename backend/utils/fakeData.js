// This File is only for test and not used in the application

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTZkZGVhOWZmMWRmYWI0M2M2NDQ4NCIsImlhdCI6MTcyNzI4MTUyMCwiZXhwIjoxNzI3Mjg1MTIwfQ.u_FT4UFpW9ra0x56Uskie-hu3fJvFW5qpmJ1ZuOaUUY'

function getUID() {

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

async function addMarketItems() {
    let items = [
        {name: 'Cola', icon: '/images/marketicons/nescafe.png'},
        {name: '7UP', icon: '/images/marketicons/7up.png'},
        {name: 'Apple Mirnda', icon: '/images/marketicons/apple.png'},
        {name: 'Mirnda', icon: '/images/marketicons/mirnda-orange.png'},
        {name: 'Coffee', icon: '/images/marketicons/coffee.png'},
        {name: 'Indomi', icon: '/images/marketicons/indomi.png'},
        {name: 'Mangoo', icon: '/images/marketicons/mango-juice.png'},
        {name: 'Orange', icon: '/images/marketicons/orange-juice.png'},
        {name: 'Pepsi', icon: '/images/marketicons/pepsi.png'},
        {name: 'Tea', icon: '/images/marketicons/tea.png'},
        {name: 'Water', icon: '/images/marketicons/water.png'},
    ]
    try {
        for(let i = 1;i <= 35;i++) {
            const item = items[Math.floor(Math.random()*items.length)]
            const res = await fetch("http://localhost:8080/api/market", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token
                },
                body: JSON.stringify({
                    localId: getUID(),
                    name: item.name + ' ' + Math.floor( Math.random() * 100 ),
                    price: Math.floor( Math.random() * 100 ),
                    icon: item.icon,
                    stowage: Math.floor( Math.random() * 100 )
                })
            })
            const data = await res.json()
            console.log(data.name);
        }
    } catch(err) {
        console.log(err);
    }
}


addMarketItems()