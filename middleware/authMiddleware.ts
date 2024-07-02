// export default defineNuxtRouteMiddleware((to, from) => {
//     if (to.params.id === '1') {
//       return abortNavigation()
//     }
//     // In a real app you would probably not redirect every route to `/`
//     // however it is important to check `to.path` before redirecting or you
//     // might get an infinite redirect loop
//     if (to.path !== '/') {
//       return navigateTo('/')
//     }
//   })
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { sql } from "drizzle-orm";
// import config from "../libs/config";
// import db from "../libs/db";

// type User = {
//     id: number;
//     usernamenya: string;
//     nama: string;
//     // role: number;
//     iat: number;
//     kas: { inisial: any, id_account: any };
// };

// export type MyRequest = Request & {
//     user?: User;
// };

// export const auth = (req: MyRequest, res: Response, next: NextFunction) => {
//     const token = req.cookies.token;
//     if (!token) {
//         return res.status(401).json({
//             message: "Unauthorized",
//         });
//     }
//     jwt.verify(token, config.JWT_SECRET, (err: any, decoded: any) => {
//         if (err) {
//             return res.status(401).json({
//                 message: "Unauthorized",
//             });
//         }
//         req.user = decoded;
//         next();
//     });
// };

// export const hasAkses = (roles: any) => async (req: MyRequest, res: Response, next: NextFunction) => {
//     // console.log(req.user, "ini user");
//     const data = await db.execute(sql`select array_agg(p.permission) as permission from pengguna u
//     left join role_permission rp on rp.id_role=u.role
//     left join permission p on p.id = rp.id_permission
//     where u.usernamenya = ${req.user?.usernamenya}`);

//     if (!Array.isArray(roles)) {
//         throw new Error("Roles must be an array");
//     }
//     // console.log(data, "ini data");

//     const permission: any = data[0].permission;
//     // Check if the user has at least one of the specified roles
//     const hasMatchingRole = roles.some((role) => permission.includes(role));

//     console.log(hasMatchingRole, "ini hasMatchingRole");
//     if (!hasMatchingRole) {
//         return res.status(403).json({ message: "Unauthorized" });
//     }

//     next();
// };

// export const login = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//       const { usernamenya, passwordnya, recaptchaToken } = req.body;
//       if (config.DISABLE_CAPTCHA) {
//           const validateCaptcha = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.CAPTCHA_SECRET}&response=${recaptchaToken}`);
//           // console.log(validateCaptcha.data, "ini data captcha");
//           if (!validateCaptcha.data.success || validateCaptcha.data.score < 0.5) {
//               throw ValidationError("Captcha tidak valid");
//           }
//       }

//       const result = await AuthLogin(usernamenya);
//       if (!result) {
//           throw ValidationError("Username tidak ditemukan");
//       }
//       if (!bcrypt.compareSync(passwordnya, result.passwordnya)) {
//           throw ValidationError("Password salah");
//       }
//       const pegawai = await getPegawaiById(result.id);

//       const pegawaiKas = await getOnePegawaiKas(result.id);

//       const dataPermission = await getPermissionByRole(result.id_role as number);

//       const payload = {
//           id: result.id,
//           usernamenya: result.usernamenya,
//           nama: result.nama,
//           pegawai: pegawai,
//           kas: pegawaiKas
//       };

//       const token = jwt.sign(payload, config.JWT_SECRET);

//       res.cookie("token", token, {
//           maxAge: 1000 * 60 * 60 * 24 * 1,
//           httpOnly: true,
//           secure: config.SECURE,
//           sameSite: process.env.SAME_SITE as boolean | "lax" | "strict" | "none" | undefined,
//       });

//       res.status(200).json({
//           message: "Login berhasil",
//           data: {
//               ...result,
//               id: result.id,
//               nama: result.nama,
//               email: pegawai.email,
//               fotonya: result.fotonya,
//               role: result.role,
//               usernamenya: result.usernamenya,
//               id_pegawai: result.id_pegawai,
//               permission: dataPermission,
//               jabatan: pegawai.jabatan,
//               pegawai: pegawai,
//               kas: pegawaiKas,
//           },
//           token: token,
//       });
//   } catch (error) {
//       next(error);
//   }
// };