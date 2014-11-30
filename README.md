ChocolateChipJS
================

##A JavaScript Library for Mobile Web App Development

The purpose of ChocolateChipJS is to use with ChocolateChip-UI. Of course, since it is so small and fast, you could use it as the basis for a simple mobile app, as you would with Zeptojs, etc. Please visit [ChocolateChip-UI's Website](http://chocolatechip-ui.com) for documentation on ChocolateChipJS. You can optionally build the ChocolateChip-UI framework with support for ChocolateChipJS. Please read the build instructions for [ChocolateChip-UI to learn more](http://chocolatechip-ui.com/documentation).

##Building 

If you do not want to build the framework from scratch, you can use the pre-compiled version in the dist folder. This is just the framework, minus examples, demos, etc.

ChocolateChipJS uses Gulpjs to build. This is a Node package, so you'll first need to have [Node installed](http://http://nodejs.org). After installing Nodejs, or if you already have it installed, on Mac OS X use the terminal to cd to the directory. On Windows you can use the Windows command prompt to do this. Once you are in the folder, run the following command in your terminal. 

###Gulpjs

On Mac OS X, you'll need to run the command in your terminal with **sudo** to avoid installation errors:

```
shell
sudo npm install -g gulp
``` 


For Windows, just runt this:

```
shell
npm install -g gulp
```

Enter your password when it requests. After you should see a number of Nodejs modules being installed in a folder called **node\_modules**. You do not need **node\_modules** in your final project. The node modules are there to enable the build process with Gruntjs.

Now that you have the node modules install, you can just type `gulp` in the terminal and hit return/enter. 

```
gulp
```

###Support for ECMAScript 6 Promises

By default ChocolateChipJS provides a deferred object that is feature compatible with jQuery's version and it's Ajax methods return deferred objects as well. If you want, you can build ChocolateChipJS with support for the ECMAScript 6 Promises API. This will work both in browsers that support the new Promises API, and by a pollyfil, with older browsers that do not. Also, when building ChocolateChipJS with Promises, its Ajax methods are also refactored to use the new API.

To build ChocolateChipJS with support for ECMAScript Promises, pass it the flag, `promiseSupport`:

```
gulp --promiseSupport true
```

This will replace the jQuery deferred object and Ajax methods with the pollyfil, Ajax methods and unit tests for the ECMAScript Pomises API.


###Note

You do not need Nodejs to use ChocolateChipJS. Nodejs is only used to build the framework and examples from the source files.

##Contributing Code
###Avoiding Carriage Returns in Commits

ChocolateChipJS uses Unix linefeeds (LF) for new lines. Github for Windows adds carriage returns to linefeeds (CRLF). If you try to check in such files, Git will flag every line with changed new lines, which means practically everything. To avoid this we've added a .gitattributes file to the repository. This will prevent Github from converting the new lines on Windows. 

If you are editing the source code on Windows, depending on the text editor you are using, or if you do a copy/paste, you may inadvertently introduce Windows carriage returns. Also some Grunt actions, such as concatenation with banners, automatically create newlines with carriage returns on Windows. When these carriage returns are added to the source code, they will show up as a changes at commit time. You can avoid this. Navigate to the ChocolateChipJS repository in the command prompt, then execute these two Git commands:

```
git config core.eol lf
git config core.autocrlf input
```

core.eol tells Git to always checkout this repository with LF. 
core.autocrlf tells Git to convert CRLF to LF on commit.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/2f123684cf50f62013c044733bfc36fb "githalytics.com")](http://githalytics.com/sourcebitsllc/chocolatechip-ui)