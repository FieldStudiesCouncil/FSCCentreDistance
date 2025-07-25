// Create the script tag, set the appropriate attributes
const script = document.createElement("script");
script.src =
	"https://maps.googleapis.com/maps/api/js?key=AIzaSyBHS4GGgHG3P1HWz0qMcl24l2MlL-gSHXQ&callback=initMap";
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {
	const locations = [
		{
			name: "Amersham",
			postcode: "HP7 0QR",
			url: "https://www.field-studies-council.org/locations/amersham/",
		},
		{
			name: "Birmingham",
			postcode: "B5 7QU",
			url: "https://www.field-studies-council.org/locations/fsc-birmingham/",
		},
		{
			name: "Bishops Wood",
			postcode: "DY13 9SE",
			url: "https://www.field-studies-council.org/locations/bishops-wood/",
		},
		{
			name: "Blencathra",
			postcode: "CA12 4SG",
			url: "https://www.field-studies-council.org/locations/blencathra/",
		},
		{
			name: "Castle Head",
			postcode: "LA11 6QT",
			url: "https://www.field-studies-council.org/locations/castlehead/",
		},
		{
			name: "Dale Fort",
			postcode: "SA62 3RD",
			url: "https://www.field-studies-council.org/locations/dale-fort/",
		},
		{
			name: "Epping Forest",
			postcode: "IG10 4AF",
			url: "https://www.field-studies-council.org/locations/eppingforest/",
		},
		{
			name: "Flatford Mill",
			postcode: "CO7 6UL",
			url: "https://www.field-studies-council.org/locations/flatfordmill/",
		},
		{
			name: "Juniper Hall",
			postcode: "RH5 6DA",
			url: "https://www.field-studies-council.org/locations/juniper-hall/",
		},
		{
			name: "London (Beckenham Place Park)",
			postcode: "BR3 1SY",
			url: "https://www.field-studies-council.org/locations/london-beckenham-place-park/",
		},
		{
			name: "London (Bushy Park)",
			postcode: "TW12 2EJ",
			url: "https://www.field-studies-council.org/locations/london-bushy-park/",
		},
		{
			name: "London (Greenwich Park)",
			postcode: "SE10 8QY",
			url: "https://www.field-studies-council.org/locations/london-greenwich-park/",
		},
		{
			name: "London (Queen Elizabeth Olympic Park)",
			postcode: "E20 2ST",
			url: "https://www.field-studies-council.org/locations/london-queen-elizabeth-olympic-park/",
		},
		{
			name: "London (The Regent’s Park)",
			postcode: "NW1 4NR",
			url: "https://www.field-studies-council.org/locations/london-the-regents-park/",
		},
		{
			name: "Margam Discovery Centre",
			postcode: "SA13 2UA",
			url: "https://www.field-studies-council.org/locations/margam-discovery-centre/",
		},
		{
			name: "Millport",
			postcode: "KA28 0EG",
			url: "https://www.field-studies-council.org/locations/millport/",
		},
		{
			name: "Nettlecombe Court",
			postcode: "TA4 4HT",
			url: "https://www.field-studies-council.org/locations/nettlecombecourt/",
		},
		{
			name: "Preston Montford",
			postcode: "SY4 1DX",
			url: "https://www.field-studies-council.org/locations/prestonmontford/",
		},
		{
			name: "Rhyd-y-creuau",
			postcode: "LL24 0HB",
			url: "https://www.field-studies-council.org/locations/rhydycreuau/",
		},
		{
			name: "Slapton Ley",
			postcode: "TQ7 2QP",
			url: "https://www.field-studies-council.org/locations/slaptonley/",
		},
		{
			name: "Head Office (Preston Montford)",
			postcode: "SY4 1HW",
			url: "https://www.field-studies-council.org/contact-us/",
		},
		{
			name: "Publications",
			postcode: "TF3 3BB",
			url: "https://www.field-studies-council.org/shop/",
		},
	];

	const form = document.querySelector("form");
	const getDistancesButton = document.querySelector("button[type='submit']");
	const addressInput = document.getElementById("address");
	const resultsTable = document.getElementById("results");
	const spinner = document.getElementById("spinner");
	const nodata = document.getElementById("no-data");

	// Initialise state
	addressInput.disabled = false;
	getDistancesButton.disabled = false;
	spinner.style.display = "none";
	nodata.style.display = "flex";

	// Create a new DistanceMatrixService object; we're using Google's Distance
	// Matrix service in the Maps JavaScript API here.
	// https://developers.google.com/maps/documentation/distance-matrix
	// https://developers.google.com/maps/documentation/javascript/distancematrix
	const distanceMatrixService = new google.maps.DistanceMatrixService();

	// Add an event listener to the button
	form.addEventListener("submit", (event) => {
		// Don't submit the form
		event.preventDefault();

		// Grab the value from the address input field
		const address = addressInput.value;

		// Check if the input contains a value; if not then return.
		if (!address) return;

		// Clear the table body
		resultsTable.tBodies[0].innerHTML = "";

		// Show the spinner
		spinner.style.display = "flex";
		nodata.style.display = "none";

		// Create an array of origins with only the input value; DistanceMatrix
		// takes an array, even if it only contains one element.
		const origins = [address];

		// Create an array of destinations with only the postcodes of the locations
		const destinations = locations.map((location) => location.postcode);

		// Define a request object with the origins, destinations, and travel mode
		// https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_requests
		const request = {
			origins: origins,
			destinations: destinations,
			travelMode: "DRIVING",
			unitSystem: google.maps.UnitSystem.IMPERIAL,
		};

		// Call the getDistanceMatrix method with the request and a callback function
		distanceMatrixService.getDistanceMatrix(request, (response, status) => {
			// Check if the status is OK; if not, return
			if (status != "OK") {
				spinner.style.display = none;
				nodata.style.display = flex;
				return;
			}

			// Get the array of DistanceMatrixRows from the response
			// https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#DistanceMatrixRow
			const rows = response.rows;

			// Check if there is at least one row; if not, return
			if (!rows.length) return;

			// Get the DistanceMatrixElements array from the first row
			// https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#DistanceMatrixElement
			const distanceMatrixElements = rows[0].elements;

			// Loop through the distanceMatrixElements array and add the distance and
			// duration TextValueObjects to each location object The TextValueObjects
			// contain a human readable .text property and a raw .value data property
			for (const [i, element] of distanceMatrixElements.entries()) {
				locations[i].distance = element?.distance;
				locations[i].duration = element?.duration;
			}

			// Sort the locations array by distance in ascending order
			locations.sort((a, b) => a.duration?.value - b.duration?.value);

			// Loop through the sorted locations array and create a table row for each
			// location object
			for (const location of locations) {
				// Create a table row element
				const tr = document.createElement("tr");

				// Create four table cell elements for each property of the location
				// object
				const tdName = document.createElement("td");
				const tdPostcode = document.createElement("td");
				const tdDistance = document.createElement("td");
				const tdDuration = document.createElement("td");

				// Set the text content and `sort` data attributes of each table cell
				// element to the corresponding property value of the location object
				// using template literals
				tdName.innerHTML = `<a href="${location.url}" target="_blank">${location.name}</a>`;
				tdName.dataset.sort = `${location.name}`;

				tdPostcode.textContent = `${location.postcode}`;
				tdPostcode.dataset.sort = `${location.postcode}`;

				tdDistance.textContent = `${location.distance?.text}`;
				tdDistance.dataset.sort = `${location.distance?.value}`;

				tdDuration.textContent = `${location.duration?.text}`;
				tdDuration.dataset.sort = `${location.duration?.value}`;

				// Append each table cell element to the table row element
				tr.appendChild(tdName);
				tr.appendChild(tdPostcode);
				tr.appendChild(tdDistance);
				tr.appendChild(tdDuration);

				// Append the table row element to the table body element
				resultsTable.tBodies[0].appendChild(tr);

				// Hide the spinner after displaying the results
				spinner.style.display = "none";
				nodata.style.display = "none";
			}
		});
	});

	// Get the table element
	const table = document.getElementById("results");

	// Get the table headers
	const headers = table.getElementsByTagName("th");

	// Create a JavaScript map to store the sort direction flags for each header;
	// note, this isn't the same thing as a Google Map. Using a Map allows us to
	// associate each header element directly with its sort direction, making
	// lookups and updates efficient and avoiding issues with index-based arrays
	// if headers change.
	const flags = new Map();

	// Initialize the flags to true for ascending order
	// ascending = true, descending = false
	for (const header of headers) {
		// Check if the header text is 'Travel time'
		// (case-insensitive, trims spaces)
		const isTravelTime = /travel time/i.test(header.textContent.trim());
		flags.set(header, !isTravelTime); // true for others, false for 'Travel time'
	}

	// Add a click listener to the table element
	table.addEventListener("click", (event) => {
		// Check if the clicked element is a button element
		if (event.target.closest("th > button")) {
			// Get the clicked header
			const header = event.target.closest("th");

			// Get the column index
			const index = header.cellIndex;

			// Get the table body rows
			const rows = table.tBodies[0].rows;

			// Convert the rows to an array
			const arr = Array.from(rows);

			// Get the sort direction flag for the header
			const ascending = flags.get(header);

			// Sort the array based on the column values
			arr.sort((a, b) => {
				// Get the cell values
				const [x, y] = [
					a.cells[index].dataset.sort,
					b.cells[index].dataset.sort,
				];

				// Compare the values based on their data type
				if (isNaN(x) && isNaN(y)) {
					// String comparison
					return ascending ? x.localeCompare(y) : y.localeCompare(x);
				} else if (isNaN(x) && !isNaN(y)) {
					// String and number comparison
					return ascending ? -1 : 1;
				} else if (!isNaN(x) && isNaN(y)) {
					// Number and string comparison
					return ascending ? 1 : -1;
				} else {
					// Number comparison
					return ascending ? x - y : y - x;
				}
			});

			resultsTable.tBodies[0].replaceChildren(...arr);

			const svgBarsUp =
				'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" /></svg>';
			const svgBarsDn =
				'<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>';

			// Toggle the direction of the sort icons
			header.querySelector(".sort-icon").innerHTML = ascending
				? svgBarsUp
				: svgBarsDn;

			// Add the sorted class to the current header column, which displays the
			// sort icon
			header.classList.add("sorted");

			// Remove the class from other headers and reset to ascending
			for (const other of headers) {
				if (other !== header) {
					other.classList.remove("sorted");
					flags.set(other, true);
				}
			}

			// Toggle the sort direction flag for the header
			flags.set(header, !ascending);
		}
	});

	// Implement a current position geocoder using Google Maps Geocoder and the
	// browser's getCurrentPosition() API

	// Create a geocoder object
	const geocoder = new google.maps.Geocoder();
	const marker = document.querySelector(".marker");

	// Get the current location using the Geolocation API
	async function getCurrentLocation() {
		try {
			// Let the user know we're geocoding and disable the input
			marker.classList.add("marker-animate");
			addressInput.value = "";
			addressInput.placeholder = "Finding location...";
			addressInput.disabled = true;

			// Get the position object using a promise
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});

			// Get the latitude and longitude from the position object
			let { latitude: lat, longitude: lng } = position.coords;

			// Create a LatLng object
			let latlng = new google.maps.LatLng(lat, lng);

			// Geocode the LatLng object and display the result
			geocodeLatLng(latlng);
		} catch (error) {
			// Handle errors
			alert(error.message);
			marker.classList.remove("marker-animate");
			addressInput.placeholder = "Enter place or postcode";
			addressInput.disabled = false;
		}
	}

	// Geocode a LatLng object and display the result
	async function geocodeLatLng(latlng) {
		// Use the geocoder object to reverse geocode the LatLng object
		geocoder.geocode({ location: latlng }, (results, status) => {
			if (status === "OK") {
				if (results[0]) {
					// Display the formatted address of the first result using template literals
					console.log(`Your location is: ${results[0].formatted_address}`);

					// Put the geocoded address into the input
					addressInput.value = results[0].formatted_address;

					// Reenable the input
					addressInput.disabled = false;

					// Remove the animation and reset the placeholder
					marker.classList.remove("marker-animate");
					addressInput.placeholder = "Enter place or postcode";
				}
			} else {
				// Geocoder failed
				marker.classList.remove("marker-animate");
				alert(`Geocoder failed due to: ${status}`);
			}
		});
	}

	// Add an event listener to the button with a class of .marker
	document
		.querySelector(".marker")
		.addEventListener("click", getCurrentLocation);
};

// Append the 'script' element to 'head'
document.head.appendChild(script);
