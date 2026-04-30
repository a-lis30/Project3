import { Routes, Route, Link } from "react-router-dom";
import PlayerCompare from "./PlayerCompare";
import ListOfSeasons from "./ListOfSeasons";
import PitcherCompare from "./PitcherCompare";
import HittingLeaders from "./HittingLeaders";
import PitchingLeaders from "./PitchingLeaders";

function Home() {
  return (
    <div> 
      <h2>Home</h2>
      <p>Welcome to the MLB Stats Dashboard!</p>
      <img src="https://1000logos.net/wp-content/uploads/2017/04/MLB-Logo.png"
      alt = "MLB logo"
      style={{ width: 640, height: 346 }}
/>
    </div>
  );
}

function App() {
  return (
    <div>
      {/* Navigation Menu */}
      <nav style={styles.nav}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/seasons">List of Seasons</Link>
        <Link style={styles.link} to="/compare">Player Compare</Link>
        <Link style={styles.link} to="/pitchers">Pitcher Compare</Link>
        <Link style={styles.link} to="/hitting-leaders">Hitting Leaders</Link>
        <Link style={styles.link} to="/pitching-leaders">Pitching Leaders</Link>
      </nav>

      {/* Page Content */}
      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/seasons" element={<ListOfSeasons />} />
          <Route path="/compare" element={<PlayerCompare />} />
          <Route path="/pitchers" element={<PitcherCompare />} />
          <Route path="/hitting-leaders" element={<HittingLeaders />} />
          <Route path="/pitching-leaders" element={<PitchingLeaders />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    padding: "10px",
    backgroundColor: "#222",
    display: "flex",
    gap: "20px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  },
  container: {
    padding: "20px"
  }
};

export default App;