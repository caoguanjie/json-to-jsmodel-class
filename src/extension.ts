// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const Placeholder = {
	CLASS_PROPERTIES: `CLASS_PROPERTIES`,
	CONSTRUCTOR_PARAMS: `CONSTRUCTOR_PARAMS`,
	CONSTRUCTOR_PROPERTIES: `CONSTRUCTOR_PROPERTIES` 
};

const getTemplate = (className: string) => (
	[
		`export class ${className} {`,
		`\t/**`,
		`\t * @typedef ${className}Constructor`,
		`\t * @type {object}`,
		Placeholder.CLASS_PROPERTIES,
		`\t */`,
		`\t/**`,
		`\t * @param {${className}Constructor} ${className}Constructor - ${className}Constructor`,
		`\t */`,
		Placeholder.CONSTRUCTOR_PARAMS,
		Placeholder.CONSTRUCTOR_PROPERTIES,
		`\t}`,
		`}`

	]
);

const getClassPropertiesTemplate = (property: string, type: string) => `\t * @property {${type}} ${property}`;
const getConstructorParamsTemplate = (properties: string[]) => `\tconstructor({ ${properties.join(`, `)} }={}) {`;
const getConstructorPropertiesTemplate = (property: string) => `\t\tthis.${property} = ${property};`;

const getSelectedJSONFromEditor = (editor: vscode.TextEditor) => {
	const text = editor?.document.getText(editor.selection); 
	if(!text) {
		throw new Error('No text selected');
	}

	return JSON.parse(text);
};

const convertToJSModel = async() => {
	const editor = vscode.window.activeTextEditor;
	if(!editor) {
		throw new Error('No active editor');
	}

	const json = getSelectedJSONFromEditor(editor);
	if(!json) {
		throw new Error('Malformed json');
	}

	const className = await vscode.window.showInputBox({ placeHolder: "Enter class name (MyClass)"});
	let insertPos = editor?.selection.end;

	const template = getTemplate(className || `ClassName`);

	editor?.edit((editBuilder)=>{
		editBuilder.insert(insertPos, `\n\n`);
		template.forEach(line => {
			switch (line) {
				case Placeholder.CLASS_PROPERTIES:
					Object.entries(json).forEach(([property, type]) => {
						editBuilder.insert(insertPos, getClassPropertiesTemplate(property, type as string)+`\n`);
						insertPos = new vscode.Position(insertPos.line+1, 0);
					});
					break;
				case Placeholder.CONSTRUCTOR_PARAMS:
					const properties = Object.keys(json);
					editBuilder.insert(insertPos, getConstructorParamsTemplate(properties)+`\n`);
					insertPos = new vscode.Position(insertPos.line+1, 0);
					break;
				case Placeholder.CONSTRUCTOR_PROPERTIES:
					Object.keys(json).forEach(property => {
						editBuilder.insert(insertPos, getConstructorPropertiesTemplate(property)+`\n`);
						insertPos = new vscode.Position(insertPos.line+1, 0);
					});
					break;
				default:
					editBuilder.insert(insertPos, line+`\n`);
					insertPos = new vscode.Position(insertPos.line+1, 0);
					break;
			}
		});
	});

	vscode.window.showInformationMessage('Conversion complete!');
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"json-to-jsmodel" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('json-to-jsmodel.convertToJsModel', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Conversion started!');
		convertToJSModel();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
