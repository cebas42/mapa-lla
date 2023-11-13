// noinspection DuplicatedCode

const centerLat = -34.301282;
const centerLng = -65.179658;

// OpenStreetMap tiles
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
});

// Leaflet con OpenStreetMap
const map = L.map("map", {
	center: [centerLat, centerLng],
	zoom: 6,
	layers: [osm],
});

const circle = "9679";

function bullet(color) {
	return "<span style='color: " + color + "; font-size: 24px; font-weight: bold'>&#" + circle + ";</span>";
}

// Markers clusters
let i;
const markerGroup = L.markerClusterGroup();
const groupColors = [
	"#000000",
	"#64DD17",
	"#B2C80C",
	"#FFB200",
	"#FF5900",
	"#FF0000",
];

const ngroups = groupColors.length;
let groupNames = []; // = ["<span style='color: red; font-size: 24px; font-weight: bold'>&#9679;</span>", "Bajo", "Medio Bajo", "Medio", "Medio Alto", "Alto"];

// fill group names with bullets
for (i = 0; i < ngroups; i++) {
	groupNames[i] = bullet(groupColors[i]);
}


// Creo los grupos de markers
let featureGroups = [];
for (i = 0; i < ngroups; i++) {
	featureGroups[i] = L.featureGroup.subGroup(markerGroup);
	featureGroups[i].addTo(map);
}
markerGroup.addTo(map);

// Agrego los grupos de markers al control de capas
const layerControl = L.control.layers(null, null, {collapsed: false});
for (i = 0; i < ngroups; i++) {
	layerControl.addOverlay(featureGroups[i], groupNames[i]);
}
// layerControl.getContainer().innerHTML = layerControl.getContainer().innerHTML+"New text!";
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

// fetch del geoJson y creación de los markers
const geoJsonUrl = "data/final_dataframe_for_60_12_y_55_6_colegios.geojson";
fetch(geoJsonUrl)
	.then(response => response.json())
	.then(geojson => {
		L.geoJson(geojson, {
			pointToLayer: (feature, latLng) => {
				const marker = L.marker(latLng, markerOptions);
				marker.bindPopup(popUpContent(feature.properties));

				// noinspection JSUnresolvedReference
				const group = conflictividad2grupo(feature.properties.nivel_conflictividad);
				marker.addTo(featureGroups[group]);

				return marker;
			},
		});
	})
	.catch(error => console.log("Error loading geojson: " + error))
;

function conflictividad2grupo(nivel) {
	// siumulo un 10% de escuelas sin datos suficientes para calcular conflictividad
	if (Math.random() < 0.1) {
		return 0;
	}

	return nivel;
}

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
		bold("Mesas irregulares: ") + p.n_mesas_irregulares + conflictividad(p.nivel_conflictividad) + br +
		// bold("Anomalía: ") + conflictividad(p.nivel_conflictividad) + br +
		bold("LLA: ") + round(p.COLEGIO_PORCENTAJE) + "%" + br +
		"";
}

function conflictividad(nivel) {
	return groupNames[nivel];
}

function round(num) {
	return (Math.round(num * 10000) / 100).toFixed(2);
}

function urlEscuela(id) {
	return "escuela/" + id;
}

// function isMobile() {
// 	return true;//window.innerWidth <= 800 && window.innerHeight <= 600;
// }
