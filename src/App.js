import { Routes, Route, Link } from "react-router-dom";
import PlayerCompare from "./components/PlayerCompare";
import ListOfSeasons from "./components/ListOfSeasons";
import PitcherCompare from "./components/PitcherCompare";

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the MLB Stats Dashboard</p>
    </div>
  );
}

function App() {
  return (
    <div>
      {/* Navigation Menu */}
      <nav style={styles.nav}>
        <Link style={styles.link} to="/">Home</Link>
        <Link style={styles.link} to="/compare">Player Compare</Link>
      </nav>

      {/* Page Content */}
      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<PlayerCompare />} />
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