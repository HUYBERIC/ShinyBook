// D O M   C O N T E N T   L O A D E D
document.addEventListener("DOMContentLoaded", function() {

// V A R I A B L E S
const searchButton = document.querySelector('#searchBtn');
const pokeInput = document.querySelector('#pokeSearched');
const displaySearch = document.querySelector('.searchResultText span');
const searchResultText = document.querySelector('.searchResultText');
const response = document.querySelector('.response');
const pokeNameFR = document.querySelector('.pokeNameFR');
const pokeNameEN = document.querySelector('.pokeNameEN');
const pokeNameJP = document.querySelector('.pokeNameJP');
const pokeSpriteRg = document.querySelector('.pokeSpriteRg');
const pokeSpriteSh = document.querySelector('.pokeSpriteSh');
const pokeType = document.querySelector('.pokeType');
const shinyBtn = document.querySelector('.shinyBtn');
const evo = document.querySelector('.evo')
const preEvo = document.querySelector('.preEvo');
const firstPrevEvo = document.querySelector('.firstPrevEvo');
const secondPrevEvo = document.querySelector('.secondPrevEvo');
const nextEvo = document.querySelector('.nextEvo');
const firstNextEvo = document.querySelector('.firstNextEvo');
const secondNextEvo = document.querySelector('.secondNextEvo');
const fullDisplay = document.querySelector('.response.grid');
let spriteSh, spriteRg;
const randomBtn = document.querySelector('#randomBtn');

// F E T C H  &  D E C L A R E
let pokeList = [];

async function loadPokemonList() {
    const response = await fetch(`https://tyradex.vercel.app/api/v1/pokemon`);
    pokeList = await response.json();
    console.log('pokeList loaded:', pokeList);
}
loadPokemonList();

async function pokeById(){
    searchResultText.classList.remove('hide');
    pokeSpriteSh.classList.add('hide');
    pokeSpriteRg.classList.remove('hide');
    fullDisplay.style.display = 'grid';

    const searchQuery = pokeInput.value.toLowerCase();
    console.log('Searching for:', searchQuery);
    const foundPokemon = pokeList.find(poke => typeof poke.name.fr === 'string' && poke.name.fr.toLowerCase() === searchQuery);
    console.log('Found Pokemon:', foundPokemon);

    if(foundPokemon){
        const id = foundPokemon.pokedex_id;
        try{
            const pokemonData = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${id}`)
            const pokeInfo = await pokemonData.json();
            console.log('Pokemon Info:', pokeInfo);

            displayPokemonInfo(pokeInfo);
            pokeInput.value = '';

        } catch (error) {
            console.error(`Erreur lors de la récupération des informations sur :`, error);
        }
    } else {
        alert(`Ce Pokémon n'existe pas, recommence!`);
    }
}

async function displayPokemonInfo(pokeInfo){
    // Nom fr
    pokeNameFR.innerText = pokeInfo.name.fr;

    // Sprite (reg&shiny) s'ils ne sont pas crées
    if (!spriteRg && !spriteSh) {
        spriteRg = document.createElement('img');
        spriteSh = document.createElement('img');
    }

    // Mettre à jour les sources
    spriteRg.src = pokeInfo.sprites.regular;
    spriteSh.src = pokeInfo.sprites.shiny;

    // Afficher uniquement le sprite régulier au début
    pokeSpriteRg.innerHTML = ''; 
    pokeSpriteRg.appendChild(spriteRg);
    
    pokeSpriteSh.innerHTML = '';
    spriteSh.classList.add('hide');
    pokeSpriteSh.appendChild(spriteSh);

    // Nom en et jp
    pokeNameEN.innerText = pokeInfo.name.en;
    pokeNameJP.innerText = pokeInfo.name.jp;

    // Type
    pokeType.innerText = pokeInfo.types.map(type => type.name).join(", ");

    // Nom de la recherche
    displaySearch.innerText = pokeInfo.name.fr;
}

function getRandomPokemon(){
    if (pokeList.length === 0) {
        console.error("La liste des pokémons n'est pas encore chargée");
        return;
    }

    const randomIndex = Math.floor(Math.random()*pokeList.length);
    const randomPokemon = pokeList[randomIndex];
    pokeInput.value = randomPokemon.name.fr;

    pokeById();
}

// A D D  E V E N T  L I S T E N E R
searchButton.addEventListener('click', pokeById);
searchButton.addEventListener('click', ()=> {
    pokeById();
});


pokeInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') pokeById();
});

randomBtn.addEventListener('click', getRandomPokemon);

shinyBtn.addEventListener('click', () => {
    spriteRg.classList.toggle('hide');
    spriteSh.classList.toggle('hide');
    pokeSpriteRg.classList.toggle('hide');
    pokeSpriteSh.classList.toggle('hide');
});
});
