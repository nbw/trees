defmodule Trees.Forest do
  @moduledoc """
  The Forest context.
  """

  import Ecto.Query, warn: false
  alias Trees.Repo

  alias Trees.Forest.Tree

  @doc """
  Returns the list of trees.

  ## Examples

      iex> list_trees()
      [%Tree{}, ...]

  """
  def list_trees do
    Repo.all(Tree)
  end

  def search_trees(%Tree.Search{x1: x1, x2: x2, y1: y1, y2: y2}) do
    from(t in Tree,
      where: t.x >= ^x1 and t.x < ^x2,
      where: t.y >= ^y1 and t.y < ^y2,
      order_by: [asc: t.y]
    )
    |> Repo.all()
  end

  @doc """
  Gets a single tree.

  Raises `Ecto.NoResultsError` if the Tree does not exist.

  ## Examples

      iex> get_tree!(123)
      %Tree{}

      iex> get_tree!(456)
      ** (Ecto.NoResultsError)

  """
  def get_tree!(id), do: Repo.get!(Tree, id)

  @doc """
  Creates a tree.

  ## Examples

      iex> create_tree(%{field: value})
      {:ok, %Tree{}}

      iex> create_tree(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_tree(attrs \\ %{}) do
    %Tree{}
    |> Tree.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a tree.

  ## Examples

      iex> update_tree(tree, %{field: new_value})
      {:ok, %Tree{}}

      iex> update_tree(tree, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_tree(%Tree{} = tree, attrs) do
    tree
    |> Tree.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a tree.

  ## Examples

      iex> delete_tree(tree)
      {:ok, %Tree{}}

      iex> delete_tree(tree)
      {:error, %Ecto.Changeset{}}

  """
  def delete_tree(%Tree{} = tree) do
    Repo.delete(tree)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking tree changes.

  ## Examples

      iex> change_tree(tree)
      %Ecto.Changeset{data: %Tree{}}

  """
  def change_tree(%Tree{} = tree, attrs \\ %{}) do
    Tree.changeset(tree, attrs)
  end

  def validate_and_search(params) do
    changeset = Tree.Search.changeset(params)

    with {:ok, search} <- Ecto.Changeset.apply_action(changeset, :validate) do
      {:ok, search_trees(search)}
    end
  end
end
