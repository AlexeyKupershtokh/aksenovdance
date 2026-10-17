import {
	type BoxProps,
	Button as MantineButton,
	type ButtonProps as MantineButtonProps,
	type PolymorphicFactory,
	polymorphicFactory,
	type StylesApiProps,
	useProps,
	useStyles,
} from "@mantine/core";
import {
	type AppActionIntent,
	appActionIntentPresentation,
} from "./action-intent";
import classes from "./app-button.module.css";

export type AppButtonIntent = AppActionIntent;

export type AppButtonKind = "standard" | "navigation";
export type AppButtonNavigationDensity = "default" | "dense";
export type AppButtonSize = "compact" | "default" | "large";
export type AppButtonStylesNames = "root";

type MantineButtonBehaviorProps = Pick<
	MantineButtonProps,
	| "data-disabled"
	| "autoContrast"
	| "children"
	| "disabled"
	| "fullWidth"
	| "justify"
	| "leftSection"
	| "loaderProps"
	| "loading"
	| "rightSection"
>;

interface AppButtonBaseProps
	extends BoxProps,
		Omit<StylesApiProps<AppButtonFactory>, "variant">,
		MantineButtonBehaviorProps {
	/** Control height is derived from `size`. */
	h?: never;
	/** Minimum height is derived from `size`. */
	mih?: never;
	/** Visual color is derived from `intent`. */
	color?: never;
	/** Radius is owned by the design system. */
	radius?: never;
	/** Mantine variants are replaced by semantic `intent`. */
	variant?: never;
}

export type AppButtonProps = AppButtonBaseProps &
	(
		| {
				/** Semantic visual priority. Use at most one primary/accent action per group. */
				intent?: AppButtonIntent;
				/** Standard control presentation. */
				kind?: "standard";
				/** Navigation density is available only for navigation rows. */
				navigationDensity?: never;
				/** Design-system size. `default` is the mobile-first 44px control. */
				size?: AppButtonSize;
		  }
		| {
				/** Navigation rows are always low-priority actions. */
				intent: "quiet";
				/** Link-like navigation row for either an anchor or a behavioral button. */
				kind: "navigation";
				/** Dense rows are reserved for the public footer. */
				navigationDensity?: AppButtonNavigationDensity;
				/** Navigation rows use the responsive compact geometry. */
				size: "compact";
		  }
	);

export type AppButtonFactory = PolymorphicFactory<{
	props: AppButtonProps;
	defaultRef: HTMLButtonElement;
	defaultComponent: "button";
	stylesNames: AppButtonStylesNames;
}>;

const defaultProps = {
	intent: "primary",
	kind: "standard",
	size: "default",
} satisfies Partial<AppButtonProps>;

const secondaryStyle = {
	"--button-bd": "1px solid var(--mantine-color-gray-6)",
	"--button-color": "var(--ink, var(--mantine-color-dark-9))",
	"--button-hover": "var(--mantine-color-emerald-0)",
	"--button-hover-color": "var(--mantine-color-emerald-9)",
} as const;

const navigationStyle = {
	"--button-bd": "0 solid transparent",
	"--button-bg": "transparent",
	"--button-color": "var(--gd-type-color-muted)",
	"--button-hover": "transparent",
	"--button-hover-color": "var(--gd-type-color-accent)",
	"--button-justify": "flex-start",
	"--button-padding-x": "0px",
} as const;

const sizePresentation: Record<
	AppButtonSize,
	{
		height: number | { base: number; sm: number };
		mantineSize: "sm" | "md";
	}
> = {
	compact: { height: { base: 44, sm: 36 }, mantineSize: "sm" },
	default: { height: 44, mantineSize: "sm" },
	large: { height: 48, mantineSize: "md" },
};

const denseNavigationHeight = 0;

export const AppButton = polymorphicFactory<AppButtonFactory>((_props) => {
	const props = useProps("AppButton", defaultProps, _props);
	const {
		attributes,
		className,
		classNames,
		intent = "primary",
		kind = "standard",
		navigationDensity = "default",
		size = "default",
		style,
		styles,
		unstyled,
		vars,
		...others
	} = props;
	const presentation = appActionIntentPresentation[intent];
	const dimensions = sizePresentation[size];
	const height =
		kind === "navigation" && navigationDensity === "dense"
			? denseNavigationHeight
			: dimensions.height;
	const getStyles = useStyles<AppButtonFactory>({
		attributes,
		className,
		classNames,
		classes,
		name: "AppButton",
		props,
		style,
		styles,
		unstyled,
		vars,
	});
	const rootStyles = getStyles("root");

	return (
		<MantineButton
			{...rootStyles}
			{...others}
			color={presentation.color}
			data-app-size={size}
			data-intent={intent}
			data-kind={kind}
			data-navigation-density={
				kind === "navigation" ? navigationDensity : undefined
			}
			h={kind === "navigation" ? "auto" : dimensions.height}
			mih={height}
			radius="md"
			size={dimensions.mantineSize}
			style={{
				...rootStyles.style,
				...(intent === "secondary" ? secondaryStyle : undefined),
				...(kind === "navigation" ? navigationStyle : undefined),
				...(presentation.foreground
					? { "--button-color": presentation.foreground }
					: undefined),
			}}
			variant={presentation.variant}
		/>
	);
});

AppButton.classes = classes;
AppButton.displayName = "@glamdance/AppButton";

export namespace AppButton {
	export type Factory = AppButtonFactory;
	export type Intent = AppButtonIntent;
	export type Kind = AppButtonKind;
	export type NavigationDensity = AppButtonNavigationDensity;
	export type Props = AppButtonProps;
	export type Size = AppButtonSize;
	export type StylesNames = AppButtonStylesNames;
}
