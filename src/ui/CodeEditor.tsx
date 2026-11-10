import { useEffect, useRef } from 'react';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { basicSetup } from 'codemirror';
import { tags } from '@lezer/highlight';

interface Props {
  value: string;
  language: 'python' | 'sql';
  disabled: boolean;
  onChange: (value: string) => void;
}
export function CodeEditor({ value, language, disabled, onChange }: Props) {
  const editorHost = useRef<HTMLDivElement>(null);
  const editorView = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const editableCompartment = useRef(new Compartment());
  const isExternalUpdate = useRef(false);
  onChangeRef.current = onChange;
  // jsdom has no layout/selection API. The native editor keeps boundary tests meaningful.
  const isNativeEditor = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
  useEffect(() => {
    if (isNativeEditor || !editorHost.current) return;
    const view = new EditorView({
      parent: editorHost.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          language === 'sql' ? sql() : python(),
          syntaxHighlighting(
            HighlightStyle.define([
              {
                tag: [tags.keyword, tags.operator, tags.typeName],
                color: 'var(--code-keyword, var(--link))',
              },
              {
                tag: [tags.string, tags.number, tags.bool],
                color: 'var(--code-literal, var(--accent))',
              },
              {
                tag: tags.comment,
                color: 'var(--code-comment, var(--muted))',
                fontStyle: 'normal',
              },
            ]),
          ),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            'aria-label': language === 'sql' ? 'SQL-Code' : 'Python-Code',
            'aria-describedby': 'editor-keyboard',
          }),
          editableCompartment.current.of([
            EditorState.readOnly.of(disabled),
            EditorView.editable.of(!disabled),
          ]),
          EditorState.transactionFilter.of((transaction) =>
            transaction.newDoc.length > 100000 ? [] : transaction,
          ),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !isExternalUpdate.current)
              onChangeRef.current(update.state.doc.toString());
          }),
          EditorView.theme({
            '&': {
              backgroundColor: 'var(--editor-background, var(--canvas))',
              color: 'var(--text)',
            },
            '.cm-content': {
              fontFamily: 'var(--mono)',
              minHeight: '260px',
              padding: '16px 0',
            },
            '.cm-gutters': {
              backgroundColor: 'var(--panel)',
              color: 'var(--muted)',
              borderRight: '1px solid var(--border)',
            },
            '&.cm-focused': {
              outline: '2px solid var(--link)',
              outlineOffset: '-2px',
            },
            '.cm-cursor': { borderLeftColor: 'var(--text)' },
            '.cm-activeLine,.cm-activeLineGutter': {
              backgroundColor: 'var(--hover)',
            },
            '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
              backgroundColor: 'var(--selection)',
            },
            '.cm-selectionMatch': {
              backgroundColor: 'var(--selection)',
            },
            '.cm-matchingBracket': {
              backgroundColor: 'var(--hover)',
              color: 'var(--text)',
            },
            '.cm-scroller': { fontFamily: 'var(--mono)', lineHeight: '1.7' },
            '.cm-tooltip': {
              backgroundColor: 'var(--panel)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            },
          }),
        ],
      }),
    });
    editorView.current = view;
    return () => {
      editorView.current = null;
      view.destroy();
    };
    // A language change rebuilds the syntax extensions; edits and runs preserve history.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, isNativeEditor]);
  useEffect(() => {
    editorView.current?.dispatch({
      effects: editableCompartment.current.reconfigure([
        EditorState.readOnly.of(disabled),
        EditorView.editable.of(!disabled),
      ]),
    });
  }, [disabled]);
  useEffect(() => {
    const view = editorView.current;
    if (view && value !== view.state.doc.toString()) {
      isExternalUpdate.current = true;
      try {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: value },
        });
      } finally {
        isExternalUpdate.current = false;
      }
    }
  }, [value]);
  return isNativeEditor ? (
    <textarea
      aria-label={language === 'sql' ? 'SQL-Code' : 'Python-Code'}
      aria-describedby="editor-keyboard"
      className="code-editor"
      maxLength={100000}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    />
  ) : (
    <div className="code-mirror" ref={editorHost} />
  );
}
