const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

class ConsoleApp {
    constructor() {
        this.program = new Command();
        this.setupCommander();
    }

    setupCommander() {
        this.program
            .name('console-app')
            .description('A interactive console application with multiple options')
            .version('1.0.0');

        this.program
            .command('files')
            .description('File operations menu')
            .action(() => this.showFileMenu());

        this.program
            .command('calc')
            .description('Calculator operations')
            .action(() => this.showCalculatorMenu());

        this.program
            .command('system')
            .description('System information')
            .action(() => this.showSystemInfo());

        this.program
            .action(() => this.showMainMenu());
    }

    async showMainMenu() {
        console.clear();
        console.log('=== MAIN MENU ===');
        console.log('Welcome to the Interactive Console Application!');
        console.log('This application demonstrates:');
        console.log('1. File operations using Node.js fs module');
        console.log('2. Mathematical calculations');
        console.log('3. System information display');
        console.log('4. Commander.js for command parsing');
        console.log('5. Inquirer.js for interactive menus\n');

        const { option } = await inquirer.prompt([
            {
                type: 'list',
                name: 'option',
                message: 'Choose an option:',
                choices: [
                    'File Operations',
                    'Calculator',
                    'System Info',
                    'Exit'
                ]
            }
        ]);

        switch(option) {
            case 'File Operations':
                this.showFileMenu();
                break;
            case 'Calculator':
                this.showCalculatorMenu();
                break;
            case 'System Info':
                this.showSystemInfo();
                break;
            case 'Exit':
                console.log('Goodbye!');
                process.exit(0);
        }
    }

    async showFileMenu() {
        console.clear();
        console.log('=== FILE OPERATIONS ===');
        console.log('This menu allows you to perform file operations using Node.js fs module');

        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Choose file operation:',
                choices: [
                    'List directory contents',
                    'Create new file',
                    'Read file',
                    'Back to main menu'
                ]
            }
        ]);

        switch(operation) {
            case 'List directory contents':
                await this.listDirectory();
                break;
            case 'Create new file':
                await this.createFile();
                break;
            case 'Read file':
                await this.readFile();
                break;
            case 'Back to main menu':
                this.showMainMenu();
                break;
        }
    }

    async listDirectory() {
        const files = fs.readdirSync(process.cwd());
        console.log('\nCurrent directory contents:');
        files.forEach(file => {
            const stats = fs.statSync(file);
            console.log(`${file} - ${stats.isDirectory() ? 'DIR' : 'FILE'} (${stats.size} bytes)`);
        });
        
        await this.pressAnyKey();
        this.showFileMenu();
    }

    async createFile() {
        const { filename, content } = await inquirer.prompt([
            {
                type: 'input',
                name: 'filename',
                message: 'Enter filename:',
                validate: input => input ? true : 'Filename cannot be empty'
            },
            {
                type: 'input',
                name: 'content',
                message: 'Enter file content:'
            }
        ]);

        fs.writeFileSync(filename, content);
        console.log(`File "${filename}" created successfully!`);
        
        await this.pressAnyKey();
        this.showFileMenu();
    }

    async readFile() {
        const files = fs.readdirSync(process.cwd()).filter(file => 
            fs.statSync(file).isFile()
        );

        if (files.length === 0) {
            console.log('No files found in current directory.');
            await this.pressAnyKey();
            this.showFileMenu();
            return;
        }

        const { filename } = await inquirer.prompt([
            {
                type: 'list',
                name: 'filename',
                message: 'Select file to read:',
                choices: files
            }
        ]);

        const content = fs.readFileSync(filename, 'utf8');
        console.log(`\nContent of "${filename}":`);
        console.log('=' .repeat(50));
        console.log(content);
        console.log('=' .repeat(50));
        
        await this.pressAnyKey();
        this.showFileMenu();
    }

    async showCalculatorMenu() {
        console.clear();
        console.log('=== CALCULATOR ===');
        console.log('Perform mathematical calculations');

        const { operation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'operation',
                message: 'Choose operation:',
                choices: [
                    'Add',
                    'Subtract',
                    'Multiply',
                    'Divide',
                    'Back to main menu'
                ]
            }
        ]);

        if (operation === 'Back to main menu') {
            this.showMainMenu();
            return;
        }

        const numbers = await inquirer.prompt([
            {
                type: 'number',
                name: 'num1',
                message: 'Enter first number:'
            },
            {
                type: 'number',
                name: 'num2',
                message: 'Enter second number:'
            }
        ]);

        let result;
        switch(operation) {
            case 'Add':
                result = numbers.num1 + numbers.num2;
                break;
            case 'Subtract':
                result = numbers.num1 - numbers.num2;
                break;
            case 'Multiply':
                result = numbers.num1 * numbers.num2;
                break;
            case 'Divide':
                result = numbers.num2 !== 0 ? numbers.num1 / numbers.num2 : 'Error: Division by zero';
                break;
        }

        console.log(`\nResult: ${numbers.num1} ${operation} ${numbers.num2} = ${result}`);
        
        await this.pressAnyKey();
        this.showCalculatorMenu();
    }

    async showSystemInfo() {
        console.clear();
        console.log('=== SYSTEM INFORMATION ===');
        console.log('Displaying current system information:\n');
        
        console.log(`Node.js version: ${process.version}`);
        console.log(`Platform: ${process.platform}`);
        console.log(`Architecture: ${process.arch}`);
        console.log(`Current directory: ${process.cwd()}`);
        console.log(`Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
        console.log(`Uptime: ${Math.round(process.uptime())} seconds`);
        
        await this.pressAnyKey();
        this.showMainMenu();
    }

    async pressAnyKey() {
        console.log('\nPress any key to continue...');
        return new Promise(resolve => {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', () => {
                process.stdin.setRawMode(false);
                resolve();
            });
        });
    }

    start() {
        this.program.parse();
    }
}

const app = new ConsoleApp();
app.start();