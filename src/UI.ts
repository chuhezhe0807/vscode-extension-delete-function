import * as vscode from "vscode";
import { getFunctionNode } from "./Logic";

// TODO 写一个vscode插件，实现功能：单引号改双引号的时候，自动修正另一个单引号，类似于idea

// 当 package.json 中配置的命令触发时才会被调用
// 只会调用一次，
export function activate(context: vscode.ExtensionContext) {
	// 后续就只会调用这个函数了
	vscode.commands.registerCommand('vscode-extension-delete-function.helloWorld', () => {
		vscode.window.showInformationMessage('hello delete.');

		// vscode中删除字符
		const editor = vscode.window.activeTextEditor;

		if(!editor) {
			return;
		}

		const code = editor.document.getText();
		const index = editor.document.offsetAt(editor.selection.active);
		const functionNode = getFunctionNode(code, index);

		if(functionNode) {
			editor.edit((editorBuilder) => {
				editorBuilder.delete(
					new vscode.Range(
						new vscode.Position(functionNode.start.line - 1, functionNode.start.column), 
						new vscode.Position(functionNode.end.line - 1, functionNode.end.column), 
					)
				)
			});
		}
	});
}