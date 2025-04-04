
let cache = {
  hotbar: [],
  storage: []
}

let configItem = {
  scroll: false,
  revert: function(isValidEl){
    if(isValidEl) {
      return false;
    }else{
      return true;
    }
  },
  appendTo: 'body',
  containment: 'window',
  helper: 'clone',
  drag: function(event, ui){
    item_isStackable = $(this).hasClass("stackable");
  },
}

let hotbar_slots = 7
let inputQuantity
let hotbar, storage

document.addEventListener("DOMContentLoaded", () => {

  // Define variables.
  inputQuantity = document.getElementById("quantity")
  inputQuantity.addEventListener("change", () => {quantitySafeguard()})
  hotbar = document.getElementById("hotbar")
  storage = document.getElementById("storage")
  //

  // Generate hotbar slots.
  for (let i = 0; i <= hotbar_slots-1; i++) {
    cache.hotbar["i_" + i] = document.createElement("div")
    cache.hotbar["i_" + i].classList.add("slot")
    cache.hotbar["i_" + i].dataset.key = "i_" + i

    hotbar.appendChild(cache.hotbar["i_" + i])
  }
  //

  // TEMP: Used to generate storage.
  generateStorage(20)
  //

  $( ".item").draggable(configItem);
  $( ".btn").droppable({
    accept: ".item",
    drop: function(_, dragItem) {
      // Add your custom actions here.
    }
  });
  $( ".outfit").droppable({
    accept: ".item",
    drop: function(_, dragItem) {
      // Add your custom actions here.
    }
  });
  $( ".bag").droppable({
    accept: ".item",
    drop: function(_, dragItem) {
      // Add your custom actions here.
    }
  });
  $( ".mask").droppable({
    accept: ".item",
    drop: function(_, dragItem) {
      // Add your custom actions here.
    }
  });

  $( ".slot" ).droppable({
    accept: ".item",
    drop: function( _, dragItem ) {
      let item = $(this).find(".item");
      quantitySafeguard()

      // Add your custom actions here.

      // Check if the slot is the same on arrival as on departure. If so, do nothing.
      if(dragItem.draggable[0].parentNode.dataset.key == $(this)[0].dataset.key){ // PAS LE MÊME SLOT.
        dragItem.draggable.animate(dragItem.draggable.data().origPosition,"slow");
        return;
      }

      if(item.length == 0) { // IF THERE ARE NO ITEMS.
        if(inputQuantity.value != 0 && inputQuantity.value < Number(dragItem.draggable[0].dataset.quantity)){ // IF THE QUANTITY IS NOT EQUAL TO ZERO AND NOT EQUAL TO OR GREATER THAN THE BASE QUANTITY.
          let newItem = dragItem.draggable.clone()
          let newAmount = Number(dragItem.draggable[0].dataset.quantity) - Number(inputQuantity.value)
          newItem[0].dataset.quantity = inputQuantity.value
          newItem[0].children[2].innerText = "x" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(
            inputQuantity.value
          )
          newItem.draggable(configItem).appendTo($(this));
          dragItem.draggable[0].dataset.quantity = newAmount
          dragItem.draggable[0].children[2].innerText = "x" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(
            newAmount
          )
        }else{ // IF THE QUANTITY IS ZERO OR THE BASE QUANTITY.
          dragItem.draggable.detach().appendTo($(this));
        }
      }else{ // IF THERE IS AN ITEM.
        if (dragItem.draggable[0].id == item[0].id){ // IF IT'S THE SAME ITEM.
          if(inputQuantity.value != 0 && inputQuantity.value < Number(dragItem.draggable[0].dataset.quantity)){ // IF THE QUANTITY IS NOT EQUAL TO ZERO AND NOT EQUAL TO OR GREATER THAN THE BASE QUANTITY.
            let newAmountOrigin = Number(dragItem.draggable[0].dataset.quantity) - Number(inputQuantity.value)
            let newAmount = Number(item[0].dataset.quantity) + Number(inputQuantity.value)
            dragItem.draggable[0].dataset.quantity = newAmountOrigin
            dragItem.draggable[0].children[2].innerText = "x" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(
              newAmountOrigin
            )
            item[0].dataset.quantity = newAmount
            item[0].children[2].innerText = "x" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(
              newAmount
            )
          }else{  // IF THE QUANTITY IS ZERO OR THE BASE QUANTITY.
            let newAmount = Number(dragItem.draggable[0].dataset.quantity) + Number(item[0].dataset.quantity)
            dragItem.draggable.detach();
            item[0].dataset.quantity = newAmount
            item[0].children[2].innerText = "x" + new Intl.NumberFormat("en-US", { maximumSignificantDigits: 10 }).format(
              newAmount
            )
          }
        }else{ // OR DO NOTHING.
          dragItem.draggable.animate(dragItem.draggable.data().origPosition,"slow");
        }
      }
    }
  });

  //
  resetKeys()
  //
});

// 
// Guard against negative numbers and/or decimal points.
//
function quantitySafeguard(){
  if(inputQuantity.value == ""){
    inputQuantity.value = 0
  }
  if(inputQuantity.value < 0){
    inputQuantity.value = 0
  }
  inputQuantity.value = Math.round(inputQuantity.value)
}

//
// Generate storage.
//
function generateStorage(count){
  storage.innerHTML = ''

  for (let i = 0; i <= count; i++) {
    cache.storage["s_" + i] = document.createElement("div")
    cache.storage["s_" + i].classList.add("slot")
    cache.storage["s_" + i].dataset.key = "s_" + i
    
    storage.appendChild(cache.storage["s_" + i])
  }
}

//
// Reset keys.
//
function resetKeys(){
  for (const [key, _] of Object.entries(cache.hotbar)) {
    cache.hotbar[key].dataset.key = key
  }
  for (const [key, _] of Object.entries(cache.storage)) {
    cache.storage[key].dataset.key = key
  }
  setTimeout(resetKeys, 200)
}