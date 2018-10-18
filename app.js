const database = firebase.database()
const storeRef = database.ref('GroceryLists')

let txtboxStore = document.getElementById('txtboxStore')
let btnStore = document.getElementById('btnStore')
let storeUL = document.getElementById('storeUL')
let btnDeleteList = document.getElementById('btnDeleteList')
let deleteDiv = document.getElementById('deleteDiv')

let stores = []

btnStore.addEventListener('click', function() {
  let storeTitle = txtboxStore.value
  let storeInfo = { Store : storeTitle }
  saveStoreToDatabase(storeInfo)
})

function saveStoreToDatabase(storeInfo) {
  storeRef.child(storeInfo.Store).set(storeInfo)
  console.log('saved in database')
}

function addGroceryItem(button,storeName){
  let groceryItem = button.previousElementSibling.value
  let itemsRef = storeRef.child(storeName).child('Grocery_Items')
  itemsRef.child(groceryItem).set({
    item : groceryItem})
}

function buildItemsLayout(store){
  if(store.Grocery_Items == null) {
    return ``
  }

  return Object.keys(store.Grocery_Items).map(function(key){
    return `<p>${store.Grocery_Items[key].item}</p>`
  }).join('')
}

function displayStoresUL() {
  let listItems = stores.map(function(store){
    return `
    <li>
      <h3>${store.Store}</h3>
      <input type="text" placeholder="Enter item"/>
      <button onclick="addGroceryItem(this, '${store.Store}')">Submit</button>
    </li>

    ${buildItemsLayout(store)}`

  })
  storeUL.innerHTML = listItems.join('')
}

function configureViewChanges() {
  storeRef.on('value', function(snapshot) {
    stores = []
    snapshot.forEach(function(childSnapshot) {
      stores.push(childSnapshot.val())
    })
    displayStoresUL()
  })
}

function deleteGroceryList(btn){
  let deleteStoreChoice = btn.previousElementSibling.value
  storeRef.child(deleteStoreChoice).remove()

}
function deleteGroceryItem(btn){
  let deleteStoreChoice = btn.previousElementSibling.previousElementSibling.previousElementSibling.value
  let deleteItemChoice = btn.previousElementSibling.value

  let itemToBeDeleted = storeRef.child(deleteStoreChoice).child('Grocery_Items').child(deleteItemChoice)
  // if(deleteItemChoice != )

  itemToBeDeleted.remove()
}
function exitOption(){
  deleteDiv.innerHTML = ''
}

btnDeleteList.addEventListener('click',function(){
  let deleteOptionPrompt = `
  <div>
  <p>To delete an item you must enter the store name and the item name and hit the delete item button</p>
  <input type="text" placeholder="Which Store?"/>
  <button onclick="deleteGroceryList(this)">Delete Store</button>
  <input type="text" placeholder="Which Item?"/>
  <button onclick="deleteGroceryItem(this)">Delete Item</button>
  </div>
  <button onclick="exitOption()">Exit</button>`

  deleteDiv.innerHTML = deleteOptionPrompt
})

configureViewChanges()
