import { useEffect, useState } from "react";

const BASE_URL = "https://statsapi.mlb.com/api/v1";

function PlayerCompare() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchPlayerHittingStats(playerId, season) {
    const url = `${BASE_URL}/people/${playerId}/stats?stats=season&group=hitting&season=${season}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch player stats");
    }

    const data = await response.json();

    const statSplit = data?.stats?.[0]?.splits?.[0];

    if (!statSplit) {
      throw new Error("No hitting stats found for this player");
    }

    return {
      name: statSplit.player.fullName,
      avg: statSplit.stat.avg,
      hr: statSplit.stat.homeRuns,
      rbi: statSplit.stat.rbi,
      ops: statSplit.stat.ops,
      ab: statSplit.stat.atBats
    };
  }

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);

        const [p1, p2] = await Promise.all([
          fetchPlayerHittingStats(592450, 2024),
          fetchPlayerHittingStats(605141, 2024)
        ]);

        setPlayer1(p1);
        setPlayer2(p2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  if (loading) return <p>Loading player stats...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Player Hitting Comparison (2024)</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Stat</th>
            <th>{player1.name}</th>
            <th>{player2.name}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>AVG</td>
            <td>{player1.avg}</td>
            <td>{player2.avg}</td>
          </tr>

          <tr>
            <td>HR</td>
            <td>{player1.hr}</td>
            <td>{player2.hr}</td>
          </tr>

          <tr>
            <td>RBI</td>
            <td>{player1.rbi}</td>
            <td>{player2.rbi}</td>
          </tr>

          <tr>
            <td>OPS</td>
            <td>{player1.ops}</td>
            <td>{player2.ops}</td>
          </tr>

          <tr>
            <td>AB</td>
            <td>{player1.ab}</td>
            <td>{player2.ab}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PlayerCompare;