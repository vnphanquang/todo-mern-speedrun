# todo-mern-speedrun

A speed run to build a todo app

## Table of Contents

- [todo-mern-speedrun](#todo-mern-speedrun)
  - [Table of Contents](#table-of-contents)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Database](#database)
    - [Application](#application)
    - [Stack](#stack)

## Development

### Prerequisites

Make sure you have the below tools installed

| Dependency | Usage |
| --- | --- |
| [pnpm] | package manager in place of npm |
| [docker] | to run mysql locally for development |

Install npm dependencies at project root

```bash
pnpm install
```

### Database

Run a local mysql docker for easy development.

Note: using 3307 here as exposed port from host to avoid conflict with default 3306

```bash
docker run -d --name speedrun -p 3307:3306 \
-e MYSQL_ROOT_PASSWORD="dev" \
mysql
```

Run migrations

```bash
cd apps/api && pnpm prisma migrate deploy
```


### Application

This project is a monorepo that uses [turborepo] under the hood, but familiarity with [turborepo] is not required. Follow the steps below to run the development servers.

0. Make sure you have started your database and run all migrations. See [Database](#database)

1. Run all code generation pipelines (currently only [prisma] client code)

    ```bash
    # run at root
    pnpm codegen
    ```

2. Start all development servers

    ```bash
    # run at root
    pnpm dev
    ```

    Or if needed, run `pnpm dev` at each project directory

### Stack

[NextJS][nextjs] for frontend. [NestJS][nestjs] for backend. [Prisma][prisma] for ORM. [MySQL][mysql] as database

[turborepo]: https://turborepo.org/
[pnpm]: https://pnpm.io/
[docker]: https://www.docker.com/
[prisma]: https://www.prisma.io/
[nextjs]: https://nextjs.org/
[nestjs]: https://nestjs.com/
[mysql]: https://www.mysql.com/
