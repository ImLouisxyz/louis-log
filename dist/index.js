import { createRequire as M0 } from "node:module";
var A0 = Object.create;
var { defineProperty: a, getPrototypeOf: E0, getOwnPropertyNames: C0 } = Object;
var P0 = Object.prototype.hasOwnProperty;
var F0 = (q, Q, U) => {
    U = q != null ? A0(E0(q)) : {};
    const X = Q || !q || !q.__esModule ? a(U, "default", { value: q, enumerable: !0 }) : U;
    for (let Z of C0(q)) if (!P0.call(X, Z)) a(X, Z, { get: () => q[Z], enumerable: !0 });
    return X;
};
var L = (q, Q) => () => (Q || q((Q = { exports: {} }).exports, Q), Q.exports);
var _ = M0(import.meta.url);
var J0 = L((f1, r0) => {
    r0.exports = {
        name: "dotenv",
        version: "16.4.5",
        description: "Loads environment variables from .env file",
        main: "lib/main.js",
        types: "lib/main.d.ts",
        exports: {
            ".": { types: "./lib/main.d.ts", require: "./lib/main.js", default: "./lib/main.js" },
            "./config": "./config.js",
            "./config.js": "./config.js",
            "./lib/env-options": "./lib/env-options.js",
            "./lib/env-options.js": "./lib/env-options.js",
            "./lib/cli-options": "./lib/cli-options.js",
            "./lib/cli-options.js": "./lib/cli-options.js",
            "./package.json": "./package.json",
        },
        scripts: {
            "dts-check": "tsc --project tests/types/tsconfig.json",
            lint: "standard",
            "lint-readme": "standard-markdown",
            pretest: "npm run lint && npm run dts-check",
            test: "tap tests/*.js --100 -Rspec",
            "test:coverage": "tap --coverage-report=lcov",
            prerelease: "npm test",
            release: "standard-version",
        },
        repository: { type: "git", url: "git://github.com/motdotla/dotenv.git" },
        funding: "https://dotenvx.com",
        keywords: ["dotenv", "env", ".env", "environment", "variables", "config", "settings"],
        readmeFilename: "README.md",
        license: "BSD-2-Clause",
        devDependencies: {
            "@definitelytyped/dtslint": "^0.0.133",
            "@types/node": "^18.11.3",
            decache: "^4.6.1",
            sinon: "^14.0.1",
            standard: "^17.0.0",
            "standard-markdown": "^7.1.0",
            "standard-version": "^9.5.0",
            tap: "^16.3.0",
            tar: "^6.1.11",
            typescript: "^4.8.4",
        },
        engines: { node: ">=12" },
        browser: { fs: !1 },
    };
});
var j0 = L((h1, A) => {
    var e0 = function (q) {
            const Q = {};
            let U = q.toString();
            U = U.replace(/\r\n?/gm, "\n");
            let X;
            while ((X = t0.exec(U)) != null) {
                const Z = X[1];
                let $ = X[2] || "";
                $ = $.trim();
                const G = $[0];
                if ((($ = $.replace(/^(['"`])([\s\S]*)\1$/gm, "$2")), G === '"'))
                    ($ = $.replace(/\\n/g, "\n")), ($ = $.replace(/\\r/g, "\r"));
                Q[Z] = $;
            }
            return Q;
        },
        q1 = function (q) {
            const Q = H0(q),
                U = j.configDotenv({ path: Q });
            if (!U.parsed) {
                const G = new Error(`MISSING_DATA: Cannot parse ${Q} for an unknown reason`);
                throw ((G.code = "MISSING_DATA"), G);
            }
            const X = O0(q).split(","),
                Z = X.length;
            let $;
            for (let G = 0; G < Z; G++)
                try {
                    const B = X[G].trim(),
                        J = X1(U, B);
                    $ = j.decrypt(J.ciphertext, J.key);
                    break;
                } catch (B) {
                    if (G + 1 >= Z) throw B;
                }
            return j.parse($);
        },
        Q1 = function (q) {
            console.log(`[dotenv@${n}][INFO] ${q}`);
        },
        U1 = function (q) {
            console.log(`[dotenv@${n}][WARN] ${q}`);
        },
        m = function (q) {
            console.log(`[dotenv@${n}][DEBUG] ${q}`);
        },
        O0 = function (q) {
            if (q && q.DOTENV_KEY && q.DOTENV_KEY.length > 0) return q.DOTENV_KEY;
            if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
            return "";
        },
        X1 = function (q, Q) {
            let U;
            try {
                U = new URL(Q);
            } catch (B) {
                if (B.code === "ERR_INVALID_URL") {
                    const J = new Error(
                        "INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development",
                    );
                    throw ((J.code = "INVALID_DOTENV_KEY"), J);
                }
                throw B;
            }
            const X = U.password;
            if (!X) {
                const B = new Error("INVALID_DOTENV_KEY: Missing key part");
                throw ((B.code = "INVALID_DOTENV_KEY"), B);
            }
            const Z = U.searchParams.get("environment");
            if (!Z) {
                const B = new Error("INVALID_DOTENV_KEY: Missing environment part");
                throw ((B.code = "INVALID_DOTENV_KEY"), B);
            }
            const $ = `DOTENV_VAULT_${Z.toUpperCase()}`,
                G = q.parsed[$];
            if (!G) {
                const B = new Error(
                    `NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${$} in your .env.vault file.`,
                );
                throw ((B.code = "NOT_FOUND_DOTENV_ENVIRONMENT"), B);
            }
            return { ciphertext: G, key: X };
        },
        H0 = function (q) {
            let Q = null;
            if (q && q.path && q.path.length > 0)
                if (Array.isArray(q.path)) {
                    for (let U of q.path) if (i.existsSync(U)) Q = U.endsWith(".vault") ? U : `${U}.vault`;
                } else Q = q.path.endsWith(".vault") ? q.path : `${q.path}.vault`;
            else Q = l.resolve(process.cwd(), ".env.vault");
            if (i.existsSync(Q)) return Q;
            return null;
        },
        K0 = function (q) {
            return q[0] === "~" ? l.join(a0.homedir(), q.slice(1)) : q;
        },
        Z1 = function (q) {
            Q1("Loading env from encrypted .env.vault");
            const Q = j._parseVault(q);
            let U = process.env;
            if (q && q.processEnv != null) U = q.processEnv;
            return j.populate(U, Q, q), { parsed: Q };
        },
        $1 = function (q) {
            const Q = l.resolve(process.cwd(), ".env");
            let U = "utf8";
            const X = Boolean(q && q.debug);
            if (q && q.encoding) U = q.encoding;
            else if (X) m("No encoding is specified. UTF-8 is used by default");
            let Z = [Q];
            if (q && q.path)
                if (!Array.isArray(q.path)) Z = [K0(q.path)];
                else {
                    Z = [];
                    for (let J of q.path) Z.push(K0(J));
                }
            let $;
            const G = {};
            for (let J of Z)
                try {
                    const V = j.parse(i.readFileSync(J, { encoding: U }));
                    j.populate(G, V, q);
                } catch (V) {
                    if (X) m(`Failed to load ${J} ${V.message}`);
                    $ = V;
                }
            let B = process.env;
            if (q && q.processEnv != null) B = q.processEnv;
            if ((j.populate(B, G, q), $)) return { parsed: G, error: $ };
            else return { parsed: G };
        },
        G1 = function (q) {
            if (O0(q).length === 0) return j.configDotenv(q);
            const Q = H0(q);
            if (!Q)
                return (
                    U1(`You set DOTENV_KEY but you are missing a .env.vault file at ${Q}. Did you forget to build it?`),
                    j.configDotenv(q)
                );
            return j._configVault(q);
        },
        z1 = function (q, Q) {
            const U = Buffer.from(Q.slice(-64), "hex");
            let X = Buffer.from(q, "base64");
            const Z = X.subarray(0, 12),
                $ = X.subarray(-16);
            X = X.subarray(12, -16);
            try {
                const G = s0.createDecipheriv("aes-256-gcm", U, Z);
                return G.setAuthTag($), `${G.update(X)}${G.final()}`;
            } catch (G) {
                const B = G instanceof RangeError,
                    J = G.message === "Invalid key length",
                    V = G.message === "Unsupported state or unable to authenticate data";
                if (B || J) {
                    const K = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
                    throw ((K.code = "INVALID_DOTENV_KEY"), K);
                } else if (V) {
                    const K = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
                    throw ((K.code = "DECRYPTION_FAILED"), K);
                } else throw G;
            }
        },
        B1 = function (q, Q, U = {}) {
            const X = Boolean(U && U.debug),
                Z = Boolean(U && U.override);
            if (typeof Q !== "object") {
                const $ = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
                throw (($.code = "OBJECT_REQUIRED"), $);
            }
            for (let $ of Object.keys(Q))
                if (Object.prototype.hasOwnProperty.call(q, $)) {
                    if (Z === !0) q[$] = Q[$];
                    if (X)
                        if (Z === !0) m(`"${$}" is already defined and WAS overwritten`);
                        else m(`"${$}" is already defined and was NOT overwritten`);
                } else q[$] = Q[$];
        },
        i = _("fs"),
        l = _("path"),
        a0 = _("os"),
        s0 = _("crypto"),
        o0 = J0(),
        n = o0.version,
        t0 =
            /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm,
        j = { configDotenv: $1, _configVault: Z1, _parseVault: q1, config: G1, decrypt: z1, parse: e0, populate: B1 };
    h1.configDotenv = j.configDotenv;
    h1._configVault = j._configVault;
    h1._parseVault = j._parseVault;
    h1.config = j.config;
    h1.decrypt = j.decrypt;
    h1.parse = j.parse;
    h1.populate = j.populate;
    A.exports = j;
});
var W0 = L((_1, V0) => {
    var D = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) D.encoding = process.env.DOTENV_CONFIG_ENCODING;
    if (process.env.DOTENV_CONFIG_PATH != null) D.path = process.env.DOTENV_CONFIG_PATH;
    if (process.env.DOTENV_CONFIG_DEBUG != null) D.debug = process.env.DOTENV_CONFIG_DEBUG;
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) D.override = process.env.DOTENV_CONFIG_OVERRIDE;
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) D.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    V0.exports = D;
});
var Y0 = L((v1, w0) => {
    var w1 = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/;
    w0.exports = function q(Q) {
        return Q.reduce(function (U, X) {
            const Z = X.match(w1);
            if (Z) U[Z[1]] = Z[2];
            return U;
        }, {});
    };
});
var I0 = L(() => {
    (function () {
        j0().config(Object.assign({}, W0(), Y0()(process.argv)));
    })();
});
var L0 = function () {
    const q = new Map();
    for (let [Q, U] of Object.entries(O)) {
        for (let [X, Z] of Object.entries(U))
            (O[X] = { open: `\x1B[${Z[0]}m`, close: `\x1B[${Z[1]}m` }), (U[X] = O[X]), q.set(Z[0], Z[1]);
        Object.defineProperty(O, Q, { value: U, enumerable: !1 });
    }
    return (
        Object.defineProperty(O, "codes", { value: q, enumerable: !1 }),
        (O.color.close = "\x1B[39m"),
        (O.bgColor.close = "\x1B[49m"),
        (O.color.ansi = s()),
        (O.color.ansi256 = o()),
        (O.color.ansi16m = t()),
        (O.bgColor.ansi = s(10)),
        (O.bgColor.ansi256 = o(10)),
        (O.bgColor.ansi16m = t(10)),
        Object.defineProperties(O, {
            rgbToAnsi256: {
                value(Q, U, X) {
                    if (Q === U && U === X) {
                        if (Q < 8) return 16;
                        if (Q > 248) return 231;
                        return Math.round(((Q - 8) / 247) * 24) + 232;
                    }
                    return (
                        16 + 36 * Math.round((Q / 255) * 5) + 6 * Math.round((U / 255) * 5) + Math.round((X / 255) * 5)
                    );
                },
                enumerable: !1,
            },
            hexToRgb: {
                value(Q) {
                    const U = /[a-f\d]{6}|[a-f\d]{3}/i.exec(Q.toString(16));
                    if (!U) return [0, 0, 0];
                    let [X] = U;
                    if (X.length === 3) X = [...X].map(($) => $ + $).join("");
                    const Z = Number.parseInt(X, 16);
                    return [(Z >> 16) & 255, (Z >> 8) & 255, Z & 255];
                },
                enumerable: !1,
            },
            hexToAnsi256: { value: (Q) => O.rgbToAnsi256(...O.hexToRgb(Q)), enumerable: !1 },
            ansi256ToAnsi: {
                value(Q) {
                    if (Q < 8) return 30 + Q;
                    if (Q < 16) return 90 + (Q - 8);
                    let U, X, Z;
                    if (Q >= 232) (U = ((Q - 232) * 10 + 8) / 255), (X = U), (Z = U);
                    else {
                        Q -= 16;
                        const B = Q % 36;
                        (U = Math.floor(Q / 36) / 5), (X = Math.floor(B / 6) / 5), (Z = (B % 6) / 5);
                    }
                    const $ = Math.max(U, X, Z) * 2;
                    if ($ === 0) return 30;
                    let G = 30 + ((Math.round(Z) << 2) | (Math.round(X) << 1) | Math.round(U));
                    if ($ === 2) G += 60;
                    return G;
                },
                enumerable: !1,
            },
            rgbToAnsi: { value: (Q, U, X) => O.ansi256ToAnsi(O.rgbToAnsi256(Q, U, X)), enumerable: !1 },
            hexToAnsi: { value: (Q) => O.ansi256ToAnsi(O.hexToAnsi256(Q)), enumerable: !1 },
        }),
        O
    );
};
var s =
        (q = 0) =>
        (Q) =>
            `\x1B[${Q + q}m`,
    o =
        (q = 0) =>
        (Q) =>
            `\x1B[${38 + q};5;${Q}m`,
    t =
        (q = 0) =>
        (Q, U, X) =>
            `\x1B[${38 + q};2;${Q};${U};${X}m`,
    O = {
        modifier: {
            reset: [0, 0],
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            overline: [53, 55],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29],
        },
        color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            blackBright: [90, 39],
            gray: [90, 39],
            grey: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39],
        },
        bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            bgBlackBright: [100, 49],
            bgGray: [100, 49],
            bgGrey: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49],
        },
    },
    R1 = Object.keys(O.modifier),
    b0 = Object.keys(O.color),
    D0 = Object.keys(O.bgColor),
    A1 = [...b0, ...D0],
    x0 = L0(),
    N = x0;
import c from "node:process";
import k0 from "node:os";
import e from "node:tty";
var I = function (q, Q = globalThis.Deno ? globalThis.Deno.args : c.argv) {
        const U = q.startsWith("-") ? "" : q.length === 1 ? "-" : "--",
            X = Q.indexOf(U + q),
            Z = Q.indexOf("--");
        return X !== -1 && (Z === -1 || X < Z);
    },
    T0 = function () {
        if ("FORCE_COLOR" in H) {
            if (H.FORCE_COLOR === "true") return 1;
            if (H.FORCE_COLOR === "false") return 0;
            return H.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(H.FORCE_COLOR, 10), 3);
        }
    },
    S0 = function (q) {
        if (q === 0) return !1;
        return { level: q, hasBasic: !0, has256: q >= 2, has16m: q >= 3 };
    },
    f0 = function (q, { streamIsTTY: Q, sniffFlags: U = !0 } = {}) {
        const X = T0();
        if (X !== void 0) v = X;
        const Z = U ? v : X;
        if (Z === 0) return 0;
        if (U) {
            if (I("color=16m") || I("color=full") || I("color=truecolor")) return 3;
            if (I("color=256")) return 2;
        }
        if ("TF_BUILD" in H && "AGENT_NAME" in H) return 1;
        if (q && !Q && Z === void 0) return 0;
        const $ = Z || 0;
        if (H.TERM === "dumb") return $;
        if (c.platform === "win32") {
            const G = k0.release().split(".");
            if (Number(G[0]) >= 10 && Number(G[2]) >= 10586) return Number(G[2]) >= 14931 ? 3 : 2;
            return 1;
        }
        if ("CI" in H) {
            if ("GITHUB_ACTIONS" in H || "GITEA_ACTIONS" in H) return 3;
            if (
                ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((G) => G in H) ||
                H.CI_NAME === "codeship"
            )
                return 1;
            return $;
        }
        if ("TEAMCITY_VERSION" in H) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(H.TEAMCITY_VERSION) ? 1 : 0;
        if (H.COLORTERM === "truecolor") return 3;
        if (H.TERM === "xterm-kitty") return 3;
        if ("TERM_PROGRAM" in H) {
            const G = Number.parseInt((H.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
            switch (H.TERM_PROGRAM) {
                case "iTerm.app":
                    return G >= 3 ? 3 : 2;
                case "Apple_Terminal":
                    return 2;
            }
        }
        if (/-256(color)?$/i.test(H.TERM)) return 2;
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(H.TERM)) return 1;
        if ("COLORTERM" in H) return 1;
        return $;
    };
function q0(q, Q = {}) {
    const U = f0(q, { streamIsTTY: q && q.isTTY, ...Q });
    return S0(U);
}
var { env: H } = c,
    v;
if (I("no-color") || I("no-colors") || I("color=false") || I("color=never")) v = 0;
else if (I("color") || I("colors") || I("color=true") || I("color=always")) v = 1;
var h0 = { stdout: q0({ isTTY: e.isatty(1) }), stderr: q0({ isTTY: e.isatty(2) }) },
    Q0 = h0;
function U0(q, Q, U) {
    let X = q.indexOf(Q);
    if (X === -1) return q;
    const Z = Q.length;
    let $ = 0,
        G = "";
    do (G += q.slice($, X) + Q + U), ($ = X + Z), (X = q.indexOf(Q, $));
    while (X !== -1);
    return (G += q.slice($)), G;
}
function X0(q, Q, U, X) {
    let Z = 0,
        $ = "";
    do {
        const G = q[X - 1] === "\r";
        ($ += q.slice(Z, G ? X - 1 : X) + Q + (G ? "\r\n" : "\n") + U), (Z = X + 1), (X = q.indexOf("\n", Z));
    } while (X !== -1);
    return ($ += q.slice(Z)), $;
}
var k = function (q) {
    return v0(q);
};
var { stdout: Z0, stderr: $0 } = Q0,
    p = Symbol("GENERATOR"),
    M = Symbol("STYLER"),
    x = Symbol("IS_EMPTY"),
    G0 = ["ansi", "ansi", "ansi256", "ansi16m"],
    b = Object.create(null),
    _0 = (q, Q = {}) => {
        if (Q.level && !(Number.isInteger(Q.level) && Q.level >= 0 && Q.level <= 3))
            throw new Error("The `level` option should be an integer from 0 to 3");
        const U = Z0 ? Z0.level : 0;
        q.level = Q.level === void 0 ? U : Q.level;
    };
var v0 = (q) => {
    const Q = (...U) => U.join(" ");
    return _0(Q, q), Object.setPrototypeOf(Q, k.prototype), Q;
};
Object.setPrototypeOf(k.prototype, Function.prototype);
for (let [q, Q] of Object.entries(N))
    b[q] = {
        get() {
            const U = y(this, d(Q.open, Q.close, this[M]), this[x]);
            return Object.defineProperty(this, q, { value: U }), U;
        },
    };
b.visible = {
    get() {
        const q = y(this, this[M], !0);
        return Object.defineProperty(this, "visible", { value: q }), q;
    },
};
var g = (q, Q, U, ...X) => {
        if (q === "rgb") {
            if (Q === "ansi16m") return N[U].ansi16m(...X);
            if (Q === "ansi256") return N[U].ansi256(N.rgbToAnsi256(...X));
            return N[U].ansi(N.rgbToAnsi(...X));
        }
        if (q === "hex") return g("rgb", Q, U, ...N.hexToRgb(...X));
        return N[U][q](...X);
    },
    y0 = ["rgb", "hex", "ansi256"];
for (let q of y0) {
    b[q] = {
        get() {
            const { level: U } = this;
            return function (...X) {
                const Z = d(g(q, G0[U], "color", ...X), N.color.close, this[M]);
                return y(this, Z, this[x]);
            };
        },
    };
    const Q = "bg" + q[0].toUpperCase() + q.slice(1);
    b[Q] = {
        get() {
            const { level: U } = this;
            return function (...X) {
                const Z = d(g(q, G0[U], "bgColor", ...X), N.bgColor.close, this[M]);
                return y(this, Z, this[x]);
            };
        },
    };
}
var m0 = Object.defineProperties(() => {}, {
        ...b,
        level: {
            enumerable: !0,
            get() {
                return this[p].level;
            },
            set(q) {
                this[p].level = q;
            },
        },
    }),
    d = (q, Q, U) => {
        let X, Z;
        if (U === void 0) (X = q), (Z = Q);
        else (X = U.openAll + q), (Z = Q + U.closeAll);
        return { open: q, close: Q, openAll: X, closeAll: Z, parent: U };
    },
    y = (q, Q, U) => {
        const X = (...Z) => u0(X, Z.length === 1 ? "" + Z[0] : Z.join(" "));
        return Object.setPrototypeOf(X, m0), (X[p] = q), (X[M] = Q), (X[x] = U), X;
    },
    u0 = (q, Q) => {
        if (q.level <= 0 || !Q) return q[x] ? "" : Q;
        let U = q[M];
        if (U === void 0) return Q;
        const { openAll: X, closeAll: Z } = U;
        if (Q.includes("\x1B")) while (U !== void 0) (Q = U0(Q, U.close, U.open)), (U = U.parent);
        const $ = Q.indexOf("\n");
        if ($ !== -1) Q = X0(Q, Z, X, $);
        return X + Q + Z;
    };
Object.defineProperties(k.prototype, b);
var c0 = k(),
    k1 = k({ level: $0 ? $0.level : 0 });
var F = c0;
var p0 = /d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g,
    g0 =
        /\b(?:[A-Z]{1,3}[A-Z][TC])(?:[-+]\d{4})?|((?:Australian )?(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time)\b/g,
    d0 = /[^-+\dA-Z]/g;
function w(q, Q, U, X) {
    if (arguments.length === 1 && typeof q === "string" && !/\d/.test(q)) (Q = q), (q = void 0);
    if (((q = q || q === 0 ? q : new Date()), !(q instanceof Date))) q = new Date(q);
    if (isNaN(q)) throw TypeError("Invalid date");
    Q = String(z0[Q] || Q || z0.default);
    var Z = Q.slice(0, 4);
    if (Z === "UTC:" || Z === "GMT:") {
        if (((Q = Q.slice(4)), (U = !0), Z === "GMT:")) X = !0;
    }
    var $ = function z() {
            return U ? "getUTC" : "get";
        },
        G = function z() {
            return q[$() + "Date"]();
        },
        B = function z() {
            return q[$() + "Day"]();
        },
        J = function z() {
            return q[$() + "Month"]();
        },
        V = function z() {
            return q[$() + "FullYear"]();
        },
        K = function z() {
            return q[$() + "Hours"]();
        },
        E = function z() {
            return q[$() + "Minutes"]();
        },
        T = function z() {
            return q[$() + "Seconds"]();
        },
        S = function z() {
            return q[$() + "Milliseconds"]();
        },
        C = function z() {
            return U ? 0 : q.getTimezoneOffset();
        },
        f = function z() {
            return i0(q);
        },
        u = function z() {
            return l0(q);
        },
        h = {
            d: function z() {
                return G();
            },
            dd: function z() {
                return Y(G());
            },
            ddd: function z() {
                return W.dayNames[B()];
            },
            DDD: function z() {
                return B0({ y: V(), m: J(), d: G(), _: $(), dayName: W.dayNames[B()], short: !0 });
            },
            dddd: function z() {
                return W.dayNames[B() + 7];
            },
            DDDD: function z() {
                return B0({ y: V(), m: J(), d: G(), _: $(), dayName: W.dayNames[B() + 7] });
            },
            m: function z() {
                return J() + 1;
            },
            mm: function z() {
                return Y(J() + 1);
            },
            mmm: function z() {
                return W.monthNames[J()];
            },
            mmmm: function z() {
                return W.monthNames[J() + 12];
            },
            yy: function z() {
                return String(V()).slice(2);
            },
            yyyy: function z() {
                return Y(V(), 4);
            },
            h: function z() {
                return K() % 12 || 12;
            },
            hh: function z() {
                return Y(K() % 12 || 12);
            },
            H: function z() {
                return K();
            },
            HH: function z() {
                return Y(K());
            },
            M: function z() {
                return E();
            },
            MM: function z() {
                return Y(E());
            },
            s: function z() {
                return T();
            },
            ss: function z() {
                return Y(T());
            },
            l: function z() {
                return Y(S(), 3);
            },
            L: function z() {
                return Y(Math.floor(S() / 10));
            },
            t: function z() {
                return K() < 12 ? W.timeNames[0] : W.timeNames[1];
            },
            tt: function z() {
                return K() < 12 ? W.timeNames[2] : W.timeNames[3];
            },
            T: function z() {
                return K() < 12 ? W.timeNames[4] : W.timeNames[5];
            },
            TT: function z() {
                return K() < 12 ? W.timeNames[6] : W.timeNames[7];
            },
            Z: function z() {
                return X ? "GMT" : U ? "UTC" : n0(q);
            },
            o: function z() {
                return (C() > 0 ? "-" : "+") + Y(Math.floor(Math.abs(C()) / 60) * 100 + (Math.abs(C()) % 60), 4);
            },
            p: function z() {
                return (
                    (C() > 0 ? "-" : "+") +
                    Y(Math.floor(Math.abs(C()) / 60), 2) +
                    ":" +
                    Y(Math.floor(Math.abs(C()) % 60), 2)
                );
            },
            S: function z() {
                return ["th", "st", "nd", "rd"][G() % 10 > 3 ? 0 : (((G() % 100) - (G() % 10) != 10) * G()) % 10];
            },
            W: function z() {
                return f();
            },
            WW: function z() {
                return Y(f());
            },
            N: function z() {
                return u();
            },
        };
    return Q.replace(p0, function (z) {
        if (z in h) return h[z]();
        return z.slice(1, z.length - 1);
    });
}
var z0 = {
        default: "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        paddedShortDate: "mm/dd/yyyy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z",
    },
    W = {
        dayNames: [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        monthNames: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"],
    },
    Y = function q(Q) {
        var U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
        return String(Q).padStart(U, "0");
    },
    B0 = function q(Q) {
        var { y: U, m: X, d: Z, _: $, dayName: G, short: B } = Q,
            J = B === void 0 ? !1 : B,
            V = new Date(),
            K = new Date();
        K.setDate(K[$ + "Date"]() - 1);
        var E = new Date();
        E.setDate(E[$ + "Date"]() + 1);
        var T = function P() {
                return V[$ + "Date"]();
            },
            S = function P() {
                return V[$ + "Month"]();
            },
            C = function P() {
                return V[$ + "FullYear"]();
            },
            f = function P() {
                return K[$ + "Date"]();
            },
            u = function P() {
                return K[$ + "Month"]();
            },
            h = function P() {
                return K[$ + "FullYear"]();
            },
            z = function P() {
                return E[$ + "Date"]();
            },
            N0 = function P() {
                return E[$ + "Month"]();
            },
            R0 = function P() {
                return E[$ + "FullYear"]();
            };
        if (C() === U && S() === X && T() === Z) return J ? "Tdy" : "Today";
        else if (h() === U && u() === X && f() === Z) return J ? "Ysd" : "Yesterday";
        else if (R0() === U && N0() === X && z() === Z) return J ? "Tmw" : "Tomorrow";
        return G;
    },
    i0 = function q(Q) {
        var U = new Date(Q.getFullYear(), Q.getMonth(), Q.getDate());
        U.setDate(U.getDate() - ((U.getDay() + 6) % 7) + 3);
        var X = new Date(U.getFullYear(), 0, 4);
        X.setDate(X.getDate() - ((X.getDay() + 6) % 7) + 3);
        var Z = U.getTimezoneOffset() - X.getTimezoneOffset();
        U.setHours(U.getHours() - Z);
        var $ = (U - X) / 604800000;
        return 1 + Math.floor($);
    },
    l0 = function q(Q) {
        var U = Q.getDay();
        if (U === 0) U = 7;
        return U;
    },
    n0 = function q(Q) {
        return (String(Q).match(g0) || [""])
            .pop()
            .replace(d0, "")
            .replace(/GMT\+0000/g, "UTC");
    };
var p1 = F0(I0(), 1);
import * as R from "node:fs";
var r = {
    show: {
        stdoutEnable: !0,
        mainProgram: !0,
        subProgram: !0,
        date: !0,
        dateformat: "yyyy-mm-dd HH:MM:ss:l Z",
        level: !0,
        ignoreLevels: process.env.ENVIRONMENT != "DEV" ? ["DEBUG"] : [],
    },
    logStorage: {
        path: "./logs",
        json: !0,
        txt: !0,
        splitBy: "day",
        stratagy: "batch",
        batch: 6,
        ignoreLevels: process.env.ENVIRONMENT != "DEV" ? ["DEBUG"] : [],
    },
    logWebook: { enable: !1, url: "", form: "" },
};
class Y1 {
    formatSettings;
    storageSettings;
    webhookSettings;
    mainProcess;
    subProcess;
    colours = { FATAL: F.bgRedBright, ERROR: F.red, WARN: F.yellow, SUCCESS: F.green, INFO: F.blue, DEBUG: F.magenta };
    logBuffer = [];
    constructor(q, Q, U = {}) {
        try {
            (this.mainProcess = q), (this.subProcess = Q);
        } catch (X) {
            console.error("There was an issue with initialising process names"), process.exit(1);
        }
        try {
            this.formatSettings = { ...r.show, ...U.show };
        } catch (X) {
            console.error("There was an issue with initialising settings: format Settings", U.show), process.exit(1);
        }
        try {
            this.storageSettings = { ...r.logStorage, ...U.logStorage };
        } catch (X) {
            console.error("There was an issue with initialising settings: storage Settings", U.logStorage),
                process.exit(1);
        }
        try {
            this.webhookSettings = { ...r.logWebook, ...U.logWebook };
        } catch (X) {
            console.error("There was an issue with initialising settings: webhook Settings", U.logWebook),
                process.exit(1);
        }
        try {
            this.success("Initialised Logger"),
                this.debug("Settings:\n" + JSON.stringify(this.formatSettings, null, 4)),
                this.debug("\n" + JSON.stringify(this.storageSettings, null, 4)),
                this.debug("\n" + JSON.stringify(this.webhookSettings, null, 4) + "\n");
        } catch (X) {
            console.error("There was an issue with logging settings"), process.exit(1);
        }
    }
    sendLog(q, Q, U) {
        try {
            const X = new Date(),
                Z = w(X, this.formatSettings.dateformat),
                $ = this.handleLogDatatype(Q),
                G = this.handleLogDatatype(U),
                B = this.formTxtLog(Z, $, q, G);
            if (this.formatSettings.stdoutEnable && !this.formatSettings.ignoreLevels.includes(q))
                console.log(this.colours[q](B));
            if (
                (this.storageSettings.json || this.storageSettings.txt) &&
                !this.storageSettings.ignoreLevels.includes(q)
            )
                this.logToFile(X, Z, $, q, G, B);
        } catch (X) {
            console.error("There was an issue logging data", X);
        }
    }
    formTxtLog(q, Q, U, X) {
        let Z = "";
        return (
            (Z += this.formatSettings.date ? `[${q}] ` : ""),
            (Z += this.formatSettings.mainProgram || this.formatSettings.subProgram ? "<" : ""),
            (Z += this.formatSettings.mainProgram ? this.mainProcess : ""),
            (Z += this.formatSettings.mainProgram && this.formatSettings.subProgram ? "." : ""),
            (Z += this.formatSettings.subProgram ? this.subProcess : ""),
            (Z += this.formatSettings.mainProgram || this.formatSettings.subProgram ? "> " : ""),
            (Z += this.formatSettings.level ? `[${U}] ` : ""),
            (Z += Q),
            (Z += X != "" ? "\nLog Data:\n" + X : ""),
            Z
        );
    }
    logToFile(q, Q, U, X, Z, $) {
        const G = {
            date: q,
            formattedDate: Q,
            mainProcess: this.mainProcess,
            subProcess: this.subProcess,
            logLevel: X,
            logMessage: U,
            logData: Z,
        };
        let B = "";
        try {
            B = JSON.stringify(G);
        } catch (J) {
            this.error("Error converting logJSON to string", { error: J, data: G });
        }
        if (this.storageSettings.stratagy == "batch" && this.storageSettings.batch > 1) {
            if (this.logBuffer.push({ logTXT: $, logJSONString: B }) >= this.storageSettings.batch)
                this.extractBuffer(q);
        } else {
            let { dirLocation: J, logLocation: V } = this.generatePaths(q);
            if (!R.existsSync(J)) R.mkdirSync(J, { recursive: !0 });
            if (this.storageSettings.txt) {
                const K = R.createWriteStream(V + "txt.log", { flags: "a" });
                K.write($ + "\n"), K.end();
            }
            if (this.storageSettings.json) {
                const K = R.createWriteStream(V + "json.log", { flags: "a" });
                K.write(B + "\n"), K.end();
            }
        }
    }
    generatePaths(q) {
        let Q = "",
            U = this.storageSettings.path;
        switch (this.storageSettings.splitBy) {
            case "don't split":
                (U += "/"), (Q += U + "logs.");
                break;
            case "year":
                (U += "/"), (Q += `${w(q, "yyyy")}.`);
                break;
            case "month":
                (U += `/${w(q, "yyyy")}/`), (Q += U + `${w(q, "mm")}.`);
                break;
            case "day":
                (U += `/${w(q, "yyyy/mm")}/`), (Q += U + `${w(q, "dd")}.`);
                break;
            case "hour":
                (U += `/${w(q, "yyyy/mm/dd")}/`), (Q += U + `${w(q, "HH")}.`);
                break;
            case "minute":
                (U += `/${w(q, "yyyy/mm/dd/HH")}/`), (Q += U + `${w(q, "MM")}.`);
                break;
            case "second":
                (U += `/${w(q, "yyyy/mm/dd/HH/MM")}/`), (Q += U + `${w(q, "ss")}.`);
                break;
            default:
                this.error("Logger split by value is invalid", this.storageSettings.splitBy);
                break;
        }
        return { dirLocation: U, logLocation: Q };
    }
    extractBuffer(q) {
        let { dirLocation: Q, logLocation: U } = this.generatePaths(q);
        if (!R.existsSync(Q)) R.mkdirSync(Q, { recursive: !0 });
        let X = "",
            Z = "",
            $ = this.logBuffer.length;
        for (let G = 0; G < $; G++) {
            let B = this.logBuffer.shift();
            if (B == null) this.error("Log buffer item is empty whilst trying to read from it");
            else (X += B.logTXT + "\n"), (Z += B.logJSONString + "\n");
        }
        if (this.storageSettings.txt) {
            const G = R.createWriteStream(U + "txt.log", { flags: "a" });
            G.write(X), G.end();
        }
        if (this.storageSettings.json) {
            const G = R.createWriteStream(U + "json.log", { flags: "a" });
            G.write(Z), G.end();
        }
    }
    handleLogDatatype(q) {
        if (q == null) return "";
        const Q = typeof q;
        if (Q == "string") return q;
        if (["bigint", "boolean", "number", "symbol", "function"].includes(Q)) return q.toString();
        if (Q == "object")
            try {
                return JSON.stringify(q, null, 4);
            } catch (U) {
                return this.error("Datatype of object is not json", { dataType: Q, data: q }), "";
            }
        return this.error("Datatype Error", { dataType: Q, data: q }), "Datatype error";
    }
    fatal(q, Q) {
        this.sendLog("FATAL", q, Q);
    }
    error(q, Q) {
        this.sendLog("ERROR", q, Q);
    }
    err = this.error;
    warn(q, Q) {
        this.sendLog("WARN", q, Q);
    }
    success(q, Q) {
        this.sendLog("SUCCESS", q, Q);
    }
    info(q, Q) {
        this.sendLog("INFO", q, Q);
    }
    log = this.info;
    debug(q, Q) {
        this.sendLog("DEBUG", q, Q);
    }
    exit() {
        if (this.storageSettings.stratagy == "batch")
            try {
                const q = new Date();
                this.extractBuffer(q), console.log("ready to shutdown");
            } catch (q) {
                console.error("There was an issue clearing the buffer", q);
            }
    }
}
export { Y1 as Logger };
