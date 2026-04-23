import { useEffect, useState } from "react";

const BASE_URL = "https://statsapi.mlb.com";

function ListOfSeasons() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example values — you can later make these dynamic
  const playerId = 592450;
  const season = 2024; // API requires a season, but returns career data

  async function fetchPlayerTeams(playerId, season) {
    const params = new URLSearchParams({
      season: season,
      player_id: playerId
    });

    const url = `${BASE_URL}/json/named.player_teams.bam?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch player teams");
    }

    const data = await response.json();

    const rows =
      data?.player_teams?.queryResults?.row;

    // Normalize: API may return object or array
    return Array.isArray(rows) ? rows : [rows];
  }

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        const result = await fetchPlayerTeams(playerId, season);
        setTeams(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, []);

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Teams Played For</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Season</th>
            <th>Team</th>
            <th>League</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td>{team.season}</td>
              <td>{team.team_full}</td>
              <td>{team.league}</td>
              <td>{team.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListOfSeasons;