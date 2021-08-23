import * as vscode from 'vscode';

export const getSelectedJSONFromEditor = (editor: vscode.TextEditor) => {
	const text = editor?.document.getText(editor.selection); 
	if(!text) {
		throw new Error('No text selected');
	}

	return JSON.parse(text);
};

export const getFileName = (editor: vscode.TextEditor) => {
	const fileNameStart = editor.document.fileName.lastIndexOf(`\\`)+1;
	const fileNameEnd = editor.document.fileName.lastIndexOf(`.`);
	const fileName = editor.document.fileName.substring(fileNameStart, fileNameEnd);
	return fileName;
};

