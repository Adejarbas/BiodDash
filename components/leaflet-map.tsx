
"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige o ícone padrão do Leaflet no React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


type LeafletMapProps = {
	className?: string;
};

import type { LatLngTuple } from "leaflet";
const cidades: { nome: string; pos: LatLngTuple; info: string }[] = [
	{
		nome: "Uberlândia – MG",
		pos: [-18.9146, -48.2757],
		info: `Rodovia BR-452, km 142\nCEP 38407-049\nZona Rural\nUberlândia – MG`
	},
	{
		nome: "Holambra – SP",
		pos: [-22.6406, -47.0481],
		info: `Estrada Municipal HBR-333, s/n\nFazenda Ribeirão Zona Rural\nHolambra – SP\nCEP 13825-000`
	},
	{
		nome: "Aracati – CE",
		pos: [-4.5586, -37.7676],
		info: `Rodovia CE 263 de Aracati à Jaguaruana, Km 4,0\nMata Fresca, Zona Rural\nCEP 62800-000\nAracati – CE`
	},
];

const estilosMapa = [
	{
		nome: "OpenStreetMap Padrão",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		atribuicao: "© OpenStreetMap contributors",
	},
	{
		nome: "OpenStreetMap HOT",
		url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
		atribuicao: "© OpenStreetMap contributors, Tiles style by HOT",
	},
	{
		nome: "CartoDB Positron",
		url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
		atribuicao: "© OpenStreetMap contributors, © CARTO",
	},
];


type Marcador = {
	nome: string;
	descricao: string;
	pos: LatLngTuple;
};



export default function LeafletMap({ className = "" }: LeafletMapProps) {
	const [marcadores, setMarcadores] = useState<Marcador[]>(cidades.map(c => ({ nome: c.nome, descricao: c.info, pos: c.pos })));
	const [estilo, setEstilo] = useState(0);
	const [modoClique, setModoClique] = useState(false);
	const [coordenadas, setCoordenadas] = useState<LatLngTuple>(cidades[0].pos);
	const [zoom, setZoom] = useState(6);
	const [cep, setCep] = useState("");
	const mapRef = useRef<any>(null);

	function AdicionarMarcador() {
			useMapEvents({
				click(e) {
					if (modoClique) {
						const nome = window.prompt("Nome do local:") || `Marcador ${marcadores.length + 1}`;
						const descricao = window.prompt("Descrição:") || "Adicionado pelo usuário";
						setMarcadores(m => [...m, { nome, descricao, pos: [e.latlng.lat, e.latlng.lng] as LatLngTuple }]);
						setModoClique(false);
					}
				}
			});
		return null;
	}

	function FlyTo({ pos, zoom }: { pos: LatLngTuple; zoom: number }) {
		const map = useMap();
		useEffect(() => {
			map.setView(pos, zoom, { animate: true });
		}, [pos, zoom]);
		return null;
	}

	const minhaLocalizacao = () => {
		if (!navigator.geolocation) {
			alert("Geolocalização não suportada.");
			return;
		}
		navigator.geolocation.getCurrentPosition(pos => {
			const { latitude, longitude } = pos.coords;
			setMarcadores(m => [
				...m,
				{ nome: "Minha Localização", descricao: "Sua localização atual", pos: [latitude, longitude] as LatLngTuple },
			]);
			setCoordenadas([latitude, longitude]);
			setZoom(15);
		});
	};

	const limparMarcadores = () => setMarcadores(cidades.map(c => ({ nome: c.nome, descricao: c.info, pos: c.pos })));
	const mudarEstilo = () => setEstilo((e) => (e + 1) % estilosMapa.length);
	const irPara = (pos: LatLngTuple) => {
		setCoordenadas(pos);
		setZoom(13);
	};

	const buscarCep = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cep) return;
		const viaCep = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`).then(r => r.json());
		if (viaCep.erro) {
			alert("CEP não encontrado!");
			return;
		}
		const endereco = `${viaCep.logradouro || ""}, ${viaCep.localidade}, ${viaCep.uf}`;
		const nominatim = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`).then(r => r.json());
		if (nominatim.length === 0) {
			alert("Localização não encontrada!");
			return;
		}
		const { lat, lon } = nominatim[0];
		const pos: LatLngTuple = [parseFloat(lat), parseFloat(lon)];
		setMarcadores(m => [...m, { nome: `CEP ${cep}`, descricao: endereco, pos }]);
		setCoordenadas(pos);
		setZoom(15);
		setCep("");
	};

	return (
		<div className={`w-full h-auto rounded-lg overflow-hidden border border-green-200 bg-green-50 p-2 ${className}`}>
			<div className="mb-2">
				<h2 className="font-bold text-xl mb-2 flex items-center gap-2"><span role="img" aria-label="controle">🎮</span> Controles do Mapa</h2>
						<div className="flex flex-wrap gap-3 mb-3">
							{marcadores.map((m, i) => (
								<div key={i} className="flex items-center gap-1">
									<button
										className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all
											${i < cidades.length ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
										onClick={() => irPara(m.pos)}
									>
										<span role="img" aria-label="pin">📍</span> {m.nome}
									</button>
									{i >= cidades.length && (
										<button
											className="ml-1 px-2 py-2 rounded-full bg-red-200 hover:bg-red-400 text-red-700 text-lg"
											title="Remover marcador"
											onClick={() => setMarcadores(marcadores => marcadores.filter((_, idx) => idx !== i))}
										>🗑️</button>
									)}
								</div>
							))}
						</div>
						<div className="flex flex-wrap gap-3 mb-3">
							<button className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-blue-500 hover:bg-blue-600 text-white transition-all ${modoClique ? "ring-2 ring-green-600" : ""}`} onClick={() => setModoClique(true)}>
								<span role="img" aria-label="add">➕</span> {modoClique ? "Clique no mapa" : "Adicionar Marcador"}
							</button>
							<button className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-orange-400 hover:bg-orange-500 text-white transition-all" onClick={mudarEstilo}>
								<span role="img" aria-label="paleta">🎨</span> Mudar Estilo
							</button>
							<button className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-red-500 hover:bg-red-600 text-white transition-all" onClick={limparMarcadores}>
								<span role="img" aria-label="limpar">🧹</span> Limpar Tudo
							</button>
						</div>
				<form className="flex gap-2 mb-3" onSubmit={buscarCep}>
					<input
						type="text"
						placeholder="Buscar por CEP"
						value={cep}
						onChange={e => setCep(e.target.value)}
						className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
						maxLength={9}
						pattern="\d{5}-?\d{3}"
						required
					/>
					<button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all">Buscar</button>
				</form>
			</div>
			<div className="mb-2 bg-gray-100 p-2 rounded text-sm">
				<strong>Coordenadas atuais:</strong> Latitude: {(coordenadas as number[])[0]?.toFixed(4)}, Longitude: {(coordenadas as number[])[1]?.toFixed(4)}
			</div>
			<MapContainer
				center={coordenadas}
				zoom={zoom}
					whenReady={() => {}}
				style={{ height: "520px", width: "100%", borderRadius: "15px" }}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution={estilosMapa[estilo].atribuicao}
					url={estilosMapa[estilo].url}
				/>
				{marcadores.map((m, i) => (
					<Marker key={i} position={m.pos}>
						<Popup>
							<div>
								<strong>{m.nome}</strong>
								<br />
								{m.descricao}
								<br />
								<small>
									{Array.isArray(m.pos) && `📍 ${m.pos[0].toFixed(4)}, ${m.pos[1].toFixed(4)}`}
								</small>
							</div>
						</Popup>
					</Marker>
				))}
				<AdicionarMarcador />
				<FlyTo pos={coordenadas} zoom={zoom} />
			</MapContainer>
		</div>
	);
}

