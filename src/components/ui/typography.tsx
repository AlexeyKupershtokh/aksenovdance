import {
	type BoxProps,
	Text as MantineText,
	type TextProps as MantineTextProps,
	Title as MantineTitle,
	type TitleProps as MantineTitleProps,
	type PolymorphicFactory,
	polymorphicFactory,
	type StylesApiProps,
	useProps,
	useStyles,
} from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./typography.module.css";

export type AppHeadingRole =
	| "display"
	| "page"
	| "section"
	| "subsection"
	| "card";
export type AppTextRole =
	| "lead"
	| "body"
	| "compact"
	| "meta"
	| "label"
	| "overline"
	| "code";
export type AppTypographyTone =
	| "default"
	| "muted"
	| "accent"
	| "positive"
	| "danger"
	| "inverse"
	| "inverseMuted";

type TypographyStyleProps =
	| "c"
	| "color"
	| "ff"
	| "fs"
	| "fw"
	| "fz"
	| "lh"
	| "lts"
	| "size"
	| "tt"
	| "variant";

type AppTypographyBoxProps = Omit<BoxProps, TypographyStyleProps>;

type HeadingBehaviorProps = Pick<
	MantineTitleProps,
	"children" | "lineClamp" | "textWrap"
>;

export type AppHeadingStylesNames = "root";

export interface AppHeadingProps
	extends AppTypographyBoxProps,
		Omit<StylesApiProps<AppHeadingFactory>, "variant">,
		HeadingBehaviorProps {
	/** HTML heading level. Choose from the document outline, not visual size. */
	level: 1 | 2 | 3 | 4 | 5 | 6;
	/** Semantic visual kind. Defaults from `level`; hero display headings opt in explicitly. */
	kind?: AppHeadingRole;
	/** Semantic color on the current surface. */
	tone?: AppTypographyTone;
}

export type AppHeadingFactory = PolymorphicFactory<{
	props: AppHeadingProps;
	defaultRef: HTMLHeadingElement;
	defaultComponent: "h2";
	stylesNames: AppHeadingStylesNames;
}>;

const headingDefaultProps = {
	tone: "default",
} satisfies Partial<AppHeadingProps>;

function defaultHeadingRole(level: AppHeadingProps["level"]): AppHeadingRole {
	if (level === 1) return "page";
	if (level === 2) return "section";
	if (level === 3) return "subsection";
	return "card";
}

export const AppHeading = polymorphicFactory<AppHeadingFactory>((_props) => {
	const props = useProps("AppHeading", headingDefaultProps, _props);
	const {
		attributes,
		className,
		classNames,
		level,
		kind = defaultHeadingRole(level),
		style,
		styles,
		tone = "default",
		unstyled,
		vars,
		...others
	} = props;
	const getStyles = useStyles<AppHeadingFactory>({
		attributes,
		className,
		classNames,
		classes: { root: classes.heading },
		name: "AppHeading",
		props,
		style,
		styles,
		unstyled,
		vars,
	});

	return (
		<MantineTitle
			{...getStyles("root")}
			{...others}
			data-role={kind}
			data-tone={tone}
			order={level}
		/>
	);
});

AppHeading.classes = { root: classes.heading };
AppHeading.displayName = "@glamdance/AppHeading";

type TextBehaviorProps = Pick<
	MantineTextProps,
	"inherit" | "inline" | "lineClamp" | "span" | "truncate"
> & { children?: ReactNode };

export type AppTextStylesNames = "root";

export interface AppTextProps
	extends AppTypographyBoxProps,
		Omit<StylesApiProps<AppTextFactory>, "variant">,
		TextBehaviorProps {
	/** Semantic text kind. */
	kind?: AppTextRole;
	/** Semantic color on the current surface. */
	tone?: AppTypographyTone;
}

export type AppTextFactory = PolymorphicFactory<{
	props: AppTextProps;
	defaultRef: HTMLParagraphElement;
	defaultComponent: "p";
	stylesNames: AppTextStylesNames;
}>;

const textDefaultProps = {
	kind: "body",
	tone: "default",
} satisfies Partial<AppTextProps>;

export const AppText = polymorphicFactory<AppTextFactory>((_props) => {
	const props = useProps("AppText", textDefaultProps, _props);
	const {
		attributes,
		className,
		classNames,
		kind = "body",
		style,
		styles,
		tone = "default",
		unstyled,
		vars,
		...others
	} = props;
	const getStyles = useStyles<AppTextFactory>({
		attributes,
		className,
		classNames,
		classes: { root: classes.text },
		name: "AppText",
		props,
		style,
		styles,
		unstyled,
		vars,
	});

	return (
		<MantineText
			{...getStyles("root")}
			{...others}
			data-role={kind}
			data-tone={tone}
		/>
	);
});

AppText.classes = { root: classes.text };
AppText.displayName = "@glamdance/AppText";

export namespace AppHeading {
	export type Factory = AppHeadingFactory;
	export type Props = AppHeadingProps;
	export type Role = AppHeadingRole;
	export type StylesNames = AppHeadingStylesNames;
}

export namespace AppText {
	export type Factory = AppTextFactory;
	export type Props = AppTextProps;
	export type Role = AppTextRole;
	export type StylesNames = AppTextStylesNames;
	export type Tone = AppTypographyTone;
}
