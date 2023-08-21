import { useStyle } from "./components/styles";
import { addLoader, removeLoader } from "./loader";
import { kebabCase } from "./utils";
import { updateOrder } from "./updateOrder";
import { deleteOrder } from "./deleteOrder";

export const createOrderItem = (order,categories) =>{
    const purchase = document.createElement('div');
    purchase.orderId = `purchase-${order.orderId}`;
    purchase.classList.add(...useStyle('purchase'));

    const purchaseTitle = createParagraph(...useStyle('purchaseTitle'));
    purchaseTitle.innerText =order.orderId;
    purchase.appendChild(purchaseTitle);

    const purchaseQuantity = createInput(...useStyle('purchaseQuantity'));
    purchaseQuantity.type ='number';
    purchaseQuantity.min = '1';
    purchaseQuantity.value = `${order.numberOfTickets}`;
    purchaseQuantity.disabled = true;


    const purchaseQuantityWrapper = createDiv(...useStyle('purchaseQuantityWrapper'));
    purchaseQuantityWrapper.append(purchaseQuantity);
    purchase.appendChild(purchaseQuantityWrapper);


    const purchaseType = createSelect(...useStyle('purchaseType'));
    purchaseType.setAttribute('disabled','true');


        const categoriesOptions = categories.map(
            (ticketCategory) =>
            `<option class="text-sm font-bold text-black" value="${ticketCategory.ticketCategoryId}" ${
                ticketCategory.ticketCategoryId === order.ticketCategoryId ? 'selected' : ''
            }>${ticketCategory.description}</option>`
        ).join('\n');
        
    purchaseType.innerHTML = categoriesOptions;
    console.log(purchaseType);
    const purchaseTypeWrapper = createDiv(...useStyle('purchaseTypeWrapper'));
    purchaseTypeWrapper.append(purchaseType);
    purchase.appendChild(purchaseTypeWrapper);

    
    


    const purchaseDate = createDiv(...useStyle('purchaseDate'));
    purchaseDate.innerText = new Date(order.orderedAt).toLocaleDateString();
    purchase.appendChild(purchaseDate);

    const purchasePrice = createDiv(...useStyle('purchasePrice'));
    purchasePrice.innerText = order.totalPrice;
    purchase.appendChild(purchasePrice);

    const actions = createDiv(...useStyle('actions'));
    const cancelButton = createButton([...useStyle(['actionButton','hiddenButton','cancelButton'])], '<i class="fa-solid fa-xmark"></i>',cancelHandler);
    const saveButton = createButton([...useStyle(['actionButton','hiddenButton','saveButton'])], '<i class="fa-solid fa-check"></i>', saveHandler);
    const editButton = createButton([...useStyle(['actionButton','editButton'])], '<i class="fa-solid fa-pencil"></i>', editHandler); 
    const deleteButton = createButton([...useStyle(['actionButton','deleteButton'])], '<i class="fa-solid fa-trash-can"></i>', deleteHandler);

    actions.appendChild(cancelButton);
    actions.appendChild(saveButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    purchase.appendChild(actions);

    function createDiv(...classes){
        const div = document.createElement('div');
        div.classList.add(...classes);
        return div;
    }

    function createParagraph(...classes){
        const p = document.createElement('p');
        p.classList.add(...classes);
        return p;
    }


    function createInput(...classes){
        const input = document.createElement('input');
        input.classList.add(...classes);
        return input;
    }

    function createSelect(...classes){
        const select = document.createElement('select');
        select.classList.add(...classes);
        return select;
    }

    function createButton(classes, innerHTML,handler){
        const button = document.createElement('button');
        button.classList.add(...classes);
        button.innerHTML = innerHTML;
        button.addEventListener('click', handler);
        return button;
    }

   function editHandler(){
        if (saveButton.classList.contains('hidden')&& cancelButton.classList.contains('hidden')){
            saveButton.classList.remove('hidden');
            cancelButton.classList.remove('hidden');
            purchaseType.removeAttribute('disabled');
            purchaseQuantity.removeAttribute('disabled');
            editButton.classList.add('hidden');
        }
    }
 
    function cancelHandler(){
        saveButton.classList.add('hidden');
        cancelButton.classList.add('hidden');
        editButton.classList.remove('hidden');
        purchaseType.setAttribute('disabled','true');
        purchaseQuantity.setAttribute('disabled','true');

        purchaseQuantity.value = order.numberOfTickets;
        Array.from(purchaseType.options).forEach(function(element,index){
            if(element.value == order.ticketCategoryId){
                purchaseType.options.selectedIndex = index;
                return;
            }
        });

    }

    function saveHandler(){
        const newType = purchaseType.value;
        const newQuantity = purchaseQuantity.value;

        if(newType != order.ticketCategoryId || newQuantity != order.numberOfTickets){
            addLoader();
            updateOrder(order.orderId, newType, newQuantity)
            .then((res) => {
                if(res.status === 200){
                    res.json().then((data)=>{
                        order = data;
                        purchasePrice.innerHTML = order.totalPrice;
                        purchaseDate.innerHTML = new Date(order.orderedAt).toLocaleDateString();

                    });
                }
            })
            .catch((err) =>{
                console.error(err);

            })
            .finally(()=>{
                setTimeout(()=>{
                    removeLoader();
                })

            });
        }


    }

    function deleteHandler(){
        deleteOrder(order.orderId);
    }


    return purchase;
};