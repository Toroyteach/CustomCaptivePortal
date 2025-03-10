import * as joi from '@hapi/joi';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

export const validEnvironments = ['development', 'production', 'qa', 'staging'];

// validating environment variables
const envVarsSchema = joi
  .object({
    PORT: joi.number().default('3000'),
    NODE_ENV: joi
      .string()
      .allow(...['development', 'production', 'qa', 'staging'])
      .required(),
    DEVELOPMENT_START_COMMAND: joi.string().default('yarn start:dev'),
    LOG_LEVEL: joi
      .string()
      .allow(...['error', 'warning', 'info', 'debug', 'silly'])
      .default('silly'),
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().default(null),
    DB_DATABASE: joi.string().required(),
    DB_PORT: joi.number().port().required().default(3306),
    CORS_ORIGIN: joi.string().required(),
    CORS_METHODS: joi.string().required(),
    TILIL_API_KEY: joi.string().required(),
    TILIL_SENDER_ID: joi.string().required(),
    TILIL_API_URL: joi.string().required(),
    COMPANY_NAME: joi.string().required(),
    COMPANY_ADDRESS: joi.string().required(),
    COMPANY_CITY: joi.string().required(),
    COMPANY_PHONE: joi.string().required(),
    LICENSE_KEY: joi.string().required(),
    CONTROLLER_IP: joi.string().required(),
    CONTROLLER_USERNAME: joi.string().required(),
    CONTROLLER_PASSWORD: joi.string().required(),
    NETFLOW_PORT: joi.number().port().default(5998),

    DB_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  //throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  license: envVars.LICENSE_KEY,
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  logLevel: envVars.LOG_LEVEL,
  isDevelopment:
    envVars.NODE_ENV === 'test' || envVars.NODE_ENV === 'development',
  db: {
    host: envVars.DB_HOST,
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_DATABASE,
    port: Number.parseInt(envVars.DB_PORT, 2),
    logging: envVars.DB_LOGGING,
  },
  sms: {
    apiKey: envVars.TILIL_API_KEY,
    senderId: envVars.TILIL_SENDER_ID,
    apiUrl: envVars.TILIL_API_URL,
  },
  company: {
    name: envVars.COMPANY_NAME,
    address: envVars.COMPANY_ADDRESS,
    city: envVars.COMPANY_CITY,
    phone: envVars.COMPANY_PHONE,
  },
  controller: {
    ip: envVars.CONTOLLER_IP,
    username: envVars.CONTOLLER_USERNAME,
    password: envVars.CONTOLLER_PASSWORD,
  },
  netflow: {
    port: envVars.NETFLOW_PORT,
  },
};
