import { useEffect, useState } from "react";

const players = [
  { id: 545361, name: "Mike Trout" },
  { id: 605141, name: "Mookie Betts" },
  { id: 547180, name: "Bryce Harper" },
  { id: 592450, name: "Aaron Judge" },
  { id: 660271, name: "Shohei Ohtani" },
  { id: 665742, name: "Juan Soto" },
  { id: 592518, name: "Manny Machado" },
  { id: 677951, name: "Bobby Witt Jr." }
];

const seasons = [2026, 2025, 2024, 2023, 2022, 2021];

const HIGHLIGHT = "#ddeeff";

function getBetter(val1, val2) {
  const n1 = parseFloat(val1);
  const n2 = parseFloat(val2);
  if (isNaN(n1) || isNaN(n2)) return null;
  if (n1 > n2) return 1;
  if (n2 > n1) return 2;
  return null; // tie
}

function PlayerCompare() {
  const [season, setSeason] = useState(2026);

  const [player1Id, setPlayer1Id] = useState(592450);
  const [player2Id, setPlayer2Id] = useState(605141);

  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchPlayerStats(playerId, season, playerName) {
    const url =
      `https://statsapi.mlb.com/api/v1/people/${playerId}/stats` +
      `?stats=season&group=hitting&season=${season}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed for ${playerName}`);

    const data = await res.json();
    const splits = data?.stats?.[0]?.splits;
    const split = Array.isArray(splits) ? splits[0] : null;

    if (!split?.stat) {
      return { name: playerName, avg: "-", hr: "-", rbi: "-", ops: "-", ab: "-" };
    }

    return {
      name: playerName,
      avg: split.stat.avg,
      hr: split.stat.homeRuns,
      rbi: split.stat.rbi,
      ops: split.stat.ops,
      ab: split.stat.atBats
    };
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const p1Meta = players.find(p => p.id === player1Id);
        const p2Meta = players.find(p => p.id === player2Id);

        const [p1, p2] = await Promise.all([
          fetchPlayerStats(player1Id, season, p1Meta.name),
          fetchPlayerStats(player2Id, season, p2Meta.name)
        ]);

        setPlayer1(p1);
        setPlayer2(p2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [player1Id, player2Id, season]);

  function cellStyle(val1, val2, player) {
    const better = getBetter(val1, val2);
    if (better === player) return { backgroundColor: HIGHLIGHT };
    return {};
  }

  return (
    <div>
      <h2>Player Comparison</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={season} onChange={(e) => setSeason(Number(e.target.value))}>
          {seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={player1Id} onChange={(e) => setPlayer1Id(Number(e.target.value))}>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={player2Id} onChange={(e) => setPlayer2Id(Number(e.target.value))}>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading stats...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && player1 && player2 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Stat</th>
              <th>{player1.name}</th>
              <th>{player2.name}</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "AVG", key: "avg" },
              { label: "HR",  key: "hr"  },
              { label: "RBI", key: "rbi" },
              { label: "OPS", key: "ops" },
              { label: "AB",  key: "ab"  }
            ].map(({ label, key }) => (
              <tr key={key}>
                <td>{label}</td>
                <td style={cellStyle(player1[key], player2[key], 1)}>{player1[key]}</td>
                <td style={cellStyle(player1[key], player2[key], 2)}>{player2[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlayerCompare;