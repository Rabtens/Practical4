package org.example

class NodeUtils implements Serializable {
    
    def script
    
    NodeUtils(script) {
        this.script = script
    }
    
    def getPackageVersion() {
        def packageJson = script.readJSON file: 'package.json'
        return packageJson.version
    }
    
    def hasScript(String scriptName) {
        def packageJson = script.readJSON file: 'package.json'
        return packageJson.scripts && packageJson.scripts[scriptName]
    }
    
    def runScript(String scriptName) {
        if (hasScript(scriptName)) {
            script.sh "npm run ${scriptName}"
        } else {
            script.echo "Script '${scriptName}' not found in package.json"
        }
    }
    
    def checkDependency(String dependencyName) {
        def packageJson = script.readJSON file: 'package.json'
        def deps = packageJson.dependencies ?: [:]
        def devDeps = packageJson.devDependencies ?: [:]
        
        return deps[dependencyName] || devDeps[dependencyName]
    }
}