(function () {
	document.addEventListener("DOMContentLoaded", executeScript);

	// Global variable
	let firstSearch = true;

	function executeScript() {
		// Make API call
		fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=151")
			// Parse JSON
			.then((response) => response.json())
			.then((data) => {
				// Assign array of pokemonts to a variable
				let pokemons = data.results;
				let index = 1;
				// Iterate through each Pokemon to display them
				pokemons.forEach((pokemon) => {
					addPokemonName(pokemon.name, index);
					index++;
				});
				// Add event listener to each pokemon
				document.querySelectorAll("a").forEach((anchor) => {
					anchor.addEventListener("click", function () {
						// When user clicks on pokemon name, make another API call to retrieve that pokemon information
						fetch(`https://pokeapi.co/api/v2/pokemon/${this.innerHTML}`)
							// Parse JSON
							.then((response) => response.json())
							.then((data) => {
								// Display pokemon sprite on screen
								showPokemon(this.innerHTML, data);
							});
					});
				});
			});

		/**
		 * Given a name, it will add it to poke-list as an anchor tag.
		 * @param {String} name
		 * @param {Number} index
		 */
		const addPokemonName = (name, index) => {
			// Create new div for pokemon
			let pokemon = document.createElement("div");
			// Add an anchor tag inside div with pokemon name
			pokemon.innerHTML = `
      <p>${index.toString().padStart(3, "0")} </p>
      <div  class="selected"><a href = "#${name}">${name}</a></div>`;
			// Append anchor to poke-list section
			document.getElementById("poke-list").appendChild(pokemon);
		};

		/**
		 * Given a name and a url to the pokemon sprite, displays the the pokemon sprite
		 * @param {String} name pokemon name
		 * @param {Object} data object containing pokemon data
		 */
		const showPokemon = (name, data) => {
			if (firstSearch) {
				document
					.querySelector(".screen-overlay")
					.classList.remove("screen-overlay");
				firstSearch = false;
			}

			// Check if there is an existing sprite
			if (document.querySelectorAll("#poke-info > div").length > 0) {
				// Remove any existing sprite
				document.getElementById("poke-info").innerHTML = "";
			}
			let sprite = data.sprites.front_default;
			let types = data.types.map((type) => type.type.name);
			let height = data.height;
			let weight = data.weight;
			// Create a new "div" element
			let card = document.createElement("div");
			// Add elements to card
			card.innerHTML = `
      <div class="screen-col poke-img">
        <img
          src="${sprite}"
          alt="Default front sprite of ${name}"
          class="poke-sprite"
        />
        <h4 id="poke-index">No${data.id.toString().padStart(3, "0")}</h4>
      </div>
      <div class="screen-col poke-data">
        <h4 id="poke-name">${name.toUpperCase()}</h4>
        <h4 id="poke-type">${types.join(", ")}</h4>
        <h4 id="poke-height">HT ${height} cm</h4>
        <h4 id="poke-weight">WT ${weight} kg</h4>
      </div>
      <div class="poke-fact">You gotta Splash if you want to evolve.</div>
        `;
			// Append card to poke-info section
			document.getElementById("poke-info").appendChild(card);
		};
	}
})();
