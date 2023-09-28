import { animate, animation, keyframes, style } from "@angular/animations";

export const tada = animation(
	animate(
		"1s 0s",
		keyframes([
			style({ transform: "scale3d(1, 1, 1)", offset: 0 }),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, 1deg)",
				offset: 0.3,
			}),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, -1deg)",
				offset: 0.4,
			}),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, 1deg)",
				offset: 0.5,
			}),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, -1deg)",
				offset: 0.6,
			}),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, 1deg)",
				offset: 0.7,
			}),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, -1deg)",
				offset: 0.8,
			}),
			style({
				transform: "scale3d(1.01, 1.01, 1.01) rotate3d(0, 0, 1, 1deg)",
				offset: 0.9,
			}),
			style({ transform: "scale3d(1, 1, 1)", offset: 1 }),
		])
	)
);
