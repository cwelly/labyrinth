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
exports.Button = void 0;
var uikit_1 = require("@react-three/uikit");
var react_1 = __importStar(require("react"));
var theme_1 = require("./theme");
var buttonVariants = {
    default: {
        containerHoverProps: {
            backgroundOpacity: 0.9,
        },
        containerProps: {
            backgroundColor: theme_1.colors.primary,
        },
        defaultProps: {
            color: theme_1.colors.primaryForeground,
        },
    },
    destructive: {
        containerHoverProps: {
            backgroundOpacity: 0.9,
        },
        containerProps: {
            backgroundColor: theme_1.colors.destructive,
        },
        defaultProps: {
            color: theme_1.colors.destructiveForeground,
        },
    },
    outline: {
        containerHoverProps: {
            backgroundColor: theme_1.colors.accent,
        },
        containerProps: {
            borderWidth: 1,
            borderColor: theme_1.colors.input,
            backgroundColor: theme_1.colors.background,
        },
    }, //TODO: hover:text-accent-foreground",
    secondary: {
        containerHoverProps: {
            backgroundOpacity: 0.8,
        },
        containerProps: {
            backgroundColor: theme_1.colors.secondary,
        },
        defaultProps: {
            color: theme_1.colors.secondaryForeground,
        },
    },
    ghost: {
        containerHoverProps: {
            backgroundColor: theme_1.colors.accent,
        },
        defaultProps: {},
    }, // TODO: hover:text-accent-foreground",
    link: {
        containerProps: {},
        defaultProps: {
            color: theme_1.colors.primary,
        },
    }, //TODO: underline-offset-4 hover:underline",
};
var buttonSizes = {
    default: { height: 40, paddingX: 16, paddingY: 8 },
    sm: { height: 36, paddingX: 12 },
    lg: { height: 42, paddingX: 32 },
    icon: { height: 40, width: 40 },
};
exports.Button = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'default' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, hover = _a.hover, props = __rest(_a, ["children", "variant", "size", "disabled", "hover"]);
    var _e = buttonVariants[variant], containerProps = _e.containerProps, defaultProps = _e.defaultProps, containerHoverProps = _e.containerHoverProps;
    var sizeProps = buttonSizes[size];
    return (react_1.default.createElement(uikit_1.Container, __assign({ borderRadius: theme_1.borderRadius.md, alignItems: "center", justifyContent: "center" }, containerProps, sizeProps, { borderOpacity: disabled ? 0.5 : undefined, backgroundOpacity: disabled ? 0.5 : undefined, cursor: disabled ? undefined : 'pointer', flexDirection: "row", hover: __assign(__assign({}, containerHoverProps), hover), ref: ref }, props),
        react_1.default.createElement(uikit_1.DefaultProperties, __assign({ fontSize: 14, lineHeight: 20, fontWeight: "medium", wordBreak: "keep-all" }, defaultProps, { opacity: disabled ? 0.5 : undefined }), children)));
});
