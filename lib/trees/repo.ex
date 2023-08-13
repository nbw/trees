# defmodule Trees.Repo do
#   use Ecto.Repo,
#     otp_app: :trees,
#     adapter: Ecto.Adapters.SQLite3
# end

defmodule Trees.Repo.Local do
  use Ecto.Repo,
    otp_app: :trees,
    adapter: Ecto.Adapters.SQLite3
end

defmodule Trees.Repo do
  use Litefs.Repo, local_repo: Trees.Repo.Local
end
