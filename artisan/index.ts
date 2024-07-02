#!/usr/bin/env node
import { createAuth } from './auth/index.js';
// Menangani argumen CLI
const args = process.argv.slice(2);
console.log(args);

if (args[0] === 'make:auth') {
    createAuth();
} else {
    console.log('Unknown command');
}
