let divPrincipal = document.querySelector('.juego');
let boton = document.querySelector('.inicio');
let matriz = [[2,4,8,16],[32,64,128,256],[512,1024,2048,0],[0,0,0,0]]
let box;
let locationsSides = []
let locationTop;
let bloques = [];
let move = 85; 
let numbers = [2, 4, 8]
let maxTop;
let maxLeft;
let minLeft;
let seconds = 0;
let movimientos = 0;




function getLocations(){
    let divs = document.querySelectorAll('.col0');
    locationTop = divs[0].offsetTop;
    for (let div of divs) {
      locationsSides.push(div.offsetLeft);
    }
    getMoreLocations();
}

function getMoreLocations(){
  let divs = document.querySelectorAll('.col');
  // lo mas abajo
  maxTop = divs[3*4+0].offsetTop ;
  maxLeft = divs[0*4+3].offsetLeft;
  minLeft = divs[0*4+0].offsetLeft;
}



const colors = {
  2: [232, 241, 228],
  4: [2, 203, 202],
  8: [142, 195, 66],
  16: [142, 150, 57],
  32: [0, 65, 225],
  64: [175, 213, 3],
  128: [19, 255, 84],
  256: [38, 91, 52],
  512: [28, 120, 152],
  1024: [159, 42, 44],
  2048: [98, 11, 92],
};




function openModal() {
  document.querySelector('.modal').style.display = "block";
}
function closeModal() {
  document.querySelector('.modal').style.display = "none";
}

boton.addEventListener('click', function () {
  
  //cambiar el fondo
  document.body.style.backgroundImage = "url(fondo_2.png)";
  boton.style.display = 'none';
  document.body.style.transition = "background-image 1s";  
  
  //mostrar la matriz
  divPrincipal.classList.remove('hidden');
  setTimeout(function () {
    divPrincipal.classList.remove('visuallyhidden');
  }, 20);
  getLocations();
  crearDivs();
}, false);


// cada vez que se apreta una flecha del teclado
window.addEventListener("keyup", (e) =>{
  var disponibilidad;
  // para cada caso poner un limite del tablero
  switch(e.key){
      case "ArrowLeft":
          disponibilidad = revisarDispo(parseInt(box.style.left) - move, parseInt(box.style.top))
          if(disponibilidad === false && parseInt(box.style.left) > minLeft){
            updateMov();
              box.style.left = parseInt(box.style.left) - move + "px";
          }else {
              if (disponibilidad){
                  revisarIgual(disponibilidad)
              }
          }
          break;
      case "ArrowRight":
          disponibilidad = revisarDispo(parseInt(box.style.left) + move, parseInt(box.style.top))
          if(disponibilidad === false && parseInt(box.style.left) < maxLeft){
              updateMov();
              box.style.left = parseInt(box.style.left) + move + "px";
          }else {
              if (disponibilidad){
                  revisarIgual(disponibilidad)
              }
          }
          break;
      case "ArrowDown":
          disponibilidad = revisarDispo(parseInt(box.style.left), parseInt(box.style.top) + move)
          if(disponibilidad === false && parseInt(box.style.top) < maxTop){
              updateMov();
              box.style.top = parseInt(box.style.top) + move + "px";
          }else {
              if (disponibilidad){
                  revisarIgual(disponibilidad)
              }
              crearDivs()
          }
          break;
  }
})

// ir abajo cuando no se esta presionando ninguna tecla
function goDown(){
  var disponibilidad = revisarDispo(parseInt(box.style.left), parseInt(box.style.top) + move)
  if(disponibilidad === false && parseInt(box.style.top) < maxTop){
      updateMov();
      box.style.top = parseInt(box.style.top) + move + "px";
  }else {
      if (disponibilidad){
          revisarIgual(disponibilidad)
      }
      crearDivs()
  }
  
}


const intervalDown = setInterval(goDown, 1000);

// bloques de 2, 4 o 8 pueden ser generados
function numberRand(){
  var randNum = Math.floor(Math.random() * 3);
  return numbers[randNum];


}

// devuelve una ubicacion random en donde puede aparecer el bloque
function locationRand(){
  var randNum = Math.floor(Math.random() * 4);
  return locationsSides[randNum];
}



function unirBoxes(bloq){
  box.remove();
  let index = bloques.indexOf(box);
  bloques.splice(index, 1);
  var header = bloq.querySelector("h1");
  bloq.classList.remove("bloque" + parseInt(header.textContent))
  header.textContent = parseInt(header.textContent) * 2;
  bloq.classList.add("bloque" + header.textContent);
  // revisar si luego de unirse tambien se puede unir con el de abajo
  var dispo = revisarDispo(parseInt(bloq.style.left), parseInt(bloq.style.top) + move);
  if(dispo){
      box = bloq;
      revisarIgual(dispo);
  }
}

//antes de crear un div nuevo que revise si con el de abajo puede juntarse
function unionAuto(bloq){
  var dispo = revisarDispo(parseInt(bloq.style.left), parseInt(bloq.style.top) + move);
  if (dispo){
      revisarIgual(dispo)
  }
}
// si ya hay uno entonces que no pueda bajar, solo si son iguales
function revisarIgual(bloqRevisar){
  console.log(box.querySelector("h1").textContent);
  console.log(bloqRevisar.querySelector("h1").textContent);
  if(box.querySelector("h1").textContent === bloqRevisar.querySelector("h1").textContent){
      
      unirBoxes(bloqRevisar);
  }else{
      return false;
  }

}

//busca si ya esta ocupado la casilla
function revisarDispo(left, top){
  for(bloque of bloques){
      if(parseInt(bloque.style.top) === top && parseInt(bloque.style.left) === left){
          return bloque;
      }
  }
  return false;

}



// crear divs
function crearDivs(){
  var nuevoCuadro = document.createElement("div");
  var header = document.createElement("h1");
  var num = numberRand();
  header.textContent = num;
  nuevoCuadro.appendChild(header);
  nuevoCuadro.classList.add("col0");
  nuevoCuadro.classList.add("bloque"+ num);
  nuevoCuadro.id = "Aparicion1";
  nuevoCuadro
  var divScope = document.getElementById("aparicion");
  divScope.appendChild(nuevoCuadro);
  checkLose();
  nuevoCuadro.focus();
  box = nuevoCuadro;
  bloques.push(box);
  box.style.left = locationRand() + "px";    
  box.style.top = locationTop + "px";   
  box.style.position = "absolute";
  sumaTotal();
  

}

//perdio el juego
const announcement = document.getElementById('announcement');


function checkLose(){
  for(bloque of bloques){
      if(bloque.style.top === locationTop + "px" ){
          mostrarAlerta();
      }
  }
}
function mostrarAlerta() {
  window.alert("Perdiste el juego :(");
  endGame();

}

function endGame(){
  clearInterval(intervalDown);
  clearInterval(intervalSec);
  

}

function sumaTotal(){
  let suma = 0;
  console.log("valor inicial: " + suma);
  for(bloque of bloques){
    if(bloques.length > 0){
      console.log("valor: " + parseInt(bloque.textContent));
      suma += parseInt(bloque.textContent);
      console.log("SUMA TOTAL: " + suma);
      updatePoints(suma);
    }
    
  }
  
}

function updatePoints(points){
  let puntaje = document.querySelector(".puntos");
  // Actualiza el contenido utilizando textContent
  puntaje.textContent = "Puntaje: " + points;
  
  
}

function updateTimer() {
  ++seconds;
  let minutos = Math.floor(seconds / 60);
  let segundosRestantes = seconds % 60;
  let tiempoFormateado = minutos.toString().padStart(2, '0') + ":" + segundosRestantes.toString().padStart(2, '0');
  let tiempo = document.querySelector(".tiempo");
  tiempo.textContent = "Tiempo: " + tiempoFormateado;
}

function updateMov(){
  ++movimientos;
  let mov = document.querySelector(".movimientos");
  mov.textContent = "Movimientos: " + movimientos;
}

const intervalSec = setInterval(updateTimer, 1000);
  
