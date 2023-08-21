import { useStyle } from "./src/components/styles";
import { addPurchase, kebabCase } from "./src/utils";
import { removeLoader,addLoader } from "./src/loader";
import { createOrderItem } from "./src/createOrderItem";


let eventData = null;

// Navigate to a specific URL
function navigateTo(url) { 
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() { 
  return `
 
   <div id="content" >
      <div class="events flex items-center justify-center flex-wrap">
   
</div>
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() { 
  return `
    <div id="content" class='hidden'>
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="purchases ml-6 mr-6">
        <div class="bg-white px-4 py-3 gap-x-4 flex font-bold">
            <button class="flex flex-1 text-center justify-center" id="sorting-button-1">
              <span>Order Id</span>
              <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-1"></i>
            </button>
            <span class="flex-1">Tickets number</span>
            <span class="flex-1">Category</span>
            <span class="flex-1 hidden md:flex">Date</span>
           <button class="hidden md:flex text-center justify-center align-items:center"  id="sorting-button-2">
            <span>Price</span>
            <i class="fa-solid fa-arrow-up-wide-short text-xl" id="sorting-icon-2"></i>
          </button>
          <span class="w-28 sm:w-8"></span>
        </div>
        <div id="purchases-content">
         </div>
      </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');//ia toate link-urile pe care le gaseste in parintele nav(index.html)
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => { //seteaza ce tip de event vrem, la click se intampla cv cand apas pe el
      event.preventDefault();//daca apas pe ceva de pe pagina nu vr sa faca refresh ci sa ramana acolo
      const href = link.getAttribute('href');//navigatie dinamica(in functie de ce alegem ni se incarca home sau orders)
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}


function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();

  setUpFilterEvents();
  addLoader();

  fetchTicketEvents().then(data =>{
     addEvents(data);
     eventData = data;
     setTimeout(() =>{
       removeLoader();
     },200);
   });

  }

  async function fetchTicketEvents(){
     const response =await fetch('https://localhost:44348/AllEvents');
     const data =await response.json();
     return data;
  }

  const addEvents = (events)=>{
    console.log(events);
    const eventsDiv = document.querySelector('.events');
    eventsDiv.innerHTML = 'No events';
    if(events.length){
      eventsDiv.innerHTML ='';
      events.forEach((event) =>{
        eventsDiv.appendChild(createEvent(event));
      });
    }
  };

  
  // Create the event card element
  const createEvent = (eventData) => {
      const eventElement =createEventElement(eventData);
      return eventElement;
      
      
  };

    const createEventElement = (eventData) => {

    const title = kebabCase(eventData.name);
    const {eventId,name,eventDescription,eventType,location} = eventData;
    const eventDiv = document.createElement('div');
    const eventWrapperClasses = useStyle('eventWrapper');
    const actionsWrapperClasses = useStyle('actionsWrapper');
    const quantityClasses = useStyle('quantity');
    const inputClasses = useStyle('input');
    const quantityActionClasses = useStyle('quantityActions');
    const increaseBtnClasses = useStyle('increaseBtn');
    const decreaseBtnClasses = useStyle('decreaseBtn');
    const addToCartBtnClasses = useStyle('addToCartBtn');

    eventDiv.classList.add(...eventWrapperClasses);

   

    const contentMarkup = `
    <header>
      <h2 class="event-title text-2xl font-bold" style="text-align: center;">${eventData.name}</h2>
    </header>
    <div style="text-align: center;" class="content" >
      <img src="src/assets/${eventData.name.toLowerCase()}.jpg" width="300" height="200" alt="${eventData.name}" class="event-image w-full height-200 rounded object-cover mb-4" style="display: block; margin: 0 auto;">
      <p class="description text-gray-700" style="font-size:20px">${eventData.eventDescription}</p>
    </div>
  `;
  eventDiv.innerHTML = contentMarkup;

  //Create ticket type selection and quantity input
  const actions = document.createElement('div');
  actions.classList.add(...actionsWrapperClasses);


  const ticketTypeMarkup = `
  <h2 class="text-lg font-bold mb-2">Choose Ticket Type</h2>
  <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border">
    <option value="standard" selected="selected">Standard</option> 
    <option value="vip">VIP</option>
  </select>
`;

  actions.innerHTML = ticketTypeMarkup;

  const quantity = document.createElement('div');
  quantity.classList.add(...quantityClasses);

  const input = document.createElement('input');
  input.classList.add(...inputClasses);
  input.type = 'number';
  input.min = '0';
  input.value = '0';

  input.addEventListener('blur', () => {
    if(!input.value){
      input.value = 0;
    }
  });

  
  input.addEventListener('input', () => {
    const currentQuantity = parseInt(input.value);
    if(currentQuantity > 0){
      addToCart.disabled = false;
    }
    else {
      addToCart.disabled = true;
    }
  });

  quantity.appendChild(input);

  const quantityActions = document.createElement('div');
  quantityActions.classList.add(...quantityActionClasses);

  const increase = document.createElement('button');
  increase.classList.add(...increaseBtnClasses);
  increase.innerText = '+';
  increase.addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
    const currentQuantity = parseInt(input.value);
    if(currentQuantity>0){
      addToCart.disabled = false;
    }else{
      addToCart.disabled = true;
    }
  });

  const decrease = document.createElement('button');
  decrease.classList.add(...decreaseBtnClasses);
  decrease.innerText = '-';
  decrease.addEventListener('click', () =>{
    const currentValue = parseInt(input.value);
    if(currentValue>0){
      input.value = currentValue -1;

    }
    const currentQuantity = parseInt(input.value);
    if(currentQuantity>0){
      addToCart.disabled = false;
    }else{
      addToCart.disabled = true;
    }
  });

  quantityActions.appendChild(increase);
  quantityActions.appendChild(decrease);

  quantity.appendChild(quantityActions);
  actions.appendChild(quantity);
  eventDiv.appendChild(actions);

  // create the event footer with "Add to Cart" button
  const eventFooter = document.createElement('footer');
  const addToCart = document.createElement('button');
  addToCart.classList.add(...addToCartBtnClasses);
  addToCart.innerText = 'Add To Cart';
  addToCart.disabled = true;

  addToCart.addEventListener('click', () =>{
    handleAddToCart(title,eventId,input,addToCart);

  });

  eventFooter.appendChild(addToCart);
  eventDiv.appendChild(eventFooter);

  
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card'); 
  // Create the event content markup
 
  
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);

  return eventDiv;
  
}




const handleAddToCart = (title,eventId,input,addToCart) =>{
  const ticketType = document.querySelector(`.${kebabCase(title)}-ticket-type`).value;
  console.log("value", ticketType);
  const quantity = input.value;
  const ticketCategoryId = ticketType.toLowerCase() === "vip" ? 2 : 1

 
  if(parseInt(quantity)){
    addLoader();
    fetch('http://localhost:8080/order',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        eventId:eventId,
        ticketCategoryId:+ticketCategoryId,
        numberOfTickets:+quantity,
      })
      
    }).then((response)=>{
      return response.json().then((data)=>{
        if(!response.ok){
          console.log("Something went wrong!");
        }
        return data;
      })
    }).then((data)=>{
      addPurchase(data);
      console.log("Done");
      input.value=0;
      addToCart.disabled=true;
    })
    .finally(()=>{
      removeLoader();
    })

  }else{}


};

//filtrarea
function liveSearch(){
  const filterInput = document.querySelector('#filter-name');

  if(filterInput){
    const searchValue = filterInput.value;

    if(searchValue !== undefined){
      const filteredEvents = eventData.filter((event) =>
      event.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      addEvents(filteredEvents);
    }
  }

}

function setUpFilterEvents(){
  const nameFilterInput = document.querySelector('#filter-name');

  if(nameFilterInput){
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup', ()=>{
      setTimeout(liveSearch,filterInterval);
    });
  }
}



//Orders Page

async function fetchOrders(){
  const response =await fetch('https://localhost:44348/Orders');
  const order =await response.json();
  console.log('order',order);
  return order;
}

async function fetchTickets(){
  const response =await fetch('https://localhost:44348/AllTickets');
  const tickets =await response.json();
  return tickets;
}



function renderOrdersPage(categories) {
  
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const purchaseDiv = document.querySelector('.purchases');
  const purchasesContent = document.getElementById('purchases-content');

  const sortingButtonName = document.getElementById('sorting-button-1');
  sortingButtonName.addEventListener('click', () => {
    handleSort('name');
  });

  const sortingButtonByPrice = document.getElementById('sorting-button-2');
  sortingButtonByPrice.addEventListener('click',() =>{
    handleSort('totalPrice');
  });

  purchasesContent.addEventListener("delete", (e) => {
    allOrders = allOrders.filter(order => order.orderId !=e.detail.id)
  })

  purchasesContent.addEventListener("update", (e) => {
    allOrders = allOrders.map(element => {
      if(element.id == e.detail.order.orderId){
        return e.detail.order;
      }
      return element;
    })
  })
  
  addLoader();
  if (purchaseDiv){
    fetchOrders().then((orders)=>{
      if(orders.length){
        setTimeout(()=>{
          removeLoader();
        },200);
       //const allOrders = [...orders];
        orders.forEach((order)=>{
          const newOrder = createOrderItem(order,categories);
          purchasesContent.appendChild(newOrder);
        
      });
        purchaseDiv.appendChild(purchasesContent)
      }else removeLoader();
    })
  }
}




// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    fetchTickets()
    .then((categories) => {
      renderOrdersPage(categories);
    })
    .catch((error) => {
      console.error('Error fetching ticket categories: ',error);
    });
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
setUpFilterEvents();