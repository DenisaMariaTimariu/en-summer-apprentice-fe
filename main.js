import { useStyle } from "./src/components/styles";
import { kebabCase } from "./src/utils";

// Navigate to a specific URL
function navigateTo(url) { 
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() { 
  return `
  
  <h1 class="text-2xl mb-4 mt-8 text-top" style="font-style:italic;">Welcome!</h1>
   <div id="content" >
      <div class="events flex items-center justify-center flex-wrap">

      </div>
    </div>
  `;
}

function getOrdersPageTemplate() { 
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
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

  fetchTicketEvents().then(data =>{
    addEvents(data);
  });

  }

  async function fetchTicketEvents(){
     const response =await fetch('https://localhost:44348/AllEvents');
     
     const data =await response.json();
     console.log('data',data);
     return data;
  }

  const addEvents = (events)=>{
    console.log(events);
    const eventsDiv = document.querySelector('.events');
    events.innerHTML = 'No events';
    if(events.length){
      events.innerHTML = '';
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
    <div class="content">
      <img src="${eventData.img}" alt="${eventData.name}" class="event-image w-full height-200 rounded object-cover mb-4">
      <p class="description text-gray-700">${eventData.eventDescription}</p>
    </div>
  `;
  eventDiv.innerHTML = contentMarkup;

  //Create ticket type selection and quantity input
  const actions = document.createElement('div');
  actions.classList.add(...actionsWrapperClasses);


  const ticketTypeMarkup = `
  <h2 class="text-lg font-bold mb-2">Choose Ticket Type</h2>
  <select id="ticketType" name="ticketType" class="select ${title}-ticket-type border">
    <option value="standard" selected="selected" >Standard</option> 
    <option value="vip" >VIP</option>
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

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {// === reprezinta egalitate perfecta
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
