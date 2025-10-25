//server/vite.server.config.js
import { defineConfig } from 'vite';
// Plugin to automatically mark node dependencies as external
import { nodeExternals } from 'rollup-plugin-node-externals'; 

export default defineConfig({
  // Use 'build' section to configure Rollup
  build: {
    // Enable Server-Side Rendering (SSR) mode for Node.js output
    ssr: true,
    
    // Configure as a library to specify entry, format, and filename
    lib: {
      entry: './server.js', // Your main application entry file
      formats: ['es'],      // Output as an ES Module
      fileName: 'index',
    },
    
    // Output the bundled code into a 'dist/server' directory
    outDir: 'dist/server',
    emptyOutDir: true,
    
    // Rollup specific configuration
    rollupOptions: {
      plugins: [
        // This plugin automatically adds ALL your 'dependencies'
        // from package.json to Rollup's 'external' list.
        // This is crucial for Express apps as you don't want to
        // bundle express, mongoose, etc., but rather rely on
        // them being in node_modules in the production environment.
        nodeExternals(),
      ],
      
      // Ensure the output target is correct for a Node.js server
      output: {
        entryFileNames: 'index.js',
      },
    },
    
    // Target a modern Node.js version
    target: 'node20', 
  },
});