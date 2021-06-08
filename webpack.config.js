const webpack = require("webpack");
const path = require("path");
const altv = require('altv-webpack-plugin');
const javascriptObfuscator = require("javascript-obfuscator");
const obfuscator = require('webpack-obfuscator');
const WebpackMessages = require('webpack-messages');
const glob = require('glob-promise');
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

const noticeInEveryFile = `/*                                              
 * ,ooooooooooooooooolc;.                
 * .:OWMMMMMMMMMMMMMMMMWXk:.             
 *   .,;;;;;;;;;;;;;;:lkNMWO'            
 *     ...............  ;0MMO.           
 *    ;0XXXXXXXXXXXXXO'  cWMN:           
 *   .kMMNOOOOOOOOOOOo.  lWMX;           
 *   cNMWl             .lXMWd.           
 *  .OMMX; .;lllllllloxKWMXo.            
 *  .cKWWKolXMMMMMMMMMWXOl'              
 *    .l0WWWMMXd:::::;,.                 
 *      .c0WMWd.                         
 *        .l0k'                          
 *          ..                           
 *                                       
 * PARADOX TO THE MOON => STUPID SKID
 */`;

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
                compiler.hooks.afterEmit.tap("FakeFiles_AfterEmit", async () => {
                    const clientFilesPath = path.resolve(__dirname, `../Server/resources/PARADOX_RP/client/`);
                    const indexFilePath = path.resolve(__dirname, "../Server/resources/PARADOX_RP/client/index.js");

                    glob(`${clientFilesPath}/*.js`).then(files => {
                        for(const file of files) if(!file.includes("index.js")) fs.unlinkSync(file);
                    }).finally(() => {
                        for(let i=0;i<55;i++) {
                            const fileName = randomString(35);
                            const fileData = javascriptObfuscator.obfuscate(`import alt from 'alt-client'; alt.log("[PARADOX ENCRYPTION] Loaded ${fileName}.js with AES-128");`, obfuscatorSettings);
    
                            fs.appendFileSync(indexFilePath, `\nimport './${fileName}.js';`);
                            fs.writeFileSync(`${clientFilesPath}/${fileName}.js`, `/**
 * @license
    
 * PARADOX ROLEPLAY
 * (C) 2021 Captcha, zeroday, Nova and Brace
 * By downloading you agree that you never will share, upload, copy or use this script/code/file.
 */
${fileData.getObfuscatedCode()}
${noticeInEveryFile}`);
                        }
                        
                        fs.appendFileSync(indexFilePath, `\n${noticeInEveryFile}`);
                    });
                });
            },
        },
        new WebpackMessages({
            name: 'Client',
            logger: str => console.log(`>> ${str}`),
            
            onComplete: () => setTimeout(() => console.log(">> Build complected."), 500)
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