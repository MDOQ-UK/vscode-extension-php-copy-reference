// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	/**
     * Generate a file and line number reference from TextEditor and Selection
	 * eg: /my/file.php:200
	 * 
	 * @param activeEditor 
	 * @param selection 
	 * @returns string
	 */
	let getFileReference = (activeEditor: vscode.TextEditor, selection: vscode.Selection) => {
		let reference = activeEditor.document.uri.path + ':' + (selection.start.line + 1);
		let workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
		if(workspaceFolder !== undefined){
			console.log(workspaceFolder.uri.path);
			reference = reference.substr(workspaceFolder.uri.path.length + 1);
		}
		return reference;
	}

	/**
	 * Determine if the current selection is a DocumentSymbol, if so return it, if not return undefined
	 * @param selection 
	 * @param symbols 
	 * @returns undefined | vscode.DocumentSymbol
	 */
	let getSelectedSymbol = (selection: vscode.Position, symbols: Array<vscode.DocumentSymbol>): undefined|vscode.DocumentSymbol => {
		for(let i = 0; i < symbols.length; i++){
			let symbol = symbols[i];
			console.log('symbol: ', symbol, symbol.name, symbol.children);
			if(symbol.selectionRange.contains(selection)){
				return symbol;
			}
			if(symbol.range.contains(selection)){
				if(symbol.children.length > 0){
					return getSelectedSymbol(selection, symbol.children);
				}
			}
		}
		return undefined;
	}

	/**
	 * Determine the correct "reference" for a particular symbol
	 * @param selectedSybmol 
	 * @param symbols 
	 * @param ref 
	 * @returns string
	 */
	let getSymbolReference = (selectedSybmol: vscode.DocumentSymbol, symbols: Array<vscode.DocumentSymbol>, ref = ''): string => {
		for(let i = 0; i < symbols.length; i++){
			let symbol = symbols[i];
			console.log('symbol: ', symbol, symbol.name, symbol.children);

			if(symbol.kind == vscode.SymbolKind.Namespace){
				ref += '\\' + symbol.name;
			}else if(symbol.selectionRange.isEqual(selectedSybmol.selectionRange)){
				switch(symbol.kind){
					case vscode.SymbolKind.Class:
						ref += '\\' + symbol.name;
						break;
					case vscode.SymbolKind.Property:
					case vscode.SymbolKind.Constant:
					case vscode.SymbolKind.Constructor:
					case vscode.SymbolKind.Function:
					case vscode.SymbolKind.Method:
					case vscode.SymbolKind.Variable:
						if(ref.length > 0){
							ref += '::';
						}
						ref += symbol.name;
				}
			}else if(symbol.range.contains(selectedSybmol.selectionRange.start) && symbol.children.length > 0){
				switch(symbol.kind){
					case vscode.SymbolKind.Class:
						ref += '\\' + symbol.name;
						break;
				}
				return getSymbolReference(selectedSybmol, symbol.children, ref);
			}
		}
		return ref;
	}

	let copyToClipboard = (reference: string) => {
		vscode.env.clipboard.writeText(reference);
		// Display a message box to the user (just for some debug)
		// vscode.window.showInformationMessage('Reference: ' + reference);
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('phpcopyreference.copyReference', () => {
		// The code you place here will be executed every time your command is executed
		
		let activeEditor = vscode.window.activeTextEditor;
		if(!activeEditor){
			console.warn('no active editor');
			return;
		}
		let selection = activeEditor.selection;
		if(!selection){
			console.warn('no selection');
			return;
		}

		if(!selection.isSingleLine){
			console.info('cant copy reference to multiline');
			return;
		}

		let documentSymbolResponse = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', activeEditor.document.uri).then((symbols: any) => {
			
			console.log('current cursor position: ', activeEditor!.selection, activeEditor!.selection.active);

			let reference = getFileReference(activeEditor!, selection);
			if(symbols === undefined){
				return copyToClipboard(reference);
			}

			let selectedSymbol = getSelectedSymbol(selection.active, symbols);
			console.log('selectedSymbol: ', selectedSymbol);
			if(selectedSymbol !== undefined){
				reference = getSymbolReference(selectedSymbol, symbols);
			}
			return copyToClipboard(reference);			
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
