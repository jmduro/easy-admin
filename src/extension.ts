import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "easy-admin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('easy-admin.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Easy Admin!');
	});

	//context.subscriptions.push(disposable);
	//Tareas
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.tareas', () => {
			// Create and show a new webview
			const panel = vscode.window.createWebviewPanel(
				'easy-admin', // Identifies the type of the webview. Used internally
				'Easy Admin', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{} // Webview options. More on these later.
			);

			// And set its HTML content
			panel.webview.html = getWebviewContentTareas();
		})
	);

	//Colaboradores
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.colaboradores', () => {
			// Create and show a new webview
			const panel = vscode.window.createWebviewPanel(
				'easy-admin', // Identifies the type of the webview. Used internally
				'Easy Admin', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{} // Webview options. More on these later.
			);

			// And set its HTML content
			panel.webview.html = getWebviewContentColaboradores();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('easy-admin.calendario', () => {
			// Create and show a new webview
			const panel = vscode.window.createWebviewPanel(
				'easy-admin', // Identifies the type of the webview. Used internally
				'Easy Admin', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{} // Webview options. More on these later.
			);

			// And set its HTML content
			panel.webview.html = getWebviewContentCalendario();
		})
	);
}

function getWebviewContentTareas() {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Tareas</title>
	</head>
	<body>
	
	<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
	</body>
	</html>`;
}

function getWebviewContentColaboradores(){
	return `<!doctype html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Colaboradores</title>
	</head>
	<body>
	Aquí van los colaboradores
	
	</body>
	</html>`;
}

function getWebviewContentCalendario(){
	return `<!doctype html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Calendario</title>
	</head>
	<body>
	Aquí va el calendario
	
	</body>
	</html>`;
}


// This method is called when your extension is deactivated
export function deactivate() { }
