defmodule Trees.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    Trees.Release.migrate()
    topologies = Application.get_env(:libcluster, :topologies) || []

    children = [
      # Start the Ecto repository
      Trees.Repo.Local,
      # Start litefs genserver and pass the local repo configuration
      {Litefs, Application.get_env(:trees, Trees.Repo.Local)},
      # setup libcluster
      {Cluster.Supervisor, [topologies, [name: Trees.ClusterSupervisor]]},
      # Start the Telemetry supervisor
      TreesWeb.Telemetry,
      # Start the Ecto repository
      # Trees.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Trees.PubSub},
      # Start Finch
      {Finch, name: Trees.Finch},
      # Start the Endpoint (http/httpsv
      TreesWeb.Presence,
      TreesWeb.Endpoint,
      # Start a worker by calling: Trees.Worker.start_link(arg)
      # {Trees.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Trees.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TreesWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
