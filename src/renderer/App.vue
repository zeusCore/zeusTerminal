<template>
  <div ref="xterm"></div>
</template>

<script>
import { Terminal } from "xterm";
import os from "os";
import "xterm/css/xterm.css";
import Fix from "xterm-addon-fit";
import { FitAddon } from "xterm-addon-fit";

const fitAddon = new FitAddon();

const pty = require("node-pty");

export default {
  name: "mainPage",
  methods: {
    init() {
      const shell =
        process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
      let env = process.env;
      env["LC_ALL"] = "zh_CN.UTF-8";
      env["LANG"] = "zh_CN.UTF-8";
      env["LC_CTYPE"] = "zh_CN.UTF-8";
      const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.cwd(),
        env: env,
        encoding: null
      });
      const xterm = new Terminal({
        cols: 80,
        rows: 30,
        fontSize: 12,
        lineHeight: 1.2,
        fontFamily: `Menlo, Monaco, 'Courier New', monospace`,
        rendererType: "dom",
        theme: {
          foreground: "#ccc",
          background: "#222",
          cursor: "rgb(254,239,143)"
        }
      });

      xterm.loadAddon(fitAddon);

      xterm.open(this.$refs.xterm);

      fitAddon.fit();

      xterm.onData((data, arg2) => {
        console.log(data);
        ptyProcess.write(data);
      });

      ptyProcess.on("data", function(data) {
        console.log("ptyProcess data", data.toString());
        xterm.write(data.toString());
      });
      // ptyProcess.write('export LANG=zh_CN.UTF-8\n')
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
body {
  font-size: 12px;
  background-color: #222;
}
</style>
