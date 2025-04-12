declare module "@ioc:Adonis/Lucid/Database" {
  interface DatabaseConfig {
    connection: string;
    connections: {
      [key: string]: {
        client: string;
        connection: {
          host: string;
          port: number;
          user: string;
          password: string;
          database: string;
        };
        migrations: {
          naturalSort: boolean;
        };
        healthCheck: boolean;
        debug: boolean;
      };
    };
  }
}
