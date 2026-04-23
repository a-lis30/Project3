import { useEffect, useState } from "react";

const BASE_URL = "https://statsapi.mlb.com";

function PitcherCompare() {
  const [pitcher1, setPitcher1] = useState(null);
  const [pitcher2, setPitcher2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchPitchingStats(playerId, season, gameType = "R") {
    const params = new URLSearchParams({
      league_list_id: "'mlb'",
      game_type: gameType,
      season: season,
      player_id: playerId
    });

    const url = `${BASE_URL}/json/named.sport_pitching_tm.bam?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch pitcher stats");
    }

    const data = await response.json();

    const row =
      data?.sport_pitching_tm?.queryResults?.row;

    return Array.isArray(row) ? row[0] : row;
  }

  useEffect(() => {
    async function loadPitchers() {
      try {
        setLoading(true);

        const [p1, p2] = await Promise.all([
          fetchPitchingStats(592789, 2024),
          fetchPitchingStats(660271, 2024)
        ]);

        setPitcher1(p1);
        setPitcher2(p2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPitchers();
  }, []);

  if (loading) return <p>Loading pitcher stats...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Pitcher Comparison (2024)</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Stat</th>
            <th>{pitcher1.name_display_first_last}</th>
            <th>{pitcher2.name_display_first_last}</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>ERA</td>
            <td>{pitcher1.era}</td>
            <td>{pitcher2.era}</td>
          </tr>

          <tr>
            <td>W</td>
            <td>{pitcher1.w}</td>
            <td>{pitcher2.w}</td>
          </tr>

          <tr>
            <td>L</td>
            <td>{pitcher1.l}</td>
            <td>{pitcher2.l}</td>
          </tr>

          <tr>
            <td>IP</td>
            <td>{pitcher1.ip}</td>
            <td>{pitcher2.ip}</td>
          </tr>

          <tr>
            <td>SO</td>
            <td>{pitcher1.so}</td>
            <td>{pitcher2.so}</td>
          </tr>

          <tr>
            <td>WHIP</td>
            <td>{pitcher1.whip}</td>
            <td>{pitcher2.whip}</td>
          </tr>

          <tr>
            <td>BB</td>
            <td>{pitcher1.bb}</td>
            <td>{pitcher2.bb}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PitcherCompare;