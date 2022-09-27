import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { FlavorPicker } from "./pages/FlavorPicker";
import { NicotineCalculator } from "./pages/Nicotine";
import { PageNotFound } from "./pages/PageNotFound";
import { Promos } from "./pages/Promos";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Promos />} />
        <Route path="flavors" element={<FlavorPicker />} />
        <Route path="nicotine" element={<NicotineCalculator />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
