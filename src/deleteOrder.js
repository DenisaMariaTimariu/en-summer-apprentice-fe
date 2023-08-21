import { addLoader } from "./loader";
import { removeLoader } from "./loader";

export function deleteOrder(orderId){

    addLoader();

    return fetch('https://localhost:44348/NoOrder',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderId: orderId,
        })
    })
    .then((res) => res.json())
    .then(data =>{
        const purchaseToBeRemoved = document.getElementById(`purchase-${data}`);
        purchaseToBeRemoved.remove();
    })
    .catch((e)=>{
        console.error(e);
    })
    .finally(()=>{
        removeLoader();
    });

}