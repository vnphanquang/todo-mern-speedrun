# todo-mern-speedrun

A speed run to build a todo app with React (nextjs), Express & MySQL (nestjs)

## Development


### Database

Run a local mysql docker for easy development.

Note: using 3307 here as exposed port from host to avoid conflict with default 3306

```bash
   docker run -d --name speedrun -p 3307:3306 \
   -e MYSQL_ROOT_PASSWORD="dev" \
   mysql
```
