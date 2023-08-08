defmodule TreesWeb.TreesJSON do
  @doc false
  def index(%{trees: trees}) do
    %{
      data: for(t <- trees, do: tree(t))
    }
  end

  defp tree(tree) do
    %{
      id: tree.id,
      type: tree.type,
      x: tree.x,
      y: tree.y
    }
  end
end
