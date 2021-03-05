import { UserInputModel } from '../data/model/userinputmodel';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import fs = require('fs');
import { getPackageName } from '../utils/stringutils';
import { getUserInput } from '../utils/getuserinputformodule';
import { foldersConstant } from '../data/constant/folders';
import { controllerContent, repoContent, screenContent, serviceContent } from '../utils/filegenerator';


export async function generateModule(inUri: vscode.Uri | undefined) {
  let data: UserInputModel;
  try {
    data = await getUserInput(inUri);
  } catch (error) {
    return vscode.window.showErrorMessage((error as Error).message);
  }

  await generateModuleFolders(data.uri, data.name, data.init);
  vscode.window.showInformationMessage("Successfully created new module " + data.name.replace(" ", "_"));
}




async function generateModuleFolders(uri: vscode.Uri, name: string, init: boolean) {
  const paths = uri.path.split("/");
  if (!paths.includes('lib') || !paths.includes('module')) {
    return vscode.window.showErrorMessage("Please create under lib/module");
  }

  let packageName;

  try {
    packageName = getPackageName();
  } catch (error) {
    return vscode.window.showErrorMessage(error);
  }

  if (packageName === undefined) {
    return vscode.window.showErrorMessage("Cant find package name");
  }

  const nameWithoutSpace = name.replace(" ", "_");
  // getPackageNameAndPath();
  const d = uri.path + "/" + nameWithoutSpace;
  await mkdirp(d);


  const options = { flag: 'wx' };

  for (const data of foldersConstant) {
    const newp = d + data;

    await mkdirp(newp);

    fs.writeFileSync(newp + "/.gitkeep", "");

    if (data === '/controller') {
      const newpaths = newp.split("/");
      const libIndex = newpaths.indexOf("lib");
      const repoImportPath = `'package:${packageName}/${newpaths.slice(libIndex + 1, newpaths.length - 1).join("/")}/data/repo/${nameWithoutSpace}_repo.dart'`;
      const file = `${newp}/${nameWithoutSpace}_controller.dart`;
      fs.writeFileSync(file, controllerContent(name, repoImportPath), options);
    }

    if (data === '/screen') {
      const file = `${newp}/${nameWithoutSpace}_screen.dart`;
      const newpaths = newp.split("/");
      const libIndex = newpaths.indexOf("lib");
      const controllerImportPath = `'package:${packageName}/${newpaths.slice(libIndex + 1, newpaths.length - 1).join("/")}/controller/${nameWithoutSpace}_controller.dart'`;
      fs.writeFileSync(file, screenContent(name, init, controllerImportPath), options);
    }

    if (data === '/data/repo') {
      const file = `${newp}/${nameWithoutSpace}_repo.dart`;
      fs.writeFileSync(file, repoContent(name), options);
    }

    if (data === '/data/service') {
      const file = `${newp}/${nameWithoutSpace}_service.dart`;
      fs.writeFileSync(file, serviceContent(name), options);
    }
  }

  vscode.workspace.openTextDocument(`${d}/screen/${nameWithoutSpace}_screen.dart`).then(doc => {
    vscode.window.showTextDocument(doc);
  });


}


