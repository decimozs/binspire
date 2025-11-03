import About from "./components/about";
import ChangeFont from "./components/change-font";
import ChangeTheme from "./components/change-theme";

export default function Settings() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <p className="text-xl font-medium">Settings</p>
      <div className="grid grid-cols-1 gap-4">
        <ChangeTheme />
        <ChangeFont />
        <About />
      </div>
    </div>
  );
}
