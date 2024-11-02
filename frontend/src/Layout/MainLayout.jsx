import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { GlobalContext } from "../Providers/GlobalProvider";
import Navbar from "../Components/Shared/Navbar";

export default function MainLayout() {
  const { isAuthenticate } = useContext(GlobalContext);
  return (
    <div>
      {!isAuthenticate && <Navbar />}
      <Outlet />
    </div>
  );
}
