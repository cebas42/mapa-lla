// noinspection DuplicatedCode

const centerLat = -34.301282;
const centerLng = -65.179658;

const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
});

const map = L.map("map", {
	center: [centerLat, centerLng],
	zoom: 6,
	layers: [osm],
});


const markerGroup = L.markerClusterGroup();
const ngroups = 5;
let groups = [], i;
const groupNames = ["N/A", "Bajo", "Medio Bajo", "Medio", "Medio Alto", "Alto"];

for (i = 0; i < ngroups; i++) {
	groups[i] = L.featureGroup.subGroup(markerGroup);
	groups[i].addTo(map);
}
markerGroup.addTo(map);

const url = "data/final_dataframe_for_60_12_y_55_6_colegios.geojson";

const layerControl = L.control.layers(null, null, {collapsed: false});
for (i = 0; i < ngroups; i++) {
	layerControl.addOverlay(groups[i], groupNames[i]);
}
layerControl.addTo(map);

const markerOptions = {
	icon: L.icon({
		iconUrl: "/img/school2.png",
		iconSize: [24, 24],
		iconAnchor: [12, 32],
		popupAnchor: [1, -32],
		// tooltipAnchor: [16, -28],
		// shadowUrl: "/img/marker-shadow.png",
		// shadowSize: [41, 41],
	}),
};

fetch(url)
	.then(response => response.json())
	.then(geojson => {
		L.geoJson(geojson, {
			pointToLayer: (feature, latLng) => {
				const marker = L.marker(latLng, markerOptions);
				marker.bindPopup(popUpContent(feature.properties));

				// noinspection JSUnresolvedReference
				const group = feature.properties.nivel_conflictividad - 1;
				marker.addTo(groups[group]);

				return marker;
			},
		});
	})
	.catch(error => console.log("Error loading geojson: " + error))
;


function bold(text) {
	return "<strong>" + text + "</strong>";
}

function link(text, url) {
	return "<a href=\"" + url + "\" target=\"_blank\">" + text + "</a>";
}

function popUpContent(p) {
	const br = "</br>";

	// noinspection JSUnresolvedReference
	return bold("Escuela: ") + br + link(p.colegio, urlEscuela(p.id_colegio)) + br +
		bold("Distrito: ") + p.distrito_nombre + br +
		bold("Sección: ") + p.seccion_nombre + br +
		bold("Circuito: ") + p.circuito_nombre + br +
		bold("Mesas irregulares: ") + p.n_mesas_irregulares + br +
		bold("Conflictividad: ") + conflictividad(p.nivel_conflictividad) + br +
		bold("LLA: ") + round(p.COLEGIO_PORCENTAJE) + "%" + br +
		"";
}

function conflictividad(nivel) {
	return groupNames[nivel];
}

function round(num) {
	return (Math.round(num * 100) / 100).toFixed(2);
}

function urlEscuela(id) {
	return "escuela/" + id;
}
