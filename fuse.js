const {
  FuseBox,
  WebIndexPlugin,
  Sparky,
  QuantumPlugin,
  EnvPlugin
} = require("fuse-box");

const express = require("express");
const { join } = require("path");
const { spawn } = require("child_process");

let production = false;

Sparky.task("copy:renderer:assets", () => {
  return Sparky.src("./assets/*").dest("./dist/renderer/out/");
});

Sparky.task("build:renderer", () => {
  const fuseHtml = FuseBox.init({
    homeDir: "src/renderer",
    output: "dist/renderer/$name.js",
    hash: false,
    target: "browser",
    cache: !production,
    sourceMaps: !production,
    plugins: [
      WebIndexPlugin({
        title: "SpeedRunner",
        template: "static/index.html",
        path: production ? "." : "/renderer",
      })
    ]
  });

  const fuse = FuseBox.init({
    homeDir: "src/renderer",
    output: "dist/renderer/out/$name.js",
    hash: false,
    target: "browser",
    cache: !production,
    sourceMaps: !production,
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
    plugins: [
      EnvPlugin({ NODE_ENV: production ? "production" : "development" }),
      production && QuantumPlugin({
        bakeApiIntoBundle: "index",
        target: "browser",
        //treeshake: true,
        removeExportsInterop: false,
        uglify: true,
      }),
    ],
  });

  // Configure development server.
  if (!production) fuse.dev({ root: false }, server => {
    const dist = join(__dirname, "dist");
    const app = server.httpServer.app;
    app.use("/out", express.static(join(dist, "renderer/out")));
    app.get("/*", (_req, res) => {
      res.sendFile(join(dist, "renderer/index.html"));
    });
  });

  const app = fuse.bundle("index")
    .instructions("> index.tsx");

  if (!production) app
    .watch()
    .hmr({ reload: true });

  return fuse.run().then(fuseHtml.run.bind(fuseHtml));
});

Sparky.task("build:main", () => {
  const fuse = FuseBox.init({
    homeDir: "src/main",
    output: "dist/main/$name.js",
    target: "server",
    cache: !production,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? "production" : "development" }),
      production && QuantumPlugin({
        bakeApiIntoBundle: "index",
        target: "server",
        treeshake: true,
        removeExportsInterop: false,
        uglify: true,
      }),
    ],
  });

  const app = fuse.bundle("index")
    .instructions("> [index.ts]");

  if (!production) app.watch();

  return fuse.run().then(() => {
    // launch the electron app if the platform is windows, fusebox behaviour is different on MacOS.
    if (process.platform === "win32" && !production) {
      const child = spawn("npm", ["run", "start:electron:watch"], { shell: true, stdio: "pipe" });
      child.stderr.on("data", data => console.error(data.toString()));
    }
  });
});


// Main task.
Sparky.task("default", ["clean:dist", "clean:cache", "build:renderer", "copy:renderer:assets", "build:main",], () => { });

// Wipe it all.
Sparky.task("clean:dist", () => Sparky.src("dist/*").clean("dist/"));

// Wipe it all from .fusebox - cache dir.
Sparky.task("clean:cache", () => Sparky.src(".fusebox/*").clean(".fusebox/"));

// Production build..
Sparky.task("set-production-env", () => production = true);
Sparky.task("dist", ["clean:dist", "clean:cache", "set-production-env", "build:renderer", "copy:renderer:assets", "build:main"], () => { })
