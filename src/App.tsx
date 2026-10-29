import React, { useState } from 'react';
import { 
  GitBranch, 
  Copy, 
  Check, 
  Terminal, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  FileCode, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'deploy' | 'apk'>('deploy');
  const [copied, setCopied] = useState(false);

  const deployYaml = `name: Release & Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    name: Build & Release Web
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    name: Deploy to GitHub Pages
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  const apkYaml = `name: Android APK Build & Release

on:
  push:
    branches:
      - main
    tags:
      - 'v*'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-apk:
    name: Build Mobile & TV APKs
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Locate Gradle project & Grant permissions
        run: |
          if [ -f "./gradlew" ]; then
            GRADLE_DIR="."
          elif [ -f "./anilili-main/gradlew" ]; then
            GRADLE_DIR="./anilili-main"
          else
            GRADLE_DIR=$(dirname $(find . -name "gradlew" -print -quit))
          fi
          echo "GRADLE_DIR=$GRADLE_DIR" >> $GITHUB_ENV
          chmod +x "$GRADLE_DIR/gradlew"

      - name: Build APKs (Mobile & TV)
        run: |
          cd "$GRADLE_DIR"
          ./gradlew assembleDebug --stacktrace --no-daemon

      - name: Prepare APKs for Release
        run: |
          mkdir -p release-apks
          find . -name "*.apk" -type f -exec cp {} release-apks/ \\;
          ls -la release-apks/

      - name: Upload APKs as Workflow Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: anilili-apks
          path: release-apks/*.apk

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/') || github.event_name == 'workflow_dispatch'
        with:
          tag_name: \${{ github.ref_name || 'v1.4.2' }}
          name: "Anilili / Rr anime Release \${{ github.ref_name || 'v1.4.2' }}"
          files: release-apks/*.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  const handleCopy = () => {
    const text = activeTab === 'deploy' ? deployYaml : apkYaml;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-600/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-white">
                Release & Deployment Files
              </h1>
              <p className="text-xs text-zinc-400">
                GitHub Actions Workflows for Automatic Deployment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/kompoti121/Anilili/releases/latest/download/Anilili.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Intro Banner */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Release Configuration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            GitHub Actions Automatic Deployment (.yml)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
            এই ফাইলটি আপনার প্রোজেক্টের <code className="text-purple-300 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-white/10">.github/workflows/deploy.yml</code> হিসেবে সংরক্ষণ করা রয়েছে। আপনার GitHub রিপোজিটরির <code className="text-zinc-200 font-mono">main</code> ব্রাঞ্চে পুশ করলে স্বয়ংক্রিয়ভাবে ওয়েবসাইটটি রিলিজ ও ডিপ্লয় হবে।
          </p>
        </div>

        {/* Tab Selector & Copy Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('deploy')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'deploy'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>.github/workflows/deploy.yml</span>
            </button>

            <button
              onClick={() => setActiveTab('apk')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'apk'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>.github/workflows/android-release.yml</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors border border-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy YAML File'}</span>
          </button>
        </div>

        {/* YAML Code Viewer */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl font-mono text-xs">
          <div className="px-4 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between text-zinc-400 text-[11px]">
            <span>
              {activeTab === 'deploy' ? '.github/workflows/deploy.yml' : '.github/workflows/android-release.yml'}
            </span>
            <span className="text-emerald-400">Ready to Push</span>
          </div>
          <pre className="p-5 text-zinc-300 overflow-x-auto leading-relaxed">
            {activeTab === 'deploy' ? deployYaml : apkYaml}
          </pre>
        </div>

        {/* Quick Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-1.5">
            <div className="font-bold text-white text-sm">1. Git Push</div>
            <p className="text-zinc-400">
              ফাইলগুলো আপনার GitHub রিপোজিটরির main ব্রাঞ্চে পুশ করুন।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-1.5">
            <div className="font-bold text-white text-sm">2. GitHub Pages On</div>
            <p className="text-zinc-400">
              Settings &gt; Pages-এ গিয়ে Source অপশনে "GitHub Actions" সিলেক্ট করুন।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 space-y-1.5">
            <div className="font-bold text-white text-sm">3. Automatic Release</div>
            <p className="text-zinc-400">
              GitHub Actions নিজে থেকেই সাইট বিল্ড করে লাইভ লিংক তৈরি করে দেবে।
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        Release files generated for GitHub Actions automatic deployment.
      </footer>

    </div>
  );
}
