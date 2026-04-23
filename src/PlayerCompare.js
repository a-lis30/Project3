import { useEffect, useState } from "react";

const BASE_URL = "https://statsapi.mlb.com";

function PlayerCompare() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local API call function (kept inside component)
  async function fetchPlayerHittingStats(playerId, season, gameType = "R") {
    const params = new URLSearchParams({
      league_list_id: "'mlb'",
      game_type: gameType,
      season: season,
      player_id: playerId
    });

    const url = `${BASE_URL}/json/named.sport_hitting_tm.bam?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch player stats");
    }

    const data = await response.json();

    const row =
      data?.sport_hitting_tm?.queryResults?.row;

    // Normalize (API may return array or object)
    return Array.isArray(row) ? row[0] : row;
  }

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);

        const [p1, p2] = await Promise.all([
          fetchPlayerHittingStats(592450, 2024), // Player 1 ID
          fetchPlayerHittingStats(605141, 2024)  // Player 2 ID
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
            <th>{player1.name_display_first_last}</th>
            <th>{player2.name_display_first_last}</th>
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