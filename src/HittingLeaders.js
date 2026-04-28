import { useEffect, useState } from "react";

const BASE_URL = "https://statsapi.mlb.com";

function HittingLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchHittingLeaders() {
    const url =
      `${BASE_URL}/api/v1/stats/leaders?leaderCategories=atBats&season=2026&statGroup=hitting&gameTypes=R&sportId=1&limit=5`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch hitting leaders");
    }

    const data = await response.json();

    const leadersArray = data?.leagueLeaders?.[0]?.leaders || [];

    return leadersArray;
  }

  useEffect(() => {
    async function loadHittingLeaders() {
      try {
        setLoading(true);
        const result = await fetchHittingLeaders();
        setLeaders(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadHittingLeaders();
  }, []);

  if (loading) return <p>Loading hitting leaders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>2017 MLB Hitting Leaders by At-Bats</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>AB</th>
          </tr>
        </thead>

        <tbody>
          {leaders.map((player, index) => (
            <tr key={index}>
              <td>{player.rank}</td>
              <td>{player.person?.fullName}</td>
              <td>{player.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HittingLeaders;