defmodule TreesWeb.TreesController do
  use TreesWeb, :controller

  action_fallback TreesWeb.FallbackController

  def index(conn, params) do
    with {:ok, trees} <- Trees.Forest.validate_and_search(params) do
      render(conn, :index, trees: trees)
    end
  end
end
