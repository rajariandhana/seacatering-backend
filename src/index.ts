import express from "express"

import bodyParser from "body-parser";

import router from "./routes/api"

import db from "./utils/database";

import cors from "cors";

import dotenv from "dotenv";

async function init() {
    try {
        const result = await db();
        console.log("database status: ", result);
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());

        dotenv.config();
        const PORT = process.env.PORT;
        app.get("/",(req,res)=>{
            res.status(200).json({
                message:"Server is running",
                data:null
            });
        });

        app.use('/api', router);
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

init();