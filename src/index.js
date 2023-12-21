"use strict";

const fs = require('fs').promises;
const {
    bold,
    italic,
    underline,
    unstyled,
    tokenColors
} = require('./dsl.js');

const defaultPalette = ['#333', '#25a', '#595', '#389', '#733', '#958', '#b73', '#aaa', '#eee']
const schemes = [
    {
        name: 'Default',
        palette: defaultPalette,
        bases: ['#eee', '#ccc', '#bbb', '#aaa', '#666', '#555', '#444', '#333']
    },
    {
        name: 'Contrast',
        palette: ['#333', '#25c', '#595', '#38a', '#a33', '#958', '#b63', '#aaa', '#fff'],
        bases: ['#fff', '#bbb', '#aaa', '#888', '#666', '#555', '#444', '#333']
    },
    {
        name: 'Dust',
        palette: defaultPalette,
        bases: ['#e8e8e0', '#c8c8c0', '#b8b8b0', '#a8a8a0', '#686860', '#585850', '#484840', '#383830']
    },
    {
        name: 'Monochrome',
        palette: ['#fff', '#333', '#333', '#333', '#333', '#333', '#333', '#333', '#fff'],
        bases: ['#fff', '#bbb', '#aaa', '#888', '#666', '#555', '#444', '#333']
    },
];

const generate = ({
    name,
    scheme: { palette, bases },
    dark,
}) => {
    const [black, blue, green, cyan, red, magenta, yellow, grey, white] = palette;
    const [base00, base01, base02, base03, base04, base05, base06, base07] =
        dark
            ? [...bases].reverse()
            : bases;
    const base08 = magenta;
    const base09 = yellow;
    const base0a = magenta;
    const base0b = red;
    const base0c = grey;
    const base0d = base05;
    const base0e = blue;
    const base0f = red;

    const bracketColours = new Array(6).fill(base07).reduce(
        (prev, color, i) => ({
            ...prev,
            ['editorBracketHighlight.foreground' + (i + 1)]: color
        }),
        {});

    return {
        name: `JLW ${name}`,
        colors: {
            'editor.background': base00,
            'editor.foreground': base05,
            'editorLineNumber.foreground': base01,
            'editor.lineHighlightBackground': base01,
            'editorCursor.foreground': red,
            'terminalCursor.foreground': red,
            'terminal.background': base00,
            'terminal.foreground': base05,
            'terminal.ansiBlack': black,
            'terminal.ansiBlue': blue,
            'terminal.ansiGreen': green,
            'terminal.ansiCyan': cyan,
            'terminal.ansiRed': red,
            'terminal.ansiMagenta': magenta,
            'terminal.ansiYellow': yellow,
            'terminal.ansiWhite': grey,
            'terminal.ansiBrightBlack': black,
            'terminal.ansiBrightBlue': blue,
            'terminal.ansiBrightGreen': green,
            'terminal.ansiBrightCyan': cyan,
            'terminal.ansiBrightRed': red,
            'terminal.ansiBrightMagenta': magenta,
            'terminal.ansiBrightYellow': yellow,
            'terminal.ansiBrightWhite': white,
            'editorIndentGuide.background': base01,
            'widget.shadow': red,
            'editorGroupHeader.tabsBorder': base05,
            'tab.activeBackground': base02,
            'tab.border': base05,
            ...bracketColours,
        },
        tokenColors: tokenColors(
            /*
                `entity.name` over-applies bold so make these exceptions.
             */
            ['variable', unstyled],
            ['entity.name.type', base0e, unstyled],

            ['variable.parameter', italic],

            ['markup.heading', bold, underline],
            ['markup.bold', bold],
            ['markup.italic', italic],
            ['markup.underline', underline],

            // Base16-Style Grouping
            [base00],
            [base01],
            [base02],
            [base03],
            [base04],
            [base05,
                'punctuation',
                'keyword.operator',
            ],
            [base06],
            [base07],
            [base08,
                'variable',
                'punctuation.definition.variable',
                'punctuation.definition.annotation',
                'entity.name.tag',
                'markup.underline.link',
                'markup.list',
            ],
            [base09,
                'constant',
                'variable.language',
                'string',
                'punctuation.definition.string.begin',
                'punctuation.definition.string.end',
                'support.constant',
                'entity.other.attribute-name',
                'markup.quote',
                'markup.inline.raw',
                'markup.block.raw',
                'markup.fenced_code.block',
            ],
            [base0a,
                bold,
                'entity.name',
                'support.module',
                'support.class',
            ],
            [base0b,
                'comment',
                'punctuation.definition.comment',
            ],
            [base0d,
                bold,
                'entity.name.function',
                'support.function',
                'entity.name.tag',
            ],
            [base0e,
                'keyword',
                'punctuation.definition.keyword',
                'storage.type',
                'storage.modifier',
                'support.type',
                'entity.name.type',
                'support.module.type',
            ],
            [base0f,
                'invalid',
                'string.regexp',
                'constant.character.escape',
            ],
        ),
    };
};

const generateSwatches = () => {
    const outputColors = color =>
        `    <div style='display:inline-block;width:48px;height:48px;background:${color}'>${color}</div>`;
    const outputScheme = scheme => {
        const style = `display: flex; padding: 16px 8px;background:${scheme.bases[0]}`;
        const name = `<h1 style='color:${scheme.bases[5]};width:128px'>${scheme.name}</h1>`;
        const body = [...scheme.bases, ...scheme.palette].map(outputColors).join('\n');
        const names = ['black', 'blue', 'green', 'cyan', 'red', 'magenta', 'yellow', 'grey', 'white'];
        const pal = scheme.palette;
        const texts =
            `
            <div style='display:flex;flex-direction:column;width:64px'>
                <code style=color:${scheme.bases[5]}>foreground</code>
                ${names.map((id, i) => `<code style=color:${pal[i]}>${id}</code>`).join('\n')}
            </div>
            `
        return `<div style='${style}'>${name}${texts}${body}</div>`;
    }
    const outputSchemes = () =>
        '<style>body {font-family:monospaced;font-size:6pt}</style>' +
        schemes.map(outputScheme).join('\n');

    fs.writeFile('colors.html', outputSchemes());
}

const generateFiles = () => {
    const toFilename = (name) => {
        const clean = name.replace(/ /g, '-').replace(/[()]/g, '').toLowerCase();
        return `themes/jlw-${clean}-color-theme.json`;
    }

    const execute = () => {
        for (const scheme of schemes) {
            const paramsList = [
                {
                    name: `${scheme.name} Light`,
                    scheme: scheme,
                    dark: false,
                },
                {
                    name: `${scheme.name} Dark`,
                    scheme: scheme,
                    dark: true,
                },
            ];

            for (const params of paramsList) {
                const filename = toFilename(params.name);
                const json = JSON.stringify(generate(params), null, 2);
                fs.writeFile(filename, json);
            }
        }
    };

    fs.mkdir('themes', { recursive: true }).then(execute);
}


generateFiles();
generateSwatches();
