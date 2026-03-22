// Lista de personajes / Character List
const characters = [
  { name: "Cobra", image: "https://static1.e621.net/data/sample/bb/0e/bb0e3f76ffdd69a8064c92d867845168.jpg" },
  { name: "Abilene", image: "https://pbs.twimg.com/media/HDKpzc0aUAAAoqR?format=jpg&name=large" },
  { name: "Abilenev2", image: "https://i.imgur.com/gRbsudz.jpeg" },
  // Añade más personajes aquí... / Add more characters here...
];

let availableCharacters = [...characters];
let currentCharacter = null;

// Elementos del DOM / DOM Elements
const characterImage = document.getElementById('character-image');
const characterName = document.getElementById('character-name');
const resultText = document.getElementById('result');
const smashBtn = document.getElementById('smash-btn');
const passBtn = document.getElementById('pass-btn');
const card = document.querySelector('.card');
const buttons = document.querySelector('.buttons');
const dragContainer = document.getElementById('drag-container');

// Carga del personaje actual / Load of the current character
function loadCharacter() {
  if (availableCharacters.length === 0) {
    showEndMessage();
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  currentCharacter = availableCharacters[randomIndex];
  availableCharacters.splice(randomIndex, 1);

  characterImage.src = currentCharacter.image || 'https://freesvg.org/storage/img/thumb/errname1.png';
  characterName.textContent = currentCharacter.name;
}

// Función para mostrar mensaje final (Al acabarse la lista de personajes) / Function to show end message (When the character list runs out)
function showEndMessage() {
  card.style.display = 'none';
  buttons.style.display = 'none';

  // Aquí puedes personalizar el mensaje final / Here you can customize the end message
  resultText.innerHTML = `
    <h2 style="color: #2196F3; margin: 5px 0;">
  
     No more characters!

    </h2> 
    <p style="color:rgb(124, 128, 129); font-size: 12px; margin: 2px 0;">

    You can reload the page to start over

    </p>
    <p style="color: white; margin: 20px 0;">

    👇 Download your history so you don't lose it. 👇

    </p>
  `;
  document.getElementById('download-btn').style.animation = 'pulse 1.5s infinite';
}

// Eventos de botones / Button events
smashBtn.addEventListener('click', () => handleVote('Smash'));
passBtn.addEventListener('click', () => handleVote('Pass'));

function handleVote(voteType) {
  if (!currentCharacter) return;

  responses.push({ character: currentCharacter.name, response: voteType });
  
  // Muestra el texto "Elección anterior" / Show the text "Previous choice"
  document.querySelector('.result-label').classList.add('visible');
  
  const emoji = voteType === 'Smash' ? '😍' : '😒';
  document.getElementById('result-text').textContent = `${voteType.toUpperCase()}! ${emoji} (${currentCharacter.name})`;
  
  nextCharacter();
  updateDownloadButton();
}

// Lógica de arrastre / Drag logic
let isDragging = false;
let startPosX = 0;
let currentTranslateX = 0;
const SWIPE_THRESHOLD = 200;

// Añadir eventos de arrastre / Add drag events
dragContainer.addEventListener('touchstart', startDrag);
dragContainer.addEventListener('touchmove', duringDrag);
dragContainer.addEventListener('touchend', endDrag);
dragContainer.addEventListener('mousedown', startDrag);
dragContainer.addEventListener('mousemove', duringDrag);
dragContainer.addEventListener('mouseup', endDrag);
dragContainer.addEventListener('mouseleave', endDrag);

// Función para manejar el inicio del arrastre / Function to handle the start of the drag
function startDrag(e) {
  if (!currentCharacter) return;
  isDragging = true;
  dragContainer.classList.add('dragging');
  startPosX = e.clientX || e.touches[0].clientX;
  currentTranslateX = 0;
}

// Función para manejar el arrastre / Function to handle the drag
function duringDrag(e) {
  if (!isDragging || !currentCharacter) return;
  e.preventDefault();
  
  const currentX = e.clientX || e.touches[0].clientX;
  currentTranslateX = currentX - startPosX;
  
  dragContainer.style.transform = `translateX(${currentTranslateX}px) rotate(${currentTranslateX * 0.1}deg)`;
}

// Función para manejar el final del arrastre / Function to handle the end of the drag
function endDrag() {
  if (!isDragging || !currentCharacter) return;
  isDragging = false;
  dragContainer.classList.remove('dragging');

  if (Math.abs(currentTranslateX) > SWIPE_THRESHOLD) {
    const voteType = currentTranslateX > 0 ? 'Smash' : 'Pass';
    handleVote(voteType);
    
    // Animación de salida / Exit animation
    dragContainer.style.transform = `translateX(${currentTranslateX * 2}px) rotate(${currentTranslateX * 0.2}deg)`;
    dragContainer.style.opacity = '0';
    setTimeout(() => {
      dragContainer.style.transform = 'none';
      dragContainer.style.opacity = '1';
    }, 300);
  } else {
    dragContainer.style.transform = 'none';
  }
}

// Inicializa el historial de respuestas / Initialize the response history
let responses = [];
function nextCharacter() {
  setTimeout(loadCharacter, 0);
}

// Función para mostrar el botón de descarga / Function to show the download button
function updateDownloadButton() {
  const downloadBtn = document.getElementById('download-btn');
  downloadBtn.style.display = responses.length > 0 ? 'inline-block' : 'none';
}

// Función para descargar el historial como CSV / Function to download the history as CSV
function downloadCSV() {
  const csvContent = [
    'Character,Response',
    ...responses.map(r => `"${r.character}",${r.response}`)
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smash-pass-historial-${new Date().toISOString()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Evento para descargar el CSV / Event to download the CSV
document.getElementById('download-btn').addEventListener('click', downloadCSV);

// Inicio de la aplicación / Start of the application
loadCharacter();