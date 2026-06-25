import { AppRouter } from "./router.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { NotificationProvider } from "../context/NotificationContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  );
}
