import { useEffect, useState } from "react";

const pitchers = [
  { id: 694973, name: "Paul Skenes" },
  { id: 669373, name: "Tarik Skubal" },
  { id: 554430, name: "Zack Wheeler" },
  { id: 608331, name: "Max Fried" },
  { id: 808967, name: "Yoshinobu Yamamoto" },
  { id: 676979, name: "Garrett Crochet" },
  { id: 656302, name: "Dylan Cease" }
];

const seasons = [2026, 2025, 2024, 2023, 2022, 2021];

const HIGHLIGHT = "#ddeeff";

// Lower ERA and WHIP is better, everything else higher is better
function getBetter(val1, val2, lowerIsBetter = false) {
  const n1 = parseFloat(val1);
  const n2 = parseFloat(val2);
  if (isNaN(n1) || isNaN(n2)) return null;
  if (lowerIsBetter) {
    if (n1 < n2) return 1;
    if (n2 < n1) return 2;
  } else {
    if (n1 > n2) return 1;
    if (n2 > n1) return 2;
  }
  return null;
}

function cellStyle(val1, val2, player, lowerIsBetter = false) {
  const better = getBetter(val1, val2, lowerIsBetter);
  if (better === player) return { backgroundColor: HIGHLIGHT };
  return {};
}

function PitcherCompare() {
  const [season, setSeason] = useState(2026);

  const [pitcher1Id, setPitcher1Id] = useState(694973);
  const [pitcher2Id, setPitcher2Id] = useState(669373);

  const [pitcher1, setPitcher1] = useState(null);
  const [pitcher2, setPitcher2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchPitcherStats(playerId, season, playerName) {
    const url =
      `https://statsapi.mlb.com/api/v1/people/${playerId}/stats` +
      `?stats=season&group=pitching&season=${season}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed for ${playerName}`);

    const data = await res.json();
    const splits = data?.stats?.[0]?.splits;
    const split = Array.isArray(splits) ? splits[0] : null;

    if (!split?.stat) {
      return {
        name: playerName,
        era: "-", wins: "-", losses: "-",
        ip: "-", so: "-", whip: "-", bb: "-"
      };
    }

    return {
      name: playerName,
      era:   split.stat.era,
      wins:  split.stat.wins,
      losses: split.stat.losses,
      ip:    split.stat.inningsPitched,
      so:    split.stat.strikeOuts,
      whip:  split.stat.whip,
      bb:    split.stat.baseOnBalls
    };
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const p1Meta = pitchers.find(p => p.id === pitcher1Id);
        const p2Meta = pitchers.find(p => p.id === pitcher2Id);

        const [p1, p2] = await Promise.all([
          fetchPitcherStats(pitcher1Id, season, p1Meta.name),
          fetchPitcherStats(pitcher2Id, season, p2Meta.name)
        ]);

        setPitcher1(p1);
        setPitcher2(p2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pitcher1Id, pitcher2Id, season]);

  return (
    <div>
      <h2>Pitcher Comparison</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={season} onChange={(e) => setSeason(Number(e.target.value))}>
          {seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={pitcher1Id} onChange={(e) => setPitcher1Id(Number(e.target.value))}>
          {pitchers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={pitcher2Id} onChange={(e) => setPitcher2Id(Number(e.target.value))}>
          {pitchers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading stats...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && pitcher1 && pitcher2 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Stat</th>
              <th>{pitcher1.name}</th>
              <th>{pitcher2.name}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "ERA",  key: "era",    lower: true  },
              { label: "W",    key: "wins",   lower: false },
              { label: "L",    key: "losses", lower: true  },
              { label: "IP",   key: "ip",     lower: false },
              { label: "SO",   key: "so",     lower: false },
              { label: "WHIP", key: "whip",   lower: true  },
              { label: "BB",   key: "bb",     lower: true  }
            ].map(({ label, key, lower }) => (
              <tr key={key}>
                <td>{label}</td>
                <td style={cellStyle(pitcher1[key], pitcher2[key], 1, lower)}>{pitcher1[key]}</td>
                <td style={cellStyle(pitcher1[key], pitcher2[key], 2, lower)}>{pitcher2[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PitcherCompare;