defmodule Trees.ForestFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Trees.Forest` context.
  """

  @doc """
  Generate a tree.
  """
  def tree_fixture(attrs \\ %{}) do
    {:ok, tree} =
      attrs
      |> Enum.into(%{
        type: "some type",
        y: 42,
        x: 42
      })
      |> Trees.Forest.create_tree()

    tree
  end
end
