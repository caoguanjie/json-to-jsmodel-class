import * as vscode from 'vscode';
import { getFileName, getSelectedJSONFromEditor } from './helpers/editorHelper';
import { Placeholder, getConstructorPropertiesTemplate, getConstructorParamsTemplate, getClassPropertiesTemplate, getTemplate, getModelsFromJson, getClassPropertiesStateTemplate } from './helpers/templateHelper';
// https://marketplace.visualstudio.com/manage/publishers/caoguanjie?auth_redirect=True
const convertToJSModel = async () => {
	try {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			throw new Error('No active editor');
		}

		const json = getSelectedJSONFromEditor(editor);
		if (!json) {
			throw new Error('Malformed json');
		}

		const fileName = getFileName(editor);

		vscode.window.showInformationMessage('Enter a class name at the top');
		const _className = await vscode.window.showInputBox({ placeHolder: `Enter class name or press Enter for default (${fileName || `MyClass`})` });
		let insertPos = editor?.selection.end;
		const className = _className || fileName || `MyClass`;

		const jsClasses = getModelsFromJson(json, className);

		editor?.edit((editBuilder) => {
			jsClasses.forEach(jsClass => {
				const template = getTemplate(jsClass.className);

				editBuilder.insert(insertPos, `\n`);
				template.forEach(line => {
					switch (line) {
						// 创建类声明
						case Placeholder.CLASS_PROPERTIES_STATE:
							Object.entries(jsClass.model).forEach(([property, type]) => {
								editBuilder.insert(insertPos, getClassPropertiesStateTemplate(property, type as String) + `\n`);
								insertPos = new vscode.Position(insertPos.line + 1, 0);
							});
							break;
						case Placeholder.CLASS_PROPERTIES:
							Object.entries(jsClass.model).forEach(([property, type]) => {
								editBuilder.insert(insertPos, getClassPropertiesTemplate(property, type as String) + `\n`);
								insertPos = new vscode.Position(insertPos.line + 1, 0);
							});
							break;
						case Placeholder.CONSTRUCTOR_PARAMS:
							const properties = Object.keys(jsClass.model);
							editBuilder.insert(insertPos, getConstructorParamsTemplate(properties) + `\n`);
							insertPos = new vscode.Position(insertPos.line + 1, 0);
							break;
						case Placeholder.CONSTRUCTOR_PROPERTIES:
							Object.keys(jsClass.model).forEach(property => {
								editBuilder.insert(insertPos, getConstructorPropertiesTemplate(property) + `\n`);
								insertPos = new vscode.Position(insertPos.line + 1, 0);
							});
							break;
						default:
							editBuilder.insert(insertPos, line + `\n`);
							insertPos = new vscode.Position(insertPos.line + 1, 0);
							break;
					}
				});
			});
		});

		vscode.window.showInformationMessage('JSON 转换 Class 已完成!');
	} catch (error) {
		vscode.window.showInformationMessage('JSON 转换 Class 失败!');
	}
};

export function activate(context: vscode.ExtensionContext) {
	console.log('"json-to-jsmodel" is now active!');

	let disposable = vscode.commands.registerCommand('json-to-jsmodel.convertToJsModel', () => {
		vscode.window.showInformationMessage('已启动转换!');
		convertToJSModel();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
