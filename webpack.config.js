const webpack = require("webpack");
const path = require("path");
const obfuscator = require('webpack-obfuscator');
const altv = require('altv-webpack-plugin');
const WebpackMessages = require('webpack-messages');

module.exports = {
	mode: "production",
    entry: "./src/index.ts",
    performance: {
        hints: false,
    },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts"]
	},
	output: {
		filename: "index.js",
        path: path.resolve(__dirname, "../Server/resources/PARADOX_RP/client/")
	},
    plugins: [
        new WebpackMessages({
            name: 'Client',
            logger: str => console.log(`>> ${str}`),
            onComplete: () => setTimeout(() => console.log(">> Build complected."), 500)
        }),
        new altv(),
        new obfuscator({
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            log: false,
            numbersToExpressions: true,
            renameGlobals: false,
            rotateStringArray: true,
            selfDefending: true,
            shuffleStringArray: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        }),
        new webpack.BannerPlugin({
            raw: true,
            banner: `/**
 * @license

 * PARADOX ROLEPLAY
 * (C) 2021 Captcha, Zeroday and U1tim4te
 * By downloading you agree that you never will share, upload, copy or use this script/code/file.
 */`
        }),
    ]
};