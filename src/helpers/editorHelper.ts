import * as vscode from 'vscode';
const dJSON = require('dirty-json');

export const getSelectedJSONFromEditor = (editor: vscode.TextEditor) => {
	const text = editor?.document.getText(editor.selection); 
	if(!text) {
		throw new Error('No text selected');
	}
	return dJSON.parse(text);
};

export const getFileName = (editor: vscode.TextEditor) => {
	const fileNameStart = editor.document.fileName.lastIndexOf(`\\`)+1;
	const fileNameEnd = editor.document.fileName.lastIndexOf(`.`);
	const fileName = editor.document.fileName.substring(fileNameStart, fileNameEnd);
	return fileName;
};

