import dotenv from 'dotenv'

dotenv.config()

const ENVIROMENT = {
    PORT: process.env.PORT,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    URL_BACKEND : process.env.URL_BACKEND || 'http://localhost:3000',
    URL_FRONTEND: process.env.URL_FRONTEND || 'http://localhost:5173'
}



for (let key in ENVIROMENT) {
    if (ENVIROMENT[key] === undefined) {
        console.error(`¡OJO! La variable de entorno ${key} está indefinida`);
    }
}

export default ENVIROMENT