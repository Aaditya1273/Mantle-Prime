const fs = require('fs')
const path = require('path')

console.log('🧹 Clearing all caches...')

// Clear Next.js cache
const nextCacheDir = path.join(__dirname, '.next')
if (fs.existsSync(nextCacheDir)) {
  fs.rmSync(nextCacheDir, { recursive: true, force: true })
  console.log('✅ Cleared .next cache')
}

// Clear node_modules/.cache if it exists
const nodeCacheDir = path.join(__dirname, 'node_modules', '.cache')
if (fs.existsSync(nodeCacheDir)) {
  fs.rmSync(nodeCacheDir, { recursive: true, force: true })
  console.log('✅ Cleared node_modules/.cache')
}

// Clear TypeScript build info
const tsBuildInfo = path.join(__dirname, 'tsconfig.tsbuildinfo')
if (fs.existsSync(tsBuildInfo)) {
  fs.unlinkSync(tsBuildInfo)
  console.log('✅ Cleared TypeScript build info')
}

// Clear any temp directories
const tempDirs = ['.turbo', '.swc']
tempDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir)
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true })
    console.log(`✅ Cleared ${dir}`)
  }
})

console.log('🚀 All caches cleared! Run npm run dev to restart with fresh build.')
console.log('💡 If you still have issues, try restarting your terminal/IDE.')