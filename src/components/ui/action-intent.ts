export type AppActionIntent =
	| "primary"
	| "secondary"
	| "quiet"
	| "danger"
	| "dangerQuiet"
	| "accent";

type AppActionIntentPresentation = {
	color?: string;
	foreground?: string;
	variant: "default" | "filled" | "light" | "subtle";
};

export const appActionIntentPresentation: Readonly<
	Record<AppActionIntent, AppActionIntentPresentation>
> = {
	accent: { color: "#B94B2C", variant: "filled" },
	danger: { color: "red.9", variant: "filled" },
	dangerQuiet: {
		color: "red",
		foreground: "var(--mantine-color-red-9)",
		variant: "light",
	},
	primary: { variant: "filled" },
	quiet: { variant: "subtle" },
	secondary: { variant: "default" },
};
