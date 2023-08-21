export function updateOrder(orderId,newType,newQuantity){
    return fetch('https://localhost:44348/OrderId', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId: orderId,
            ticketCategoryId: newType,
            numberOfTickets: newQuantity,
        })
    }).then((res) =>{
        if(res.status === 200){
        }else{
        }

        return res;
    }).catch((err) =>{
        throw new Error(err);
    })
}