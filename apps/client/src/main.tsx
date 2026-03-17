import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner.tsx";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/uk";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const supportedLocales = ["uk", "en"];
const browserLocale = navigator.language || "en";
const locale = browserLocale.split("-")[0];

dayjs.locale(supportedLocales.includes(locale) ? locale : "uk");

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    <Toaster position="top-center" closeButton={true} />
  </Provider>,
);
