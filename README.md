<p align="center"><b>Flutter MNC Code Standard Extention</b></p>

<p align="center">
  <img width="128" height="128" src="assets/logo.png">
  <p align="center"><i>Implementation of MNC Flutter Code Standard</i></p>
</p>

Extention are created to the way to :
- Simplify and Unified way of structure code
- Ease to write
- Minimize the learning curve

## Features
- Module Generator
- Widget File Creator

## Module Generator
![modulegenerator](assets/create-module-gif.gif)

### Module 
![arch](assets/module_arch.jpg)
### Controller
The Controller module represents the logic of data flow within the application. It is the middle layer between the Repo and Screen layers. The Controller is responsible for updating the pipe when the data changes.
### Data
The Data module defines the IO logic of the application. This module must have a Repository the source data can be various and send data to Controller.
### Screen
The Screen module represents entry point of route and page of current app.
### Test
The Test module are place for current module unit, widget and integration test.
### Widget
The Widget module are place for current module widgets.


