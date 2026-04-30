import { useEffect, useState } from "react";

const seasons = [2026, 2025, 2024, 2023, 2022, 2021];

const CATEGORIES = [
  { key: "battingAverage",      label: "Batting Average", statLabel: "AVG" },
  { key: "homeRuns",            label: "Home Runs",       statLabel: "HR"  },
  { key: "rbi",                 label: "RBI",             statLabel: "RBI" },
  { key: "onBasePlusSlugging",  label: "OPS",             statLabel: "OPS" }
];

function LeaderTable({ category, season }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        setLoading(true);
        setError(null);

        const url =
          `https://statsapi.mlb.com/api/v1/stats/leaders` +
          `?leaderCategories=${category.key}` +
          `&season=${season}` +
          `&statGroup=hitting` +
          `&sportId=1` +
          `&limit=5`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch leaders");

        const data = await res.json();
        const rows = data?.leagueLeaders?.[0]?.leaders || [];
        setLeaders(rows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaders();
  }, [category.key, season]);

  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>{category.label}</h3>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Team</th>
              <th>{category.statLabel}</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((player, i) => (
              <tr key={i}>
                <td>{player.rank}</td>
                <td>{player.person?.fullName}</td>
                <td>{player.team?.name}</td>
                <td>{player.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function HittingLeaders() {
  const [season, setSeason] = useState(2026);

  return (
    <div>
      <h2>MLB Hitting Leaders</h2>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: "bold", marginRight: 8 }}>Season:</label>
        <select value={season} onChange={(e) => setSeason(Number(e.target.value))}>
          {seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <LeaderTable key={cat.key} category={cat} season={season} />
        ))}
      </div>
    </div>
  );
}

export default HittingLeaders;