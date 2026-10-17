import "@mantine/core/styles.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-600.css";
import "@fontsource/roboto/cyrillic-400.css";
import "@fontsource/roboto/cyrillic-500.css";
import "@fontsource/roboto/cyrillic-600.css";
import "@fontsource/roboto-serif/latin-600.css";
import "@fontsource/roboto-serif/cyrillic-600.css";
import "./styles/tokens.css";
import "./styles/site.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const theme = createTheme({
	primaryColor: "emerald",
	colors: {
		emerald: [
			"#E4EFEA",
			"#CFE2DC",
			"#A7C8BE",
			"#80AEA1",
			"#5A9585",
			"#347D6C",
			"#0F6B5F",
			"#0B554B",
			"#084238",
			"#052E28",
		],
		coral: [
			"#FCE8E1",
			"#F8CDC0",
			"#F3AE99",
			"#EF9073",
			"#EB7958",
			"#E96F4C",
			"#D85F3D",
			"#B94B2C",
			"#963A20",
			"#702B18",
		],
	},
	fontFamily: "Roboto, sans-serif",
	headings: { fontFamily: "Roboto Serif, serif", fontWeight: "600" },
	defaultRadius: "md",
});

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(
	<StrictMode>
		<MantineProvider theme={theme} forceColorScheme="light">
			<App />
		</MantineProvider>
	</StrictMode>,
);
