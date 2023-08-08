defmodule Trees.Repo do
  use Ecto.Repo,
    otp_app: :trees,
    adapter: Ecto.Adapters.SQLite3
end
