# Trees

## Usage

### Development (normal way)

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

### Development (LiteFs way)

`docker compose up`

Now you can visit:
- [`localhost:7000`](http://localhost:7000) (primary)
- [`localhost:7001`](http://localhost:7001) (replica)

#### Debug Litefs db

To see the contents of the db:

1. `sudo docker ps`
2. find container id
3. `sudo docker exec –it <container id> /bin/bash`
4. `sqlite3 /litefs/trees.db`


