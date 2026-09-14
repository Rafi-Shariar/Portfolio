import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
    try {
        const isAdminExist = await prisma.user.findFirst({
            where : {
                role : Role.ADMIN
            }
        });

        if(isAdminExist){
            console.log("Super Admin Already Exists!");
            return;
        }

        const name = config.admin_name
        const email = config.admin_email
        const password = "Rafi#9617"

        if(!name || !email || !password){
            throw new Error("Super Admin Name , Email, Password Missing In Env File!!!")
        }

        const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

        const superAdmin = await prisma.user.create({
            data : {
                name,
                email,
                password : hashedPassword,
            
            }
        })

        console.log("Admin Created Successfully");



    } catch (error) {

        console.log("Error Seeding Super Admin : ", error);

        await prisma.user.delete({
            where : {
                email : config.admin_email
            }
        })

        
    }
}
