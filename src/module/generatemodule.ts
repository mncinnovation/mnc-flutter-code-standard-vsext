import { UserInputModel } from '../data/model/userinputmodel';
import * as vscode from 'vscode';
import * as mkdirp from 'mkdirp';
import fs = require('fs');
import { camelize, pascalize } from '../utils/stringutils';
import { getUserInput } from '../utils/getuserinputformodule';
import { foldersConstant } from '../data/constant/folders';
import * as yaml from "js-yaml";


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
      const repoImportPath = `'package:${newpaths[libIndex - 1]}/${newpaths.slice(libIndex + 1, newpaths.length - 1).join("/")}/data/repo/${nameWithoutSpace}_repo.dart'`;
      const file = `${newp}/${nameWithoutSpace}_controller.dart`;
      fs.writeFileSync(file, controllerContent(name, repoImportPath), options);
    }

    if (data === '/screen') {
      const file = `${newp}/${nameWithoutSpace}_screen.dart`;
      const newpaths = newp.split("/");
      const libIndex = newpaths.indexOf("lib");
      const controllerImportPath = `'package:${newpaths[libIndex - 1]}/${newpaths.slice(libIndex + 1, newpaths.length - 1).join("/")}/controller/${nameWithoutSpace}_controller.dart'`;
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

function controllerContent(name: String, repoImportPath: String) {
  const co = pascalize(name);
  const content = `
import 'package:get/get.dart';
import ${repoImportPath};
class ${co}Controller extends GetxController with ${co}Repo {

}`;

  return content;
}


function repoContent(name: String) {
  const co = pascalize(name);
  const content = `
//Example of Repo
//You might not use it
class ${co}Repo {
//   // final _myNetwork = ${co}Network();

//   // Every function should have repo as prefix

 Future<void> repoFunc() async {
    try {
//      servFunc();
     } catch (e) {
       rethrow;
     }
   }

//   Stream<Object> repoAnotherFunc() async* {}
}
`;

  return content;
}


function serviceContent(name: String) {
  const co = pascalize(name);
  const content = `
// //Example Of Service
// //You migh not use it
// class ${co}Service {
//   Future<void> servFunc() async {}
// }

`;

  return content;
}



function screenContent(name: String, init: boolean, controllerImportPath: string) {
  const widget = pascalize(name);
  const content = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '${controllerImportPath}';

class ${widget}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetBuilder<${widget}Controller>(
      builder: (${widget}Controller c) {
        return Scaffold();
      },
    );
  }
}`;

  const contentWithInit = `
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import ${controllerImportPath};

class ${widget}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GetBuilder<${widget}Controller>(
      init: ${widget}Controller(),
      builder: (${widget}Controller controller) {
        return Scaffold();
      },
    );
  }
}`;

  return init ? contentWithInit : content;
}


function getPackageNameAndPath(inUri: vscode.Uri) {
  if (vscode.workspace.workspaceFolders !== undefined) {
    try {
      const a = `import 'package:${vscode.workspace.workspaceFolders[0].name}/`;

    } catch (error) {
      console.log(error);
    }

  } else {
    throw new Error("Please open a workspace");
  }

}
