import { useEffect, useState } from "react";

const players = [
  // Hitters
  { id: 545361, name: "Mike Trout",      type: "hitter"  },
  { id: 605141, name: "Mookie Betts",    type: "hitter"  },
  { id: 547180, name: "Bryce Harper",    type: "hitter"  },
  { id: 592450, name: "Aaron Judge",     type: "hitter"  },
  { id: 660271, name: "Shohei Ohtani",   type: "hitter"  },
  { id: 665742, name: "Juan Soto",       type: "hitter"  },
  { id: 592518, name: "Manny Machado",   type: "hitter"  },
  { id: 677951, name: "Bobby Witt Jr.",  type: "hitter"  },
  // Pitchers
  { id: 694973, name: "Paul Skenes",        type: "pitcher" },
  { id: 669373, name: "Tarik Skubal",       type: "pitcher" },
  { id: 554430, name: "Zack Wheeler",       type: "pitcher" },
  { id: 608331, name: "Max Fried",          type: "pitcher" },
  { id: 808967, name: "Yoshinobu Yamamoto", type: "pitcher" },
  { id: 676979, name: "Garrett Crochet",    type: "pitcher" },
  { id: 656302, name: "Dylan Cease",        type: "pitcher" }
];

function ListOfSeasons() {
  const [selectedId, setSelectedId] = useState(592450);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedPlayer = players.find(p => p.id === selectedId);


  useEffect(() => {
    async function fetchSeasons() {
      const group = selectedPlayer.type === "hitter" ? "hitting" : "pitching";

      const url =
        `https://statsapi.mlb.com/api/v1/people/${selectedPlayer.id}` +
        `?hydrate=stats(group=${group},type=yearByYear)`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch season data");

      const data = await res.json();
      const splits = data?.people?.[0]?.stats?.[0]?.splits || [];
      return [...splits].sort((a, b) => Number(b.season) - Number(a.season));
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSeasons();
        setSeasons(data);
      } catch (err) {
        setError(err.message);
        setSeasons([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedPlayer]);

  return (
    <div>
      <h2>Seasons Played</h2>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", marginRight: 8 }}>Player:</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading && <p>Loading seasons...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && seasons.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: 8 }}>
          <thead>
            <tr>
              <th>Season</th>
              <th>Team</th>
              {selectedPlayer.type === "hitter" ? (
                <>
                  <th>AVG</th>
                  <th>OPS</th>
                </>
              ) : (
                <th>ERA</th>
              )}
            </tr>
          </thead>
          <tbody>
            {seasons.map((s, i) => (
              <tr key={i}>
                <td>{s.season}</td>
                <td>{s.team?.name || "—"}</td>
                {selectedPlayer.type === "hitter" ? (
                  <>
                    <td>{s.stat?.avg ?? "—"}</td>
                    <td>{s.stat?.ops ?? "—"}</td>
                  </>
                ) : (
                  <td>{s.stat?.era ?? "—"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && seasons.length === 0 && (
        <p>No season data found for this player.</p>
      )}
    </div>
  );
}

export default ListOfSeasons;