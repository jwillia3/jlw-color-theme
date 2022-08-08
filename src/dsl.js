const bold = 'bold';
const italic = 'italic';
const underline = 'underline';
const unstyled = 'unstyled';

/**
 * Generate clauses for <tt>tokenColors</tt>.
 * @param {(string[]|false)[]} defs The input definitions as a series of token
 * @returns {({ scope: string[], fontStyle: string })[]} The content of <tt>tokenColors</tt>
 * @example
 *  tokenColors(
 *      ['scope', 'another-scope', bold, red],
 *      [], // ignored because it's empty
 *      [bold, red], // ignored because there is no scope
 *      flag && [...possibleOptions], // ignored because it's falsey
 * )
 */
const tokenColors = (...defs) => {

    const matchers = [
        feat => feat.startsWith('#') && ['foreground', feat],
        feat => feat === 'bold' && ['fontStyle', 'bold'],
        feat => feat === 'italic' && ['fontStyle', 'italic'],
        feat => feat === 'underline' && ['fontStyle', 'underline'],
        feat => feat === 'unstyled' && ['fontStyle', ''],
        () => [undefined, undefined],
    ];

    const build = (tokens) => {
        const scope = [];
        const settings = {};
        for (const token of tokens || []) {
            const [key, value] = matchers.find(m => m(token))?.(token);
            if (key === undefined)
                scope.push(token);
            else
                settings[key] = key in settings && value
                    ? `${settings[key]} ${value}`
                    : value;
        }
        return Object.keys(scope).length === 0
            ? null
            : { scope, settings };
    }

    // @ts-ignore
    return defs.map(build).filter(Boolean);
}

exports.bold = bold;
exports.italic = italic;
exports.underline = underline;
exports.unstyled = unstyled;
exports.tokenColors = tokenColors;
