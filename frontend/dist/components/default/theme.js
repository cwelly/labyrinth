"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = exports.borderRadius = void 0;
exports.Defaults = Defaults;
var uikit_1 = require("@react-three/uikit");
var react_1 = __importDefault(require("react"));
var three_1 = require("three");
function hsl(h, s, l) {
    return new three_1.Color().setHSL(h / 360, s / 100, l / 100, 'srgb');
}
var baseBorderRadius = 8;
exports.borderRadius = {
    lg: baseBorderRadius,
    md: baseBorderRadius - 2,
    sm: baseBorderRadius - 4,
};
exports.colors = (0, uikit_1.basedOnPreferredColorScheme)({
    light: {
        background: hsl(0, 0, 100),
        foreground: hsl(222.2, 84, 4.9),
        card: hsl(0, 0, 100),
        cardForeground: hsl(222.2, 84, 4.9),
        popover: hsl(0, 0, 100),
        popoverForeground: hsl(222.2, 84, 4.9),
        primary: hsl(222.2, 47.4, 11.2),
        primaryForeground: hsl(210, 40, 98),
        secondary: hsl(210, 40, 96.1),
        secondaryForeground: hsl(222.2, 47.4, 11.2),
        muted: hsl(210, 40, 96.1),
        mutedForeground: hsl(215.4, 16.3, 46.9),
        accent: hsl(210, 40, 96.1),
        accentForeground: hsl(222.2, 47.4, 11.2),
        destructive: hsl(0, 72.22, 50.59),
        destructiveForeground: hsl(210, 40, 98),
        border: hsl(214.3, 31.8, 91.4),
        input: hsl(214.3, 31.8, 91.4),
        ring: hsl(222.2, 84, 4.9),
    },
    dark: {
        background: hsl(222.2, 84, 4.9),
        foreground: hsl(210, 40, 98),
        card: hsl(222.2, 84, 4.9),
        cardForeground: hsl(210, 40, 98),
        popover: hsl(222.2, 84, 4.9),
        popoverForeground: hsl(210, 40, 98),
        primary: hsl(210, 40, 98),
        primaryForeground: hsl(222.2, 47.4, 11.2),
        secondary: hsl(217.2, 32.6, 17.5),
        secondaryForeground: hsl(210, 40, 98),
        muted: hsl(217.2, 32.6, 17.5),
        mutedForeground: hsl(215, 20.2, 65.1),
        accent: hsl(217.2, 32.6, 17.5),
        accentForeground: hsl(210, 40, 98),
        destructive: hsl(0, 62.8, 30.6),
        destructiveForeground: hsl(210, 40, 98),
        border: hsl(217.2, 32.6, 17.5),
        input: hsl(217.2, 32.6, 17.5),
        ring: hsl(212.7, 26.8, 83.9),
    },
});
function Defaults(props) {
    return (react_1.default.createElement(uikit_1.DefaultProperties, __assign({ scrollbarColor: exports.colors.foreground, scrollbarBorderRadius: 4, scrollbarOpacity: 0.3, lineHeight: "150%", borderColor: exports.colors.border, color: exports.colors.foreground }, props)));
}
