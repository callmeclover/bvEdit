import { EditorView, keymap, lineNumbers, gutter, drawSelection } from "@codemirror/view";
import { javascript, esLint, autoCloseTags } from "@codemirror/lang-javascript";
import { search, searchKeymap } from "@codemirror/search";
import {
  autocompletion,
  snippetKeymap,
  completionKeymap,
  closeBracketsKeymap,
  closeBrackets,
} from "@codemirror/autocomplete";
import { foldKeymap } from "@codemirror/language";
import { lintGutter, lintKeymap, linter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark"
import { history, historyKeymap, defaultKeymap } from "@codemirror/commands"

import * as eslint from "eslint-linter-browserify";

window.onerror = (err)=>{
  window.alert(err)
}

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
    history(),
    drawSelection(),
    keymap.of(searchKeymap),
    keymap.of(historyKeymap),
    keymap.of(defaultKeymap),
    linter(esLint(new eslint.Linter(), config)),
    autocompletion(),
    lineNumbers(),
    gutter(),
    search(),
    closeBrackets(),
    keymap.of(foldKeymap),
    keymap.of(lintKeymap),
    keymap.of(snippetKeymap),
    keymap.of(completionKeymap),
    keymap.of(closeBracketsKeymap),
    EditorView.theme({
        "&": {height: "100vh"},
        ".cm-scroller": {overflow: "auto"},
      }),
  ],
  parent: document.body,
  lint: true,
});

document.onkeydown = (e)=>{
  if (e.key == "s" && e.ctrlKey) {
    e.preventDefault();
    download("file.js", editor.state.doc.toString());
  }
}