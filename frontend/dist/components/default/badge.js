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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
var uikit_1 = require("@react-three/uikit");
var react_1 = __importStar(require("react"));
var theme_1 = require("./theme");
var badgeVariants = {
    default: {
        defaultProps: {
            color: theme_1.colors.primaryForeground,
        },
        containerProps: {
            backgroundColor: theme_1.colors.primary,
        },
        containerHoverProps: {
            backgroundOpacity: 0.8,
        },
    },
    secondary: {
        defaultProps: {
            color: theme_1.colors.secondaryForeground,
        },
        containerProps: {
            backgroundColor: theme_1.colors.secondary,
        },
        containerHoverProps: {
            backgroundOpacity: 0.8,
        },
    },
    destructive: {
        defaultProps: {
            color: theme_1.colors.destructiveForeground,
        },
        containerProps: {
            backgroundColor: theme_1.colors.destructive,
        },
        containerHoverProps: {
            backgroundOpacity: 0.8,
        },
    },
    outline: {},
};
exports.Badge = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, hover = _a.hover, props = __rest(_a, ["children", "variant", "hover"]);
    var _c = badgeVariants[variant], containerProps = _c.containerProps, defaultProps = _c.defaultProps, containerHoverProps = _c.containerHoverProps;
    return (react_1.default.createElement(uikit_1.Container, __assign({ borderRadius: 1000, borderWidth: 1, paddingX: 10, paddingY: 2, hover: __assign(__assign({}, containerHoverProps), hover), ref: ref }, containerProps, props),
        react_1.default.createElement(uikit_1.DefaultProperties, __assign({ fontSize: 12, lineHeight: 16, fontWeight: "semi-bold" }, defaultProps), children)));
});
