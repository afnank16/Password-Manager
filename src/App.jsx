import ToDoList from "./components/ToDoList";



// function orderPizza() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("🍕 Your pizza has arrived!");
//         }, 3000);
//     });
// }

// console.log("Ordering pizza...");


// orderPizza().then((message) => {
//     console.log(message);
// });

// console.log("Watching TV while waiting...");


// function watchTV() {
//   for(let i = 0; i <= 10; i++) {
//     setTimeout(() => {
//       console.log(i);
//       if(i === 10) {
//       console.log("🍕 Your pizza has arrived!");
//     }
//     },  i*1000);
//   }
// }
// watchTV();

// fetch("https://jsonplaceholder.typicode.com/users")
//   .then((response) => response.json())
//   .then((data) => {
//     console.log(data);
//   });




// function walkDog(){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {

//             const dogWalked = true;

//             if(dogWalked){
//                 resolve("You walk the dog 🐕");
//             }
//             else{
//                 reject("You DIDN'T walk the dog");
//             }
//         }, 1500);
//     });
// }

// function cleanKitchen(){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
            
//             const kitchenCleaned = true;

//             if(kitchenCleaned){
//                 resolve("You clean the kitchen 🧹");
//             }
//             else{
//                 reject("You DIDN'T clean the kitchen");
//             }
//         }, 2500);
//     });
// }

// function takeOutTrash(){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {

//             const trashTakenOut = true;

//             if(trashTakenOut){
//                 resolve("You take out the trash ♻");
//             }
//             else{
//                 reject("You DIDN'T take out the trash");
//             }

//         }, 500);
//     });
// }

// walkDog().then(value => {console.log(value); return cleanKitchen()})
//                   .then(value => {console.log(value); return takeOutTrash()})
//                   .then(value => {console.log(value); console.log("You finished all the chores!")})
//                   .catch(error => console.error(error));



async function getData(){
    console.log("Fetching data...");
    try{
        const response =await fetch("https://jsonplaceholder.typicode.com/users");
        const data =await response.json();
        console.log(data);
    }
    catch(error){
        console.log(error);
    }
}


function App() {

  return (
    <div>
  <ToDoList />
  <button className="border py-1 px-2 bg-slate-100 hover:bg-slate-200"
  onClick={getData}>
    click me
  </button>
    </div>
  )

}

export default App;