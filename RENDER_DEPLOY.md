# Render.com Build and Deploy Settings

## Build Command
```
npm install && npm run build
```

## Publish Directory
```
dist
```

## Environment Variables (if needed)
```
NODE_ENV=production
```

## Node.js Version
The `.nvmrc` file specifies Node.js 20.19.0

## Build Process
1. Install dependencies with `npm install`
2. Build with Vite using `npx vite build`
3. Output goes to `dist/` directory

## Troubleshooting
- Vite is included in both dependencies and devDependencies for maximum compatibility
- Using `npx` ensures proper package resolution
- Node.js 20.19.0 is compatible with Vite 5.4+