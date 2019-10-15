## Development instructions

### Install depenedencies
Install packages via ```npm install```

### Build material addons package
Use ```npm run build:mat-add``` in the [root directory of the material-addons-project](https://github.com/porscheinformatik/material-addons/tree/master/material-addons-project/) to build the package to your local dist directory. 

### Install in demo 
Use ```npm install --no-optional``` to remove old versions of the package in the demo. Afterwards, use normal ```npm install``` to get the newest version of the package from the dist directory.  

### Publish
Use ```npm run publish:mat-add``` to publish a new version on npm. The script bumps the version, builds it and then publishs it to the npm registry. 

### Deploy demo
Use ```npm run deploy:demo``` to deploy a new version to [github pages](https://porscheinformatik.github.io/material-addons) of the demno. 

    


    
