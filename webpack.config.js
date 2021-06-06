const webpack = require("webpack");
const path = require("path");
const altv = require('altv-webpack-plugin');
const javascriptObfuscator = require("javascript-obfuscator");
const obfuscator = require('webpack-obfuscator');
const WebpackMessages = require('webpack-messages');
const glob = require('glob');
const fs = require("fs");
const { ConcatSource } = require('webpack-sources');

const obfuscatorSettings = {
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
};

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
        {
            /**
             * 
             * @param { webpack.Compiler } compiler 
             */
            apply: (compiler) => {
                const fileNames = [];
                const fileNames2 = [];
                let importedFakeFiles = 0;

                /**
                 * 
                 * @param { webpack.Chunk } chunk 
                 * @param { string } moduleName 
                 * @returns 
                 */
                function doesChunkImport(chunk, moduleName) {
                    for (const module of chunk._modules) {
                        if(typeof module.userRequest == "string" && module.userRequest.includes(moduleName)) return true;
                        else if (module.userRequest === moduleName) return true;
                    }
                
                    return false;
                }

                let externals = [];
                compiler.options.externals = externals;

                compiler.hooks.afterEmit.tap("FakeFiles_AfterEmit", () => {
                    for(const file of fileNames) fs.appendFileSync(path.resolve(__dirname, "../Server/resources/PARADOX_RP/client/index.js"), `import './${file}';`);
                });

                compiler.hooks.compilation.tap('FakeFiles_replace', compilation => {
                    compilation.hooks.optimizeChunkAssets.tap('FakeFiles', chunks => {
                        for (const chunk of chunks) {
                            for(const external of externals) {
                                if(doesChunkImport(chunk, external)) {
                                    for(const fileName of chunk.files) {
                                        const currentSource = compilation.assets[fileName];
    
                                        compilation.assets[fileName] = new ConcatSource(`import './${fileNames[importedFakeFiles]}';\n`, currentSource);
                                    }
    
                                    importedFakeFiles++;
                                }
                            }
                        }
                    });
                });

                compiler.hooks.compile.tap("FakeFiles_compile", () => {
                    function randomString(length) {
                        var result           = [];
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;

                        for ( var i = 0; i < length; i++ ) {
                            result.push(characters.charAt(Math.floor(Math.random() * 
                            charactersLength)));
                        }

                        return result.join('');
                    }

                    const filepath = path.resolve(__dirname, "../Server/resources/PARADOX_RP/client/");
                    glob(`${filepath}/*.js`, (err, files) => {
                        if(err) return console.error(err);
                        for(const file of files) if(!file.includes("index.js")) fs.unlinkSync(file);
                    });

                    for(let i=0;i<25;i++) {
                        externals.push(`fake_file${i}`);

                        const fileName = randomString(25);
                        const fileData = javascriptObfuscator.obfuscate(`import alt from 'alt-client'; alt.log("[PARADOX ENCRYPTION] Loaded ${fileName}.js");`, obfuscatorSettings);

                        fs.writeFileSync(`${filepath}/${fileName}.js`, `${fileData.getObfuscatedCode()}
// Imagine man probiert PARADOX RP zu dumpen. Gz. Nova ;)`);

                        fileNames.push(`${fileName}.js`);
                        fileNames2.push(fileName);
                    }
                });
            },
        },
        new WebpackMessages({
            name: 'Client',
            logger: str => console.log(`>> ${str}`),
            
            onComplete: () => {
                setTimeout(() => console.log(">> Build complected."), 500);
            }
        }),
        new altv(),
        new obfuscator(obfuscatorSettings),
        new webpack.BannerPlugin({
            raw: true,
            banner: `/**
 * @license

 * PARADOX ROLEPLAY
 * (C) 2021 Captcha, zeroday, Nova and Brace
 * By downloading you agree that you never will share, upload, copy or use this script/code/file.
 */`
        })
    ]
};