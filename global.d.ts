interface D1QueryResult<T = Record<string, unknown>> {
  results?: T[];
  success?: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1QueryResult<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1QueryResult[]>;
}

type PagesFunction<Env = unknown> = (context: {
  env: Env;
  request: Request;
}) => Response | Promise<Response>;
