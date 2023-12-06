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

function countWords(doc) {
    let count = 0, iter = doc.iter()
    while (!iter.next().done) {
      let inWord = false
      for (let i = 0; i < iter.value.length; i++) {
        let word = /\w/.test(iter.value[i])
        if (word && !inWord) count++
        inWord = word
      }
    }
    return `Word count: ${count}`
  }

  function wordCountPanel(view) {
    let dom = document.createElement("div")
    dom.textContent = countWords(view.state.doc)
    return {
      dom,
      update(update) {
        if (update.docChanged) dom.textContent = countWords(update.state.doc)
      }
    }
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
  ],
  parent: document.body,
  lint: true,
});

showPanel.of(wordCountPanel)
