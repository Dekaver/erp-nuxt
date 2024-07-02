
import { promises as fs } from 'fs';
import path from 'path';

// Mendapatkan direktori root proyek
const rootDir = path.resolve();  // path.resolve() akan mengembalikan path dari direktori kerja saat ini

// Fungsi untuk membuat modul auth
export const createAuth = async () => {
  const authDir = path.join(rootDir, 'auth');
  const authControllerPath = path.join(authDir, 'auth.controller.js');

  try {
    // Membuat direktori auth jika belum ada
    await fs.mkdir(authDir, { recursive: true });
    console.log(`Directory ${authDir} created.`);

    // Menulis file auth.controller.js
    const authControllerContent = `
      // auth.controller.js
      // Controller for authentication module

      console.log('Auth controller loaded.');
    `;

    await fs.writeFile(authControllerPath, authControllerContent.trim());
    console.log(`File ${authControllerPath} created.`);
  } catch (err : any) {
    console.error(`Error: ${err.message}`);
  }
};