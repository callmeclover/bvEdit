import { EditorView, keymap, lineNumbers, gutter, showPanel, Panel } from "@codemirror/view";
import { javascript, esLint, autoCloseTags } from "@codemirror/lang-javascript";
import { search } from "@codemirror/search";
import {
  autocompletion,
  snippetKeymap,
  completionKeymap,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { foldKeymap } from "@codemirror/language";
import { lintGutter, lintKeymap, linter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark"
import { Text } from "@codemirror/state"

import * as eslint from "eslint-linter-browserify";

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const config = {
  // eslint configuration
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    semi: ["error", "never"],
  },
};

let editor = new EditorView({
  extensions: [
    oneDark,
    javascript(),
    lintGutter(),
    linter(esLint(new eslint.Linter(), config)),
    autocompletion(),
    lineNumbers(),
    gutter(),
    search(),
    autoCloseTags,
    keymap.of(foldKeymap),
    keymap.of(lintKeymap),
    keymap.of(snippetKeymap),
    keymap.of(completionKeymap),
    keymap.of(closeBracketsKeymap),
    EditorView.theme({
        "&": {height: "100vh"},
        ".cm-scroller": {overflow: "auto"},
      }),

    keymap.of([{
    key: "Ctrl-D",
    run() { download("file.js", editor.mirror.getText()); return true }
  }])
  ],
  parent: document.body,
  lint: true,
});
