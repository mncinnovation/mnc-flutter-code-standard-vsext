import * as vscode from 'vscode';

export interface UserInputModel {
    name: string,
    init: boolean,
    uri: vscode.Uri,
}