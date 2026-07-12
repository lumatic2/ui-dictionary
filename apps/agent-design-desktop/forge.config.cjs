const path = require('node:path')
const { flipFuses, FuseV1Options, FuseVersion } = require('@electron/fuses')

const hardenedFuseConfig = {
  version: FuseVersion.V1,
  strictlyRequireAllFuses: true,
  [FuseV1Options.RunAsNode]: false,
  [FuseV1Options.EnableCookieEncryption]: true,
  [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
  [FuseV1Options.EnableNodeCliInspectArguments]: false,
  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
  [FuseV1Options.OnlyLoadAppFromAsar]: true,
  [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,
  [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
  [FuseV1Options.WasmTrapHandlers]: true,
}

module.exports = {
  packagerConfig: {
    name: 'AskewlyDesign',
    executableName: 'AskewlyDesign',
    asar: true,
    icon: path.join(__dirname, 'staging', 'icons', 'agent-design'),
    extraResource: [
      path.join(__dirname, 'staging', 'renderer'),
      path.join(__dirname, 'staging', 'bridge'),
      path.join(__dirname, 'staging', 'mcp'),
      path.join(__dirname, 'staging', 'resource-manifest.json'),
    ],
    ignore: [
      /^\/(?:src|test|scripts|staging|results|out|node_modules)(?:\/|$)/,
      /^\/(?:forge\.config\.cjs|package-lock\.json|tsconfig\.json|\.gitignore)$/,
    ],
    win32metadata: {
      CompanyName: 'Askewly',
      FileDescription: 'AskewlyDesign code-native UI canvas',
      OriginalFilename: 'AskewlyDesign.exe',
      ProductName: 'AskewlyDesign',
      InternalName: 'AskewlyDesign',
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'askewly_design',
        authors: 'Askewly',
        description: 'Agent-native code canvas for Codex and Claude terminals',
        setupExe: 'AskewlyDesign-UnsignedDevelopment-Setup.exe',
        setupIcon: path.join(__dirname, 'staging', 'icons', 'agent-design.ico'),
        noMsi: true,
      },
    },
  ],
  hooks: {
    postPackage: async (_forgeConfig, packageResult) => {
      if (packageResult.platform !== 'win32') {
        throw new Error(`Refusing to package unsupported platform: ${packageResult.platform}`)
      }

      for (const outputPath of packageResult.outputPaths) {
        await flipFuses(path.join(outputPath, 'AskewlyDesign.exe'), hardenedFuseConfig)
      }
    },
  },
  plugins: [],
  publishers: [],
}
