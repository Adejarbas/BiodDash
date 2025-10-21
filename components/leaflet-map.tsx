"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import ExcelJS from "exceljs";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import { supabase } from "@/lib/supabase/client";

// Corrige o ícone padrão do Leaflet no React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type LeafletMapProps = { className?: string };

type Marcador = {
  dbId?: string;
  nome: string;
  descricao: string;
  pos: LatLngTuple;
};

const cidades: { nome: string; pos: LatLngTuple; info: string }[] = [
  {
    nome: "Uberlândia – MG",
    pos: [-18.9146, -48.2757],
    info: `Rodovia BR-452, km 142\nCEP 38407-049\nZona Rural\nUberlândia – MG`,
  },
  {
    nome: "Holambra – SP",
    pos: [-22.6406, -47.0481],
    info: `Estrada Municipal HBR-333, s/n\nFazenda Ribeirão Zona Rural\nHolambra – SP\nCEP 13825-000`,
  },
  {
    nome: "Aracati – CE",
    pos: [-4.5586, -37.7676],
    info: `Rodovia CE 263 de Aracati à Jaguaruana, Km 4,0\nMata Fresca, Zona Rural\nCEP 62800-000\nAracati – CE`,
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

/* =========================
   Helpers Supabase / Geocode
   ========================= */

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user.id;
}

// Insere e retorna o id da linha criada
async function insertAddress(address: string): Promise<string | null> {
  const user_id = await getCurrentUserId();
  if (!user_id) {
    alert("Você precisa estar autenticado para salvar o local.");
    return null;
  }
  const { data, error } = await supabase
    .from("biodigestor_maps")
    .insert([{ user_id, address }])
    .select("id")
    .single();

  if (error) {
    alert(
      `Falha ao salvar:\n` +
      `code: ${error.code ?? "-"}\n` +
      `status: ${error.status ?? "-"}\n` +
      `message: ${error.message ?? "-"}`
    );
    return null;
  }
  return data?.id ?? null;
}

async function deleteAddressById(id: string) {
  const user_id = await getCurrentUserId();
  if (!user_id) {
    alert("Você precisa estar autenticado para remover o local.");
    return false;
  }
  const { error } = await supabase
    .from("biodigestor_maps")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    alert(
      `Falha ao remover:\n` +
      `code: ${error.code ?? "-"}\n` +
      `status: ${error.status ?? "-"}\n` +
      `message: ${error.message ?? "-"}`
    );
    return false;
  }
  return true;
}

// Nominatim — reverse geocoding (lat/lon -> endereço legível)
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      { headers: { "Accept-Language": "pt-BR", "User-Agent": "bio-app/1.0 (dev)" } }
    );
    const j = await resp.json();
    return j?.display_name ?? null;
  } catch {
    return null;
  }
}

// Nominatim — geocoding (endereço -> lat/lon)
async function geocodeAddress(address: string): Promise<LatLngTuple | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      { headers: { "Accept-Language": "pt-BR", "User-Agent": "bio-app/1.0 (dev)" } }
    );
    const arr = await resp.json();
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const { lat, lon } = arr[0];
    return [parseFloat(lat), parseFloat(lon)];
  } catch {
    return null;
  }
}

export default function LeafletMap({ className = "" }: LeafletMapProps) {
  const [marcadores, setMarcadores] = useState<Marcador[]>(
    cidades.map((c) => ({ nome: c.nome, descricao: c.info, pos: c.pos }))
  );
  const [estilo, setEstilo] = useState(0);
  const [modoClique, setModoClique] = useState(false);
  const [coordenadas, setCoordenadas] = useState<LatLngTuple>(cidades[0].pos);
  const [zoom, setZoom] = useState(6);
  const [cep, setCep] = useState("");
  const mapRef = useRef<any>(null);

  // 🔧 CORREÇÃO DO ERRO DO LEAFLET
  useEffect(() => {
    const container = L.DomUtil.get("map");
    if (container != null) {
      // evita erro "Map container is already initialized"
      (container as any)._leaflet_id = null;
    }
  }, []);

  // Carrega endereços salvos no Supabase e desenha
  useEffect(() => {
    (async () => {
      const user_id = await getCurrentUserId();
      if (!user_id) return;

      const { data, error } = await supabase
        .from("biodigestor_maps")
        .select("id, address, created_at")
        .eq("user_id", user_id)
        .order("created_at", { ascending: true });

      if (error) {
        alert(`Erro ao carregar locais: ${error.message}`);
        return;
      }

      if (data && data.length) {
        const novos: Marcador[] = [];
        for (const row of data) {
          const pos = await geocodeAddress(row.address);
          if (pos) {
            novos.push({
              dbId: row.id,
              nome: row.address.split(",")[0] || "Local salvo",
              descricao: row.address,
              pos,
            });
          }
        }
        if (novos.length) {
          setMarcadores((prev) => [...prev, ...novos]);
        }
      }
    })();
  }, []);

  function AdicionarMarcador() {
    useMapEvents({
      async click(e) {
        if (!modoClique) return;

        const defaultName = `Marcador ${marcadores.length + 1}`;
        const nome = window.prompt("Nome do local:", defaultName) || defaultName;
        const descricaoUser = window.prompt("Descrição:", "Adicionado pelo usuário") || "Adicionado pelo usuário";

        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        const endereco = (await reverseGeocode(lat, lon)) || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        const dbId = await insertAddress(endereco);
        if (!dbId) {
          setModoClique(false);
          return;
        }

        setMarcadores((m) => [
          ...m,
          { dbId, nome, descricao: descricaoUser || endereco, pos: [lat, lon] as LatLngTuple },
        ]);
        setModoClique(false);
      },
    });
    return null;
  }

  function FlyTo({ pos, zoom }: { pos: LatLngTuple; zoom: number }) {
    const map = useMap();
    useEffect(() => {
      map.setView(pos, zoom, { animate: true });
    }, [pos, zoom, map]);
    return null;
  }

  const minhaLocalizacao = async () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada.");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const endereco = (await reverseGeocode(latitude, longitude)) || `Lat ${latitude}, Lng ${longitude}`;
      const dbId = await insertAddress(endereco);
      if (!dbId) return;

      const novoPos: LatLngTuple = [latitude, longitude];
      setMarcadores((m) => [
        ...m,
        { dbId, nome: "Minha Localização", descricao: endereco, pos: novoPos },
      ]);
      setCoordenadas(novoPos);
      setZoom(15);
    });
  };

  const limparMarcadores = () =>
    setMarcadores(cidades.map((c) => ({ nome: c.nome, descricao: c.info, pos: c.pos })));

  const exportToExcel = async () => {
    try {
      // Preparar dados
      const rows = marcadores.map((m) => [
        m.nome,
        m.descricao,
        Array.isArray(m.pos) ? m.pos[0] : "",
        Array.isArray(m.pos) ? m.pos[1] : "",
        m.dbId ?? "",
      ] as (string | number)[]);

      // Criar canvas e desenhar gráfico (ex: contagem de marcadores por cidade fixa)
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");

      // Exemplo de dados para o gráfico: número de marcadores por nome (agregado)
      const counts: Record<string, number> = {};
      marcadores.forEach((m) => {
        const key = m.nome || "Sem nome";
        counts[key] = (counts[key] ?? 0) + 1;
      });
      const labels = Object.keys(counts);
      const dataVals = labels.map((l) => counts[l]);

      if (ctx) {
        // Criar gráfico
        // eslint-disable-next-line no-unused-vars
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Quantidade de marcadores",
                data: dataVals,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: true },
            },
          },
        });

        // Aguardar próxima frame para garantir render do chart
        await new Promise((res) => setTimeout(res, 250));

        const dataUrl = canvas.toDataURL("image/png");

        // Criar workbook com ExcelJS
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Marcadores");

        // Cabeçalho
        ws.addRow(["Nome", "Descrição", "Latitude", "Longitude", "DB_ID"]);
        rows.forEach((r) => ws.addRow(r));

        // Inserir imagem do gráfico
        const base64 = dataUrl.split(",")[1];
        const imageId = wb.addImage({ base64, extension: "png" });
        // Posicionar imagem (células aproximadas)
        ws.addImage(imageId, {
          tl: { col: 6, row: 1 },
          br: { col: 16, row: 20 },
          editAs: "oneCell",
        });

        // Ajustes de largura para legibilidade
        ws.columns = [
          { width: 30 },
          { width: 50 },
          { width: 15 },
          { width: 15 },
          { width: 20 },
        ];

        const buf = await wb.xlsx.writeBuffer();
        const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `marcadores_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        throw new Error("Falha ao obter contexto do canvas para gerar gráfico.");
      }
    } catch (err) {
      console.error("Erro ao exportar Excel com gráfico:", err);
      alert("Falha ao exportar Excel com gráfico. Veja o console para mais detalhes.");
    }
  };

  const mudarEstilo = () => setEstilo((e) => (e + 1) % estilosMapa.length);

  const irPara = (pos: LatLngTuple) => {
    setCoordenadas(pos);
    setZoom(13);
  };

  const buscarCep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep) return;

    const cepNum = cep.replace(/\D/g, "");
    try {
      const viaCep = await fetch(`https://viacep.com.br/ws/${cepNum}/json/`).then((r) => r.json());
      if (viaCep.erro) {
        alert("CEP não encontrado!");
        return;
      }
      const endereco = `${viaCep.logradouro || ""}, ${viaCep.localidade}, ${viaCep.uf}`.trim();

      const dbId = await insertAddress(endereco);
      if (!dbId) return;

      const pos = await geocodeAddress(endereco);
      if (!pos) {
        alert("Localização não encontrada!");
        return;
      }

      setMarcadores((m) => [...m, { dbId, nome: `CEP ${cepNum}`, descricao: endereco, pos }]);
      setCoordenadas(pos);
      setZoom(15);
      setCep("");
    } catch {
      alert("Não foi possível localizar o CEP informado.");
    }
  };

  const removerMarcador = async (idx: number) => {
    const marker = marcadores[idx];
    if (marker?.dbId) {
      const ok = await deleteAddressById(marker.dbId);
      if (!ok) return;
    }
    setMarcadores((items) => items.filter((_, i) => i !== idx));
  };

  return (
    <div className={`w-full h-auto rounded-lg overflow-hidden border border-green-200 bg-green-50 p-2 ${className}`}>
      <div className="mb-2">
        <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
          <span role="img" aria-label="controle">🎮</span> Controles do Mapa
        </h2>

        <div className="flex flex-wrap gap-3 mb-3">
          <button
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
            onClick={minhaLocalizacao}
          >
            <span role="img" aria-label="gps">🛰️</span> Minha Localização
          </button>

          {marcadores.map((m, i) => (
            <div key={`${m.dbId ?? "static"}-${i}`} className="flex items-center gap-1">
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
                  onClick={() => removerMarcador(i)}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-3">
          <button
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-blue-500 hover:bg-blue-600 text-white transition-all ${modoClique ? "ring-2 ring-green-600" : ""}`}
            onClick={() => setModoClique(true)}
          >
            <span role="img" aria-label="add">➕</span> {modoClique ? "Clique no mapa" : "Adicionar Marcador"}
          </button>
          <button
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
            onClick={() => exportToExcel()}
          >
            <span role="img" aria-label="excel">📥</span> Exportar Excel
          </button>
          <button
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-orange-400 hover:bg-orange-500 text-white transition-all"
            onClick={mudarEstilo}
          >
            <span role="img" aria-label="paleta">🎨</span> Mudar Estilo
          </button>
          <button
            className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-sm bg-red-500 hover:bg-red-600 text-white transition-all"
            onClick={limparMarcadores}
          >
            <span role="img" aria-label="limpar">🧹</span> Limpar Tudo
          </button>
        </div>

        <form className="flex gap-2 mb-3" onSubmit={buscarCep}>
          <input
            type="text"
            placeholder="Buscar por CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            maxLength={9}
            pattern="\d{5}-?\d{3}"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="mb-2 bg-gray-100 p-2 rounded text-sm">
        <strong>Coordenadas atuais:</strong>{" "}
        Latitude: {(coordenadas as number[])[0]?.toFixed(4)}, Longitude: {(coordenadas as number[])[1]?.toFixed(4)}
      </div>

      <MapContainer
        id="map" // 👈 ESSENCIAL para correção
        center={coordenadas}
        zoom={zoom}
        whenReady={() => {}}
        style={{ height: "520px", width: "100%", borderRadius: "15px" }}
        scrollWheelZoom={true}
      >
        <TileLayer attribution={estilosMapa[estilo].atribuicao} url={estilosMapa[estilo].url} />
        {marcadores.map((m, i) => (
          <Marker key={`${m.dbId ?? "static"}-${i}`} position={m.pos}>
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
