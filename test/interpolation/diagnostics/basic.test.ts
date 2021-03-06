import * as vscode from 'vscode';
import { activateLS, showFile, FILE_LOAD_SLEEP_TIME } from '../helper';
import { getDocUri, sleep, sameLineRange } from '../util';
import { testDiagnostics, testNoDiagnostics } from './helper';

describe('Should find template-diagnostics in <template> region', () => {
  before('activate', async () => {
    await activateLS();
  });

  const tests: TemplateDiagnosticTest[] = [
    {
      file: 'expression.vue',
      diagnostics: [
        {
          range: sameLineRange(1, 8, 16),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'messaage' does not exist on type"
        }
      ]
    },
    {
      file: 'filter.vue',
      diagnostics: [
        {
          range: sameLineRange(1, 42, 46),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'test' does not exist on type"
        },
        {
          range: sameLineRange(3, 10, 18),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'messaage' does not exist on type"
        },
        {
          range: sameLineRange(3, 41, 45),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'test' does not exist on type"
        }
      ]
    },
    {
      file: 'v-for.vue',
      diagnostics: [
        {
          range: sameLineRange(5, 15, 24),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'notExists' does not exist on type"
        }
      ]
    },
    {
      file: 'object-literal.vue',
      diagnostics: [
        {
          range: sameLineRange(4, 11, 14),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'bar' does not exist on type"
        },
        {
          range: sameLineRange(5, 6, 9),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'baz' does not exist on type"
        }
      ]
    },
    {
      file: 'v-on.vue',
      diagnostics: [
        {
          range: sameLineRange(10, 31, 34),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Argument of type '123' is not assignable to parameter of type 'string'"
        },
        {
          range: sameLineRange(11, 20, 24),
          severity: vscode.DiagnosticSeverity.Error,
          message: `Type '"test"' is not assignable to type 'number'`
        },
        {
          range: sameLineRange(12, 20, 28),
          severity: vscode.DiagnosticSeverity.Error,
          message: `Property 'notExist' does not exist on type`
        }
      ]
    },
    {
      file: 'directive.vue',
      diagnostics: [
        {
          range: sameLineRange(1, 22, 25),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'bar' does not exist on type"
        }
      ]
    },
    {
      file: 'directive-dynamic-argument.vue',
      diagnostics: [
        {
          range: sameLineRange(3, 6, 14),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'notExist' does not exist on type"
        },
        {
          range: sameLineRange(4, 6, 14),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'notExist' does not exist on type"
        },
        {
          range: sameLineRange(5, 12, 20),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'notExist' does not exist on type"
        }
      ]
    },
    {
      file: 'template-position.vue',
      diagnostics: [
        {
          range: sameLineRange(13, 18, 21),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'foo' does not exist on type"
        }
      ]
    },
    {
      file: 'jsdocs-type-check.vue',
      diagnostics: [
        {
          range: sameLineRange(2, 23, 26),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Argument of type 'string' is not assignable to parameter of type 'number'"
        }
      ]
    },
    {
      file: 'member-modifiers.vue',
      diagnostics: [
        {
          range: sameLineRange(9, 16, 17),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'b' is protected and only accessible within class 'Child' and its subclasses"
        },

        {
          range: sameLineRange(10, 16, 17),
          severity: vscode.DiagnosticSeverity.Error,
          message: "Property 'c' is private and only accessible within class 'Child'"
        }
      ]
    }
  ];

  tests.forEach(t => {
    it(`Shows template diagnostics for ${t.file}`, async () => {
      const docUri = getDocUri(`diagnostics/${t.file}`);
      await showFile(docUri);
      await sleep(FILE_LOAD_SLEEP_TIME);
      await testDiagnostics(docUri, t.diagnostics);
    });
  });

  const noErrorTests: string[] = ['class.vue', 'style.vue', 'hyphen-attrs.vue', 'template-literal.vue'];

  noErrorTests.forEach(t => {
    it(`Shows no template diagnostics error for ${t}`, async () => {
      const docUri = getDocUri(`diagnostics/${t}`);
      await showFile(docUri);
      await sleep(FILE_LOAD_SLEEP_TIME);
      await testNoDiagnostics(docUri);
    });
  });
});

interface TemplateDiagnosticTest {
  file: string;
  diagnostics: vscode.Diagnostic[];
}
