import { pascalize } from './stringutils';

export function controllerContent(name: String, repoImportPath: String) {
    const co = pascalize(name);
    const content = `
  import 'package:get/get.dart';
  import ${repoImportPath};
  class ${co}Controller extends GetxController with ${co}Repo {
  
  }`;

    return content;
}


export function repoContent(name: String) {
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


export function serviceContent(name: String) {
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



export function screenContent(name: String, init: boolean, controllerImportPath: string) {
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

