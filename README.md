![](images/icon.png) 
# json-to-jsmodel

Converts the selected json object to a jsdoc javascript model.

## Features

Allows you to select a json model where the property name is the property and the property value is the type and convert it into a js class with jsdoc definitions

![demo](demo.gif)

- Select the json object
- Right click then select Convert to JS Model or ctrl+shift+p type and select Convert to JS Model
- Enter a class name or press enter for the default (file name)

## Requirements

Requires visual studio > v1.55.2

## Extension Settings

None

## Known Issues

- Can not handle nested objects (fixed in v0.0.6)
- Does not handle arrays (fixed in v0.0.7)
- Does not identify Similar class types when handling nested objects

## Release Notes

### 0.0.1

Initial release

### 0.0.2

Fixed bug where property type was swapped with property name in constructor

### 0.0.3

Add support for vs code 1.55.2

### 0.0.4

Improved documentation

### 0.0.5

Added an icon

### 0.0.6

- Removed ClassName from Constructor declaration
- Changed default ClassName to be the name of the current opened file
- Added support for nested Objects
- Changed types to be Capitalized
- Added support for DateTime identification

### 0.0.7

- Added support for nested Arrays
- Fixed setting file name for default class name

### 0.0.8

- Added support for "dirty" json objects

**Enjoy!**
