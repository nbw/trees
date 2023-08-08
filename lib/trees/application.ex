defmodule Trees.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      TreesWeb.Telemetry,
      # Start the Ecto repository
      Trees.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: Trees.PubSub},
      # Start Finch
      {Finch, name: Trees.Finch},
      # Start the Endpoint (http/https)
      TreesWeb.Endpoint
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
