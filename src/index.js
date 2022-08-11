"use strict";

const fs = require('fs').promises;
const { formatWithOptions } = require('util');
const {
    bold,
    italic,
    underline,
    unstyled,
    tokenColors
} = require('./dsl.js');

// Palette
const black = '#333';
const blue = '#258';
const green = '#575';
const cyan = '#39a';
const red = '#733';
const purple = '#958';
const amber = '#b73';
const grey = '#aaa';
const darkGrey = '#444'
const lightGrey = '#ddd';
const white = '#eee';
const offWhite = '#e8e8e0';
const colourArray = [
    blue,
    green,
    cyan,
    red,
    purple,
    amber,
];

const generate = ({
    name,
    light = true,
    dust = false,
    coloredVars = false,
    italicParams = true
}) => {
    const bg = dust ? offWhite : light ? white : black;
    const fg = light ? black : grey;
    const faint = light ? lightGrey : darkGrey;

    const bracketColours = colourArray.reduce((p, v, i) => ({
        ...p,
        ['editorBracketHighlight.foreground' + (i + 1)]: v
    }), {});

    return {
        name: `Jerry ${name}`,
        colors: {
            'editor.background': bg,
            'editor.foreground': fg,
            'editorLineNumber.foreground': fg,
            'editor.lineHighlightBackground': faint,
            'editorCursor.foreground': purple,
            'terminalCursor.foreground': red,
            'terminal.background': bg,
            'terminal.foreground': fg,
            'terminal.ansiBlack': black,
            'terminal.ansiBlue': blue,
            'terminal.ansiGreen': green,
            'terminal.ansiCyan': cyan,
            'terminal.ansiRed': red,
            'terminal.ansiMagenta': purple,
            'terminal.ansiYellow': amber,
            'terminal.ansiWhite': grey,
            'terminal.ansiBrightBlack': black,
            'terminal.ansiBrightBlue': blue,
            'terminal.ansiBrightGreen': green,
            'terminal.ansiBrightCyan': cyan,
            'terminal.ansiBrightRed': red,
            'terminal.ansiBrightMagenta': purple,
            'terminal.ansiBrightYellow': amber,
            'terminal.ansiBrightWhite': white,
            'editorIndentGuide.background': grey,
            'widget.shadow': red,
            'editorGroupHeader.tabsBorder': fg,
            'tab.activeBackground': grey,
            'tab.border': fg,
            ...bracketColours,
        },
        tokenColors: tokenColors(
            // Standard
            ['punctuation', fg],
            ['comment',
                'punctuation.definition.comment',
                grey],
            ['entity.name',
                'support.module',
                'support.class',
                bold],
            ['storage.type',
                'storage.modifier',
                'support.type',
                'entity.name.type',
                'support.module.type',
                blue,
                unstyled],
            ['keyword',
                'punctuation.definition.keyword',
                blue],
            ['keyword.operator', fg],

            ['variable', fg, unstyled], // Reset scopes that are also entities
            coloredVars && [
                'variable',
                'punctuation.definition.variable',
                'punctuation.definition.annotation',
                purple],
            italicParams &&
            ['variable.parameter', italic],

            ['constant',
                'variable.language',
                'string',
                'punctuation.definition.string.begin',
                'punctuation.definition.string.end',
                'support.constant',
                amber,
                bold],
            ['punctuation.section.interpolation.begin',
                'punctuation.section.interpolation.end',
                fg,
                bold],
            ['string.regexp', red, bold],
            ['constant.character.escape', red, bold],
            ['entity.name.function',
                'support.function',
                bold],
            ['invalid', red],

            // HTML
            ['entity.name.tag', blue],
            ['entity.other.attribute-name', blue],
            ['text.html', 'text.xml', purple],

            // Markup
            ['markup.heading', blue, bold, underline],
            ['markup.list', italic],
            ['markup.bold', bold],
            ['markup.italic', italic],
            ['markup.underline', underline],
            ['markup.underline.link', blue, underline],
            ['markup.quote', blue],
            ['markup.raw.inline', purple],
            ['markup.raw.block', blue],
        ),
    };
};



const themes = [
    { name: "Light" },
    { name: "Dust", dust: true },
    { name: "Dark", light: false },
    { name: "Light (Colored Vars)", coloredVars: true },
    { name: "Dust (Colored Vars)", dust: true, coloredVars: true },
    { name: "Dark (Colored Vars)", light: false, coloredVars: true },
];

// Generate all files.
fs.mkdir('themes', { recursive: true })
    .then(() => {

        const toFilename = (name) => {
            const clean = name.replace(/ /g, '-').replace(/[()]/g, '').toLowerCase();
            return `themes/jlw-${clean}-color-theme.json`;
        }

        const files = themes.map(settings => {
            const json = JSON.stringify(generate(settings), null, 4);
            return fs.writeFile(toFilename(settings.name), json);
        });

        Promise.all(files);
    })
