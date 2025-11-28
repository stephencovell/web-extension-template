#!/usr/bin/env node

/**
 * Build script for Chrome/Firefox extensions
 * 
 * Usage: 
 *   node build-extension.js [platform] [options]
 * 
 * platform: 'chrome' | 'firefox' | 'all' (default: 'chrome')
 * 
 * Options:
 *   --dev     Build to dist/ for local testing (no zip)
 *   --watch   Watch mode - rebuild on file changes (implies --dev)
 */

import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

// Parse arguments
const args = process.argv.slice(2)
const isWatch = args.includes('--watch')
const isDev = args.includes('--dev') || isWatch
const platform = args.find(arg => !arg.startsWith('--')) || 'chrome'

// Validate platform argument
const validPlatforms = ['chrome', 'firefox', 'all']
if (!validPlatforms.includes(platform)) {
  console.error(`Error: Invalid platform: ${platform}`)
  console.error(`  Valid options: ${validPlatforms.join(', ')}`)
  process.exit(1)
}

if ((isDev || isWatch) && platform === 'all') {
  console.error('Error: dev/watch mode only supports single platform (chrome or firefox)')
  process.exit(1)
}

// Read config files
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'))
const projectJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'project.json'), 'utf8'))

const version = packageJson.version
const projectName = projectJson.name
const ext = projectJson.extension

// Directory paths
const distDir = path.join(rootDir, 'dist')
const tmpDir = path.join(rootDir, '.tmp')
const artifactDir = path.join(rootDir, 'artifact')
const publicDir = path.join(rootDir, 'public')

/**
 * Run a shell command
 */
function run(cmd, options = {}) {
  try {
    execSync(cmd, { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
      ...options 
    })
  } catch (error) {
    console.error(`Error: Command failed: ${cmd}`)
    process.exit(1)
  }
}

/**
 * Remove directory recursively
 */
function rmdir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

/**
 * Copy directory recursively, excluding .DS_Store
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue
    
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Generate manifest for a specific platform
 */
function generateManifest(targetPlatform, outputDir) {
  const isChrome = targetPlatform === 'chrome'
  
  const baseManifest = {
    "manifest_version": 3,
    "name": ext.name,
    "version": version,
    "description": ext.description,
    "permissions": ext.permissions,
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline';"
    },
    "action": {
      "default_popup": "popup.html",
      "default_title": ext.name,
      "default_icon": {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png", 
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    },
    "icons": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png", 
      "128": "icons/icon128.png"
    }
  }

  let manifest
  if (isChrome) {
    manifest = {
      ...baseManifest,
      "background": {
        "service_worker": "background.js"
      }
    }
  } else {
    manifest = {
      ...baseManifest,
      "browser_specific_settings": {
        "gecko": {
          "id": ext.firefox.id
        }
      },
      "background": {
        "scripts": ["background.js"]
      }
    }
  }

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
}

/**
 * Post-process build output (cleanup)
 */
function postProcess(buildDir) {
  // Remove vite.svg if present
  const viteSvg = path.join(buildDir, 'vite.svg')
  if (fs.existsSync(viteSvg)) {
    fs.unlinkSync(viteSvg)
  }
}

/**
 * Build extension for a specific platform
 */
function buildExtension(targetPlatform) {
  const buildDir = isDev ? distDir : path.join(tmpDir, targetPlatform)
  const zipName = `${projectName}-${targetPlatform}-v${version}.zip`
  
  console.log(`\nBuilding ${targetPlatform} extension${isDev ? ' (dev)' : ''}...`)
  
  // Clean build directory
  rmdir(buildDir)
  fs.mkdirSync(buildDir, { recursive: true })
  
  // Run Vite build
  console.log(`  Running Vite build...`)
  const outDir = isDev ? 'dist' : `.tmp/${targetPlatform}`
  run(`vite build --outDir ${outDir}`)
  
  // Generate manifest
  console.log(`  Generating manifest...`)
  generateManifest(targetPlatform, buildDir)
  
  // Copy icons
  console.log(`  Copying icons...`)
  copyDir(path.join(publicDir, 'icons'), path.join(buildDir, 'icons'))
  
  // Post-process
  postProcess(buildDir)
  
  if (isDev) {
    console.log(`  Done: ${targetPlatform}`)
    return
  }
  
  // Create zip (production only)
  fs.mkdirSync(artifactDir, { recursive: true })
  console.log(`  Creating ${zipName}...`)
  run(`zip -r -9 "${path.join(artifactDir, zipName)}" .`, { cwd: buildDir })
  
  console.log(`  Done: ${targetPlatform}`)
}

/**
 * Watch mode - rebuild on changes
 */
function watchMode(targetPlatform) {
  console.log(`\nWatch mode - ${projectName} v${version}`)
  console.log(`Platform: ${targetPlatform}`)
  
  // Initial setup: clean and create dist with manifest + icons
  rmdir(distDir)
  fs.mkdirSync(distDir, { recursive: true })
  
  console.log(`\nSetting up dist/...`)
  generateManifest(targetPlatform, distDir)
  copyDir(path.join(publicDir, 'icons'), path.join(distDir, 'icons'))
  
  console.log(`Starting Vite watch mode...`)
  console.log(`\nLoad extension from: dist/`)
  console.log(`Reload extension in browser after changes.\n`)
  
  // Start Vite in watch mode
  const vite = spawn('npx', ['vite', 'build', '--watch', '--outDir', 'dist'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  })
  
  vite.on('close', (code) => {
    process.exit(code)
  })
}

// Main execution
console.log(`\nExtension Build - ${projectName} v${version}`)

if (isWatch) {
  watchMode(platform)
} else if (isDev) {
  console.log(`Platform: ${platform} (dev mode)`)
  buildExtension(platform)
  console.log(`\nDev build complete!`)
  console.log(`Load unpacked extension from: dist/`)
  console.log('')
} else {
  console.log(`Platform: ${platform}`)
  rmdir(tmpDir)
  
  if (platform === 'all') {
    buildExtension('chrome')
    buildExtension('firefox')
  } else {
    buildExtension(platform)
  }
  
  console.log(`\nCleaning up...`)
  rmdir(tmpDir)
  
  console.log(`\nBuild complete!`)
  console.log(`Artifacts: artifact/`)
  if (platform === 'all' || platform === 'chrome') {
    console.log(`  ${projectName}-chrome-v${version}.zip`)
  }
  if (platform === 'all' || platform === 'firefox') {
    console.log(`  ${projectName}-firefox-v${version}.zip`)
  }
  console.log('')
}
